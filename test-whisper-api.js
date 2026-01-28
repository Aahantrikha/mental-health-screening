import { testWhisperConnection, transcribeAudio } from './services/whisperService.js';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Whisper API Integration...\n');

async function testWhisperAPI() {
    try {
        // Test 1: Connection test
        console.log('1️⃣ Testing Whisper API connection...');
        const connectionTest = await testWhisperConnection();
        
        if (connectionTest.success) {
            console.log('✅ Connection successful!');
            console.log(`   Token: ${connectionTest.token}`);
            console.log(`   Available models: ${connectionTest.models.length}`);
            connectionTest.models.forEach((model, i) => {
                console.log(`   ${i + 1}. ${model}`);
            });
        } else {
            console.log('❌ Connection failed:', connectionTest.error);
            return;
        }
        
        console.log('\n2️⃣ Testing with sample audio data...');
        
        // Create a simple test audio buffer (silence)
        // This is just to test the API endpoint, not actual transcription
        const testBuffer = Buffer.alloc(16000 * 2); // 1 second of 16kHz 16-bit silence
        
        // Add some basic WAV header
        const wavHeader = Buffer.from([
            0x52, 0x49, 0x46, 0x46, // "RIFF"
            0x24, 0x08, 0x00, 0x00, // File size
            0x57, 0x41, 0x56, 0x45, // "WAVE"
            0x66, 0x6D, 0x74, 0x20, // "fmt "
            0x10, 0x00, 0x00, 0x00, // Subchunk1Size
            0x01, 0x00,             // AudioFormat (PCM)
            0x01, 0x00,             // NumChannels (mono)
            0x80, 0x3E, 0x00, 0x00, // SampleRate (16000)
            0x00, 0x7D, 0x00, 0x00, // ByteRate
            0x02, 0x00,             // BlockAlign
            0x10, 0x00,             // BitsPerSample
            0x64, 0x61, 0x74, 0x61, // "data"
            0x00, 0x08, 0x00, 0x00  // Subchunk2Size
        ]);
        
        const testAudioBuffer = Buffer.concat([wavHeader, testBuffer]);
        
        console.log(`📊 Test audio buffer: ${testAudioBuffer.length} bytes`);
        
        try {
            const result = await transcribeAudio(testAudioBuffer);
            console.log('✅ Transcription test completed!');
            console.log(`   Result: "${result}"`);
            
            if (!result || result.trim().length === 0) {
                console.log('ℹ️ Empty result is expected for silence audio');
            }
            
        } catch (transcriptionError) {
            console.log('⚠️ Transcription test failed (this might be expected for silence):', transcriptionError.message);
            
            // Check if it's just because of empty audio
            if (transcriptionError.message.includes('empty') || 
                transcriptionError.message.includes('short') ||
                transcriptionError.message.includes('no speech')) {
                console.log('ℹ️ This is expected behavior for silence audio');
            } else {
                console.log('❌ Unexpected error - this needs investigation');
            }
        }
        
        console.log('\n✅ Whisper API test completed!');
        console.log('🎤 Ready to process real audio recordings');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testWhisperAPI();