# WinGemini 🌌 - Windows Mobile-Style AI Overlay

> A fast, beautiful Windows floating Gemini assistant modeled after the Android mobile overlay experience. Features global hotkey trigger (`Alt + Space`), instant screen vision ("Ask about this screen"), multi-provider API support (Google Gemini, OpenRouter, OpenAI, Groq), and an automated GitHub Actions CI/CD pipeline that compiles Windows `.exe` and `.zip` files directly to the GitHub **Releases** tab.

---

## ⚡ Features

- **📱 Mobile-Style Overlay**: Frosted glass Acrylic/Mica card with animated Gemini gradient glow border and compact floating pill mode.
- **⌨️ Global Hotkey**: Press `Alt + Space` (or your customized hotkey) anywhere in Windows to summon the assistant over any game, code editor, or app.
- **👁️ "Ask About This Screen"**: One-click screen capture that passes the active desktop context to Gemini 3.8 Flash or OpenRouter Claude 3.5 Sonnet to summarize, find bugs, or answer questions.
- **🔌 Multi-Provider AI**: Built-in support for:
  - **Google Gemini** (Gemini 3.8 Flash, 3.1 Flash Lite, Gemini 4 Argon)
  - **OpenRouter** (DeepSeek R1, Claude 3.5 Sonnet, GPT-4o, Llama 3.3 70B)
  - **OpenAI** (GPT-4o, GPT-4o-mini)
  - **Groq** (Ultra-fast LPU inference)
  - **Local Ollama / Custom Endpoints** (`http://localhost:11434/v1`)
- **📦 Turnkey GitHub Actions CI/CD**: Dual-job workflow that builds Windows installer `.exe`, portable `.exe`, and `.zip`, then automatically publishes them to your GitHub repository **Releases** tab!

---

## 🚀 GitHub Actions Auto-Build & Release Workflow

This repository includes a production-tested GitHub Actions workflow located at:
```text
.github/workflows/build-and-release.yml
```

### How to Trigger the Workflow:
1. **Push any commit to GitHub**:
   ```bash
   git add .
   git commit -m "feat: update overlay"
   git push
   ```
   The workflow is configured with `on: push`, so it automatically triggers on every push!

2. **Or Push a Version Tag (for named releases)**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Or Click "Run workflow" in GitHub UI**:
   - Go to your repository's **Actions** tab on GitHub.
   - Select **"Build & Release Windows App"** from the left sidebar.
   - Click **Run workflow**!

### What GitHub Actions Produces (in your "Releases" tab):
- **`WinGemini-Setup-1.0.0.exe`**: Full Windows NSIS installer with Start Menu & Desktop shortcuts.
- **`WinGemini-Portable-1.0.0.exe`**: Zero-install standalone executable.
- **`WinGemini-1.0.0-win.zip`**: Portable ZIP archive.
- **`SHA256SUMS.txt`**: Cryptographic verification checksums.

---

## 🛠️ Local Development & Manual Build

If you want to package locally on a Windows machine:
```bash
# 1. Install dependencies
npm install

# 2. Build Web Application & Package Windows Binaries
npm run package:win
```
The compiled binaries will be output to the `./dist_electron/` folder.
