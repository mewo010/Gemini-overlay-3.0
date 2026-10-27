import React from 'react';
import {
  Sparkles,
  Monitor,
  FolderGit2,
  Settings,
  Download,
  Keyboard,
  Boxes,
} from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderNavProps {
  currentTab: 'simulator' | 'github';
  onSelectTab: (tab: 'simulator' | 'github') => void;
  onOpenSettings: () => void;
  onDownloadZip: () => void;
  settings: AppSettings;
  onToggleOverlay: () => void;
  isOverlayOpen: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onDownloadZip,
  settings,
  onToggleOverlay,
  isOverlayOpen,
}) => {
  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-40 select-none">
      
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 p-[1.5px] flex items-center justify-center shadow-lg">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base tracking-tight">WinGemini</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Windows Overlay
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Android-Style AI Floating Assistant for Windows 11/10
          </span>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <div className="flex items-center bg-slate-950/70 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => onSelectTab('simulator')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentTab === 'simulator'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop Simulator</span>
        </button>

        <button
          onClick={() => onSelectTab('github')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentTab === 'github'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>GitHub CI/CD &amp; Exporter</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-400/20 text-emerald-300">
            .EXE
          </span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Summon Overlay Trigger */}
        <button
          onClick={onToggleOverlay}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            isOverlayOpen
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border-slate-700'
          }`}
          title="Summon WinGemini overlay"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>{isOverlayOpen ? 'Overlay Open' : 'Summon Overlay'}</span>
          <kbd className="font-mono text-[10px] bg-slate-900 px-1 rounded text-slate-400 border border-slate-750">
            {settings.globalHotkey}
          </kbd>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title="Open Settings (API Keys, Hotkeys, Overlay Style)"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Download Source Button */}
        <button
          onClick={onDownloadZip}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          title="Download turnkey Windows desktop project as a ZIP bundle"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download .zip</span>
        </button>
      </div>

    </header>
  );
};
