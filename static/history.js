/* ================================
   📚 LlamaDoc AI - Chat History
   ================================ */

let historyData = [];

/**
 * Load chat history from backend
 */
async function loadHistory(uploadId) {
    if (!uploadId) {
        console.warn('No upload ID provided for history');
        return;
    }
    
    const historyPane = document.getElementById('history-pane');
    const historyList = document.getElementById('history-list');
    
    if (!historyList) {
        console.error('History list element not found');
        return;
    }
    
    // Show loading state
    historyList.innerHTML = '<div class="history-loading">Loading history...</div>';
    
    try {
        const response = await fetch(`/history?upload_id=${uploadId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load history');
        }
        
        historyData = await response.json();
        
        if (historyData.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No chat history yet. Start asking questions!</div>';
            return;
        }
        
        // Render history entries
        renderHistory(historyData);
        
        // Show history pane
        if (historyPane) {
            historyPane.classList.remove('hidden');
        }
        
        console.log(`Loaded ${historyData.length} history entries`);
    } catch (error) {
        console.error('Error loading history:', error);
        historyList.innerHTML = '<div class="history-error">Failed to load history</div>';
    }
}

/**
 * Render history entries in the UI
 */
function renderHistory(entries) {
    const historyList = document.getElementById('history-list');
    
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    entries.forEach(entry => {
        const item = createHistoryItem(entry);
        historyList.appendChild(item);
    });
}

/**
 * Create a single history item element
 */
function createHistoryItem(entry) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.dataset.historyId = entry.id;
    
    // Format timestamp
    const timestamp = formatTimestamp(entry.created_at);
    
    // Truncate summary for display
    const shortSummary = truncateText(entry.summary || entry.answer, 100);
    const shortQuestion = truncateText(entry.question, 60);
    
    item.innerHTML = `
        <div class="history-timestamp">${timestamp}</div>
        <div class="history-question">
            <strong>Q:</strong> ${escapeHtml(shortQuestion)}
        </div>
        <div class="history-summary">
            ${escapeHtml(shortSummary)}
        </div>
        <div class="history-actions">
            ${entry.question_audio_path ? 
                `<button class="history-btn play-question-btn" onclick="playAudio('${entry.question_audio_path}')" title="Play question audio">
                    🎧 Question
                </button>` : ''}
            ${entry.answer_audio_path ? 
                `<button class="history-btn play-answer-btn" onclick="playAudio('${entry.answer_audio_path}')" title="Play answer audio">
                    🔊 Answer
                </button>` : 
                `<button class="history-btn speak-btn" onclick="speakHistoryAnswer('${entry.id}')" title="Speak answer">
                    🔊 Speak
                </button>`}
            <button class="history-btn view-btn" onclick="viewHistoryDetails('${entry.id}')" title="View full answer">
                👁️ View
            </button>
        </div>
    `;
    
    return item;
}

/**
 * Format timestamp for display
 */
function formatTimestamp(isoString) {
    if (!isoString) return 'Unknown time';
    
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
        const mins = Math.floor(diff / 60000);
        return `${mins} min${mins > 1 ? 's' : ''} ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Play audio file
 */
function playAudio(audioPath) {
    if (!audioPath) {
        console.error('No audio path provided');
        return;
    }
    
    const audio = new Audio(audioPath);
    
    audio.onplay = () => {
        console.log('Playing audio:', audioPath);
    };
    
    audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        alert('Failed to play audio');
    };
    
    audio.play();
}

/**
 * Speak answer from history using TTS
 */
function speakHistoryAnswer(historyId) {
    const entry = historyData.find(e => e.id === historyId);
    
    if (!entry) {
        console.error('History entry not found:', historyId);
        return;
    }
    
    // Use the speakText function from voice.js
    if (window.speakText) {
        window.speakText(entry.answer);
    } else {
        // Fallback if voice.js not loaded
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(entry.answer);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    }
}

/**
 * View full history entry details
 */
function viewHistoryDetails(historyId) {
    const entry = historyData.find(e => e.id === historyId);
    
    if (!entry) {
        console.error('History entry not found:', historyId);
        return;
    }
    
    // Display in answer section
    const answerSection = document.getElementById('answer-section');
    const answerSummary = document.getElementById('answer-summary');
    
    if (!answerSection || !answerSummary) {
        console.error('Answer section not found');
        return;
    }
    
    // Show answer section
    answerSection.classList.remove('hidden');
    
    // Render the full answer
    answerSummary.innerHTML = `
        <div class="history-detail-header">
            <div class="history-detail-time">${formatTimestamp(entry.created_at)}</div>
        </div>
        <div class="question-header">
            <strong>Question:</strong> ${escapeHtml(entry.question)}
        </div>
        <hr>
        <div class="markdown-content">
            <p>${escapeHtml(entry.answer)}</p>
        </div>
        ${entry.question_audio_path || entry.answer_audio_path ? `
            <hr>
            <div class="audio-controls">
                ${entry.question_audio_path ? 
                    `<div class="audio-item">
                        <label>Question Audio:</label>
                        <audio controls src="${entry.question_audio_path}"></audio>
                    </div>` : ''}
                ${entry.answer_audio_path ? 
                    `<div class="audio-item">
                        <label>Answer Audio:</label>
                        <audio controls src="${entry.answer_audio_path}"></audio>
                    </div>` : ''}
            </div>
        ` : ''}
    `;
    
    // Scroll to answer
    answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Toggle history sidebar
 */
function toggleHistorySidebar() {
    const sidebar = document.getElementById('history-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

/**
 * Clear history (optional feature)
 */
async function clearHistory(uploadId) {
    if (!confirm('Are you sure you want to clear all chat history for this document?')) {
        return;
    }
    
    // This would require a DELETE endpoint on the backend
    console.log('Clear history not yet implemented');
    // TODO: Implement /history DELETE endpoint
}

/**
 * Export history to JSON (optional feature)
 */
function exportHistory() {
    if (historyData.length === 0) {
        alert('No history to export');
        return;
    }
    
    const dataStr = JSON.stringify(historyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `llamadoc-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Helper function for HTML escaping (reuse from voice.js)
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-load history when page loads (if upload ID is available)
window.addEventListener('DOMContentLoaded', () => {
    console.log('History module loaded');
});
