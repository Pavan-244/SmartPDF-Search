# 🎤 LlamaDoc AI - Enhanced Voice Features

## ✨ New Features Added

### 1. 🎙️ **Voice Input (Speech-to-Text)**
- Click the microphone button to record your question
- Uses browser MediaRecorder API to capture audio
- Sends audio to `/voice-input` endpoint
- Backend uses **SpeechRecognition** library with Google's free API
- Automatically transcribes and submits your query

**How it works:**
1. Click 🎤 button
2. Speak your question clearly
3. Click again to stop recording
4. Audio is transcribed and sent to AI

### 2. 🔊 **Voice Output with Modulation (TTS)**
- Offline text-to-speech using **pyttsx3**
- Customizable voice settings:
  - **Voice Type**: Default, Male, Female
  - **Speed**: 100-250 words per minute (adjustable)
  - **Volume**: 0.0-1.0 (adjustable)
- Audio is generated server-side and played automatically

**Voice Settings Panel:**
```
🎚️ Voice Settings
├── Voice Type: [Default | Male | Female]
├── Speed: 180 wpm (adjustable slider)
└── Volume: 1.0 (adjustable slider)
```

### 3. 🔇 **Mute Control**
- Toggle button to mute/unmute audio playback
- Stops current audio immediately when muted
- Prevents future TTS generation when muted
- State persists across questions

### 4. 📥 **Download Answer**
- Export AI answers in multiple formats:
  - **TXT** - Plain text file
  - **PDF** - Professional PDF document (uses ReportLab)
  - **DOCX** - Microsoft Word document (uses python-docx)
- Includes both question and answer
- Download via dropdown menu

**Example:**
```
📥 Download as: [TXT ▼] [⬇️ Download]
```

### 5. 💾 **Enhanced Chat History**
- Stores voice modulation settings per conversation
- Saves audio files for questions (optional)
- Tracks mute state for each interaction
- New database columns:
  - `voice_type` - Selected voice (default/male/female)
  - `audio_speed` - Speech rate (100-250 wpm)
  - `is_muted` - Whether audio was muted

## 📡 New API Endpoints

### `/voice-input` (POST)
**Description:** Transcribe audio to text using SpeechRecognition

**Request:**
```
Content-Type: multipart/form-data
Body: audio file (WAV format)
```

**Response:**
```json
{
  "text": "What is the main topic of this document?",
  "message": "Audio transcribed successfully"
}
```

**Error Cases:**
- 400: Could not understand audio
- 503: Speech recognition service error
- 501: SpeechRecognition not installed

---

### `/tts` (POST)
**Description:** Generate TTS audio with voice modulation using pyttsx3

**Request:**
```json
{
  "text": "This is the answer to your question...",
  "voice_type": "female",
  "rate": 180,
  "volume": 1.0
}
```

**Response:**
```json
{
  "audio_url": "/uploads/audio/abc123.mp3",
  "message": "TTS audio generated with pyttsx3",
  "settings": {
    "voice_type": "female",
    "rate": 180,
    "volume": 1.0
  }
}
```

---

### `/download/{upload_id}/{format}` (GET)
**Description:** Download the latest answer in TXT, PDF, or DOCX format

**Parameters:**
- `upload_id` - The PDF upload ID
- `format` - File format: `txt`, `pdf`, or `docx`

**Response:**
- File download with appropriate content-type

**Example:**
```
GET /download/abc123-def456/pdf
→ Downloads: answer_abc123.pdf
```

---

### `/save_history` (POST) - Enhanced
**New Parameters:**
- `voice_type` - Voice type used (default/male/female)
- `audio_speed` - Speech rate in WPM (default: 180)
- `is_muted` - Whether audio was muted (default: false)

**Request:**
```
Content-Type: multipart/form-data

upload_id: abc123-def456
question: What is the main topic?
answer: The main topic is...
voice_type: female
audio_speed: 200
is_muted: false
question_audio: [audio file]
```

## 🎨 Frontend Components

### Voice Controls Panel
```html
<div class="voice-controls-panel">
  <!-- Microphone + Mute buttons -->
  <div class="voice-row">
    <button id="mic-btn">🎤</button>
    <div id="waveform"></div>
    <button id="mute-btn">🔇 Mute</button>
  </div>
  
  <!-- Voice Settings -->
  <details class="voice-settings">
    <summary>🎚️ Voice Settings</summary>
    <!-- Voice type, speed, volume controls -->
  </details>
</div>
```

### Download Controls
```html
<div class="download-controls">
  <label>📥 Download as:</label>
  <select id="download-format">
    <option value="txt">TXT</option>
    <option value="pdf">PDF</option>
    <option value="docx">DOCX</option>
  </select>
  <button id="download-btn">⬇️ Download</button>
</div>
```

## 🛠️ Technical Implementation

### Dependencies Installed
```bash
pip install SpeechRecognition
pip install pyaudio
pip install pyttsx3
pip install python-docx
pip install reportlab
```

### Database Schema Updates
```sql
ALTER TABLE chat_history ADD COLUMN voice_type TEXT DEFAULT 'default';
ALTER TABLE chat_history ADD COLUMN audio_speed INTEGER DEFAULT 180;
ALTER TABLE chat_history ADD COLUMN is_muted BOOLEAN DEFAULT 0;
```

### Files Modified/Created
1. **models.py** - Added voice settings columns
2. **main.py** - Added 3 new endpoints (voice-input, enhanced tts, download)
3. **static/voice_enhanced.js** - New 500+ line voice module with:
   - Audio recording with MediaRecorder
   - Voice settings management
   - Mute control
   - TTS with modulation
   - Download functionality
4. **templates/index.html** - Added voice controls panel, settings, download UI
5. **static/style.css** - Added 150+ lines for new components

## 🚀 Usage Flow

### Complete Voice Interaction Flow
```
1. User clicks 🎤 button
   ↓
2. Browser records audio
   ↓
3. POST /voice-input → Transcription
   ↓
4. POST /query → AI generates answer
   ↓
5. POST /tts → Generate modulated audio (if not muted)
   ↓
6. Audio plays automatically
   ↓
7. POST /save_history → Save with voice settings
   ↓
8. User can download as TXT/PDF/DOCX
```

### Settings Persistence
- Voice settings saved to `localStorage`
- Persists across page reloads
- Each conversation saves its settings to database

## 🎯 Free & Open Source Stack
- ✅ **SpeechRecognition** - Free Google Speech API
- ✅ **pyttsx3** - Offline TTS (no API needed)
- ✅ **python-docx** - Open source DOCX generation
- ✅ **ReportLab** - Open source PDF generation
- ✅ **SQLite** - Free database
- ✅ **MediaRecorder API** - Built into browsers

**Zero paid APIs required!**

## 📊 Feature Comparison

| Feature | Before | After |
|---------|--------|-------|
| Voice Input | ❌ None | ✅ MediaRecorder + SpeechRecognition |
| TTS | 🔶 Browser only | ✅ pyttsx3 (offline, modulation) |
| Voice Settings | ❌ None | ✅ Type, Speed, Volume |
| Mute Control | ❌ None | ✅ Toggle mute/unmute |
| Download | ❌ None | ✅ TXT, PDF, DOCX |
| Voice History | ❌ None | ✅ Settings saved per conversation |

## 🎉 All Features Working!

The LlamaDoc AI now has a complete voice interaction system with:
- 🎤 Voice questions
- 🗣️ Customizable voice responses
- 🔇 Mute control
- 📥 Multi-format downloads
- 💾 Full history tracking
- 🎚️ Voice modulation settings

**Server running at:** http://localhost:8000

Test it out! 🦙✨
