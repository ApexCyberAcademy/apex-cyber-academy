/**
 * Seed the CEH (Certified Ethical Hacker) course into the database.
 * Does NOT delete existing courses.
 * Run: node seed-ceh-course.mjs
 */

import { readFileSync } from 'fs';
import { createConnection } from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const seedData = JSON.parse(readFileSync('./ceh_seed_data.json', 'utf-8'));

function parseDbUrl(url) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: parseInt(u.port) || 3306,
    user: u.username,
    password: u.password,
    database: u.pathname.slice(1),
    ssl: { rejectUnauthorized: false },
  };
}

async function main() {
  const config = parseDbUrl(DATABASE_URL);
  const conn = await createConnection(config);
  console.log('Connected to database');

  // Check existing courses
  const [existing] = await conn.execute('SELECT id, slug, title FROM courses');
  console.log(`\nExisting courses: ${existing.length}`);
  existing.forEach(c => console.log(`  - ${c.slug} (ID: ${c.id})`));

  const existingSlugs = existing.map(c => c.slug);

  for (const course of seedData.courses) {
    if (existingSlugs.includes(course.slug)) {
      console.log(`\nSkipping ${course.slug} — already exists`);
      continue;
    }

    console.log(`\nSeeding course: ${course.title}`);

    // Insert course
    const [courseResult] = await conn.execute(
      `INSERT INTO courses (slug, title, subtitle, description, certCode, totalHours, totalSessions, examFormat, priceSelfPaced, priceLive, imageUrl, isPublished, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course.slug,
        course.title,
        course.subtitle || null,
        course.description || null,
        course.certCode || null,
        course.totalHours || null,
        course.totalSessions || null,
        course.examFormat || null,
        course.priceSelfPaced || null,
        course.priceLive || null,
        course.imageUrl || null,
        true,
        course.sortOrder || 0,
      ]
    );
    const courseId = courseResult.insertId;
    console.log(`  Course ID: ${courseId}`);

    for (const mod of course.modules) {
      const [modResult] = await conn.execute(
        `INSERT INTO modules (courseId, title, description, sortOrder, examWeight)
         VALUES (?, ?, ?, ?, ?)`,
        [courseId, mod.title, mod.description || null, mod.sortOrder || 0, mod.examWeight || null]
      );
      const moduleId = modResult.insertId;
      console.log(`  Module: ${mod.title} (ID: ${moduleId})`);

      for (const lec of mod.lectures) {
        const [lecResult] = await conn.execute(
          `INSERT INTO lectures (moduleId, courseId, title, slug, content, studyGuideContent, glossaryContent, arabicContent, audioUrl, durationMinutes, objectives, sortOrder)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            moduleId,
            courseId,
            lec.title,
            lec.slug,
            lec.content || null,
            lec.studyGuideContent || null,
            lec.glossaryContent || null,
            null, // arabicContent - not included for CEH
            lec.audioUrl || null,
            lec.durationMinutes || null,
            lec.objectives || null,
            lec.sortOrder || 0,
          ]
        );
        console.log(`    Lecture: ${lec.title} (ID: ${lecResult.insertId})`);
      }

      if (mod.quiz) {
        const quiz = mod.quiz;
        const [quizResult] = await conn.execute(
          `INSERT INTO quizzes (moduleId, courseId, title, description, isFinalExam, timeLimitMinutes, passingScore, sortOrder)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            moduleId,
            courseId,
            quiz.title,
            quiz.description || null,
            quiz.isFinalExam ? 1 : 0,
            quiz.timeLimitMinutes || null,
            quiz.passingScore || 70,
            quiz.sortOrder || 0,
          ]
        );
        const quizId = quizResult.insertId;
        console.log(`    Quiz: ${quiz.title} (ID: ${quizId}) — ${quiz.questions.length} questions`);

        for (const q of quiz.questions) {
          await conn.execute(
            `INSERT INTO questions (quizId, questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation, objective, sortOrder)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              quizId,
              q.questionText,
              q.optionA,
              q.optionB,
              q.optionC,
              q.optionD,
              q.correctAnswer,
              q.explanation || null,
              q.objective || null,
              q.number || 0,
            ]
          );
        }
      }
    }

    // Final exam
    if (course.finalExam) {
      const fe = course.finalExam;
      const [feResult] = await conn.execute(
        `INSERT INTO quizzes (moduleId, courseId, title, description, isFinalExam, timeLimitMinutes, passingScore, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          null,
          courseId,
          fe.title,
          fe.description || null,
          1,
          fe.timeLimitMinutes || 90,
          fe.passingScore || 70,
          99,
        ]
      );
      const feQuizId = feResult.insertId;
      console.log(`  Final Exam: ${fe.title} (ID: ${feQuizId}) — ${fe.questions.length} questions`);

      for (const q of fe.questions) {
        await conn.execute(
          `INSERT INTO questions (quizId, questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation, objective, sortOrder)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            feQuizId,
            q.questionText,
            q.optionA,
            q.optionB,
            q.optionC,
            q.optionD,
            q.correctAnswer,
            q.explanation || null,
            q.objective || null,
            q.number || 0,
          ]
        );
      }
    }
  }

  // Verify counts
  const [courseCount] = await conn.execute('SELECT COUNT(*) as c FROM courses');
  const [moduleCount] = await conn.execute('SELECT COUNT(*) as c FROM modules');
  const [lectureCount] = await conn.execute('SELECT COUNT(*) as c FROM lectures');
  const [quizCount] = await conn.execute('SELECT COUNT(*) as c FROM quizzes');
  const [questionCount] = await conn.execute('SELECT COUNT(*) as c FROM questions');

  console.log('\n=== SEED COMPLETE ===');
  console.log(`Courses: ${courseCount[0].c}`);
  console.log(`Modules: ${moduleCount[0].c}`);
  console.log(`Lectures: ${lectureCount[0].c}`);
  console.log(`Quizzes: ${quizCount[0].c}`);
  console.log(`Questions: ${questionCount[0].c}`);

  await conn.end();
  console.log('Done!');
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
