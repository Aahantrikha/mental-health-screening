# Mental Health Screening API - Complete Documentation

## Overview

This API provides a hybrid architecture for mental health screening that combines:
- **Cloud-based Speech-to-Text**: Whisper large-v3 via Hugging Face API
- **Local Classification**: DistilBERT mental health classifier running on FastAPI

## API Specification

### Base URL
```
http://localhost:3000
```

---

## Endpoints

### 1. Health Check

Check if the API and its dependencies are running.

**Endpoint**: `GET /health`

**Response**: `200 OK`
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

---

### 2. Full Analysis

Complete pipeline: audio → transcript → classification → risk analysis

**Endpoint**: `POST /api/full-analysis`

**Content-Type**: `multipart/form-data`

**Request Parameters**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| audio | File | Yes | Audio file (MP3, WAV, MP4, WebM, OGG, FLAC) |

**File Constraints**:
- Max size: 25MB
- Supported formats: audio/mpeg, audio/wav, audio/mp4, audio/webm, audio/ogg, audio/flac

**Response**: `200 OK`

```json
{
  "transcript": "I've been feeling really anxious lately and having trouble sleeping. I worry about everything and can't seem to relax.",
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
  "report": "Mental Health Screening Report\n\nPrimary Classification: Anxiety (95.0% confidence)\nRisk Level: High\n\n⚠️ HIGH RISK DETECTED\n\nThe analysis indicates significant signs of anxiety. We strongly recommend:\n• Speak with a mental health professional immediately\n• Contact a crisis helpline if experiencing thoughts of self-harm\n• Reach out to trusted friends or family members\n• Avoid making major life decisions while in distress\n\nCrisis Resources:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n\n⚠️ DISCLAIMER: This is a screening tool only and not a clinical diagnosis. Please consult with a qualified mental health professional for proper evaluation and treatment.",
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

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| transcript | string | Transcribed text from audio |
| prediction | array | Classification results with labels and confidence scores |
| riskLevel | string | "High", "Moderate", or "Low" |
| report | string | Human-readable screening report with recommendations |
| chartData | object | Formatted data for visualization (labels and scores arrays) |
| metadata | object | Request metadata (file info, timestamp) |

---

## Error Responses

### 400 Bad Request

**Missing File**:
```json
{
  "error": "No audio file provided",
  "message": "Please upload an audio file using the \"audio\" field"
}
```

**Invalid File Type**:
```json
{
  "error": "Invalid file type",
  "message": "Invalid file type. Allowed: audio/mpeg, audio/wav, ..."
}
```

**Empty Transcription**:
```json
{
  "error": "Transcription failed",
  "message": "Could not extract text from audio. Please ensure audio contains speech."
}
```

### 413 Payload Too Large

```json
{
  "error": "File too large",
  "message": "Audio file must be less than 25MB",
  "maxSize": "25MB"
}
```

### 500 Internal Server Error

**Missing HF Token**:
```json
{
  "error": "Configuration error",
  "message": "Hugging Face API token not configured. Please set HF_TOKEN in .env file."
}
```

### 503 Service Unavailable

**Classifier Not Running**:
```json
{
  "error": "Service unavailable",
  "message": "Cannot connect to local classifier at http://localhost:8000/predict. Please ensure your FastAPI server is running on port 8000.",
  "suggestion": "Ensure your FastAPI classifier is running on http://localhost:8000"
}
```

---

## Risk Level Calculation

The API calculates risk levels based on classification confidence:

| Risk Level | Criteria |
|------------|----------|
| **High** | Depression/Anxiety with ≥75% confidence, OR Stress/Suicidal with ≥60% confidence |
| **Moderate** | Depression/Anxiety with ≥50% confidence, OR Stress/Suicidal with <60% confidence |
| **Low** | Normal classification OR low confidence on concerning labels |

---

## Usage Examples

### cURL

```bash
# Basic request
curl -X POST http://localhost:3000/api/full-analysis \
  -F "audio=@recording.mp3"

# Save response to file
curl -X POST http://localhost:3000/api/full-analysis \
  -F "audio=@recording.mp3" \
  -o response.json

# With verbose output
curl -v -X POST http://localhost:3000/api/full-analysis \
  -F "audio=@recording.mp3"
```

### JavaScript (Fetch API)

```javascript
const formData = new FormData();
formData.append('audio', audioFile);

const response = await fetch('http://localhost:3000/api/full-analysis', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Risk Level:', result.riskLevel);
console.log('Transcript:', result.transcript);
```

### Python (requests)

```python
import requests

url = 'http://localhost:3000/api/full-analysis'
files = {'audio': open('recording.mp3', 'rb')}

response = requests.post(url, files=files)
data = response.json()

print(f"Risk Level: {data['riskLevel']}")
print(f"Transcript: {data['transcript']}")
```

### Node.js (axios)

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('audio', fs.createReadStream('recording.mp3'));

const response = await axios.post(
  'http://localhost:3000/api/full-analysis',
  form,
  { headers: form.getHeaders() }
);

console.log(response.data);
```

---

## Integration Guide

### Frontend Integration

1. **File Upload Component**:
```html
<input type="file" id="audioFile" accept="audio/*">
<button onclick="analyzeAudio()">Analyze</button>
```

2. **Upload Handler**:
```javascript
async function analyzeAudio() {
  const fileInput = document.getElementById('audioFile');
  const formData = new FormData();
  formData.append('audio', fileInput.files[0]);

  const response = await fetch('http://localhost:3000/api/full-analysis', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  displayResults(result);
}
```

3. **Display Results**:
```javascript
function displayResults(data) {
  document.getElementById('transcript').textContent = data.transcript;
  document.getElementById('riskLevel').textContent = data.riskLevel;
  
  // Create chart with data.chartData
  createChart(data.chartData);
}
```

### Mobile App Integration

**React Native Example**:
```javascript
import * as DocumentPicker from 'expo-document-picker';

const pickAndAnalyze = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*'
  });

  if (result.type === 'success') {
    const formData = new FormData();
    formData.append('audio', {
      uri: result.uri,
      type: 'audio/mpeg',
      name: result.name
    });

    const response = await fetch('http://localhost:3000/api/full-analysis', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    setResults(data);
  }
};
```

---

## Performance Considerations

### Response Times

| Component | Typical Duration |
|-----------|------------------|
| File Upload | 1-5 seconds (depends on file size) |
| Whisper Transcription | 10-30 seconds (first request may take 60s) |
| Local Classification | <1 second |
| Total | 15-35 seconds |

### Optimization Tips

1. **Audio Preprocessing**: Compress audio files before upload
2. **Caching**: Cache Whisper results for identical audio
3. **Batch Processing**: Queue multiple requests
4. **CDN**: Use CDN for static assets
5. **Load Balancing**: Multiple classifier instances

---

## Security Best Practices

### Production Deployment

1. **HTTPS Only**: Never use HTTP in production
2. **Authentication**: Implement JWT or OAuth
3. **Rate Limiting**: Prevent abuse (e.g., 10 requests/minute)
4. **Input Validation**: Validate file types and sizes
5. **CORS**: Configure allowed origins
6. **API Keys**: Rotate Hugging Face tokens regularly
7. **Logging**: Log all requests (without PII)
8. **Monitoring**: Set up alerts for errors

### Example Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many requests, please try again later.'
});

app.use('/api/full-analysis', limiter);
```

---

## Monitoring & Logging

### Key Metrics to Track

- Request count
- Response times
- Error rates
- Whisper API usage
- Classifier availability
- Risk level distribution

### Logging Example

```javascript
app.use((req, res, next) => {
  console.log({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot connect to classifier" | FastAPI not running | Start FastAPI: `uvicorn main:app --port 8000` |
| "Invalid HF token" | Wrong token in .env | Check token at huggingface.co/settings/tokens |
| "Model is loading" | First Whisper request | Wait 60 seconds and retry |
| "File too large" | Audio >25MB | Compress audio or increase limit |
| Empty transcript | No speech in audio | Ensure audio contains clear speech |

---

## Support & Resources

- **Hugging Face Whisper**: https://huggingface.co/openai/whisper-large-v3
- **DistilBERT Classifier**: https://huggingface.co/dsuram/distilbert-mentalhealth-classifier
- **Crisis Resources**: 
  - National Suicide Prevention Lifeline: 988
  - Crisis Text Line: Text HOME to 741741

---

## Disclaimer

This API is a screening tool only and does not provide clinical diagnoses. All results should be reviewed by qualified mental health professionals. Users experiencing mental health crises should contact emergency services or crisis hotlines immediately.