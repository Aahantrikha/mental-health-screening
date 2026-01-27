# Mental Health Screening API

Hybrid architecture combining cloud-based Whisper speech-to-text with local DistilBERT mental health classification.

## Architecture

```
User Voice Input
      ↓
Whisper API (Hugging Face Cloud) → Transcript
      ↓
Local DistilBERT Classifier → Prediction
      ↓
Risk Analysis → Screening Report
      ↓
JSON Response (with chart data)
```

## Features

- 🎤 **Speech-to-Text**: Whisper large-v3 via Hugging Face API
- 🧠 **Mental Health Classification**: Local DistilBERT model (dsuram/distilbert-mentalhealth-classifier)
- 📊 **Risk Assessment**: Automated risk level calculation (High/Moderate/Low)
- 📈 **Chart-Ready Data**: Formatted for frontend visualization
- 🔒 **Production-Ready**: Error handling, validation, and logging

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Hugging Face Account** with API token
3. **Local FastAPI Classifier** running on `http://localhost:8000`

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Hugging Face token:

```env
HF_TOKEN=hf_your_token_here
CLASSIFIER_URL=http://localhost:8000/predict
PORT=3000
NODE_ENV=development
```

**Get your HF token**: https://huggingface.co/settings/tokens

### 3. Start Local Classifier

Ensure your FastAPI classifier is running:

```bash
# In your Python project directory
uvicorn main:app --reload --port 8000
```

### 4. Start the API Server

```bash
npm start
```

Or with auto-reload during development:

```bash
npm run dev
```

## API Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T10:30:00.000Z",
  "services": {
    "whisper": "Hugging Face Cloud API",
    "classifier": "http://localhost:8000/predict"
  }
}
```

### Full Analysis

```http
POST /api/full-analysis
Content-Type: multipart/form-data
```

**Request:**
- Field name: `audio`
- File types: `.mp3`, `.wav`, `.mp4`, `.webm`, `.ogg`, `.flac`
- Max size: 25MB

**Response:**
```json
{
  "transcript": "I've been feeling really anxious lately and can't sleep well...",
  "prediction": [
    {
      "label": "Anxiety",
      "score": 0.95
    },
    {
      "label": "Depression",
      "score": 0.03
    },
    {
      "label": "Normal",
      "score": 0.02
    }
  ],
  "riskLevel": "High",
  "report": "Mental Health Screening Report\n\nPrimary Classification: Anxiety (95.0% confidence)...",
  "chartData": {
    "labels": ["Anxiety", "Depression", "Normal"],
    "scores": [95.0, 3.0, 2.0]
  },
  "metadata": {
    "audioFile": "recording.mp3",
    "audioSize": 245678,
    "transcriptLength": 156,
    "timestamp": "2026-01-26T10:30:00.000Z"
  }
}
```

## Testing with cURL

### Test with audio file:

```bash
curl -X POST http://localhost:3000/api/full-analysis \
  -F "audio=@path/to/your/audio.mp3"
```

### Test with sample audio (if you have one):

```bash
curl -X POST http://localhost:3000/api/full-analysis \
  -F "audio=@sample_audio.wav" \
  -o response.json
```

## Testing with Postman

1. Create a new POST request to `http://localhost:3000/api/full-analysis`
2. Go to **Body** tab
3. Select **form-data**
4. Add key: `audio` (change type to **File**)
5. Upload your audio file
6. Click **Send**

## Project Structure

```
.
├── server.js                 # Express app entry point
├── routes/
│   └── analysis.js          # Main analysis route
├── services/
│   ├── whisperService.js    # Hugging Face Whisper integration
│   └── classifierService.js # Local FastAPI classifier client
├── utils/
│   └── riskAnalysis.js      # Risk calculation and reporting
├── middleware/
│   └── errorHandler.js      # Global error handling
├── package.json
├── .env.example
└── README.md
```

## Error Handling

The API provides detailed error messages:

- **400**: Invalid request (missing file, wrong format)
- **413**: File too large (>25MB)
- **500**: Configuration error (missing HF_TOKEN)
- **503**: Service unavailable (classifier not running)

## Risk Level Calculation

- **High**: Depression/Anxiety with ≥75% confidence
- **Moderate**: Depression/Anxiety with ≥50% confidence
- **Low**: Normal classification or low confidence

## Production Deployment

### Environment Variables

Set these in production:

```env
NODE_ENV=production
HF_TOKEN=your_production_token
CLASSIFIER_URL=http://your-classifier-service:8000/predict
PORT=3000
```

### Security Considerations

1. Use HTTPS in production
2. Implement rate limiting
3. Add authentication/authorization
4. Validate and sanitize all inputs
5. Set up proper CORS policies
6. Monitor API usage and costs

### Scaling

- Consider caching Whisper results for identical audio
- Implement request queuing for high traffic
- Use load balancer for multiple classifier instances
- Monitor Hugging Face API rate limits

## Troubleshooting

### "Cannot connect to local classifier"

- Ensure FastAPI is running: `uvicorn main:app --reload --port 8000`
- Check classifier URL in `.env`
- Test classifier directly: `curl http://localhost:8000/predict -d '{"text":"test"}'`

### "Invalid Hugging Face API token"

- Verify token in `.env` file
- Check token permissions at https://huggingface.co/settings/tokens
- Ensure token has read access

### "Whisper model is loading"

- First request may take 30-60 seconds as model loads
- Retry after a few moments
- Consider using a dedicated inference endpoint for production

## License

MIT

## Disclaimer

This is a screening tool only and not a clinical diagnosis. Always consult qualified mental health professionals for proper evaluation and treatment.