# 🚀 Quick Start - Mental Health Screening API

## What You Have Now

A complete Node.js + Express backend that:
1. ✅ Accepts audio file uploads
2. ✅ Transcribes speech using Whisper (Hugging Face Cloud)
3. ✅ Classifies text using your local DistilBERT model
4. ✅ Calculates risk levels (High/Moderate/Low)
5. ✅ Returns structured JSON with chart-ready data

## Next Steps (2 minutes)

### Step 1: Add Your Hugging Face Token

1. Get token: https://huggingface.co/settings/tokens
2. Open `.env` file
3. Replace `your_huggingface_token_here` with your actual token

```env
HF_TOKEN=hf_your_actual_token_here
```

### Step 2: Start Your Local Classifier

In a separate terminal:
```bash
cd path/to/your/fastapi-project
uvicorn main:app --reload --port 8000
```

### Step 3: Start This API

```bash
npm start
```

You should see:
```
🚀 Mental Health Screening API running on port 3000
📊 Health check: http://localhost:3000/health
🎤 Analysis endpoint: http://localhost:3000/api/full-analysis
```

### Step 4: Test It!

**Option A - Web Interface** (Easiest):
1. Open `example-client.html` in your browser
2. Drag and drop an audio file
3. Click "Analyze Audio"
4. See results with charts!

**Option B - Command Line**:
```bash
curl -X POST http://localhost:3000/api/full-analysis \
  -F "audio=@your-audio-file.mp3"
```

**Option C - Test Script**:
```bash
node test-api.js your-audio-file.mp3
```

## 📁 Project Files

```
├── server.js                    # Main server
├── routes/analysis.js           # POST /api/full-analysis endpoint
├── services/
│   ├── whisperService.js       # Whisper API integration
│   └── classifierService.js    # Local classifier client
├── utils/riskAnalysis.js       # Risk calculation logic
├── middleware/errorHandler.js  # Error handling
├── example-client.html         # Demo web interface
├── test-api.js                 # Testing script
├── verify-setup.js             # Setup verification
└── .env                        # Your configuration

Documentation:
├── README.md                   # Full documentation
├── SETUP.md                    # Detailed setup guide
├── API_DOCUMENTATION.md        # Complete API reference
└── QUICK_START.md             # This file
```

## 🎯 API Endpoint

```
POST http://localhost:3000/api/full-analysis
Content-Type: multipart/form-data
Field: audio (file)
```

**Response**:
```json
{
  "transcript": "...",
  "prediction": [{"label": "Anxiety", "score": 0.95}],
  "riskLevel": "High",
  "report": "...",
  "chartData": {"labels": [...], "scores": [...]},
  "metadata": {...}
}
```

## 🔧 Verify Setup

Run this anytime to check your configuration:
```bash
node verify-setup.js
```

## 📚 Documentation

- **README.md** - Overview and features
- **SETUP.md** - Step-by-step installation
- **API_DOCUMENTATION.md** - Complete API reference with examples

## 🆘 Troubleshooting

### "HF_TOKEN not configured"
→ Edit `.env` and add your Hugging Face token

### "Cannot connect to local classifier"
→ Start your FastAPI server: `uvicorn main:app --port 8000`

### "Whisper model is loading"
→ Wait 60 seconds on first request, then retry

## 🎨 Frontend Integration

Use the `example-client.html` as a template. Key code:

```javascript
const formData = new FormData();
formData.append('audio', audioFile);

const response = await fetch('http://localhost:3000/api/full-analysis', {
  method: 'POST',
  body: formData
});

const result = await response.json();
// Use result.transcript, result.riskLevel, result.chartData
```

## 🚀 Production Checklist

Before deploying:
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use HTTPS (not HTTP)
- [ ] Add authentication
- [ ] Implement rate limiting
- [ ] Configure CORS properly
- [ ] Set up error monitoring
- [ ] Add request logging

## 💡 Tips

1. **Audio Format**: MP3 works best, keep files under 10MB
2. **First Request**: Whisper model loads on first use (30-60s)
3. **Testing**: Use `example-client.html` for quick testing
4. **Monitoring**: Check console logs for detailed info

## 🎉 You're Ready!

Your hybrid mental health screening API is complete and ready to use. The architecture combines the power of cloud-based Whisper with your local DistilBERT classifier for accurate, real-time mental health screening.

Happy coding! 🚀