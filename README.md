# 🦙 SmartPDF Search - AI-Powered PDF Question Answering System

A modern, intelligent PDF document analysis system powered by **TinyLlama** and **LangChain**. Ask questions about your PDF documents and get accurate, context-aware answers with voice interaction capabilities.

![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🤖 AI-Powered Q&A
- **TinyLlama 1.1B Model** - Efficient, locally-hosted LLM
- **Semantic Search** - Uses sentence transformers for accurate document retrieval
- **Context-Aware Answers** - Retrieves relevant document sections for precise responses
- **Markdown Support** - Rich formatted answers with syntax highlighting

### 🎤 Voice Interaction
- **Voice Input** - Record questions using your microphone
- **Auto-Transcription** - Converts speech to text (Google STT + browser fallback)
- **Voice Output** - Automatic text-to-speech using Web Speech API
- **Voice Controls** - Adjustable speed, volume, and mute functionality
- **Seamless Workflow** - Auto-submit and auto-play for hands-free operation

### 📚 Document Management
- **PDF Upload** - Drag & drop or browse to upload
- **Text Extraction** - Advanced PDF parsing with PDFPlumber
- **Vector Storage** - FAISS for efficient semantic search
- **Persistent History** - SQLite database stores all Q&A sessions

### 💾 Export Options
- **Download Answers** - Export in TXT, PDF, or DOCX format
- **Chat History** - View and replay previous conversations
- **Audio Archive** - Save question/answer audio recordings

### 🎨 Modern UI
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Ready** - Eye-friendly interface
- **Real-time Feedback** - Loading states and notifications
- **Code Highlighting** - Syntax highlighting for technical answers

## 🚀 Quick Start

### Prerequisites

- Python 3.10 or higher
- Git
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/SmartPDF-Search.git
cd SmartPDF-Search
```

2. **Create and activate virtual environment**
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up LM Studio (for TinyLlama)**
   - Download [LM Studio](https://lmstudio.ai/)
   - Load the TinyLlama 1.1B Chat model
   - Start the local server (default: http://localhost:1234/v1)

5. **Run the application**
```bash
# Development mode with auto-reload
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

6. **Open in browser**
```
http://localhost:8000
```

## 📖 Usage

### Basic Workflow

1. **Upload PDF**
   - Click "Choose File" or drag & drop your PDF
   - Wait for processing (vectorization happens automatically)

2. **Ask Questions**
   - Type your question in the text box, OR
   - Click the microphone 🎤 and speak your question

3. **Get Answers**
   - AI analyzes the document and provides contextual answers
   - Voice output plays automatically (if not muted)
   - View source citations and confidence scores

4. **Download Results**
   - Export answers in TXT, PDF, or DOCX format
   - Access chat history anytime

### Voice Features

**Voice Input:**
- Click 🎤 microphone button
- Speak your question clearly
- Click 🎤 again to stop recording
- Transcription appears automatically
- Query submits and processes

**Voice Output:**
- Answers play automatically via browser TTS
- Click 🔇 to mute/unmute
- Adjust speed (100-250 WPM)
- Adjust volume (0-100%)

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern async web framework
- **LangChain** - LLM orchestration and chains
- **TinyLlama** - Lightweight 1.1B parameter model
- **SQLAlchemy** - Database ORM
- **PDFPlumber** - PDF text extraction

### AI/ML
- **FAISS** - Vector similarity search
- **Sentence Transformers** - Text embeddings (all-MiniLM-L6-v2)
- **HuggingFace** - Model hosting and inference

### Frontend
- **Vanilla JavaScript** - No framework overhead
- **Web Speech API** - Browser-based voice I/O
- **Markdown-it** - Rich text rendering
- **Highlight.js** - Code syntax highlighting

### Voice Processing
- **SpeechRecognition** - Python speech-to-text
- **pyttsx3** - Offline text-to-speech
- **pydub** - Audio format conversion

## 📁 Project Structure

```
SmartPDF-Search/
│
├── main.py                 # FastAPI application
├── models.py               # SQLAlchemy database models
├── requirements.txt        # Python dependencies
│
├── static/                 # Frontend assets
│   ├── scripts.js         # Main query logic
│   ├── voice_enhanced.js  # Voice features
│   ├── history.js         # Chat history
│   └── style.css          # Styles
│
├── templates/
│   └── index.html         # Main UI template
│
├── uploads/               # Uploaded PDFs (gitignored)
│   ├── pdfs/             # Original files
│   └── audio/            # Voice recordings
│
├── downloads/            # Generated exports (gitignored)
│
└── docs/                 # Documentation
    ├── VOICE_FEATURES.md
    ├── FILE_LOCKING_FIX.md
    └── DESIGN.md
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file (optional):

```env
# LM Studio API Configuration
OPENAI_API_BASE=http://localhost:1234/v1
OPENAI_API_KEY=not-needed

# Database
DATABASE_URL=sqlite:///./history.db

# Upload limits
MAX_UPLOAD_SIZE=10485760  # 10MB

# Voice settings
DEFAULT_VOICE_SPEED=180
DEFAULT_VOICE_VOLUME=1.0
```

### LM Studio Settings

- **Model:** TinyLlama 1.1B Chat v1.0
- **Temperature:** 0.0 (for consistent answers)
- **Max Tokens:** 2048
- **Context Length:** 4096

## 🔧 Advanced Features

### Custom Voice Settings

Modify voice parameters in `main.py`:

```python
# Text-to-Speech configuration
@app.post("/tts")
async def text_to_speech(request: Request):
    voice_type = body.get("voice_type", "default")  # male/female
    rate = body.get("rate", 180)                     # WPM
    volume = body.get("volume", 1.0)                 # 0.0-1.0
```

### Database Schema

Chat history includes:
- Question and answer text
- Upload ID (links to PDF)
- Voice settings (type, speed, mute state)
- Audio file paths
- Timestamps

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main UI |
| `/upload` | POST | Upload PDF |
| `/query` | POST | Ask question |
| `/voice-input` | POST | Transcribe audio |
| `/tts` | POST | Generate speech |
| `/history` | GET | Get chat history |
| `/save_history` | POST | Save conversation |
| `/download/{id}/{format}` | GET | Export answer |

## 🐛 Troubleshooting

### Common Issues

**Voice input not working:**
- Check browser permissions for microphone
- Install FFmpeg for audio conversion (optional)
- Fallback to browser Web Speech API works automatically

**Database errors:**
- Delete `history.db` to recreate with fresh schema
- Check write permissions in project directory

**LM Studio connection failed:**
- Ensure LM Studio is running
- Verify API base URL (default: http://localhost:1234/v1)
- Check model is loaded and server is started

**PDF upload fails:**
- Check file size (default limit: 10MB)
- Ensure PDF is not password-protected
- Verify PDF contains extractable text

## 📚 Documentation

- [Voice Features Guide](VOICE_FEATURES.md)
- [File Locking Fix](FILE_LOCKING_FIX.md)
- [Design Overview](DESIGN.md)
- [Markdown Features](MARKDOWN_FEATURE.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TinyLlama Team** - For the efficient 1.1B model
- **LangChain** - For the amazing LLM framework
- **FastAPI** - For the modern web framework
- **HuggingFace** - For model hosting and transformers
- **LM Studio** - For easy local LLM deployment

## 🔮 Roadmap

- [ ] Multi-PDF comparison queries
- [ ] Advanced search filters
- [ ] Custom model fine-tuning
- [ ] Multi-language support
- [ ] Cloud deployment options
- [ ] Mobile app (React Native)
- [ ] Batch processing mode
- [ ] API key authentication

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/Pavan-244/SmartPDF-Search/issues)
- Email: pavankumar9014663184@gmail.com

---

**Made with ❤️ by [Pavan Kumar]**

*Star ⭐ this repo if you find it helpful!*
