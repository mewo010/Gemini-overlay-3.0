import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  FileCode,
  FolderGit2,
  Tag,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Boxes,
  Terminal,
  AlertTriangle,
  Play,
  FolderTree,
  Settings2,
  Zap,
  Globe,
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
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
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

  const handleCopyCode = (text?: string, id?: string) => {
    const code = text || currentFile.content;
    navigator.clipboard.writeText(code);
    if (id) {
      setCopiedSnippet(id);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } else {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
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
              Windows .EXE &amp; .ZIP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Build &amp; Release to GitHub in One Workflow
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
            <span>{isExportingZip ? 'Packaging Zip...' : 'Download Updated Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* WHY ACTION DIDN'T START AUTO - ROOT CAUSE & INSTANT 1-MINUTE FIX */}
      <div className="p-6 rounded-3xl bg-amber-950/40 border border-amber-500/40 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Why It Didn&apos;t Start Auto &amp; The 3-Step Instant Fix
            </h2>
            <p className="text-xs text-amber-200/90 mt-0.5">
              Follow these exact steps — one of these 3 is the exact reason GitHub blocked the automatic run.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Diagnostic Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Check #1: GitHub Button
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  Most Common!
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                &quot;Enable Workflows&quot; Banner on GitHub
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                On newly created or imported repos, GitHub <strong>disables all automatic workflows</strong> until you manually approve them once!
              </p>
              <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div>1. Go to your repo on <strong>github.com</strong></div>
                <div>2. Click the <strong>Actions</strong> tab</div>
                <div className="text-emerald-400 font-semibold">
                  3. If you see a green button saying &quot;Enable Actions&quot; or &quot;I understand my workflows, go ahead and enable them&quot;, CLICK IT!
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Until you click that button once, GitHub will reject every automatic push trigger.
            </div>
          </div>

          {/* Diagnostic Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Check #2: Verify Git Tracked
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">
                  Terminal Fix
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Did Git Actually Upload .github?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                On Windows, folders with leading dots like <code className="text-sky-300 font-mono">.github</code> are hidden, so <code className="text-sky-300 font-mono">git add .</code> sometimes skipped it!
              </p>
              <p className="text-xs text-slate-400 mt-1">Run this check in your terminal:</p>
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs font-mono text-sky-300">
                <span className="truncate">git ls-files .github/workflows/</span>
                <button
                  onClick={() => handleCopyCode('git ls-files .github/workflows/', 'ls-check')}
                  className="ml-2 text-slate-400 hover:text-white shrink-0"
                >
                  {copiedSnippet === 'ls-check' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-amber-300 mt-1">
                If empty, run: <code className="text-emerald-400 font-mono">git add -f .github/ &amp;&amp; git commit -m &quot;add workflow&quot; &amp;&amp; git push</code>
              </p>
            </div>
            <button
              onClick={() => handleCopyCode('git add -f .github/ && git commit -m "feat: add workflow" && git push', 'force-add')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5"
            >
              {copiedSnippet === 'force-add' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Force-Add Command</span>
            </button>
          </div>

          {/* Diagnostic Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Check #3: 100% Guaranteed Fix
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Web Direct
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Add Directly via GitHub Web UI
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                If terminal pushing is giving issues, adding the file on github.com works 100% of the time:
              </p>
              <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside mt-1.5">
                <li>On your GitHub repo, click <strong>Add file</strong> &gt; <strong>Create new file</strong>.</li>
                <li>In name box type: <code className="text-emerald-300 font-mono">.github/workflows/build-and-release.yml</code></li>
                <li>Copy the workflow code below &amp; paste it in.</li>
                <li>Click <strong>Commit changes</strong>!</li>
              </ol>
            </div>
            <button
              onClick={() => handleCopyCode(GITHUB_WORKFLOW_YML, 'full-wf')}
              className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow"
            >
              {copiedSnippet === 'full-wf' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Workflow YAML for GitHub UI</span>
            </button>
          </div>

        </div>

        {/* Updated Trigger Notice */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              <strong>Updated Workflow Trigger:</strong> Changed to <code className="text-sky-300 font-mono">on: push</code> unconditionally so ANY commit on ANY branch auto-triggers immediately!
            </span>
          </div>
          <button
            onClick={handleDownloadZip}
            className="text-sky-400 hover:text-sky-300 font-medium underline flex items-center gap-1"
          >
            Download updated ZIP <Download className="w-3.5 h-3.5" />
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
              <div className="text-sm font-semibold text-white">Unconditional Push or Manual</div>
              <p className="text-xs text-slate-400 mt-1">
                Triggers automatically whenever you push code or tags, or click <span className="text-slate-300">&quot;Run workflow&quot;</span> in GitHub.
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              on: push
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
                Runs on <code className="text-sky-300">windows-latest</code>. Compiles React and packages NSIS Installer <code className="text-sky-300">.exe</code>, Portable <code className="text-sky-300">.exe</code>, and <code className="text-sky-300">.zip</code>.
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
              onClick={() => handleCopyCode()}
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
          <Terminal className="w-4 h-4 text-sky-400" /> Terminal Commands Reference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
              1
            </div>
            <div className="text-sm font-semibold text-slate-200">Push to GitHub Main</div>
            <p className="text-xs text-slate-400">
              Commit the project to your repo:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto space-y-1">
              <div>git init</div>
              <div>git add -f .github/</div>
              <div>git add .</div>
              <div>git commit -m &quot;feat: wingemini&quot;</div>
              <div>git branch -M main</div>
              <div className="text-sky-300">git push -u origin main</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
              2
            </div>
            <div className="text-sm font-semibold text-slate-200">Automatic Execution</div>
            <p className="text-xs text-slate-400">
              With <code className="text-sky-300 font-mono">on: push</code>, GitHub starts the build job right away:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto space-y-1">
              <div>Job 1: build (windows-latest)</div>
              <div>Job 2: release (ubuntu-latest)</div>
              <div className="text-slate-400 pt-1">Takes ~3 minutes to compile</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
              3
            </div>
            <div className="text-sm font-semibold text-slate-200">Download from Releases Tab</div>
            <p className="text-xs text-slate-400">
              Under your repository&apos;s <strong>Releases</strong> tab:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto space-y-1">
              <div>✓ WinGemini-Setup-1.0.0.exe</div>
              <div>✓ WinGemini-Portable-1.0.0.exe</div>
              <div>✓ WinGemini-1.0.0-win.zip</div>
              <div>✓ SHA256SUMS.txt</div>
            </div>
          </div>
        </div>

        {/* GitHub Permission Reminder */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong>Important GitHub Permission:</strong> In your GitHub repository, make sure you enable <strong>Read and write permissions</strong> under <em>Settings &gt; Actions &gt; General &gt; Workflow permissions</em> so that the release job has permission to upload binary files to the Releases tab!
          </div>
        </div>
      </div>

    </div>
  );
};
