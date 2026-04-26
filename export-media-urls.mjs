/**
 * Export all media URLs from the database to a JSON file.
 * Run with: node export-media-urls.mjs
 */
import { createConnection } from 'mysql2/promise';
import { writeFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

function parseDbUrl(url) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: parseInt(u.port) || 3306,
    user: u.username,
    password: u.password,
    database: u.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
  };
}

async function main() {
  const conn = await createConnection(parseDbUrl(DATABASE_URL));
  
  // Get all lectures with media
  const [lectures] = await conn.execute(`
    SELECT 
      l.id, l.title, l.slug, l.audioUrl, l.slideUrl, l.sortOrder,
      c.slug as courseSlug, c.title as courseTitle, c.certCode, c.imageUrl as courseImageUrl,
      m.title as moduleTitle, m.sortOrder as moduleSortOrder, m.id as moduleId
    FROM lectures l
    JOIN courses c ON l.courseId = c.id
    JOIN modules m ON l.moduleId = m.id
    ORDER BY c.sortOrder, m.sortOrder, l.sortOrder
  `);
  
  // Get course images
  const [courses] = await conn.execute(`
    SELECT id, slug, title, certCode, imageUrl FROM courses ORDER BY sortOrder
  `);
  
  // Organize by course
  const manifest = {};
  let totalAudio = 0;
  let totalSlides = 0;
  let totalImages = 0;
  
  for (const course of courses) {
    manifest[course.slug] = {
      title: course.title,
      certCode: course.certCode,
      imageUrl: course.imageUrl || null,
      lectures: []
    };
    if (course.imageUrl) totalImages++;
  }
  
  for (const lec of lectures) {
    if (!manifest[lec.courseSlug]) {
      manifest[lec.courseSlug] = { title: lec.courseTitle, certCode: lec.certCode, lectures: [] };
    }
    manifest[lec.courseSlug].lectures.push({
      id: lec.id,
      title: lec.title,
      slug: lec.slug,
      moduleTitle: lec.moduleTitle,
      moduleSortOrder: lec.moduleSortOrder,
      sortOrder: lec.sortOrder,
      audioUrl: lec.audioUrl || null,
      slideUrl: lec.slideUrl || null,
    });
    if (lec.audioUrl) totalAudio++;
    if (lec.slideUrl) totalSlides++;
  }
  
  writeFileSync('/home/ubuntu/media-manifest.json', JSON.stringify(manifest, null, 2));
  
  // Also create a flat download list
  const downloadList = [];
  for (const [slug, info] of Object.entries(manifest)) {
    if (info.imageUrl) {
      downloadList.push({ type: 'IMAGE', courseSlug: slug, lectureSlug: 'course-image', url: info.imageUrl });
    }
    for (const lec of info.lectures) {
      if (lec.audioUrl) {
        downloadList.push({ type: 'AUDIO', courseSlug: slug, lectureSlug: lec.slug, url: lec.audioUrl });
      }
      if (lec.slideUrl) {
        downloadList.push({ type: 'SLIDE', courseSlug: slug, lectureSlug: lec.slug, url: lec.slideUrl });
      }
    }
  }
  
  writeFileSync('/home/ubuntu/media-download-list.json', JSON.stringify(downloadList, null, 2));
  
  console.log('='.repeat(60));
  console.log('MEDIA MANIFEST SUMMARY');
  console.log('='.repeat(60));
  for (const [slug, info] of Object.entries(manifest)) {
    const audioCount = info.lectures.filter(l => l.audioUrl).length;
    const slideCount = info.lectures.filter(l => l.slideUrl).length;
    console.log(`\n${info.title} (${slug})`);
    console.log(`  Lectures: ${info.lectures.length}`);
    console.log(`  Audio files: ${audioCount}`);
    console.log(`  Slide files: ${slideCount}`);
    if (info.imageUrl) console.log(`  Course image: Yes`);
  }
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TOTALS: ${totalAudio} audio, ${totalSlides} slides, ${totalImages} images`);
  console.log(`Total media files to download: ${totalAudio + totalSlides + totalImages}`);
  console.log(`${'='.repeat(60)}`);
  
  await conn.end();
}

main().catch(err => { console.error(err); process.exit(1); });
