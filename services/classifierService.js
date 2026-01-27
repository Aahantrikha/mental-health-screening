import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CLASSIFIER_URL = process.env.CLASSIFIER_URL || 'http://localhost:8000/predict';

/**
 * Classify text using local DistilBERT FastAPI endpoint
 * @param {string} text - Text to classify
 * @returns {Promise<Array>} - Prediction results [{label, score}]
 */
export async function classifyText(text) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    console.log(`🔄 Calling local classifier at ${CLASSIFIER_URL}...`);

    const response = await axios.post(
      CLASSIFIER_URL,
      { text },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (!response.data) {
      throw new Error('Classifier returned empty response');
    }

    // Handle different response formats
    let predictions;
    
    if (Array.isArray(response.data)) {
      predictions = response.data;
    } else if (response.data.predictions) {
      predictions = response.data.predictions;
    } else if (response.data.label && response.data.score !== undefined) {
      predictions = [{ label: response.data.label, score: response.data.score }];
    } else {
      throw new Error('Unexpected classifier response format');
    }

    // Ensure predictions have required fields
    predictions = predictions.map(pred => ({
      label: pred.label || pred.class || 'Unknown',
      score: pred.score !== undefined ? pred.score : pred.confidence || 0
    }));

    return predictions;

  } catch (error) {
    console.error('❌ Classifier error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot connect to local classifier at ${CLASSIFIER_URL}. ` +
        'Please ensure your FastAPI server is running on port 8000.'
      );
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error('Classifier request timed out. The model may be processing a large input.');
    }

    throw new Error(`Classification failed: ${error.message}`);
  }
}

/**
 * Test classifier connection
 */
export async function testClassifierConnection() {
  try {
    const response = await axios.get(CLASSIFIER_URL.replace('/predict', '/health'), {
      timeout: 5000
    });
    return { success: true, status: response.status };
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return { 
        success: false, 
        error: 'Classifier not running. Start your FastAPI server on port 8000.' 
      };
    }
    return { success: false, error: error.message };
  }
}