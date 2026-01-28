import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../services/whisperService.js';
import { classifyText } from '../services/classifierService.js';
import { calculateRiskLevel, generateReport, formatChartData } from '../utils/riskAnalysis.js';

const router = express.Router();

// Configure multer for audio file uploads with better error handling
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
    files: 1, // Only one file at a time
  },
  fileFilter: (req, file, cb) => {
    console.log(`📁 Received file: ${file.originalname}, type: ${file.mimetype}, size: ${file.size || 'unknown'}`);
    
    const allowedMimes = [
      'audio/mpeg',
      'audio/wav',
      'audio/mp3',
      'audio/mp4',
      'audio/webm',
      'audio/ogg',
      'audio/flac',
      'audio/webm;codecs=opus'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log(`❌ Invalid file type: ${file.mimetype}`);
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimes.join(', ')}`));
    }
  }
});

/**
 * POST /api/text-analysis
 * Direct text mental health screening (skips Whisper)
 */
router.post('/text-analysis', async (req, res, next) => {
  try {
    const { text } = req.body;

    // Validate text input
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'No text provided',
        message: 'Please provide text in the request body'
      });
    }

    console.log(`📝 Received text: "${text.substring(0, 100)}..."`);

    // Step 1: Classify text using local DistilBERT
    console.log('🧠 Classifying text with local DistilBERT...');
    const prediction = await classifyText(text);

    // Step 2: Calculate risk level
    const riskLevel = calculateRiskLevel(prediction);

    // Step 3: Generate screening report
    const report = generateReport(prediction, riskLevel);

    // Step 4: Format chart data
    const chartData = formatChartData(prediction);

    // Step 5: Return complete analysis
    const response = {
      text,
      prediction,
      riskLevel,
      report,
      chartData,
      metadata: {
        textLength: text.length,
        timestamp: new Date().toISOString(),
        source: 'direct-text'
      }
    };

    console.log(`✅ Analysis complete. Risk level: ${riskLevel}`);
    res.json(response);

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/full-analysis
 * Complete speech-to-text mental health screening pipeline
 */
router.post('/full-analysis', upload.single('audio'), async (req, res, next) => {
  try {
    // Validate audio file
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided',
        message: 'Please upload an audio file using the "audio" field'
      });
    }

    // Validate file buffer
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        error: 'Empty audio file',
        message: 'The uploaded audio file appears to be empty or corrupted.'
      });
    }

    console.log(`📁 Processing audio file:`);
    console.log(`   Name: ${req.file.originalname}`);
    console.log(`   Size: ${(req.file.size / 1024).toFixed(2)} KB`);
    console.log(`   Type: ${req.file.mimetype}`);
    console.log(`   Buffer length: ${req.file.buffer.length} bytes`);

    // Step 1: Transcribe audio using Whisper (Hugging Face Cloud)
    console.log('🎤 Transcribing audio with Whisper...');
    
    let transcript;
    try {
      transcript = await transcribeAudio(req.file.buffer);
    } catch (transcriptionError) {
      console.error('❌ Transcription failed:', transcriptionError.message);
      
      // Since Whisper API is currently unavailable, provide helpful guidance
      return res.status(503).json({
        error: 'Speech-to-text service unavailable',
        message: 'The Whisper API is currently unavailable due to Hugging Face API changes. Please use one of these alternatives:',
        alternatives: [
          {
            option: 'Real-time transcription',
            description: 'Use the real-time client that transcribes as you speak',
            url: '/realtime-client.html'
          },
          {
            option: 'Perfect client',
            description: 'Use the hybrid client with both voice and text input',
            url: '/perfect-client.html'
          },
          {
            option: 'Text input',
            description: 'Type your text directly for analysis',
            endpoint: '/api/text-analysis'
          }
        ],
        technical_details: transcriptionError.message
      });
    }
    
    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({
        error: 'No speech detected',
        message: 'Could not extract text from audio. Please ensure audio contains clear speech.'
      });
    }

    console.log(`✅ Transcript: "${transcript.substring(0, 100)}..."`);

    // Step 2: Classify transcript using local DistilBERT
    console.log('🧠 Classifying text with local DistilBERT...');
    const prediction = await classifyText(transcript);

    // Step 3: Calculate risk level
    const riskLevel = calculateRiskLevel(prediction);

    // Step 4: Generate screening report
    const report = generateReport(prediction, riskLevel);

    // Step 5: Format chart data
    const chartData = formatChartData(prediction);

    // Step 6: Return complete analysis
    const response = {
      transcript,
      prediction,
      riskLevel,
      report,
      chartData,
      metadata: {
        audioFile: req.file.originalname,
        audioSize: req.file.size,
        audioType: req.file.mimetype,
        transcriptLength: transcript.length,
        timestamp: new Date().toISOString()
      }
    };

    console.log(`✅ Analysis complete. Risk level: ${riskLevel}`);
    res.json(response);

  } catch (error) {
    console.error('❌ Full analysis error:', error);
    next(error);
  }
});

export default router;