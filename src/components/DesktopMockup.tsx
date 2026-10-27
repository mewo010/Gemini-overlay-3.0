import React, { useState } from 'react';
import {
  Code,
  Globe,
  Terminal,
  Sparkles,
  Search,
  Wifi,
  Volume2,
  Battery,
  Monitor,
  Maximize2,
  Minus,
  X,
  Play,
  FileCode,
  Layers,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { MockDesktopWindow } from '../types';

interface DesktopMockupProps {
  onToggleOverlay: () => void;
  isOverlayOpen: boolean;
  onSelectScreenPreset: (dataUrl: string, description: string) => void;
  onCaptureRealScreen: () => void;
  globalHotkey: string;
}

export const DesktopMockup: React.FC<DesktopMockupProps> = ({
  onToggleOverlay,
  isOverlayOpen,
  onSelectScreenPreset,
  onCaptureRealScreen,
  globalHotkey,
}) => {
  const [activeWindow, setActiveWindow] = useState<'code' | 'browser' | 'terminal'>('code');
  const [currentTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Simulated screenshots as stylized SVG data URLs for instant offline fidelity
  const mockScreens = {
    code: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%231e1e1e"/><rect width="800" height="30" fill="%23252526"/><circle cx="20" cy="15" r="5" fill="%23ff5f56"/><circle cx="35" cy="15" r="5" fill="%23ffbd2e"/><circle cx="50" cy="15" r="5" fill="%2327c93f"/><text x="80" y="20" fill="%23cccccc" font-family="monospace" font-size="12">src/auth/session.ts - Visual Studio Code</text><text x="40" y="70" fill="%23e06c75" font-family="monospace" font-size="14">import</text><text x="90" y="70" fill="%23abb2bf" font-family="monospace" font-size="14">{ GoogleGenAI } from '@google/genai';</text><text x="40" y="100" fill="%23c678dd" font-family="monospace" font-size="14">export async function</text><text x="210" y="100" fill="%2361afef" font-family="monospace" font-size="14">initSession</text><text x="300" y="100" fill="%23abb2bf" font-family="monospace" font-size="14">() {</text><text x="60" y="130" fill="%23e5c07b" font-family="monospace" font-size="14">  const token = await fetchAuthToken();</text><text x="60" y="160" fill="%23e06c75" font-family="monospace" font-size="14">  // ERROR: Unhandled promise rejection on undefined key</text><text x="60" y="190" fill="%23abb2bf" font-family="monospace" font-size="14">  if (!token.secretKey) {</text><text x="80" y="220" fill="%23d19a66" font-family="monospace" font-size="14">    throw new Error('Missing authentication secret');</text><text x="60" y="250" fill="%23abb2bf" font-family="monospace" font-size="14">  }</text><text x="40" y="280" fill="%23abb2bf" font-family="monospace" font-size="14">}</text></svg>`,
    browser: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%230f172a"/><rect width="800" height="40" fill="%231e293b"/><text x="40" y="25" fill="%2338bdf8" font-family="sans-serif" font-size="14">Edge Browser - AI Compute Architecture Report 2026</text><text x="40" y="90" fill="%23f8fafc" font-family="sans-serif" font-weight="bold" font-size="20">Quarterly Breakthroughs in Multimodal Edge Reasoning</text><text x="40" y="130" fill="%2394a3b8" font-family="sans-serif" font-size="14">Key Findings: Windows on-device desktop overlays increase developer focus by 42%.</text><rect x="40" y="160" width="340" height="180" rx="8" fill="%231e293b"/><text x="60" y="200" fill="%2338bdf8" font-family="sans-serif" font-size="16">Model Latency Comparison:</text><text x="60" y="240" fill="%23cbd5e1" font-family="monospace" font-size="13">Gemini 3.8 Flash: 140ms (Fastest)</text><text x="60" y="270" fill="%23cbd5e1" font-family="monospace" font-size="13">DeepSeek R1: 420ms (Reasoning)</text><text x="60" y="300" fill="%23cbd5e1" font-family="monospace" font-size="13">GPT-4o: 310ms (General)</text></svg>`,
    terminal: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%230c0c0c"/><rect width="800" height="30" fill="%231f1f1f"/><text x="20" y="20" fill="%23cccccc" font-family="monospace" font-size="12">PowerShell - WinGemini Build Environment</text><text x="20" y="70" fill="%2322c55e" font-family="monospace" font-size="13">PS C:\\Users\\Developer\\wingemini> npm run package:win</text><text x="20" y="110" fill="%2394a3b8" font-family="monospace" font-size="13">> vite build</text><text x="20" y="140" fill="%2394a3b8" font-family="monospace" font-size="13">✓ built in 640ms</text><text x="20" y="180" fill="%2394a3b8" font-family="monospace" font-size="13">> electron-builder --win --x64</text><text x="20" y="210" fill="%2338bdf8" font-family="monospace" font-size="13">  • building target=nsis file=dist_electron/WinGemini-Setup-1.0.0.exe</text><text x="20" y="240" fill="%2338bdf8" font-family="monospace" font-size="13">  • building target=portable file=dist_electron/WinGemini-Portable-1.0.0.exe</text><text x="20" y="270" fill="%2338bdf8" font-family="monospace" font-size="13">  • building target=zip file=dist_electron/WinGemini-1.0.0-win.zip</text><text x="20" y="310" fill="%2322c55e" font-family="monospace" font-size="13">✓ Packaging completed successfully with 0 errors.</text></svg>`,
  };

  const selectScenario = (type: 'code' | 'browser' | 'terminal') => {
    setActiveWindow(type);
    const desc =
      type === 'code'
        ? 'TypeScript code in VS Code with unhandled promise rejection error'
        : type === 'browser'
        ? 'Edge browser showing AI latency benchmark report'
        : 'Windows PowerShell showing electron-builder packaging logs';
    onSelectScreenPreset(mockScreens[type], desc);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-slate-950 select-none">
      
      {/* Top Windows Simulation Control Bar */}
      <div className="z-30 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 font-medium border border-sky-500/20">
            <Monitor className="w-3.5 h-3.5" /> Windows 11 Desktop Simulator
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Trigger with shortcut <kbd className="font-mono bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded border border-slate-700">{globalHotkey}</kbd> or the floating pill
          </span>
        </div>

        {/* Quick Screen Scenarios & Real Capture */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] hidden md:inline">Test Screen Vision:</span>
          <button
            onClick={() => selectScenario('code')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeWindow === 'code'
                ? 'bg-sky-500 text-white font-medium shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> VS Code Error
          </button>
          <button
            onClick={() => selectScenario('browser')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeWindow === 'browser'
                ? 'bg-sky-500 text-white font-medium shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Browser Report
          </button>
          <button
            onClick={() => selectScenario('terminal')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeWindow === 'terminal'
                ? 'bg-sky-500 text-white font-medium shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Build Logs
          </button>

          {/* Real Display Capture button */}
          <button
            onClick={onCaptureRealScreen}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity ml-1"
            title="Use browser screen capture to analyze your actual Windows screen"
          >
            <Camera className="w-3.5 h-3.5" /> Capture Real Screen
          </button>
        </div>
      </div>

      {/* Realistic Windows Desktop Wallpaper & Active Mock Window */}
      <div
        className="relative flex-1 p-6 flex items-center justify-center overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.95)), linear-gradient(135deg, #020617 0%, #0f172a 50%, #030712 100%)',
        }}
      >
        {/* Subtle Windows Bloom light texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] pointer-events-none" />

        {/* Windows Desktop Icons on left */}
        <div className="absolute top-8 left-8 flex flex-col gap-6 text-center text-slate-300 text-xs">
          <div
            onClick={() => selectScenario('code')}
            className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-colors w-20 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Code className="w-6 h-6 text-sky-400" />
            </div>
            <span className="text-[11px] drop-shadow">VS Code</span>
          </div>

          <div
            onClick={() => selectScenario('browser')}
            className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-colors w-20 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6 text-cyan-300" />
            </div>
            <span className="text-[11px] drop-shadow">Microsoft Edge</span>
          </div>

          <div
            onClick={() => selectScenario('terminal')}
            className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-colors w-20 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Terminal className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[11px] drop-shadow">PowerShell</span>
          </div>
        </div>

        {/* The Active Desktop App Window */}
        <div className="w-full max-w-3xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
          
          {/* App Window Titlebar */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeWindow === 'code' && <Code className="w-4 h-4 text-sky-400" />}
              {activeWindow === 'browser' && <Globe className="w-4 h-4 text-cyan-400" />}
              {activeWindow === 'terminal' && <Terminal className="w-4 h-4 text-emerald-400" />}
              <span className="text-xs font-medium text-slate-200">
                {activeWindow === 'code' && 'Visual Studio Code — src/auth/session.ts'}
                {activeWindow === 'browser' && 'Microsoft Edge — AI Compute Architecture Report'}
                {activeWindow === 'terminal' && 'Windows PowerShell — WinGemini Build Pipeline'}
              </span>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-1 hover:bg-slate-800 rounded">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 hover:bg-slate-800 rounded">
                <Maximize2 className="w-3 h-3" />
              </button>
              <button className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* App Content */}
          <div className="p-5 font-mono text-xs overflow-auto max-h-[380px]">
            {activeWindow === 'code' && (
              <div className="space-y-1.5 text-slate-300">
                <div className="text-slate-500 pb-2">
                  // You can summon WinGemini [Alt+Space] and click "Ask about screen" to debug this error!
                </div>
                <div>
                  <span className="text-purple-400">import</span> {'{ GoogleGenAI }'}{' '}
                  <span className="text-purple-400">from</span>{' '}
                  <span className="text-emerald-400">'@google/genai'</span>;
                </div>
                <div>
                  <span className="text-purple-400">import</span> {'{ getSecretKey }'}{' '}
                  <span className="text-purple-400">from</span>{' '}
                  <span className="text-emerald-400">'./vault'</span>;
                </div>
                <div className="pt-2">
                  <span className="text-purple-400">export async function</span>{' '}
                  <span className="text-blue-400">verifySession</span>(
                  <span className="text-amber-300">userId: string</span>) {'{'}
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">const</span> token ={' '}
                  <span className="text-purple-400">await</span> fetchAuthToken(userId);
                </div>
                <div className="pl-4 bg-red-500/10 border-l-2 border-red-500 py-1 text-red-300">
                  <span className="text-slate-500">// Line 14: Potential crash bug below</span>
                  <br />
                  <span className="text-purple-400">if</span> (!token.secretKey) {'{'}
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">throw new</span>{' '}
                  <span className="text-amber-300">Error</span>(
                  <span className="text-emerald-400">'Auth token invalid: missing secretKey'</span>);
                  <br />
                  {'}'}
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">return</span> {'{'}{' '}
                  <span className="text-sky-300">status: 'authenticated'</span>, token {'}'};
                </div>
                <div>{'}'}</div>
              </div>
            )}

            {activeWindow === 'browser' && (
              <div className="font-sans space-y-4 text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-sm font-semibold text-white">
                    2026 Developer Productivity & AI Overlay Impact Report
                  </div>
                  <span className="text-[11px] text-sky-400">Verified Benchmarks</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mobile-style floating AI overlays on desktop systems (such as Windows 11) reduce context switching by 68% compared to opening browser tabs or dedicated separate chat windows.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-lg font-bold text-sky-400">140ms</div>
                    <div className="text-[10px] text-slate-400">Gemini 3.8 Flash Latency</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-lg font-bold text-indigo-400">Alt+Space</div>
                    <div className="text-[10px] text-slate-400">Instant Global Hotkey</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-lg font-bold text-emerald-400">100%</div>
                    <div className="text-[10px] text-slate-400">Offline GitHub Actions Ready</div>
                  </div>
                </div>
              </div>
            )}

            {activeWindow === 'terminal' && (
              <div className="space-y-1.5 text-slate-300 font-mono text-xs">
                <div className="text-emerald-400">
                  PS C:\Users\Developer\wingemini&gt; npm run package:win
                </div>
                <div className="text-slate-400">&gt; wingemini@1.0.0 package:win</div>
                <div className="text-slate-400">&gt; vite build &amp;&amp; electron-builder --win --x64</div>
                <div className="text-emerald-300">✓ 42 modules transformed.</div>
                <div className="text-slate-400">dist/index.html &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.62 kB</div>
                <div className="text-slate-400">dist/assets/index.js &nbsp;&nbsp;184.20 kB</div>
                <div className="text-sky-400 pt-1">
                  • electron-builder version=25.1.8 os=10.0.22631
                </div>
                <div className="text-sky-400">
                  • packaging platform=win32 arch=x64 target=nsis,portable,zip
                </div>
                <div className="text-slate-300">
                  • building target=nsis file=dist_electron/WinGemini-Setup-1.0.0.exe
                </div>
                <div className="text-slate-300">
                  • building target=portable file=dist_electron/WinGemini-Portable-1.0.0.exe
                </div>
                <div className="text-slate-300">
                  • building target=zip file=dist_electron/WinGemini-1.0.0-win.zip
                </div>
                <div className="text-emerald-400 pt-2 font-bold">
                  ✓ SUCCESS: All Windows binaries built and ready for GitHub Actions Release!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Realistic Windows 11 Taskbar */}
      <div className="z-30 h-12 bg-slate-900/85 backdrop-blur-2xl border-t border-slate-800/80 px-4 flex items-center justify-between">
        
        {/* Left Side: Widgets / Weather */}
        <div className="flex items-center gap-2 text-slate-300 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors">
            <span className="text-amber-400 font-medium">72°F</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">Sunny</span>
          </div>
        </div>

        {/* Center: Windows 11 Taskbar Apps */}
        <div className="flex items-center gap-1">
          {/* Windows Start Button */}
          <button
            className="p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
            title="Start Menu"
          >
            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
              <span className="bg-sky-400 rounded-sm" />
              <span className="bg-sky-400 rounded-sm" />
              <span className="bg-sky-400 rounded-sm" />
              <span className="bg-sky-400 rounded-sm" />
            </div>
          </button>

          {/* Search Button */}
          <button
            className="p-2 rounded-xl hover:bg-slate-800/80 text-slate-300 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* VS Code */}
          <button
            onClick={() => selectScenario('code')}
            className={`p-2 rounded-xl transition-all relative ${
              activeWindow === 'code' ? 'bg-slate-800/90 text-sky-400 shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
            title="Visual Studio Code"
          >
            <Code className="w-4 h-4" />
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-sky-400 rounded-full" />
          </button>

          {/* Edge */}
          <button
            onClick={() => selectScenario('browser')}
            className={`p-2 rounded-xl transition-all relative ${
              activeWindow === 'browser' ? 'bg-slate-800/90 text-cyan-400 shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
            title="Microsoft Edge"
          >
            <Globe className="w-4 h-4" />
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-cyan-400 rounded-full" />
          </button>

          {/* Terminal */}
          <button
            onClick={() => selectScenario('terminal')}
            className={`p-2 rounded-xl transition-all relative ${
              activeWindow === 'terminal' ? 'bg-slate-800/90 text-emerald-400 shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
            title="PowerShell"
          >
            <Terminal className="w-4 h-4" />
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-emerald-400 rounded-full" />
          </button>

          {/* WinGemini Taskbar Trigger Icon */}
          <button
            onClick={onToggleOverlay}
            className={`p-2 rounded-xl transition-all relative ${
              isOverlayOpen
                ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-400 border border-sky-500/30'
                : 'hover:bg-slate-800 text-sky-400'
            }`}
            title={`Toggle WinGemini Overlay [${globalHotkey}]`}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-gradient-to-r from-sky-400 to-pink-500 rounded-full" />
          </button>
        </div>

        {/* Right: Windows System Tray & Clock */}
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          {/* WinGemini Tray Icon */}
          <button
            onClick={onToggleOverlay}
            className="p-1 rounded-lg hover:bg-slate-800 text-sky-400 transition-colors"
            title="WinGemini System Tray Icon - Click to toggle"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800/80 cursor-pointer">
            <Wifi className="w-3.5 h-3.5" />
            <Volume2 className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>

          <div className="px-2 py-1 rounded-lg hover:bg-slate-800/80 cursor-pointer text-slate-300 text-right text-[11px] font-sans">
            <div>{currentTime}</div>
            <div className="text-[10px] text-slate-400">Windows 11</div>
          </div>
        </div>

      </div>
    </div>
  );
};
