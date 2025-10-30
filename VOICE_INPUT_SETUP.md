# Voice Input Setup Instructions

## Required Dependencies

### 1. Python Packages (Already Installed)
```bash
pip install SpeechRecognition
pip install pydub
pip install pyaudio
pip install pyttsx3
```

### 2. FFmpeg (Required for Audio Conversion)

**pydub** needs FFmpeg to convert audio formats (webm/ogg → wav).

#### Windows Installation:

**Option 1: Using Chocolatey (Recommended)**
```powershell
# Install Chocolatey if not installed
# Then run:
choco install ffmpeg
```

**Option 2: Manual Installation**
1. Download FFmpeg from: https://www.gyan.dev/ffmpeg/builds/
2. Extract to `C:\ffmpeg`
3. Add to PATH:
   - Open System Properties → Environment Variables
   - Edit "Path" under System Variables
   - Add: `C:\ffmpeg\bin`
4. Restart terminal

**Option 3: Without FFmpeg (Alternative)**
If you can't install FFmpeg, you can modify the voice input to use Web Speech API directly in the browser instead of sending audio to server.

#### Verify FFmpeg Installation:
```powershell
ffmpeg -version
```

## Alternative: Browser-Only Speech Recognition

If FFmpeg is not available, update `voice_enhanced.js` to use Web Speech API:

```javascript
// Instead of MediaRecorder, use:
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    // Use transcript directly - no server call needed
};
```

## Troubleshooting

### Error: "ffmpeg not found"
- FFmpeg is not installed or not in PATH
- Install using one of the options above

### Error: "Could not understand audio"
- Speak more clearly
- Ensure microphone is working
- Check microphone permissions in browser

### Error: "Microphone access denied"
- Allow microphone access in browser settings
- Chrome: chrome://settings/content/microphone
- Edge: edge://settings/content/microphone

### Error: "Speech recognition service error"
- Check internet connection (Google API requires internet)
- Try again after a few seconds

## Current Implementation

The app now supports:
1. ✅ Audio recording via MediaRecorder (webm/ogg format)
2. ✅ Server-side conversion using pydub + ffmpeg
3. ✅ Speech recognition via Google API
4. ✅ Fallback error messages

## Testing Voice Input

1. Upload a PDF
2. Click the 🎤 microphone button
3. Speak your question clearly
4. Click 🎤 again to stop
5. Wait for transcription
6. AI will respond with text and voice

If you see "ffmpeg not found" error, install FFmpeg using the instructions above.
