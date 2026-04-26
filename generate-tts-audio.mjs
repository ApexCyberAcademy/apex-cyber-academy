/**
 * Generate TTS audio for all lectures using edge-tts (Python CLI),
 * upload to S3 via the Forge storage proxy, and update the database.
 */
import { execSync } from 'child_process';
import { readFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_URL = (process.env.BUILT_IN_FORGE_API_URL || '').replace(/\/+$/, '');
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!DATABASE_URL || !FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const VOICE = 'en-US-GuyNeural'; // Professional male voice
const TEMP_DIR = '/tmp/tts_audio';
const MAX_TEXT_LENGTH = 5000; // edge-tts handles long text well, but let's be safe

// Strip markdown formatting for cleaner TTS
function stripMarkdown(text) {
  return text
    .replace(/#{1,6}\s+/g, '') // headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/^\s*[-*+]\s+/gm, '') // list markers
    .replace(/^\s*\d+\.\s+/gm, '') // numbered lists
    .replace(/\|[^|]*\|/g, '') // table rows
    .replace(/[-]{3,}/g, '') // horizontal rules
    .replace(/>\s+/g, '') // blockquotes
    .replace(/\n{3,}/g, '\n\n') // excessive newlines
    .trim();
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
  const cleanText = truncateForTTS(stripMarkdown(text));
  // Write text to temp file to avoid shell escaping issues
  const textFile = outputPath + '.txt';
  const { writeFileSync } = await_import_fs();
  writeFileSync(textFile, cleanText, 'utf-8');
  
  try {
    execSync(`edge-tts --file "${textFile}" --voice ${VOICE} --write-media "${outputPath}" 2>&1`, {
      timeout: 120000, // 2 min timeout
    });
    // Clean up text file
    if (existsSync(textFile)) unlinkSync(textFile);
    return true;
  } catch (e) {
    console.error('  TTS generation failed:', e.message);
    if (existsSync(textFile)) unlinkSync(textFile);
    return false;
  }
}

// Hacky but works for .mjs
function await_import_fs() {
  return { writeFileSync: (p, d, e) => { execSync(`cat > "${p}" << 'ENDOFTEXTFILE'\n${d}\nENDOFTEXTFILE`); }};
}

// Actually use fs properly
import { writeFileSync } from 'fs';

function generateAudioFixed(text, outputPath) {
  const cleanText = truncateForTTS(stripMarkdown(text));
  const textFile = outputPath + '.txt';
  writeFileSync(textFile, cleanText, 'utf-8');
  
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
  // Ensure temp directory
  if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

  // Connect to database
  const conn = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });

  // Get all lectures with content
  const [lectures] = await conn.execute(
    'SELECT id, title, content FROM lectures WHERE content IS NOT NULL ORDER BY courseId, sortOrder'
  );

  console.log(`Found ${lectures.length} lectures to process\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const lecture of lectures) {
    const { id, title, content } = lecture;
    
    // Check if already has audio
    const [existing] = await conn.execute('SELECT audioUrl FROM lectures WHERE id = ? AND audioUrl IS NOT NULL', [id]);
    if (existing.length > 0 && existing[0].audioUrl) {
      console.log(`[${id}] "${title}" — already has audio, skipping`);
      skipped++;
      continue;
    }

    console.log(`[${id}] "${title}" — generating audio...`);
    
    const audioPath = `${TEMP_DIR}/lecture_${id}.mp3`;
    const generated = generateAudioFixed(content, audioPath);
    
    if (!generated || !existsSync(audioPath)) {
      console.log(`  ✗ Failed to generate audio`);
      failed++;
      continue;
    }

    const fileSize = readFileSync(audioPath).length;
    console.log(`  Generated: ${(fileSize / 1024).toFixed(1)} KB`);

    // Upload to S3
    try {
      const s3Key = `apex-lms/audio/lecture-${id}-${Date.now()}.mp3`;
      const audioUrl = await uploadToS3(audioPath, s3Key);
      console.log(`  Uploaded: ${audioUrl.substring(0, 80)}...`);

      // Update database
      await conn.execute('UPDATE lectures SET audioUrl = ? WHERE id = ?', [audioUrl, id]);
      console.log(`  ✓ Database updated`);
      success++;
    } catch (e) {
      console.error(`  ✗ Upload/DB error: ${e.message}`);
      failed++;
    }

    // Clean up temp file
    if (existsSync(audioPath)) unlinkSync(audioPath);
    
    // Small delay to be nice to the TTS service
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${lectures.length}`);

  await conn.end();
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
