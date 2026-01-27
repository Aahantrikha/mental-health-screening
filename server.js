import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analysisRouter from './routes/analysis.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      whisper: 'Hugging Face Cloud API',
      classifier: process.env.CLASSIFIER_URL || 'http://localhost:8000/predict'
    }
  });
});

// Routes
app.use('/api', analysisRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Mental Health Screening API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎤 Audio analysis: http://localhost:${PORT}/api/full-analysis`);
  console.log(`📝 Text analysis: http://localhost:${PORT}/api/text-analysis`);
});