# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-27

### Added
- Initial release of Mental Health Screening API
- Hybrid architecture with Whisper + DistilBERT
- Speech-to-text transcription using Whisper large-v3
- Mental health classification using DistilBERT
- Risk level calculation (High/Moderate/Low)
- Web interface with three input methods:
  - Text input
  - Audio recording
  - File upload
- Real-time chart visualization
- RESTful API endpoints
- Comprehensive documentation
- Setup verification tools
- Error handling and validation
- CORS support for web integration

### Features
- **Audio Analysis**: Upload MP3/WAV files for analysis
- **Text Analysis**: Direct text input for classification
- **Voice Recording**: Browser-based audio recording
- **Risk Assessment**: Automated mental health risk scoring
- **Chart Visualization**: Interactive results display
- **Privacy-First**: Audio processed in memory only
- **Fast Processing**: Local classification under 1 second

### Technical
- Node.js + Express backend
- Python + FastAPI classifier service
- Hugging Face Whisper API integration
- Local DistilBERT model deployment
- Chart.js for data visualization
- Multer for file upload handling
- Comprehensive error handling

### Documentation
- Complete API documentation
- Architecture overview
- Setup and deployment guides
- Contributing guidelines
- Security considerations

## [Unreleased]

### Planned
- [ ] Additional mental health models
- [ ] Batch processing capabilities
- [ ] Enhanced security features
- [ ] Mobile app support
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] User authentication
- [ ] Data export features

---

## Release Notes

### v1.0.0 - Initial Release
This is the first stable release of the Mental Health Screening API. The system provides a complete solution for mental health screening using state-of-the-art AI models.

**Key Highlights:**
- Production-ready hybrid architecture
- Real-time processing capabilities
- Comprehensive web interface
- Professional documentation
- Open source with MIT license

**Getting Started:**
See [QUICK_START.md](QUICK_START.md) for setup instructions.

**Support:**
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Email support for security issues