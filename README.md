# 🦙 SmartPDF Search

AI-powered PDF question answering system with voice interaction using TinyLlama and LangChain.

![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.120-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 🤖 **AI Q&A** - Ask questions about PDFs using TinyLlama 1.1B model
- 🎤 **Voice Input** - Speak your questions (speech-to-text)
- 🔊 **Voice Output** - Hear answers automatically (text-to-speech)
- 📄 **Export Answers** - Download as TXT, PDF, or DOCX
- 💾 **Chat History** - Auto-saved conversations in database
- 🎨 **Modern UI** - Responsive design with markdown support

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- FFmpeg (for audio processing)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Pavan-244/SmartPDF-Search.git
cd SmartPDF-Search
```

2. **Create virtual environment**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Install FFmpeg**
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- **Linux**: `sudo apt install ffmpeg`
- **Mac**: `brew install ffmpeg`

5. **Run the application**
```bash
uvicorn main:app --reload
```

6. **Open browser**
```
http://localhost:8000
```

## 📖 Usage

1. **Upload PDF** - Click "Choose File" or drag & drop
2. **Ask Questions** - Type or use voice input (click microphone)
3. **Get Answers** - AI analyzes and responds with voice output
4. **Export** - Download answers in your preferred format
5. **View History** - Access previous conversations

## 🛠️ Technology Stack

- **Backend**: FastAPI, Python 3.10+
- **AI/ML**: TinyLlama, LangChain, Sentence Transformers, PyTorch
- **Voice**: SpeechRecognition, Web Speech API, pyttsx3
- **Database**: SQLAlchemy, SQLite
- **PDF**: pypdfium2
- **Export**: python-docx, ReportLab

## 📁 Project Structure

```
SmartPDF-Search/
├── main.py              # FastAPI application
├── static/              # Frontend assets
│   ├── scripts.js       # Main JavaScript
│   ├── voice_enhanced.js # Voice features
│   ├── history.js       # Chat history
│   └── style.css        # Styles
├── templates/
│   └── index.html       # Main UI
├── uploads/             # PDF & audio storage
├── downloads/           # Generated exports
└── requirements.txt     # Dependencies
```

## ⚙️ Configuration

Create `.env` file (optional):
```env
MODEL_NAME=TinyLlama/TinyLlama-1.1B-Chat-v1.0
MAX_NEW_TOKENS=512
TEMPERATURE=0.7
```

## 🔧 Troubleshooting

**Issue**: Voice input not working
- **Solution**: Grant microphone permissions in browser

**Issue**: FFmpeg error
- **Solution**: Install FFmpeg and add to system PATH

**Issue**: Model download slow
- **Solution**: First run downloads TinyLlama (~2GB), be patient

**Issue**: Database error
- **Solution**: Delete `history.db`, it will auto-recreate

## 📝 API Endpoints

- `POST /upload` - Upload PDF file
- `POST /query` - Ask question (returns answer + auto-saves history)
- `POST /voice-input` - Upload audio for transcription
- `GET /download/{id}/{format}` - Download answer (txt/pdf/docx)
- `GET /history` - Retrieve chat history
- `POST /tts` - Generate speech from text

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- [TinyLlama](https://github.com/jzhang38/TinyLlama) - Compact LLM
- [LangChain](https://github.com/langchain-ai/langchain) - LLM framework
- [FastAPI](https://fastapi.tiangolo.com/) - Web framework

## 📧 Contact

Created by **Pavan Kumar** - [GitHub](https://github.com/Pavan-244)

---

⭐ **Star this repo** if you find it useful!
