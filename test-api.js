/**
 * Simple test script for the Mental Health Screening API
 * Usage: node test-api.js <path-to-audio-file>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    console.log('✅ Health check passed');
    console.log(JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testFullAnalysis(audioFilePath) {
  console.log('\n🎤 Testing full analysis...');
  
  if (!audioFilePath) {
    console.error('❌ No audio file provided');
    console.log('Usage: node test-api.js <path-to-audio-file>');
    return false;
  }

  if (!fs.existsSync(audioFilePath)) {
    console.error(`❌ Audio file not found: ${audioFilePath}`);
    return false;
  }

  try {
    const audioBuffer = fs.readFileSync(audioFilePath);
    const fileName = path.basename(audioFilePath);
    
    console.log(`📁 Uploading: ${fileName} (${(audioBuffer.length / 1024).toFixed(2)} KB)`);

    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    formData.append('audio', blob, fileName);

    const response = await fetch(`${API_URL}/api/full-analysis`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error);
      return false;
    }

    const result = await response.json();
    
    console.log('\n✅ Analysis complete!\n');
    console.log('📝 Transcript:', result.transcript);
    console.log('\n🧠 Predictions:');
    result.prediction.forEach(pred => {
      console.log(`  - ${pred.label}: ${(pred.score * 100).toFixed(1)}%`);
    });
    console.log('\n⚠️  Risk Level:', result.riskLevel);
    console.log('\n📊 Chart Data:', JSON.stringify(result.chartData, null, 2));
    console.log('\n📋 Report:\n', result.report);

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Mental Health Screening API Test\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test health check
  const healthOk = await testHealthCheck();
  
  if (!healthOk) {
    console.error('\n❌ Server is not running. Start it with: npm start');
    process.exit(1);
  }

  // Test full analysis if audio file provided
  const audioFile = process.argv[2];
  
  if (audioFile) {
    await testFullAnalysis(audioFile);
  } else {
    console.log('\n💡 To test full analysis, provide an audio file:');
    console.log('   node test-api.js path/to/audio.mp3');
  }
}

main();