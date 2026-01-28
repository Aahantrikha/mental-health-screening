import dotenv from 'dotenv';

dotenv.config();

/**
 * Transcribe audio using Hugging Face Whisper API
 * Note: The Hugging Face Inference API has been deprecated and moved to a new system
 * that requires special permissions or paid access for Whisper models.
 * 
 * @param {Buffer} audioBuffer - Audio file buffer
 * @returns {Promise<string>} - Transcribed text
 */
export async function transcribeAudio(audioBuffer) {
    try {
        console.log(`🔄 Attempting Whisper transcription...`);
        console.log(`   Audio buffer size: ${audioBuffer.length} bytes`);
        
        // The Hugging Face Inference API has been deprecated
        // The old api-inference.huggingface.co endpoint returns 410 Gone
        // The new system requires special permissions or paid access
        
        throw new Error('Hugging Face Whisper API is currently unavailable. The inference API has been deprecated and requires special permissions. Please use the real-time transcription feature instead.');
        
    } catch (error) {
        console.error('❌ Whisper transcription error:', error.message);
        
        // Provide helpful error message for users
        throw new Error(`Whisper API unavailable: Please use the real-time transcription feature which works directly in your browser, or contact support for API access.`);
    }
}

/**
 * Test Whisper API connection
 * @returns {Object} - Connection test result
 */
export async function testWhisperConnection() {
    try {
        console.log(`🔍 Testing Whisper connection...`);
        
        return { 
            success: false, 
            error: 'Hugging Face Inference API has been deprecated. Use real-time transcription instead.',
            models: [],
            token: 'N/A'
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}