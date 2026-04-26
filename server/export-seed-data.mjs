/**
 * Export all course data from the live database into seed JSON files
 * for the worldwide bundle. Includes transformed lecture content,
 * study sheet URLs, diagram URLs, glossary, study guides, etc.
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const OUTPUT_DIR = '/home/ubuntu/apex-global-v2/seed-data';

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const conn = await mysql.createConnection(DATABASE_URL);

  // Export courses
  console.log('Exporting courses...');
  const [courses] = await conn.query('SELECT * FROM courses ORDER BY id');
  console.log(`  Found ${courses.length} courses`);

  // Export modules
  console.log('Exporting modules...');
  const [modules] = await conn.query('SELECT * FROM modules ORDER BY courseId, sortOrder');
  console.log(`  Found ${modules.length} modules`);

  // Export lectures with ALL content
  console.log('Exporting lectures...');
  const [lectures] = await conn.query('SELECT * FROM lectures ORDER BY moduleId, sortOrder');
  console.log(`  Found ${lectures.length} lectures`);

  // Export questions
  console.log('Exporting questions...');
  const [questions] = await conn.query('SELECT * FROM questions ORDER BY quizId, id');
  console.log(`  Found ${questions.length} questions`);

  // Export quizzes
  console.log('Exporting quizzes...');
  const [quizzes] = await conn.query('SELECT * FROM quizzes ORDER BY courseId, id');
  console.log(`  Found ${quizzes.length} quizzes`);

  // Export badges
  console.log('Exporting badges...');
  const [badges] = await conn.query('SELECT * FROM badges ORDER BY id');
  console.log(`  Found ${badges.length} badges`);

  // Export bundles
  console.log('Exporting bundles...');
  const [bundles] = await conn.query('SELECT * FROM bundles ORDER BY id');
  console.log(`  Found ${bundles.length} bundles`);

  // Export bundle_courses
  console.log('Exporting bundle_courses...');
  const [bundleCourses] = await conn.query('SELECT * FROM bundle_courses ORDER BY bundleId, courseId');
  console.log(`  Found ${bundleCourses.length} bundle_courses`);

  // Build the complete seed data object
  const seedData = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    description: 'Apex Cyber Academy - Complete seed data with transformed student-friendly content, diagrams, and study sheets',
    stats: {
      courses: courses.length,
      modules: modules.length,
      lectures: lectures.length,
      questions: questions.length,
      quizzes: quizzes.length,
      badges: badges.length,
      bundles: bundles.length,
      bundleCourses: bundleCourses.length,
    },
    courses,
    modules,
    lectures,
    quizzes,
    questions,
    badges,
    bundles,
    bundleCourses,
  };

  // Write the complete seed data
  const outputPath = path.join(OUTPUT_DIR, 'complete_seed_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2));
  const fileSizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`\nSeed data exported to: ${outputPath}`);
  console.log(`File size: ${fileSizeMB} MB`);

  // Also export a summary of content lengths for verification
  const contentSummary = lectures.map(l => ({
    id: l.id,
    title: l.title,
    contentLen: l.content ? l.content.length : 0,
    arabicContentLen: l.arabicContent ? l.arabicContent.length : 0,
    studyGuideLen: l.studyGuideContent ? l.studyGuideContent.length : 0,
    glossaryLen: l.glossaryContent ? l.glossaryContent.length : 0,
    hasAudio: !!l.audioUrl,
    hasSlides: !!l.slideUrl,
    hasStudySheetEn: !!l.study_sheet_en_url,
    hasStudySheetAr: !!l.study_sheet_ar_url,
    hasDiagram: l.content ? l.content.includes('concept-diagram') || l.content.includes('manuscdn.com') : false,
  }));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'content_summary.json'),
    JSON.stringify(contentSummary, null, 2)
  );
  console.log('Content summary exported to: content_summary.json');

  await conn.end();
  console.log('\nDone!');
}

main().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
