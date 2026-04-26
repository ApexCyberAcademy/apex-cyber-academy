/**
 * Regenerate TTS audio for all lectures with improved text cleaning.
 * Fixes: colons, table formatting, markdown artifacts, metadata blocks read verbatim.
 * Uses edge-tts (Python CLI), uploads to S3, and updates the database.
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_URL = (process.env.BUILT_IN_FORGE_API_URL || '').replace(/\/+$/, '');
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!DATABASE_URL || !FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const VOICE = 'en-US-GuyNeural';
const TEMP_DIR = '/tmp/tts_audio_v2';
const MAX_TEXT_LENGTH = 5000;

/**
 * Thoroughly clean lecture text for natural TTS narration.
 * Removes all markdown formatting, table syntax, metadata blocks,
 * and converts structural elements into natural speech pauses.
 */
function cleanTextForSpeech(text) {
  let cleaned = text;

  // 1. Remove the entire metadata table block at the top of each lecture
  //    Pattern: "| | |\n|:---|:---|\n| **Key** | Value |\n..." followed by "---"
  cleaned = cleaned.replace(/\|[^\n]*\|\s*\n(\|[:\-\s|]+\|\s*\n)?(\|[^\n]*\|\s*\n)*---/g, '');

  // 2. Remove any remaining markdown table rows (lines with pipes)
  cleaned = cleaned.replace(/^\s*\|.*\|\s*$/gm, '');

  // 3. Remove table separator lines
  cleaned = cleaned.replace(/^\s*\|?[\s:]*[-]+[\s:]*(\|[\s:]*[-]+[\s:]*)*\|?\s*$/gm, '');

  // 4. Remove markdown headers but keep the text, add a pause (period)
  //    "## Session Overview" → "Session Overview."
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, '$1.');

  // 5. Remove bold markers
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');

  // 6. Remove italic markers
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');

  // 7. Remove inline code backticks
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 8. Remove code blocks entirely
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // 9. Remove markdown links, keep link text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 10. Remove blockquote markers
  cleaned = cleaned.replace(/^>\s+/gm, '');

  // 11. Remove horizontal rules
  cleaned = cleaned.replace(/^[-*_]{3,}\s*$/gm, '');

  // 12. Remove bullet/list markers but keep the text
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');

  // 13. Clean up colons that would be read awkwardly
  //     "Session Overview:" → "Session Overview."
  //     "Key Concepts:" → "Key Concepts."
  //     But keep colons in time formats like "2:30" and ratios
  cleaned = cleaned.replace(/:\s*$/gm, '.'); // colon at end of line → period
  cleaned = cleaned.replace(/(\w):\s+(\n|[A-Z])/g, '$1. $2'); // colon before newline/capital → period

  // 14. Remove "Session X of Y" standalone lines (metadata)
  cleaned = cleaned.replace(/Session \d+ of \d+\.?\s*/g, '');

  // 15. Remove standalone metadata labels
  cleaned = cleaned.replace(/^(Duration|Exam Domain|Objectives Covered|Delivery|Module)\s*\.?\s*$/gm, '');

  // 16. Remove references to "Live online (Zoom/Teams)" delivery format
  cleaned = cleaned.replace(/Live online \(Zoom\/Teams\),?\s*(bilingual English\/Arabic)?/gi, '');

  // 17. Remove percentage references in parentheses like "(12%)"
  //     Keep them in running text but remove standalone
  cleaned = cleaned.replace(/^\s*\d+\.\d+\s*[-—]\s*/gm, ''); // "1.0 — " objective numbering

  // 18. Clean up parenthetical objective references like "1.1, 1.2 (partial)"
  cleaned = cleaned.replace(/\d+\.\d+(,\s*\d+\.\d+)*\s*(\(partial\)|\(continued\))?/g, '');

  // 19. Remove time durations like "2 hours (120 minutes)"
  cleaned = cleaned.replace(/\d+\s*hours?\s*\(\d+\s*minutes?\)/gi, '');

  // 20. Clean up double periods, excessive whitespace
  cleaned = cleaned.replace(/\.{2,}/g, '.');
  cleaned = cleaned.replace(/\.\s*\./g, '.');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');

  // 21. Remove empty lines and trim
  cleaned = cleaned.replace(/^\s*$/gm, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // 22. Final trim
  cleaned = cleaned.trim();

  return cleaned;
}

// Truncate text to fit TTS limits while keeping coherent sentences
function truncateForTTS(text, maxLen = MAX_TEXT_LENGTH) {
  if (text.length <= maxLen) return text;
  const truncated = text.substring(0, maxLen);
  const lastPeriod = truncated.lastIndexOf('.');
  return lastPeriod > maxLen * 0.5 ? truncated.substring(0, lastPeriod + 1) : truncated;
}

// Generate audio using edge-tts CLI
function generateAudio(text, outputPath) {
  const cleanText = truncateForTTS(cleanTextForSpeech(text));
  const textFile = outputPath + '.txt';
  writeFileSync(textFile, cleanText, 'utf-8');

  // Also save the cleaned text for review
  const reviewFile = outputPath + '.cleaned.txt';
  writeFileSync(reviewFile, cleanText, 'utf-8');

  try {
    execSync(`edge-tts --file "${textFile}" --voice ${VOICE} --write-media "${outputPath}" 2>&1`, {
      timeout: 120000,
    });
    if (existsSync(textFile)) unlinkSync(textFile);
    return true;
  } catch (e) {
    console.error('  TTS generation failed:', e.message);
    if (existsSync(textFile)) unlinkSync(textFile);
    return false;
  }
}

// Upload to S3 via Forge storage proxy
async function uploadToS3(filePath, s3Key) {
  const fileBuffer = readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'audio/mpeg' });
  const form = new FormData();
  form.append('file', blob, s3Key.split('/').pop());

  const uploadUrl = new URL('v1/storage/upload', FORGE_API_URL + '/');
  uploadUrl.searchParams.set('path', s3Key);

  const resp = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${FORGE_API_KEY}` },
    body: form,
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Upload failed: ${resp.status} ${errText}`);
  }

  const result = await resp.json();
  return result.url;
}

async function main() {
  if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

  const conn = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });

  // Get ALL lectures (we're regenerating everything)
  const [lectures] = await conn.execute(
    'SELECT id, title, content FROM lectures WHERE content IS NOT NULL ORDER BY courseId, sortOrder'
  );

  console.log(`Found ${lectures.length} lectures to regenerate\n`);

  // First, show a preview of the cleaning for the first lecture
  if (lectures.length > 0) {
    const sample = lectures[0];
    const original = sample.content.substring(0, 500);
    const cleaned = cleanTextForSpeech(sample.content).substring(0, 500);
    console.log('=== CLEANING PREVIEW ===');
    console.log('ORIGINAL (first 500 chars):');
    console.log(original);
    console.log('\nCLEANED (first 500 chars):');
    console.log(cleaned);
    console.log('========================\n');
  }

  let success = 0;
  let failed = 0;

  for (const lecture of lectures) {
    const { id, title, content } = lecture;
    console.log(`[${id}] "${title}" — regenerating audio...`);

    const audioPath = `${TEMP_DIR}/lecture_${id}.mp3`;
    const generated = generateAudio(content, audioPath);

    if (!generated || !existsSync(audioPath)) {
      console.log(`  ✗ Failed to generate audio`);
      failed++;
      continue;
    }

    const fileSize = readFileSync(audioPath).length;
    console.log(`  Generated: ${(fileSize / 1024).toFixed(1)} KB`);

    try {
      const s3Key = `apex-lms/audio/lecture-${id}-v2-${Date.now()}.mp3`;
      const audioUrl = await uploadToS3(audioPath, s3Key);
      console.log(`  Uploaded: ${audioUrl.substring(0, 80)}...`);

      // Update database with new URL
      await conn.execute('UPDATE lectures SET audioUrl = ? WHERE id = ?', [audioUrl, id]);
      console.log(`  ✓ Database updated`);
      success++;
    } catch (e) {
      console.error(`  ✗ Upload/DB error: ${e.message}`);
      failed++;
    }

    // Clean up temp file
    if (existsSync(audioPath)) unlinkSync(audioPath);

    // Small delay
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${lectures.length}`);

  await conn.end();
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
