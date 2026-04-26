import { readFileSync } from 'fs';
const d = JSON.parse(readFileSync('seed_data.json', 'utf-8'));
console.log('Courses:', d.courses.length);
d.courses.forEach(c => {
  console.log(c.slug, '- modules:', c.modules.length, '- finalExam:', !!c.finalExam);
  c.modules.forEach(m => {
    console.log('  ', m.title, '- lectures:', m.lectures.length, '- quiz:', !!m.quiz, m.quiz ? m.quiz.questions.length + ' questions' : '');
  });
  if (c.finalExam) console.log('  Final exam:', c.finalExam.questions.length, 'questions');
});
