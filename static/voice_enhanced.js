/* ================================
   🎤 LlamaDoc AI - Enhanced Voice Features
   Voice Input, TTS with Modulation, Mute Control
   ================================ */

let currentUploadId = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let isMuted = false;
let currentAudio = null;

// Voice settings
let voiceSettings = {
    voiceType: 'default',
    rate: 180,
    volume: 1.0
};

/**
 * Initialize voice features with upload ID
 */
function initVoice(uploadId) {
    currentUploadId = uploadId;
    loadVoiceSettings();
    initializeControls();
    console.log('Voice features initialized for upload:', uploadId);
}

/**
 * Initialize voice control event listeners
 */
function initializeControls() {
    // Mute button
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMute);
    }
    
    // Voice settings
    const voiceTypeSelect = document.getElementById('voice-type');
    const voiceSpeed = document.getElementById('voice-speed');
    const voiceVolume = document.getElementById('voice-volume');
    
    if (voiceTypeSelect) {
        voiceTypeSelect.addEventListener('change', (e) => {
            voiceSettings.voiceType = e.target.value;
            saveVoiceSettings();
        });
    }
    
    if (voiceSpeed) {
        voiceSpeed.addEventListener('change', (e) => {
            voiceSettings.rate = parseInt(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value;
            saveVoiceSettings();
        });
    }
    
    if (voiceVolume) {
        voiceVolume.addEventListener('change', (e) => {
            voiceSettings.volume = parseFloat(e.target.value);
            document.getElementById('volume-value').textContent = e.target.value;
            saveVoiceSettings();
        });
    }
    
    // Download buttons
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadAnswer);
    }
}

/**
 * Load voice settings from localStorage
 */
function loadVoiceSettings() {
    const saved = localStorage.getItem('voiceSettings');
    if (saved) {
        voiceSettings = JSON.parse(saved);
        
        // Update UI
        const voiceTypeSelect = document.getElementById('voice-type');
        const voiceSpeed = document.getElementById('voice-speed');
        const voiceVolume = document.getElementById('voice-volume');
        
        if (voiceTypeSelect) voiceTypeSelect.value = voiceSettings.voiceType;
        if (voiceSpeed) {
            voiceSpeed.value = voiceSettings.rate;
            document.getElementById('speed-value').textContent = voiceSettings.rate;
        }
        if (voiceVolume) {
            voiceVolume.value = voiceSettings.volume;
            document.getElementById('volume-value').textContent = voiceSettings.volume;
        }
    }
}

/**
 * Save voice settings to localStorage
 */
function saveVoiceSettings() {
    localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
}

/**
 * Toggle mute/unmute
 */
function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('mute-btn');
    
    if (muteBtn) {
        muteBtn.textContent = isMuted ? '🔈 Unmute' : '🔇 Mute';
        muteBtn.classList.toggle('muted', isMuted);
    }
    
    // Stop current audio if muting
    if (isMuted && currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    showNotification(isMuted ? 'Audio muted' : 'Audio unmuted', 'info');
}

/**
 * Show notification message to user
 */
function showNotification(message, type = 'info') {
    const notification = document.getElementById('voice-notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `voice-notification ${type}`;
        notification.style.display = 'block';
        
        // Auto-hide after different durations based on type
        let duration = 3000;
        if (type === 'success') duration = 2000;
        if (type === 'error') duration = 5000;
        
        // Clear any existing timeout
        if (notification._timeout) {
            clearTimeout(notification._timeout);
        }
        
        notification._timeout = setTimeout(() => {
            notification.style.display = 'none';
        }, duration);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

/**
 * Toggle microphone recording
 */
function toggleMicrophone() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

/**
 * Start recording audio using MediaRecorder API
 */
async function startRecording() {
    if (!currentUploadId) {
        showNotification('Please upload a PDF first!', 'error');
        return;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,
                noiseSuppression: true
            }
        });
        
        // Use audio/webm or audio/ogg based on browser support
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
            ? 'audio/webm' 
            : 'audio/ogg';
        
        mediaRecorder = new MediaRecorder(stream, { mimeType });
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            await processAudioRecording(audioBlob, mimeType);
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        isRecording = true;
        
        // Update UI
        const micBtn = document.getElementById('mic-btn');
        const waveform = document.getElementById('waveform');
        
        if (micBtn) micBtn.classList.add('recording');
        if (waveform) waveform.classList.add('active');
        
        showNotification('🎤 Recording... Click to stop', 'info');
    } catch (error) {
        console.error('Error accessing microphone:', error);
        if (error.name === 'NotAllowedError') {
            showNotification('Microphone access denied. Please allow microphone access in browser settings.', 'error');
        } else if (error.name === 'NotFoundError') {
            showNotification('No microphone found. Please connect a microphone.', 'error');
        } else {
            showNotification('Error accessing microphone: ' + error.message, 'error');
        }
    }
}

/**
 * Stop recording audio
 */
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Update UI
        const micBtn = document.getElementById('mic-btn');
        const waveform = document.getElementById('waveform');
        
        if (micBtn) micBtn.classList.remove('recording');
        if (waveform) waveform.classList.remove('active');
        
        showNotification('Processing audio...', 'info');
    }
}

/**
 * Process recorded audio - send to /voice-input endpoint
 */
async function processAudioRecording(audioBlob, mimeType) {
    try {
        const formData = new FormData();
        
        // Determine file extension based on mime type
        const extension = mimeType.includes('webm') ? 'webm' : 'ogg';
        formData.append('audio', audioBlob, `recording.${extension}`);
        
        showNotification('🔄 Transcribing audio...', 'info');
        
        const response = await fetch('/voice-input', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const transcribedText = data.text;
            showNotification(`✅ Got it: "${transcribedText}"`, 'success');
            
            // Update question input
            document.getElementById('question').value = transcribedText;
            
            // Show processing message
            showNotification('🤖 Getting AI response...', 'info');
            
            // Auto-submit query immediately after transcription
            await submitVoiceQuery(transcribedText, audioBlob);
        } else {
            // Check if it's an FFmpeg error
            if (data.detail && data.detail.toLowerCase().includes('ffmpeg')) {
                showNotification('⚠️ FFmpeg not installed. Trying browser fallback...', 'error');
                console.log('To use server transcription, install FFmpeg. See VOICE_INPUT_SETUP.md');
                
                // Auto-use browser API instead (no confirmation needed)
                setTimeout(() => {
                    useBrowserSpeechRecognition();
                }, 1000);
            } else {
                throw new Error(data.detail || 'Failed to transcribe audio');
            }
        }
    } catch (error) {
        console.error('Audio processing error:', error);
        showNotification(`❌ ${error.message}`, 'error');
        
        // If server is unreachable, auto-try browser API
        if (error.message.includes('fetch')) {
            console.log('Tip: You can use browser-based speech recognition as a fallback');
        }
    }
}

/**
 * Use browser Web Speech API as fallback
 */
function useBrowserSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        showNotification('Speech recognition not supported in this browser', 'error');
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    const micBtn = document.getElementById('mic-btn');
    const waveform = document.getElementById('waveform');
    
    recognition.onstart = () => {
        if (micBtn) micBtn.classList.add('recording');
        if (waveform) waveform.classList.add('active');
        showNotification('🎤 Listening... Speak your question!', 'info');
    };
    
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        showNotification(`✅ Got it: "${transcript}"`, 'success');
        
        // Update question input
        document.getElementById('question').value = transcript;
        
        // Show processing message
        setTimeout(() => {
            showNotification('🤖 Getting AI response...', 'info');
        }, 1000);
        
        // Auto-submit immediately after transcription
        await submitVoiceQuery(transcript, null);
    };
    
    recognition.onerror = (event) => {
        if (micBtn) micBtn.classList.remove('recording');
        if (waveform) waveform.classList.remove('active');
        showNotification(`Error: ${event.error}`, 'error');
    };
    
    recognition.onend = () => {
        if (micBtn) micBtn.classList.remove('recording');
        if (waveform) waveform.classList.remove('active');
    };
    
    recognition.start();
}

/**
 * Submit voice query and get AI response with TTS
 */
async function submitVoiceQuery(questionText, audioBlob = null) {
    try {
        // Show answer section immediately
        const answerSection = document.getElementById('answer-section');
        if (answerSection) {
            answerSection.classList.remove('hidden');
            answerSection.style.display = 'block';
        }
        
        // Show loading
        document.getElementById('loading').style.display = 'block';
        document.getElementById('answer').style.display = 'none';
        
        // Submit query to /query endpoint
        const queryResponse = await fetch('/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                upload_id: currentUploadId,
                question: questionText
            })
        });
        
        const queryData = await queryResponse.json();
        
        if (!queryResponse.ok) {
            throw new Error(queryData.detail || 'Query failed');
        }
        
        const answer = queryData.answer;
        
        // Display answer
        document.getElementById('loading').style.display = 'none';
        const answerDiv = document.getElementById('answer');
        answerDiv.innerHTML = answer; // Already formatted as HTML from backend
        answerDiv.style.display = 'block';
        
        // Show success notification
        showNotification('✅ Answer ready!', 'success');
        
        // Apply syntax highlighting
        if (window.hljs) {
            answerDiv.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
        
        // Generate TTS audio if not muted
        let audioUrl = null;
        if (!isMuted) {
            showNotification('🔊 Generating voice response...', 'info');
            audioUrl = await generateTTS(answer);
        }
        
        // Save to history with voice settings and audio
        await saveToHistory(questionText, answer, audioBlob, audioUrl);
        
        // Reload history
        if (typeof loadHistory === 'function') {
            loadHistory(currentUploadId);
        }
        
    } catch (error) {
        console.error('Query error:', error);
        document.getElementById('loading').style.display = 'none';
        showNotification(`❌ ${error.message}`, 'error');
    }
}

/**
 * Generate TTS audio using pyttsx3 on backend
 */
async function generateTTS(text) {
    try {
        // Strip HTML tags for TTS
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        const response = await fetch('/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: plainText,
                voice_type: voiceSettings.voiceType,
                rate: voiceSettings.rate,
                volume: voiceSettings.volume
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.audio_url) {
            // Play audio
            playAudio(data.audio_url);
            return data.audio_url;
        } else {
            console.warn('TTS failed:', data.detail);
            return null;
        }
    } catch (error) {
        console.error('TTS error:', error);
        return null;
    }
}

/**
 * Play audio file
 */
function playAudio(audioUrl) {
    if (isMuted) return;
    
    try {
        if (currentAudio) {
            currentAudio.pause();
        }
        
        currentAudio = new Audio(audioUrl);
        currentAudio.volume = voiceSettings.volume;
        currentAudio.play();
        
        currentAudio.onended = () => {
            currentAudio = null;
        };
        
        currentAudio.onerror = (error) => {
            console.error('Audio playback error:', error);
            currentAudio = null;
        };
    } catch (error) {
        console.error('Audio play error:', error);
    }
}

/**
 * Save conversation to history with audio files and voice settings
 */
async function saveToHistory(question, answer, questionAudioBlob, answerAudioUrl) {
    try {
        const formData = new FormData();
        formData.append('upload_id', currentUploadId);
        formData.append('question', question);
        formData.append('answer', answer);
        formData.append('voice_type', voiceSettings.voiceType);
        formData.append('audio_speed', voiceSettings.rate);
        formData.append('is_muted', isMuted);
        
        // Add question audio if available
        if (questionAudioBlob) {
            formData.append('question_audio', questionAudioBlob, 'question.wav');
        }
        
        const response = await fetch('/save_history', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Failed to save history:', data.detail);
        } else {
            console.log('History saved:', data.history_id);
        }
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

/**
 * Download answer in selected format
 */
async function downloadAnswer() {
    if (!currentUploadId) {
        showNotification('No answer to download!', 'error');
        return;
    }
    
    const formatSelect = document.getElementById('download-format');
    const format = formatSelect ? formatSelect.value : 'txt';
    
    try {
        const url = `/download/${currentUploadId}/${format}`;
        window.open(url, '_blank');
        showNotification(`Downloading answer as ${format.toUpperCase()}...`, 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed', 'error');
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
