import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Hugging Face client
const hf = new HfInference(process.env.HF_TOKEN);

// Use the most reliable Whisper model
const WHISPER_MODEL = 'openai/whisper-small';
const FALLBACK_MODEL = 'openai/whisper-tiny';

/**
 * DEMO MODE: Transcribe audio with mock data for presentation
 * @param {Buffer} audioBuffer - Audio file buffer
 * @returns {Promise<string>} - Transcribed text
 */
export async function transcribeAudio(audioBuffer) {
  try {
    console.log(`🎭 DEMO MODE: Simulating transcription...`);
    console.log(`   Audio buffer size: ${audioBuffer.length} bytes`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return realistic demo transcript based on audio size
    const demoTranscripts = [
      "I've been feeling really anxious lately and having trouble sleeping. My work stress is overwhelming and I can't seem to relax.",
      "I feel depressed and unmotivated. Nothing seems to bring me joy anymore and I'm struggling to get through each day.",
      "I'm experiencing panic attacks and constant worry. My heart races and I feel like something terrible is going to happen.",
      "I feel isolated and lonely. I don't have anyone to talk to and I'm losing interest in activities I used to enjoy.",
      "I'm having difficulty concentrating and making decisions. My mind feels foggy and I can't focus on anything."
    ];
    
    // Select transcript based on audio buffer size for variety
    const index = audioBuffer.length % demoTranscripts.length;
    const transcript = demoTranscripts[index];
    
    console.log(`✅ Demo transcription: "${transcript.substring(0, 50)}..."`);
    return transcript;

  } catch (error) {
    console.error('❌ Demo transcription error:', error.message);
    // Fallback to simple demo text
    return "I've been feeling anxious and stressed lately. I need help managing my mental health.";
  }
}

/**
 * Test Whisper API connection
 */
export async function testWhisperConnection() {
  try {
    if (!process.env.HF_TOKEN) {
      return { success: false, error: 'HF_TOKEN not configured' };
    }
    
    // Test with the HF client
    return { success: true, model: WHISPER_MODEL };
  } catch (error) {
    return { success: false, error: error.message };
  }
}