# System Architecture

## Overview

This is a **hybrid architecture** that combines cloud-based AI (Whisper) with local AI (DistilBERT) for mental health screening.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Web App    │  │  Mobile App  │  │   Desktop    │        │
│  │   (Browser)  │  │ (React Native)│  │     App      │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                │
│                            │                                    │
│                            │ HTTP POST                          │
│                            │ multipart/form-data                │
│                            │ (audio file)                       │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NODE.JS EXPRESS API                          │
│                    (Port 3000)                                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  POST /api/full-analysis                                 │ │
│  │  - Receives audio file                                   │ │
│  │  - Orchestrates the pipeline                             │ │
│  │  - Returns structured JSON                               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Multer     │  │   Services   │  │    Utils     │        │
│  │ File Upload  │  │   Whisper    │  │ Risk Analysis│        │
│  │              │  │  Classifier  │  │   Reporting  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
           │                                    │
           │                                    │
           ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│   HUGGING FACE API   │          │   LOCAL FASTAPI      │
│   (Cloud Service)    │          │   (Port 8000)        │
│                      │          │                      │
│  Whisper Large v3    │          │  DistilBERT Model    │
│  Speech-to-Text      │          │  Mental Health       │
│                      │          │  Classifier          │
│  Input: Audio Buffer │          │  Input: Text         │
│  Output: Transcript  │          │  Output: Predictions │
└──────────────────────┘          └──────────────────────┘
```

## Data Flow

### Step-by-Step Process

```
1. USER UPLOADS AUDIO
   ↓
   Audio File (MP3, WAV, etc.)
   Size: Up to 25MB
   
2. NODE.JS RECEIVES FILE
   ↓
   Multer middleware validates and buffers file
   
3. WHISPER TRANSCRIPTION (Cloud)
   ↓
   Audio Buffer → Hugging Face API
   Model: openai/whisper-large-v3
   Duration: 10-30 seconds
   ↓
   Transcript Text
   
4. TEXT CLASSIFICATION (Local)
   ↓
   Transcript → FastAPI Endpoint
   Model: dsuram/distilbert-mentalhealth-classifier
   Duration: <1 second
   ↓
   Predictions: [{label, score}, ...]
   
5. RISK ANALYSIS
   ↓
   Calculate risk level based on predictions
   Generate screening report
   Format chart data
   
6. RETURN RESPONSE
   ↓
   JSON Response with:
   - transcript
   - prediction
   - riskLevel
   - report
   - chartData
   - metadata
```

## Component Details

### 1. Frontend Layer

**Responsibilities:**
- Audio recording/upload interface
- File validation (client-side)
- Progress indicators
- Results visualization (charts)
- Error handling

**Technologies:**
- HTML5 Audio API
- Fetch API / Axios
- Chart.js for visualization

### 2. Node.js API Layer

**Responsibilities:**
- HTTP request handling
- File upload management
- Service orchestration
- Error handling
- Response formatting

**Key Files:**
- `server.js` - Express app setup
- `routes/analysis.js` - Main endpoint
- `middleware/errorHandler.js` - Global error handling

**Technologies:**
- Express.js
- Multer (file uploads)
- Axios (HTTP client)

### 3. Whisper Service (Cloud)

**Responsibilities:**
- Audio transcription
- Speech-to-text conversion

**Key Files:**
- `services/whisperService.js`

**API Details:**
- Provider: Hugging Face Inference API
- Model: openai/whisper-large-v3
- Authentication: HF_TOKEN
- Rate Limits: Based on HF plan

### 4. Classifier Service (Local)

**Responsibilities:**
- Text classification
- Mental health prediction

**Key Files:**
- `services/classifierService.js`
- `fastapi-example.py` (FastAPI server)

**Model Details:**
- Model: dsuram/distilbert-mentalhealth-classifier
- Base: DistilBERT
- Classes: Anxiety, Depression, Normal, etc.

### 5. Risk Analysis (Utility)

**Responsibilities:**
- Risk level calculation
- Report generation
- Data formatting

**Key Files:**
- `utils/riskAnalysis.js`

**Logic:**
- High: Depression/Anxiety ≥75% confidence
- Moderate: Depression/Anxiety ≥50% confidence
- Low: Normal or low confidence

## Request/Response Flow

### Request

```http
POST /api/full-analysis HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="audio"; filename="recording.mp3"
Content-Type: audio/mpeg

[Binary Audio Data]
------WebKitFormBoundary--
```

### Response

```json
{
  "transcript": "I've been feeling anxious...",
  "prediction": [
    {"label": "Anxiety", "score": 0.95},
    {"label": "Depression", "score": 0.03},
    {"label": "Normal", "score": 0.02}
  ],
  "riskLevel": "High",
  "report": "Mental Health Screening Report...",
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

## Error Handling Flow

```
Request
  ↓
┌─────────────────┐
│ File Validation │ → 400 Bad Request (invalid file)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Whisper API     │ → 500 Config Error (no HF_TOKEN)
│                 │ → 503 Service Error (model loading)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Classifier API  │ → 503 Service Unavailable (not running)
│                 │ → 408 Timeout (slow response)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Success         │ → 200 OK (with results)
└─────────────────┘
```

## Scalability Considerations

### Current Architecture
- Single Node.js instance
- Single FastAPI instance
- Synchronous processing

### Scaling Options

**Horizontal Scaling:**
```
Load Balancer
     ↓
┌────┴────┬────────┬────────┐
│ Node 1  │ Node 2 │ Node 3 │
└────┬────┴────┬───┴────┬───┘
     │         │        │
     └────┬────┴────┬───┘
          │         │
    ┌─────┴─────┐  ┌┴──────────┐
    │ Whisper   │  │ Classifier│
    │ (Cloud)   │  │ Pool      │
    └───────────┘  └───────────┘
```

**Queue-Based Processing:**
```
Request → Queue → Worker Pool → Response
          (Redis)  (Multiple instances)
```

## Security Architecture

### Authentication Flow (Production)

```
Client Request
     ↓
┌──────────────┐
│ API Gateway  │ → JWT Validation
└──────┬───────┘
       ↓
┌──────────────┐
│ Rate Limiter │ → Check request limits
└──────┬───────┘
       ↓
┌──────────────┐
│ Node.js API  │ → Process request
└──────────────┘
```

### Data Privacy

- Audio files: Not stored (processed in memory)
- Transcripts: Not logged (privacy)
- Predictions: Anonymized in logs
- HF_TOKEN: Environment variable (not in code)

## Performance Metrics

### Typical Response Times

| Component | Duration | Notes |
|-----------|----------|-------|
| File Upload | 1-5s | Depends on file size |
| Whisper API | 10-30s | First request: 60s |
| Classifier | <1s | Local processing |
| Risk Analysis | <0.1s | Pure computation |
| **Total** | **15-35s** | End-to-end |

### Optimization Strategies

1. **Caching**: Cache Whisper results for identical audio
2. **Compression**: Compress audio before upload
3. **Parallel Processing**: Process multiple requests concurrently
4. **CDN**: Serve static assets from CDN
5. **Connection Pooling**: Reuse HTTP connections

## Deployment Architecture

### Development
```
Localhost:3000 (Node.js)
Localhost:8000 (FastAPI)
```

### Production
```
HTTPS Load Balancer
     ↓
Docker Containers
├── Node.js API (multiple instances)
├── FastAPI Classifier (multiple instances)
└── Redis (caching/queuing)
     ↓
External Services
└── Hugging Face API
```

## Monitoring Points

```
┌─────────────┐
│   Metrics   │
└─────────────┘
      ↓
┌─────────────────────────────┐
│ • Request count             │
│ • Response times            │
│ • Error rates               │
│ • Whisper API usage         │
│ • Classifier availability   │
│ • Risk level distribution   │
└─────────────────────────────┘
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML/JS/Chart.js | User interface |
| API | Node.js + Express | Request handling |
| File Upload | Multer | Multipart form data |
| Speech-to-Text | Whisper (HF API) | Audio transcription |
| Classification | DistilBERT (FastAPI) | Mental health prediction |
| Risk Analysis | Custom logic | Risk calculation |
| Data Format | JSON | API responses |

---

This architecture provides a balance between:
- **Performance**: Local classifier for fast predictions
- **Accuracy**: State-of-the-art Whisper for transcription
- **Scalability**: Stateless design for easy scaling
- **Cost**: Cloud for heavy lifting, local for frequent operations