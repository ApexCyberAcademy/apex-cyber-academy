/**
 * Generate Arabic translations for all lectures using the built-in LLM.
 * Run with: node generate-arabic.mjs
 * 
 * This script:
 * 1. Reads all lectures from the database
 * 2. For each lecture without Arabic content, sends the content to the LLM for translation
 * 3. Updates the database with the Arabic translation
 */

import mysql from "mysql2/promise";
const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

if (!DATABASE_URL) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

if (!FORGE_API_KEY) {
  console.error("BUILT_IN_FORGE_API_KEY not found");
  process.exit(1);
}

const apiUrl = FORGE_API_URL
  ? `${FORGE_API_URL.replace(/\/$/, "")}/v1/chat/completions`
  : "https://forge.manus.im/v1/chat/completions";

async function translateToArabic(content, title) {
  // Take only the first ~2000 chars of content to keep translations manageable
  const truncated = content.length > 3000 ? content.substring(0, 3000) + "\n\n..." : content;
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are a professional Arabic translator specializing in cybersecurity and IT certification content. Translate the following lecture content into Modern Standard Arabic (فصحى). 

Rules:
- Keep technical terms in English with Arabic transliteration in parentheses where helpful
- Use clear, educational Arabic suitable for university-level students
- Maintain the structure (headings, bullet points, etc.) in Arabic
- Keep markdown formatting
- Translate section headers and key concepts
- For acronyms like CIA, NIST, etc., keep the English acronym and add Arabic meaning
- Output ONLY the Arabic translation, no English text`
        },
        {
          role: "user",
          content: `Translate this cybersecurity lecture titled "${title}" into Arabic:\n\n${truncated}`
        }
      ],
      max_tokens: 8192,
      thinking: { budget_tokens: 128 }
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM failed: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function main() {
  console.log("Connecting to database...");
  const connection = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });

  // Get all lectures that need Arabic translation
  const [lectures] = await connection.execute(
    "SELECT id, title, content, arabicContent FROM lectures WHERE arabicContent IS NULL OR arabicContent = '' ORDER BY id"
  );

  console.log(`Found ${lectures.length} lectures needing Arabic translation`);

  let translated = 0;
  let failed = 0;

  for (const lecture of lectures) {
    try {
      console.log(`[${translated + failed + 1}/${lectures.length}] Translating: ${lecture.title}...`);
      
      const arabicContent = await translateToArabic(lecture.content || "", lecture.title);
      
      if (arabicContent && arabicContent.length > 50) {
        await connection.execute(
          "UPDATE lectures SET arabicContent = ? WHERE id = ?",
          [arabicContent, lecture.id]
        );
        translated++;
        console.log(`  ✓ Translated (${arabicContent.length} chars)`);
      } else {
        console.log(`  ⚠ Translation too short, skipping`);
        failed++;
      }

      // Rate limit - wait 1 second between requests
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      failed++;
      // Wait longer on error
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\nDone! Translated: ${translated}, Failed: ${failed}`);
  await connection.end();
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
