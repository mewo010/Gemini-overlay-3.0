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
  HelpCircle,
  Play,
  FolderTree,
  Settings2,
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
  const [showTroubleshooter, setShowTroubleshooter] = useState(true);

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

      {/* ACTION DIDN'T START? TROUBLESHOOTING & INSTANT FIX PANEL */}
      <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Why Action Didn&apos;t Start &amp; How to Fix It
              </h2>
              <p className="text-xs text-amber-300/80">
                Follow these 4 quick checks to make GitHub start the workflow immediately
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTroubleshooter(!showTroubleshooter)}
            className="text-xs text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20"
          >
            {showTroubleshooter ? 'Hide Checklist' : 'Show Checklist'}
          </button>
        </div>

        {showTroubleshooter && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Fix 1: Trigger with a Version Tag */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> 1. Push a Version Tag (Immediate Trigger)
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                  Most Common
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you only ran <code className="text-sky-300 font-mono">git push origin main</code>, GitHub may not have started the release because it waits for a release tag. Run this command to tag your commit and push it now:
              </p>
              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
                <span className="truncate">git tag v1.0.0 &amp;&amp; git push origin v1.0.0</span>
                <button
                  onClick={() => handleCopyCode('git tag v1.0.0 && git push origin v1.0.0', 'tag-cmd')}
                  className="ml-2 text-slate-400 hover:text-white shrink-0"
                  title="Copy command"
                >
                  {copiedSnippet === 'tag-cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Fix 2: Run via GitHub Actions UI Button */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                  <Play className="w-4 h-4" /> 2. Manual One-Click Trigger in GitHub UI
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300">
                  No Terminal Needed
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our workflow supports <code className="text-sky-300 font-mono">workflow_dispatch</code>. You can start it right from your browser:
              </p>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                <li>Go to your GitHub repository and click the <strong>Actions</strong> tab.</li>
                <li>In the left sidebar, click <strong>"Build &amp; Release Windows App"</strong>.</li>
                <li>Click the <strong className="text-sky-300">"Run workflow"</strong> dropdown button on the right.</li>
                <li>Leave inputs as default and click the green <strong>Run workflow</strong> button!</li>
              </ol>
            </div>

            {/* Fix 3: Check File Location */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4" /> 3. Check Exact Workflow File Path
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                  File Structure
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                GitHub will <em>completely ignore</em> the workflow if it is not in the exact folder path at the root of your repo. Make sure the file is located at:
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-sky-300 flex items-center justify-between">
                <span className="truncate">.github/workflows/build-and-release.yml</span>
                <button
                  onClick={() => handleCopyCode('.github/workflows/build-and-release.yml', 'path-str')}
                  className="ml-2 text-slate-400 hover:text-white shrink-0"
                >
                  {copiedSnippet === 'path-str' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                (Note the leading dot in <code>.github</code>. If you unzipped into a nested folder, move the files to the root.)
              </p>
            </div>

            {/* Fix 4: Check GitHub Actions Permissions */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4" /> 4. Enable Actions &amp; Write Permissions
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                  Repo Settings
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                On some new GitHub accounts, Actions are disabled or read-only by default:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li>Go to <strong>Settings</strong> &gt; <strong>Actions</strong> &gt; <strong>General</strong> in your repo.</li>
                <li>Under <em>Actions permissions</em>, select <strong>"Allow all actions and reusable workflows"</strong>.</li>
                <li>Under <em>Workflow permissions</em>, select <strong>"Read and write permissions"</strong> and click <strong>Save</strong>.</li>
              </ul>
            </div>

          </div>
        )}
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
              <div className="text-sm font-semibold text-white">Push to Main, Tag, or Manual Click</div>
              <p className="text-xs text-slate-400 mt-1">
                Triggers automatically whenever you push to <code className="text-sky-300">main</code>, push a tag (<code className="text-amber-300">v1.0.0</code>), or click <span className="text-slate-300">"Run workflow"</span> in GitHub.
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              on: push: branches: [main] &amp; tags: [&apos;v*&apos;]
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
          <Terminal className="w-4 h-4 text-sky-400" /> Fast Terminal Commands to Push &amp; Trigger Build
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
              1
            </div>
            <div className="text-sm font-semibold text-slate-200">Push to GitHub Main</div>
            <p className="text-xs text-slate-400">
              Extract the zip and commit to your repo:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto space-y-1">
              <div>git init</div>
              <div>git add .</div>
              <div>git commit -m &quot;feat: wingemini overlay&quot;</div>
              <div>git branch -M main</div>
              <div>git remote add origin &lt;YOUR-REPO-URL&gt;</div>
              <div className="text-sky-300">git push -u origin main</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
              2
            </div>
            <div className="text-sm font-semibold text-slate-200">Push Tag to Trigger Release</div>
            <p className="text-xs text-slate-400">
              Push a tag to trigger the automatic release creation:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto space-y-1">
              <div>git tag v1.0.0</div>
              <div>git push origin v1.0.0</div>
              <div className="text-slate-500 pt-1"># Or click "Run workflow" in Actions</div>
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
