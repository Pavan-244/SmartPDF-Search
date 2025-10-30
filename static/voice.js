/* ================================
   🎤 LlamaDoc AI - Voice Input & TTS
   ================================ */

let currentUploadId = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

/**
 * Initialize voice features with upload ID
 */
function initVoice(uploadId) {
    currentUploadId = uploadId;
    console.log('Voice features initialized for upload:', uploadId);
}

/**
 * Check if browser supports Web Speech API
 */
function checkSpeechSupport() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return {
        recognition: !!SpeechRecognition,
        synthesis: !!window.speechSynthesis
    };
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
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

/**
 * Start speech recognition using Web Speech API
 */
function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        showNotification('Speech recognition not supported. Please use manual input.', 'error');
        return;
    }
    
    if (!currentUploadId) {
        showNotification('Please upload a PDF first!', 'error');
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    
    const micBtn = document.getElementById('mic-btn');
    const waveform = document.getElementById('waveform');
    
    recognition.onstart = () => {
        console.log('Speech recognition started');
        micBtn.classList.add('recording');
        if (waveform) waveform.classList.add('active');
        showNotification('🎤 Listening... Speak now!', 'info');
    };
    
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        console.log('Transcript:', transcript, 'Confidence:', confidence);
        showNotification(`Transcribed: "${transcript}"`, 'success');
        
        // Update question input
        document.getElementById('question').value = transcript;
        
        // Call query endpoint with transcribed text
        await submitVoiceQuery(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
            showNotification('No speech detected. Please try again.', 'error');
        } else if (event.error === 'not-allowed') {
            showNotification('Microphone permission denied. Please allow microphone access.', 'error');
        } else {
            showNotification(`Error: ${event.error}`, 'error');
        }
        
        micBtn.classList.remove('recording');
        if (waveform) waveform.classList.remove('active');
    };
    
    recognition.onend = () => {
        console.log('Speech recognition ended');
        micBtn.classList.remove('recording');
        if (waveform) waveform.classList.remove('active');
    };
    
    // Start recognition
    try {
        recognition.start();
    } catch (error) {
        console.error('Failed to start recognition:', error);
        showNotification('Failed to start recording. Please try again.', 'error');
    }
}

/**
 * Submit voice query to backend
 */
async function submitVoiceQuery(questionText) {
    const answerSection = document.getElementById('answer-section');
    const answerSummary = document.getElementById('answer-summary');
    const queryBtn = document.querySelector('#query-form button');
    
    // Show loading state
    answerSection.classList.remove('hidden');
    answerSummary.innerHTML = '<p style="text-align: center; color: #666;">🤔 Thinking and searching through your PDF...</p>';
    answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    if (queryBtn) {
        queryBtn.disabled = true;
    }
    
    showNotification('⏳ Processing your question...', 'info');
    
    try {
        const response = await fetch('/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                upload_id: currentUploadId,
                question: questionText
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Extract answer
            let answerHtml = '';
            let answerText = '';
            
            if (data.answer) {
                if (typeof data.answer === 'object' && data.answer !== null) {
                    answerHtml = data.answer.html || '';
                    answerText = data.answer.text || data.answer.summary || '';
                } else {
                    answerText = data.answer;
                }
            }
            
            // Display answer
            if (answerHtml) {
                answerSummary.innerHTML = `
                    <div class="question-header">
                        <strong>Question:</strong> ${escapeHtml(questionText)}
                    </div>
                    <hr>
                    <div class="markdown-content">${answerHtml}</div>
                `;
                
                // Apply syntax highlighting
                answerSummary.querySelectorAll('pre code').forEach((block) => {
                    if (window.hljs) {
                        hljs.highlightElement(block);
                    }
                });
            } else {
                answerSummary.innerHTML = `
                    <p><strong>Question:</strong> ${escapeHtml(questionText)}</p>
                    <hr>
                    <p>${escapeHtml(answerText)}</p>
                `;
            }
            
            // Speak answer using browser TTS
            speakText(answerText);
            
            // Save to history
            await saveToHistory(questionText, answerText, answerText);
            
            showNotification('✅ Answer received and spoken!', 'success');
        } else {
            answerSummary.innerHTML = `
                <p style="color: #dc3545;">❌ <strong>Error:</strong> ${escapeHtml(data.detail || 'Unknown error')}</p>
            `;
            showNotification('❌ Failed to get answer', 'error');
        }
    } catch (error) {
        console.error('Query error:', error);
        answerSummary.innerHTML = `
            <p style="color: #dc3545;">❌ <strong>Error:</strong> ${escapeHtml(error.message)}</p>
        `;
        showNotification('❌ Network error', 'error');
    } finally {
        if (queryBtn) {
            queryBtn.disabled = false;
        }
    }
}

/**
 * Speak text using browser Text-to-Speech
 */
function speakText(text) {
    if (!window.speechSynthesis) {
        console.warn('Text-to-speech not supported');
        return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
        console.log('Speech started');
        showNotification('🔊 Playing answer...', 'info');
    };
    
    utterance.onend = () => {
        console.log('Speech ended');
    };
    
    utterance.onerror = (event) => {
        console.error('Speech error:', event);
    };
    
    // Speak
    window.speechSynthesis.speak(utterance);
}

/**
 * Save chat history to backend
 */
async function saveToHistory(question, answer, summary) {
    try {
        const response = await fetch('/save_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                upload_id: currentUploadId,
                question: question,
                answer: answer,
                summary: summary
            })
        });
        
        if (response.ok) {
            console.log('History saved successfully');
            // Reload history panel
            if (window.loadHistory) {
                loadHistory(currentUploadId);
            }
        } else {
            console.error('Failed to save history');
        }
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

/**
 * Fallback: Record audio using MediaRecorder
 */
function startAudioRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showNotification('Audio recording not supported in this browser', 'error');
        return;
    }
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                await uploadAudioForTranscription(audioBlob);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            isRecording = true;
            
            const micBtn = document.getElementById('mic-btn');
            if (micBtn) micBtn.classList.add('recording');
            
            showNotification('🎙️ Recording audio... Click again to stop', 'info');
        })
        .catch(error => {
            console.error('Microphone access error:', error);
            showNotification('Microphone access denied', 'error');
        });
}

/**
 * Stop audio recording
 */
function stopAudioRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        const micBtn = document.getElementById('mic-btn');
        if (micBtn) micBtn.classList.remove('recording');
        
        showNotification('Processing audio...', 'info');
    }
}

/**
 * Upload audio blob for server-side transcription (fallback)
 */
async function uploadAudioForTranscription(audioBlob) {
    const formData = new FormData();
    formData.append('question_audio', audioBlob, 'question.webm');
    formData.append('upload_id', currentUploadId);
    
    showNotification('Uploading audio for transcription...', 'info');
    
    try {
        // Note: You would need a /transcribe endpoint for this
        // For now, just save the audio
        const response = await fetch('/save_history', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showNotification('Audio uploaded. Please type your question manually.', 'info');
        }
    } catch (error) {
        console.error('Audio upload error:', error);
        showNotification('Failed to upload audio', 'error');
    }
}

/**
 * Toggle microphone button action
 */
function toggleMicrophone() {
    const support = checkSpeechSupport();
    
    if (support.recognition) {
        // Use Web Speech API
        startSpeechRecognition();
    } else {
        // Use MediaRecorder fallback
        if (isRecording) {
            stopAudioRecording();
        } else {
            startAudioRecording();
        }
    }
}

/**
 * Request server-side TTS (optional fallback)
 */
async function requestServerTTS(text) {
    try {
        const response = await fetch('/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Play audio file
            const audio = new Audio(data.audio_url);
            audio.play();
        }
    } catch (error) {
        console.error('Server TTS error:', error);
        // Fallback to browser TTS
        speakText(text);
    }
}

// Helper function (reuse from scripts.js)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Log support status on load
window.addEventListener('DOMContentLoaded', () => {
    const support = checkSpeechSupport();
    console.log('Voice support:', support);
    
    if (!support.recognition) {
        console.warn('Web Speech API not supported - using MediaRecorder fallback');
    }
});
