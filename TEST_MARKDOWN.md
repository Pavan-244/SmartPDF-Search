# 🧪 Markdown Rendering Test Cases

## Test Case 1: Basic Markdown Elements

### Question:
"Explain Python data types with examples"

### Expected LLM Response (Markdown):
```markdown
# Python Data Types

Python has several built-in data types:

## Numeric Types
- **int**: Whole numbers like `42`
- **float**: Decimal numbers like `3.14`

## Example Code

```python
# Integer example
age = 25

# Float example
price = 19.99

# String example
name = "Alice"
```

> **Note:** Python is dynamically typed!

For more info, visit [Python Docs](https://docs.python.org)
```

### Expected Frontend Output:
✅ Rendered with:
- H1 and H2 headers with bottom borders
- Bold text for **int** and **float**
- Inline code styling for `42`, `3.14`
- Syntax-highlighted Python code block
- Styled blockquote with blue left border
- Clickable blue link with hover effect

---

## Test Case 2: Tables

### Question:
"Compare Python vs JavaScript"

### Expected LLM Response (Markdown):
```markdown
Here's a comparison:

| Feature | Python | JavaScript |
|---------|--------|------------|
| Typing | Dynamic | Dynamic |
| Use Case | Data Science, Backend | Web Frontend, Backend |
| Package Manager | pip | npm |
| Performance | Moderate | Fast |

**Conclusion:** Both are powerful languages for different purposes.
```

### Expected Frontend Output:
✅ Rendered with:
- Beautiful table with blue header
- Alternating row colors on hover
- Proper cell padding and borders
- Bold conclusion text

---

## Test Case 3: Mixed Content with Lists

### Question:
"How to set up a FastAPI project?"

### Expected LLM Response (Markdown):
```markdown
## FastAPI Setup Guide

Follow these steps:

1. **Install FastAPI**
   ```bash
   pip install fastapi uvicorn
   ```

2. **Create main.py**
   ```python
   from fastapi import FastAPI
   
   app = FastAPI()
   
   @app.get("/")
   def read_root():
       return {"message": "Hello World"}
   ```

3. **Run the server**
   ```bash
   uvicorn main:app --reload
   ```

### Features
- 🚀 Fast performance
- 📝 Auto documentation
- ✅ Type hints

> Pro tip: Use `--reload` during development!
```

### Expected Frontend Output:
✅ Rendered with:
- Numbered list with proper indentation
- Multiple code blocks (bash and python) with correct syntax highlighting
- Emoji support in bullet points
- Styled blockquote for the tip
- Nested content structure

---

## Test Case 4: Code-Heavy Response

### Question:
"Show me a complete REST API example"

### Expected LLM Response (Markdown):
```markdown
### Complete REST API Example

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Item(BaseModel):
    id: int
    name: str
    price: float

items_db = []

@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    items_db.append(item)
    return item

@app.get("/items/", response_model=List[Item])
async def read_items():
    return items_db

@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: int):
    for item in items_db:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")
```

This creates three endpoints:
- `POST /items/` - Create item
- `GET /items/` - List all items
- `GET /items/{item_id}` - Get specific item
```

### Expected Frontend Output:
✅ Rendered with:
- Large Python code block with perfect syntax highlighting
- Keywords, strings, and decorators properly colored
- Bullet list below the code
- Inline code for endpoint paths

---

## Test Case 5: Real PDF Content Response

### Question (from uploaded PDF):
"What is the main conclusion of this research paper?"

### Expected LLM Response (Markdown):
```markdown
Based on the provided context, the main conclusions are:

## Key Findings

1. **Primary Result**: The study found that *machine learning models* improved accuracy by 23%

2. **Statistical Significance**: 
   - p-value < 0.05
   - Sample size: n=1000
   - Confidence interval: 95%

### Data Summary

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Accuracy | 77% | 95% | +23% |
| Speed | 2.3s | 1.1s | +52% |

> "The results demonstrate significant improvement in both accuracy and efficiency." - Research Paper, pg. 42

```python
# Simplified model implementation
def predict(input_data):
    return model.predict(input_data)
```

**Conclusion**: The proposed approach shows promise for real-world applications.
```

### Expected Frontend Output:
✅ Rendered with:
- Mixed markdown elements (headers, bold, italic)
- Bullet and numbered lists
- Well-formatted table with data
- Styled blockquote (citation)
- Syntax-highlighted Python code
- Professional layout

---

## Test Case 6: Error Handling

### Question:
"What is the capital of XYZ?" (when PDF doesn't contain this info)

### Expected LLM Response (Markdown):
```markdown
The information is not available in the provided context.

> Please note: I can only answer questions based on the content of your uploaded PDF document.
```

### Expected Frontend Output:
✅ Rendered with:
- Clear plain text message
- Styled blockquote for the note
- No errors in console

---

## 🎯 How to Test

1. **Start your server:**
   ```bash
   python main.py
   ```

2. **Upload a PDF** with technical content

3. **Ask questions** that would trigger markdown responses:
   - "Summarize this in a table"
   - "Show code examples from the document"
   - "Create a list of key points"

4. **Check the rendering:**
   - Open browser DevTools (F12)
   - Inspect the `.markdown-content` div
   - Verify syntax highlighting is applied
   - Check table and code block styling

---

## 🐛 Troubleshooting

### Problem: Code blocks not highlighted
**Solution:** Check browser console for highlight.js errors. Ensure CDN is loaded.

### Problem: Tables not rendering
**Solution:** Verify markdown includes proper table syntax with `|` separators.

### Problem: Inline code looks like plain text
**Solution:** Check CSS for `.markdown-content code` styles.

### Problem: Line breaks not preserved
**Solution:** The `nl2br` extension handles this. Verify it's enabled in `convert_markdown_to_html()`.

---

## 📊 Expected vs Actual Checklist

When testing, verify:

- [ ] Headers (H1-H6) have proper sizing and bottom borders
- [ ] **Bold** text is rendered in bold
- [ ] *Italic* text is rendered in italic
- [ ] `Inline code` has gray background and pink color
- [ ] Code blocks have dark background
- [ ] Code blocks have syntax highlighting (colors)
- [ ] Tables have blue headers
- [ ] Table rows highlight on hover
- [ ] Blockquotes have blue left border
- [ ] Links are blue and underline on hover
- [ ] Lists are properly indented
- [ ] Images (if any) are responsive
- [ ] Overall layout is clean and readable

---

**Test Date:** October 30, 2025  
**Test Status:** Ready for execution ✅
