# Quick Setup Guide

## Step-by-Step Installation

### 1. Get Your Hugging Face Token

1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it a name (e.g., "whisper-api")
4. Select "Read" permission
5. Copy the token (starts with `hf_...`)

### 2. Install Node.js Dependencies

```bash
npm install
```

This will install:
- express (web framework)
- @huggingface/inference (Whisper API client)
- multer (file upload handling)
- axios (HTTP client for local classifier)
- dotenv (environment variables)
- cors (cross-origin requests)

### 3. Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your token
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

Your `.env` should look like:
```env
HF_TOKEN=hf_your_actual_token_here
CLASSIFIER_URL=http://localhost:8000/predict
PORT=3000
NODE_ENV=development
```

### 4. Start Your Local Classifier

Make sure your FastAPI classifier is running:

```bash
# Navigate to your Python project
cd path/to/your/fastapi-project

# Start the server
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 5. Start the Node.js API

In a new terminal:

```bash
npm start
```

You should see:
```
🚀 Mental Health Screening API running on port 3000
📊 Health check: http://localhost:3000/health
🎤 Analysis endpoint: http://localhost:3000/api/full-analysis
```

### 6. Test the API

#### Option A: Use the Web Interface

Open `example-client.html` in your browser:
- Drag and drop an audio file
- Click "Analyze Audio"
- View results with charts

#### Option B: Use cURL

```bash
curl -X POST http://localhost:3000/api/full-analysis \
  -F "audio=@path/to/your/audio.mp3"
```

#### Option C: Use the Test Script

```bash
node test-api.js path/to/your/audio.mp3
```

## Troubleshooting

### "Cannot connect to local classifier"

**Problem**: Node.js can't reach your FastAPI server

**Solutions**:
1. Check if FastAPI is running: `curl http://localhost:8000/health`
2. Verify the port in `.env` matches your FastAPI port
3. Make sure no firewall is blocking port 8000

### "Invalid Hugging Face API token"

**Problem**: HF_TOKEN is wrong or missing

**Solutions**:
1. Check `.env` file exists and has `HF_TOKEN=hf_...`
2. Verify token at https://huggingface.co/settings/tokens
3. Make sure token has "Read" permission
4. Restart the Node.js server after changing `.env`

### "Whisper model is loading"

**Problem**: First request to Whisper takes time

**Solution**: This is normal! The model needs to load (30-60 seconds). Just retry after a minute.

### "File too large"

**Problem**: Audio file exceeds 25MB

**Solutions**:
1. Compress your audio file
2. Use a lower bitrate (e.g., 128kbps for MP3)
3. Trim the audio to a shorter duration

## Testing Without Audio Files

If you don't have audio files, you can test the classifier directly:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been feeling very anxious and depressed lately"}'
```

## Next Steps

1. **Frontend Integration**: Use `example-client.html` as a template
2. **Add Authentication**: Implement user auth before production
3. **Rate Limiting**: Add rate limits to prevent abuse
4. **Monitoring**: Set up logging and error tracking
5. **Deployment**: Deploy to cloud (AWS, Azure, Heroku, etc.)

## Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use HTTPS (not HTTP)
- [ ] Add authentication middleware
- [ ] Implement rate limiting
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure CORS properly
- [ ] Add request logging
- [ ] Set up health check monitoring
- [ ] Document API for your team
- [ ] Add automated tests

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all services are running (Node.js + FastAPI)
3. Test each service independently
4. Check the README.md for more details

## Architecture Diagram

```
┌─────────────────┐
│   Web Client    │
│ (Browser/App)   │
└────────┬────────┘
         │ POST /api/full-analysis
         │ (multipart/form-data)
         ▼
┌─────────────────┐
│   Node.js API   │
│   (Port 3000)   │
└────┬───────┬────┘
     │       │
     │       └──────────────────┐
     │                          │
     ▼                          ▼
┌─────────────────┐    ┌──────────────────┐
│  Whisper API    │    │ Local Classifier │
│ (HF Cloud)      │    │  (Port 8000)     │
│ openai/whisper  │    │   DistilBERT     │
└─────────────────┘    └──────────────────┘
```

Happy coding! 🚀