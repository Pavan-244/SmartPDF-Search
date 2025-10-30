# 🚀 GitHub Deployment Guide

This guide will walk you through pushing SmartPDF Search to GitHub.

## Prerequisites

- Git installed on your system
- GitHub account created
- SSH key configured (optional but recommended)

## Step 1: Initialize Git Repository

Open PowerShell in your project directory and run:

```powershell
# Navigate to project directory
cd "C:\Users\Pavan Kumar\Desktop\virtual_space\SmartPDF Search"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SmartPDF Search with AI Q&A and voice features"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in the details:
   - **Repository name:** `SmartPDF-Search` (or your preferred name)
   - **Description:** "AI-powered PDF question answering with voice interaction using TinyLlama and LangChain"
   - **Visibility:** Public (or Private if preferred)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 3: Link Local Repository to GitHub

GitHub will show you commands. Use these:

```powershell
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/SmartPDF-Search.git

# Rename branch to main (if it's master)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Using SSH (Alternative - More Secure)

If you have SSH keys configured:

```powershell
git remote add origin git@github.com:YOUR_USERNAME/SmartPDF-Search.git
git branch -M main
git push -u origin main
```

## Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all files uploaded
3. README.md will be displayed automatically

## Step 5: Configure Repository Settings (Optional)

### Add Topics/Tags
1. Click **"⚙️ Settings"** → **"General"**
2. In **"Topics"** section, add:
   - `pdf`
   - `ai`
   - `llm`
   - `tinyllama`
   - `langchain`
   - `fastapi`
   - `voice-recognition`
   - `question-answering`

### Enable GitHub Pages (Optional)
If you want to host documentation:
1. Go to **Settings** → **Pages**
2. Select **"main"** branch
3. Select **"/docs"** folder (if you have docs)
4. Click **Save**

### Add Repository Description
1. Click the **⚙️** gear icon next to "About"
2. Add description and website
3. Select topics
4. Click **Save changes**

## Step 6: Update README with Your Details

Before pushing, update these placeholders in `README.md`:

```markdown
# Replace:
YOUR_USERNAME → your actual GitHub username
your.email@example.com → your actual email
[Your Name] → your actual name
```

Then commit and push the changes:

```powershell
git add README.md
git commit -m "Update README with personal details"
git push
```

## Step 7: Create a Release (Optional)

1. Go to **Releases** → **"Create a new release"**
2. Click **"Choose a tag"** → Type `v1.0.0` → **"Create new tag"**
3. Release title: `v1.0.0 - Initial Release`
4. Describe the release:
   ```
   ## Features
   - AI-powered PDF Q&A with TinyLlama
   - Voice input and output
   - Chat history with database
   - Export answers (TXT, PDF, DOCX)
   - Modern responsive UI
   ```
5. Click **"Publish release"**

## Common Git Commands

```powershell
# Check status
git status

# Add specific files
git add filename.py

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View commit history
git log

# View remote URL
git remote -v
```

## Troubleshooting

### Authentication Failed

If you get authentication errors:

**Option 1: Use Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Copy the token
5. Use it as password when prompted

**Option 2: Use SSH Keys**
```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub | clip

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

### Large Files Error

If you get errors about large files:

```powershell
# Remove file from git tracking
git rm --cached path/to/large/file

# Add to .gitignore
echo "path/to/large/file" >> .gitignore

# Commit changes
git add .gitignore
git commit -m "Remove large files from tracking"
```

### Merge Conflicts

If you have merge conflicts:

```powershell
# Pull changes
git pull origin main

# Resolve conflicts in files
# Then:
git add .
git commit -m "Resolve merge conflicts"
git push
```

## Best Practices

1. **Commit Often** - Small, focused commits are better
2. **Write Clear Messages** - Describe what and why
3. **Use Branches** - Create feature branches for new features
4. **Keep Secrets Safe** - Never commit API keys or passwords
5. **Update .gitignore** - Keep generated files out of git
6. **Pull Before Push** - Always pull latest changes first
7. **Test Before Commit** - Make sure code works

## Next Steps

After pushing to GitHub:

1. ✅ Add a screenshot to README
2. ✅ Create a demo video
3. ✅ Write detailed documentation
4. ✅ Add unit tests
5. ✅ Set up CI/CD (GitHub Actions)
6. ✅ Add badges to README
7. ✅ Share on social media

## GitHub Actions (CI/CD) - Optional

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.10
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest
```

## Badges for README

Add these to the top of your README.md:

```markdown
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stars](https://img.shields.io/github/stars/YOUR_USERNAME/SmartPDF-Search)
![Forks](https://img.shields.io/github/forks/YOUR_USERNAME/SmartPDF-Search)
```

---

**Congratulations! 🎉 Your project is now on GitHub!**

Share it with the world: `https://github.com/YOUR_USERNAME/SmartPDF-Search`
