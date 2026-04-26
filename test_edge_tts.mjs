import { ttsSave, getVoices } from 'edge-tts';
import { statSync } from 'fs';

async function test() {
  // List available EN-US male voices
  const voices = await getVoices();
  const enMaleVoices = voices.filter(v => v.Locale.startsWith('en-US') && v.Gender === 'Male');
  console.log('Available EN-US Male voices:');
  enMaleVoices.forEach(v => console.log(`  ${v.ShortName} - ${v.FriendlyName}`));
  
  // Generate test audio
  const outputPath = '/home/ubuntu/test_edge_audio.mp3';
  await ttsSave({
    text: 'Welcome to Apex Cyber Academy. In this lecture, we will explore the fundamentals of cybersecurity, including threat identification, risk management, and security controls.',
    voice: 'en-US-GuyNeural',
    outputPath,
  });
  
  const stats = statSync(outputPath);
  console.log('\nAudio generated:', stats.size, 'bytes');
  console.log('Saved to:', outputPath);
}

test().catch(e => console.error('Error:', e));
