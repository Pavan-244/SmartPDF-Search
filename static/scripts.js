/* ================================
   🦙 LlamaDoc AI - Frontend Logic
   ================================ */

let uploadId = null;

// Get DOM elements
const uploadForm = document.getElementById('upload-form');
const queryForm = document.getElementById('query-form');
const uploadStatus = document.getElementById('upload-status');
const querySection = document.getElementById('query-section');
const answerSection = document.getElementById('answer-section');
const answerSummary = document.getElementById('answer-summary');
const fileInput = document.getElementById('file');
const fileLabel = document.querySelector('.file-label');

// Update file label when file is selected
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const fileName = e.target.files[0].name;
        fileLabel.querySelector('.file-text').textContent = `Selected: ${fileName}`;
        fileLabel.style.borderColor = '#28a745';
        fileLabel.style.backgroundColor = '#e8f5e9';
    }
});

// Handle file upload
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    
    // Show loading state
    const uploadBtn = uploadForm.querySelector('button');
    const btnText = uploadBtn.querySelector('.btn-text');
    const btnLoader = uploadBtn.querySelector('.btn-loader');
    
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    uploadBtn.disabled = true;
    
    uploadStatus.textContent = '⏳ Uploading and processing your PDF...';
    uploadStatus.className = 'status-message';
    
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            uploadId = data.upload_id;
            uploadStatus.textContent = `✅ File uploaded successfully! You can now ask questions.`;
            uploadStatus.className = 'status-message success';
            
            // Initialize voice features with upload ID
            if (window.initVoice) {
                initVoice(uploadId);
            }
            
            // Load chat history for this upload
            if (window.loadHistory) {
                loadHistory(uploadId);
            }
            
            // Show query section with smooth reveal
            querySection.classList.remove('hidden');
            querySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Focus on question input
            setTimeout(() => {
                document.getElementById('question').focus();
            }, 500);
        } else {
            uploadStatus.textContent = `❌ Error: ${data.detail}`;
            uploadStatus.className = 'status-message error';
        }
    } catch (error) {
        uploadStatus.textContent = `❌ Error: ${error.message}`;
        uploadStatus.className = 'status-message error';
    } finally {
        // Reset button state
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        uploadBtn.disabled = false;
    }
});

// Handle query submission
queryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!uploadId) {
        alert('⚠️ Please upload a PDF first');
        return;
    }
    
    const question = document.getElementById('question').value.trim();
    
    if (!question) {
        alert('⚠️ Please enter a question');
        return;
    }
    
    // Show loading state
    const queryBtn = queryForm.querySelector('button');
    const btnText = queryBtn.querySelector('.btn-text');
    const btnLoader = queryBtn.querySelector('.btn-loader');
    
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    queryBtn.disabled = true;
    
    // Show answer section with loading message
    answerSection.classList.remove('hidden');
    answerSummary.innerHTML = '<p style="text-align: center; color: #666;">🤔 Thinking and searching through your PDF...</p>';
    answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    try {
        const response = await fetch('/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                upload_id: uploadId,
                question: question
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Handle different response formats
            let answerHtml = '';
            let answerText = '';
            
            if (data.answer) {
                // Check if answer is an object with html/text/summary/paragraphs
                if (typeof data.answer === 'object' && data.answer !== null) {
                    // Prefer HTML rendering if available (from markdown conversion)
                    answerHtml = data.answer.html || '';
                    answerText = data.answer.text || data.answer.summary || JSON.stringify(data.answer);
                } else {
                    answerText = data.answer;
                }
            } else {
                answerText = 'No answer received.';
            }
            
            // Display answer with rich HTML formatting or fallback to text
            if (answerHtml) {
                answerSummary.innerHTML = `
                    <div class="question-header">
                        <strong>Question:</strong> ${escapeHtml(question)}
                    </div>
                    <hr>
                    <div class="markdown-content">${answerHtml}</div>
                `;
                
                // Apply syntax highlighting to code blocks
                answerSummary.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            } else {
                answerSummary.innerHTML = `
                    <p><strong>Question:</strong> ${escapeHtml(question)}</p>
                    <hr>
                    <p>${escapeHtml(answerText)}</p>
                `;
            }
            
            // Optional: Show source info if available
            if (data.sources && data.sources.length > 0) {
                const sourcesText = data.sources.map((s, i) => 
                    `Source ${i + 1}: ${s.page_content ? s.page_content.substring(0, 150) + '...' : 'N/A'}`
                ).join('\n');
                
                answerSummary.innerHTML += `
                    <hr>
                    <p style="font-size: 0.9rem; color: #666;"><strong>Sources:</strong></p>
                    <p style="font-size: 0.85rem; color: #888; white-space: pre-wrap;">${escapeHtml(sourcesText)}</p>
                `;
            }
            
            // Auto-play TTS using Web Speech API (browser-based)
            if (window.speechSynthesis && answerText) {
                const muteBtn = document.getElementById('mute-btn');
                const isMuted = muteBtn && muteBtn.classList.contains('muted');
                
                if (!isMuted) {
                    // Cancel any ongoing speech
                    window.speechSynthesis.cancel();
                    
                    // Create speech utterance
                    const utterance = new SpeechSynthesisUtterance(answerText);
                    
                    // Get voice settings if available
                    const voiceSpeedInput = document.getElementById('voice-speed');
                    const voiceVolumeInput = document.getElementById('voice-volume');
                    
                    if (voiceSpeedInput) {
                        utterance.rate = parseInt(voiceSpeedInput.value) / 100; // Convert WPM to rate (0.1 to 10)
                    }
                    if (voiceVolumeInput) {
                        utterance.volume = parseFloat(voiceVolumeInput.value);
                    }
                    
                    // Speak the text
                    window.speechSynthesis.speak(utterance);
                }
            }
        } else {
            answerSummary.innerHTML = `
                <p style="color: #dc3545;">❌ <strong>Error:</strong> ${escapeHtml(data.detail || 'Unknown error occurred')}</p>
            `;
        }
    } catch (error) {
        answerSummary.innerHTML = `
            <p style="color: #dc3545;">❌ <strong>Error:</strong> ${escapeHtml(error.message)}</p>
        `;
    } finally {
        // Reset button state
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        queryBtn.disabled = false;
    }
});

// Helper function to escape HTML and prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add keyboard shortcut (Enter to submit)
document.getElementById('question').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        queryForm.dispatchEvent(new Event('submit'));
    }
});
