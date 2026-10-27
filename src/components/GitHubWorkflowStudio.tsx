import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  FileCode,
  FolderGit2,
  GitBranch,
  Tag,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Boxes,
  Terminal,
} from 'lucide-react';
import { GITHUB_WORKFLOW_YML, GITHUB_WORKFLOW_EXPLANATION } from '../constants/githubWorkflow';
import {
  ELECTRON_PACKAGE_JSON,
  ELECTRON_MAIN_JS,
  ELECTRON_PRELOAD_JS,
  README_MD,
} from '../constants/electronSource';
import { generateProjectZip, downloadBlob } from '../utils/zipGenerator';

export const GitHubWorkflowStudio: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('workflow');
  const [isCopied, setIsCopied] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

  const filesMap: Record<string, { title: string; filename: string; content: string; lang: string }> = {
    workflow: {
      title: 'GitHub Actions Workflow',
      filename: '.github/workflows/build-and-release.yml',
      content: GITHUB_WORKFLOW_YML,
      lang: 'yaml',
    },
    pkg: {
      title: 'Electron package.json & Builder Config',
      filename: 'package.json',
      content: ELECTRON_PACKAGE_JSON,
      lang: 'json',
    },
    main: {
      title: 'Windows Native Main Process',
      filename: 'electron/main.js',
      content: ELECTRON_MAIN_JS,
      lang: 'javascript',
    },
    preload: {
      title: 'Secure Context Bridge',
      filename: 'electron/preload.js',
      content: ELECTRON_PRELOAD_JS,
      lang: 'javascript',
    },
    readme: {
      title: 'Project Documentation & Quickstart',
      filename: 'README.md',
      content: README_MD,
      lang: 'markdown',
    },
  };

  const currentFile = filesMap[selectedFile];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const blob = await generateProjectZip();
      downloadBlob(blob, 'WinGemini-Windows-Desktop-App.zip');
    } catch (err) {
      console.error('Failed to create ZIP package:', err);
      alert('Failed to package zip. You can copy the code files manually below.');
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold border border-sky-500/20 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" /> Turnkey CI/CD Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              Windows .EXE & .ZIP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Build & Release to GitHub in One Workflow
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Everything you need to compile a native Windows installer (<code className="text-sky-300 font-mono">.exe</code>), standalone portable app, and <code className="text-sky-300 font-mono">.zip</code> using GitHub Actions, automatically published to your repository&apos;s <strong>Releases</strong> tab in a separated job.
          </p>
        </div>

        {/* Big Download ZIP Action Button */}
        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadZip}
            disabled={isExportingZip}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            <span>{isExportingZip ? 'Packaging Zip...' : 'Download Complete Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Architecture (Separated Build & Release Jobs) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" /> GitHub Actions Dual-Job Pipeline Architecture
          </h2>
          <span className="text-xs text-slate-400">Same workflow file &bull; 2 separated jobs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Stage 1: Trigger */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1: Trigger</span>
              <Tag className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Push Tag or Manual Click</div>
              <p className="text-xs text-slate-400 mt-1">
                Triggers when pushing a release tag (<code className="text-amber-300">git tag v1.0.0</code>) or clicking <span className="text-slate-300">"Run workflow"</span> in GitHub Actions UI.
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              on: push: tags: [&apos;v*&apos;]
            </div>
          </div>

          {/* Stage 2: Job 1 - Build */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-sky-500/30 flex flex-col justify-between space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Job 1: build</span>
              <Package className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Windows Runner Compilation</div>
              <p className="text-xs text-slate-400 mt-1">
                Runs on <code className="text-sky-300">windows-latest</code>. Packages NSIS Installer <code className="text-sky-300">.exe</code>, Portable <code className="text-sky-300">.exe</code>, and <code className="text-sky-300">.zip</code>.
              </p>
            </div>
            <div className="text-[11px] font-mono text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
              runs-on: windows-latest
            </div>
          </div>

          {/* Stage 3: Job 2 - Release */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Job 2: release</span>
              <Boxes className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Publish to GitHub Releases Tab</div>
              <p className="text-xs text-slate-400 mt-1">
                Executes with <code className="text-emerald-300">needs: build</code>. Computes SHA256 hashes and creates release assets in your repo&apos;s Releases tab.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              uses: softprops/action-gh-release@v2
            </div>
          </div>
        </div>

        {/* Feature Explanations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {GITHUB_WORKFLOW_EXPLANATION.map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-xs font-semibold text-sky-300 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> {item.title}
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Viewer & File Explorer */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Sidebar: File Tabs */}
        <div className="w-full md:w-72 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-2 shrink-0">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
            Windows Project Files
          </div>
          <div className="space-y-1">
            {Object.entries(filesMap).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setSelectedFile(key)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  selectedFile === key
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0 text-slate-400" />
                <div className="truncate flex-1">
                  <div className="truncate font-semibold text-slate-200">{item.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{item.filename}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={handleDownloadZip}
              disabled={isExportingZip}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4 text-sky-400" /> Download All as ZIP
            </button>
          </div>
        </div>

        {/* Right Pane: Code Display */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/95">
          {/* File Header */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-sky-400 font-semibold">
                {currentFile.filename}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {currentFile.lang}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>

          {/* Syntax Highlighted Box */}
          <div className="p-5 overflow-auto max-h-[540px] font-mono text-xs leading-relaxed text-slate-300">
            <pre className="whitespace-pre overflow-x-auto selection:bg-sky-500/30">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* 3-Step Setup Instructions Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" /> How to Deploy to GitHub &amp; Trigger Releases (Quickstart)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
              1
            </div>
            <div className="text-sm font-semibold text-slate-200">Push to GitHub</div>
            <p className="text-xs text-slate-400">
              Download the ZIP, extract it, and push to a new GitHub repo:
            </p>
            <div className="bg-slate-900 p-2 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto">
              git init &amp;&amp; git add .<br />
              git commit -m &quot;Initial WinGemini commit&quot;<br />
              git remote add origin &lt;repo-url&gt;<br />
              git push -u origin main
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
              2
            </div>
            <div className="text-sm font-semibold text-slate-200">Trigger the Build</div>
            <p className="text-xs text-slate-400">
              Push a release tag to start the build &amp; release workflow automatically:
            </p>
            <div className="bg-slate-900 p-2 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto">
              git tag v1.0.0<br />
              git push origin v1.0.0<br />
              # Or click &quot;Run workflow&quot; in Actions tab
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
              3
            </div>
            <div className="text-sm font-semibold text-slate-200">Download from Releases Tab</div>
            <p className="text-xs text-slate-400">
              Once the workflow finishes, check your GitHub repository <strong>Releases</strong> tab:
            </p>
            <div className="bg-slate-900 p-2 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto">
              ✓ WinGemini-Setup-1.0.0.exe<br />
              ✓ WinGemini-Portable-1.0.0.exe<br />
              ✓ WinGemini-1.0.0-win.zip
            </div>
          </div>
        </div>

        {/* GitHub Permission Reminder */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong>GitHub Actions Release Permission:</strong> In your GitHub repository, ensure you have enabled read and write permissions under <em>Settings &gt; Actions &gt; General &gt; Workflow permissions &gt; Read and write permissions</em> so the release job can upload binaries to your Releases tab.
          </div>
        </div>
      </div>

    </div>
  );
};
