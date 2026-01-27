# 🧠 Mental Health Screening API

A hybrid AI-powered mental health screening system that combines **Whisper speech-to-text** with **DistilBERT classification** for real-time mental health assessment.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Features

- 🎤 **Speech-to-Text**: Whisper large-v3 via Hugging Face API
- 🧠 **Mental Health Classification**: Local DistilBERT model
- 📊 **Risk Assessment**: Automated High/Moderate/Low risk calculation
- 📈 **Visualization**: Chart.js integration for results
- 🔒 **Privacy-First**: Audio processed in memory, not stored
- ⚡ **Real-time**: Fast local classification (<1 second)

## 🏗️ Architecture

```
Audio Input → Whisper API → Transcript → Local DistilBERT → Risk Analysis → Results
```

**Hybrid Approach:**
- **Cloud**: Whisper for accurate speech transcription
- **Local**: DistilBERT for fast, private mental health classification

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Hugging Face API token

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/mental-health-screening-api.git
cd mental-health-screening-api
npm install
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your Hugging Face token
```

### 3. Start Services
```bash
# Terminal 1: Start FastAPI classifier
python classifier_server.py

# Terminal 2: Start Node.js API
npm start
```

### 4. Open Web Interface
Open `enhanced-client.html` in your browser or visit:
- API: `http://localhost:3000`
- Classifier: `http://localhost:8000`

## 📱 Usage

### Web Interface
1. **Text Analysis**: Type text directly
2. **Audio Recording**: Record using microphone
3. **File Upload**: Upload MP3/WAV files

### API Endpoints

**Text Analysis:**
```bash
curl -X POST http://localhost:3000/api/text-analysis \
  -H "Content-Type: application/json" \
  -d '{"text":"I feel anxious and stressed"}'
```

**Audio Analysis:**
```bash
curl -X POST http://localhost:3000/api/full-analysis \
  -F "audio=@recording.mp3"
```

## 📊 Response Format

```json
{
  "transcript": "I've been feeling anxious lately...",
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
  }
}
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js + Express |
| **AI Classification** | Python + FastAPI + DistilBERT |
| **Speech-to-Text** | Whisper (Hugging Face API) |
| **Frontend** | HTML5 + JavaScript + Chart.js |
| **Model** | `dsuram/distilbert-mentalhealth-classifier` |

## 📁 Project Structure

```
├── server.js                 # Main Express server
├── classifier_server.py      # FastAPI mental health classifier
├── routes/analysis.js        # API endpoints
├── services/
│   ├── whisperService.js     # Whisper integration
│   └── classifierService.js  # Classifier client
├── utils/riskAnalysis.js     # Risk calculation
├── enhanced-client.html      # Web interface
└── docs/                     # Documentation
```

## 🔧 Configuration

### Environment Variables
```env
HF_TOKEN=your_huggingface_token_here
CLASSIFIER_URL=http://localhost:8000/predict
PORT=3000
NODE_ENV=development
```

### Risk Level Calculation
- **High**: Depression/Anxiety ≥75% confidence
- **Moderate**: Depression/Anxiety ≥50% confidence  
- **Low**: Normal classification or low confidence

## 🧪 Testing

```bash
# Verify setup
node verify-setup.js

# Test API
node test-api.js

# Test complete system
node test-complete-system.js
```

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md)
- [Setup Instructions](SETUP.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Architecture Overview](ARCHITECTURE.md)

## 🚀 Deployment

### Development
```bash
npm run dev  # Auto-reload
```

### Production
```bash
NODE_ENV=production npm start
```

## ⚠️ Disclaimer

This is a **screening tool only** and not a clinical diagnosis. Always consult qualified mental health professionals for proper evaluation and treatment.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for Whisper API
- [dsuram](https://huggingface.co/dsuram) for the DistilBERT mental health classifier
- [OpenAI](https://openai.com/) for Whisper model

## 📞 Support

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/mental-health-screening-api/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/mental-health-screening-api/discussions)

---

**⭐ Star this repository if it helped you!**