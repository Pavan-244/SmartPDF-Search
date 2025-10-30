# Contributing to SmartPDF Search

First off, thank you for considering contributing to SmartPDF Search! It's people like you that make this tool better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct of being respectful and inclusive.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples** (screenshots, code snippets, etc.)
* **Describe the behavior you observed** and what you expected to see
* **Include details about your environment** (OS, Python version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List any similar features in other applications** if applicable

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure your code follows the existing style
4. Make sure your code lints
5. Write a clear commit message

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/SmartPDF-Search.git
cd SmartPDF-Search
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the development server:
```bash
uvicorn main:app --reload
```

## Coding Standards

### Python
- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and single-purpose

### JavaScript
- Use ES6+ syntax
- Follow consistent naming conventions
- Add comments for complex logic
- Keep functions pure when possible

### Git Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally

## Project Structure

```
SmartPDF-Search/
├── main.py              # FastAPI app
├── models.py            # Database models
├── static/              # Frontend assets
├── templates/           # HTML templates
└── requirements.txt     # Dependencies
```

## Testing

Before submitting a PR, make sure to:
- Test all modified features
- Test on different browsers (if frontend changes)
- Verify the application starts without errors
- Check for console errors

## Questions?

Feel free to open an issue with the tag `question`.

Thank you! 🙏
