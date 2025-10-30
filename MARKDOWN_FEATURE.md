# 📝 Markdown Rendering Feature

## Overview
LlamaDoc AI now supports **rich Markdown rendering** with syntax highlighting for code blocks, tables, and images!

## ✨ Features Added

### 1. **Backend (Python - main.py)**
- ✅ Added `markdown` library integration
- ✅ Created `convert_markdown_to_html()` function
- ✅ Enhanced `/query` endpoint to return `html` field with formatted content

**Supported Markdown Features:**
- **Code Blocks** with syntax highlighting (fenced code)
- **Tables** with clean styling
- **Headers** (H1-H6)
- **Lists** (ordered and unordered)
- **Bold**, *Italic*, `Inline Code`
- **Blockquotes**
- **Links**
- **Images**
- **Line breaks** preserved

**Example Backend Response:**
```json
{
  "answer": {
    "text": "Original text",
    "html": "<h2>Formatted HTML</h2><pre><code class=\"python\">...</code></pre>",
    "summary": "First paragraph",
    "paragraphs": ["para1", "para2"]
  },
  "sources": [...]
}
```

### 2. **Frontend (HTML - index.html)**
- ✅ Added **highlight.js** CDN for syntax highlighting
- ✅ GitHub Dark theme for code blocks
- ✅ Script loaded for automatic highlighting

### 3. **Frontend (JavaScript - scripts.js)**
- ✅ Updated to render `data.answer.html` instead of plain text
- ✅ Automatic syntax highlighting with `hljs.highlightElement()`
- ✅ Graceful fallback to plain text if HTML not available
- ✅ XSS protection for user input (question text)

### 4. **Frontend (CSS - style.css)**
- ✅ Comprehensive `.markdown-content` styles
- ✅ Beautiful table styling with hover effects
- ✅ Code block styling (dark theme)
- ✅ Blockquote styling
- ✅ Responsive image handling
- ✅ Link hover effects

## 🎨 Styling Details

### Code Blocks
```python
def example():
    return "Syntax highlighted!"
```
- Dark background (#1e1e1e)
- Syntax highlighting via highlight.js
- Rounded corners, proper padding

### Tables
| Feature | Status |
|---------|--------|
| Tables  | ✅     |
| Styling | ✅     |

- Blue header background
- Hover effects on rows
- Clean borders

### Other Elements
- **Headers**: Styled with bottom borders
- **Lists**: Proper indentation and spacing
- **Blockquotes**: Blue left border with gray background
- **Links**: Blue with underline on hover

## 🔧 Technical Implementation

### Markdown Conversion Function
```python
def convert_markdown_to_html(text: str) -> str:
    md = markdown.Markdown(
        extensions=[
            'fenced_code',      # ```python code blocks
            'codehilite',       # Syntax highlighting
            'tables',           # Table support
            'nl2br',            # Newlines to <br>
            'sane_lists',       # Better list parsing
        ],
        extension_configs={
            'codehilite': {
                'css_class': 'highlight',
                'linenums': False,
                'guess_lang': True,
            }
        }
    )
    return md.convert(text)
```

### JavaScript Rendering
```javascript
if (answerHtml) {
    answerSummary.innerHTML = `
        <div class="question-header">
            <strong>Question:</strong> ${escapeHtml(question)}
        </div>
        <hr>
        <div class="markdown-content">${answerHtml}</div>
    `;
    
    // Apply syntax highlighting
    answerSummary.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}
```

## 📦 Dependencies Added

```txt
markdown>=3.5.0
Pygments>=2.17.0
```

Install with:
```bash
pip install markdown pygments
```

## 🧪 Testing the Feature

### Test 1: Code Block
**Question:** "Show me a Python function example"

**Expected LLM Response:**
```
Here's a Python function:

```python
def greet(name):
    return f"Hello, {name}!"
```

This function takes a name and returns a greeting.
```

### Test 2: Table
**Question:** "Create a comparison table"

**Expected LLM Response:**
```
| Feature | Version 1 | Version 2 |
|---------|-----------|-----------|
| Speed   | Fast      | Faster    |
| Size    | 10MB      | 5MB       |
```

### Test 3: Mixed Content
**Question:** "Explain with examples"

**Expected LLM Response:**
```
# Introduction

This is a **bold** statement with *italic* text.

## Code Example

```javascript
console.log('Hello World');
```

> Important note in a blockquote

[Learn more](https://example.com)
```

## 🎯 Usage Examples

### Example 1: Simple Markdown
**Input:** "What is Python?"

**LLM Returns:**
```markdown
**Python** is a high-level programming language.

Features:
- Easy to learn
- Versatile
- Large community
```

**Frontend Renders:**
- **Python** is a high-level programming language.

Features:
- Easy to learn
- Versatile
- Large community

### Example 2: Code with Syntax Highlighting
**Input:** "Show me a FastAPI example"

**LLM Returns:**
```markdown
Here's a FastAPI example:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
```
```

**Frontend Renders:**
Syntax-highlighted code block with proper Python coloring!

## 🔒 Security Considerations

1. **User Input (Question)**: Always escaped with `escapeHtml()`
2. **LLM Output (Answer)**: Rendered as HTML (trusted source - your LLM)
3. **No eval()**: Pure HTML rendering, no code execution
4. **CSP-ready**: Can add Content Security Policy headers if needed

## 🚀 Future Enhancements

- [ ] Math equations with KaTeX/MathJax
- [ ] Mermaid diagrams
- [ ] Copy button for code blocks
- [ ] Dark/Light theme toggle for code
- [ ] Custom syntax themes
- [ ] PDF export with formatting
- [ ] Line numbers for code blocks

## 📝 Notes

- The LLM must return markdown-formatted text for this to work
- Plain text responses still work (fallback to text rendering)
- Syntax highlighting supports 190+ languages via highlight.js
- Tables are fully responsive and styled

## 🎨 Customization

### Change Code Theme
Edit `index.html` line 8:
```html
<!-- Current: GitHub Dark -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">

<!-- Try: VS Code Dark -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css">

<!-- Try: Monokai -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai.min.css">
```

### Adjust Table Colors
Edit `style.css`:
```css
.markdown-content table th {
    background-color: #4a90e2;  /* Change this color */
}
```

---

**Implemented:** October 30, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
