#!/usr/bin/env pwsh
# SmartPDF Search - GitHub Push Script
# This script initializes git and guides you through pushing to GitHub

Write-Host "🚀 SmartPDF Search - GitHub Deployment Script" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if already initialized
if (Test-Path .git) {
    Write-Host "⚠️  Git repository already initialized" -ForegroundColor Yellow
    $reinit = Read-Host "Do you want to reinitialize? (y/N)"
    if ($reinit -ne 'y') {
        Write-Host "Skipping initialization..." -ForegroundColor Yellow
    } else {
        Remove-Item -Recurse -Force .git
        git init
        Write-Host "✅ Repository reinitialized" -ForegroundColor Green
    }
} else {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Repository Information" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Get GitHub username
$username = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Username cannot be empty!" -ForegroundColor Red
    exit 1
}

# Get repository name
$repoName = Read-Host "Enter repository name (default: SmartPDF-Search)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "SmartPDF-Search"
}

Write-Host ""
Write-Host "📦 Preparing files..." -ForegroundColor Cyan

# Update README with username
$readmePath = "README.md"
if (Test-Path $readmePath) {
    $readme = Get-Content $readmePath -Raw
    $readme = $readme -replace 'YOUR_USERNAME', $username
    $readme = $readme -replace 'your\.email@example\.com', ''
    Set-Content $readmePath -Value $readme
    Write-Host "✅ README.md updated with your username" -ForegroundColor Green
}

# Stage all files
Write-Host "Adding files to git..." -ForegroundColor Cyan
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: SmartPDF Search with AI Q&A and voice features"

Write-Host ""
Write-Host "🔗 Remote Repository Setup" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Ask for authentication method
Write-Host "Choose authentication method:" -ForegroundColor Yellow
Write-Host "1. HTTPS (easier, requires token)" -ForegroundColor White
Write-Host "2. SSH (more secure, requires SSH key)" -ForegroundColor White
$authChoice = Read-Host "Enter choice (1 or 2)"

if ($authChoice -eq "2") {
    $remoteUrl = "git@github.com:$username/$repoName.git"
    Write-Host "Using SSH: $remoteUrl" -ForegroundColor Cyan
} else {
    $remoteUrl = "https://github.com/$username/$repoName.git"
    Write-Host "Using HTTPS: $remoteUrl" -ForegroundColor Cyan
}

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $updateRemote = Read-Host "Update remote URL? (y/N)"
    if ($updateRemote -eq 'y') {
        git remote set-url origin $remoteUrl
        Write-Host "✅ Remote URL updated" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote repository added" -ForegroundColor Green
}

# Set main branch
git branch -M main

Write-Host ""
Write-Host "🌐 GitHub Repository" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "Before pushing, make sure you've created the repository on GitHub!" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: $repoName" -ForegroundColor White
Write-Host "3. Description: AI-powered PDF Q&A with voice interaction" -ForegroundColor White
Write-Host "4. Choose Public or Private" -ForegroundColor White
Write-Host "5. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host "6. Click 'Create repository'" -ForegroundColor White
Write-Host ""

$proceed = Read-Host "Have you created the repository? (y/N)"
if ($proceed -ne 'y') {
    Write-Host ""
    Write-Host "⏸️  Setup paused. Run this script again after creating the repository." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To push manually later, run:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor White
    exit 0
}

Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

try {
    git push -u origin main
    Write-Host ""
    Write-Host "🎉 SUCCESS! Your code is now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Your repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Add repository description and topics on GitHub" -ForegroundColor White
    Write-Host "  2. Add a screenshot to README.md" -ForegroundColor White
    Write-Host "  3. Create a release (v1.0.0)" -ForegroundColor White
    Write-Host "  4. Share your project! 🌟" -ForegroundColor White
} catch {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Make sure the repository exists on GitHub" -ForegroundColor White
    Write-Host "  2. Check your credentials" -ForegroundColor White
    Write-Host "  3. For HTTPS, use Personal Access Token as password" -ForegroundColor White
    Write-Host "  4. See GITHUB_GUIDE.md for more help" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
