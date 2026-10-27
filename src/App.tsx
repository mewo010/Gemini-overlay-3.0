import React, { useState, useEffect, useCallback } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { DesktopMockup } from './components/DesktopMockup';
import { GeminiOverlay } from './components/GeminiOverlay';
import { SettingsModal } from './components/SettingsModal';
import { GitHubWorkflowStudio } from './components/GitHubWorkflowStudio';
import { AppSettings, ChatMessage } from './types';
import { DEFAULT_SETTINGS } from './constants/defaultSettings';
import { sendAIMessage } from './utils/aiClient';
import { generateProjectZip, downloadBlob } from './utils/zipGenerator';

export default function App() {
  // Settings with LocalStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('wingemini_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load stored settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [currentTab, setCurrentTab] = useState<'simulator' | 'github'>('simulator');
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeScreenImage, setActiveScreenImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Save settings to localStorage
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('wingemini_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      handleSaveSettings(updated);
      return updated;
    });
  };

  // Play subtle sound effect
  const playChime = useCallback(
    (type: 'open' | 'reply') => {
      if (!settings.soundEffects) return;
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'open') {
          osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.2);
        } else {
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.18); // G5
          gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.25);
        }
      } catch {
        // AudioContext not allowed before user interaction
      }
    },
    [settings.soundEffects]
  );

  // Global Hotkey Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      const hotkey = settings.globalHotkey.toLowerCase();
      const parts = hotkey.split('+');

      const requiresCtrl = parts.includes('ctrl');
      const requiresAlt = parts.includes('alt');
      const requiresShift = parts.includes('shift');
      const requiresMeta = parts.includes('win') || parts.includes('meta');

      const mainKey = parts.find((p) => !['ctrl', 'alt', 'shift', 'win', 'meta'].includes(p));

      const ctrlMatch = requiresCtrl ? e.ctrlKey : !e.ctrlKey;
      const altMatch = requiresAlt ? e.altKey : !e.altKey;
      const shiftMatch = requiresShift ? e.shiftKey : !e.shiftKey;
      const metaMatch = requiresMeta ? e.metaKey : !e.metaKey;

      let keyMatch = false;
      if (mainKey) {
        if (mainKey === 'space' && e.code === 'Space') keyMatch = true;
        else if (e.key.toLowerCase() === mainKey) keyMatch = true;
      }

      if (ctrlMatch && altMatch && shiftMatch && metaMatch && keyMatch) {
        e.preventDefault();
        setIsOverlayOpen((prev) => {
          const next = !prev;
          if (next) playChime('open');
          return next;
        });
        return;
      }

      // Escape to close
      if (e.key === 'Escape' && isOverlayOpen && !isInput) {
        setIsOverlayOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.globalHotkey, isOverlayOpen, playChime]);

  // Handle Preset Screen Selection
  const handleSelectScreenPreset = (dataUrl: string, description: string) => {
    setActiveScreenImage(dataUrl);
    if (!isOverlayOpen) {
      setIsOverlayOpen(true);
      playChime('open');
    }
  };

  // Capture Real Screen using browser getDisplayMedia
  const handleCaptureRealScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'monitor' },
        audio: false,
      });

      const track = stream.getVideoTracks()[0];
      const imageCapture = new (window as any).ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();
      track.stop();

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setActiveScreenImage(dataUrl);
        if (!isOverlayOpen) setIsOverlayOpen(true);
        playChime('open');
      }
    } catch (err) {
      console.warn('Real screen capture was cancelled or denied:', err);
    }
  };

  // Send AI Message
  const handleSendMessage = async (text: string, screenImage?: string | null) => {
    if (!text && !screenImage) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text || (screenImage ? 'Analyze this screen.' : ''),
      timestamp: Date.now(),
      screenshot: screenImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const replyText = await sendAIMessage({
        prompt: text,
        imageBase64: screenImage || undefined,
        settings,
        chatHistory: messages.map((m) => ({ role: m.role as any, content: m.content })),
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
        modelUsed:
          settings.activeProvider === 'gemini'
            ? settings.geminiModel
            : settings.activeProvider === 'openrouter'
            ? settings.openRouterModel
            : settings.activeProvider,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playChime('reply');
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Error: ${error.message || 'Failed to generate response. Please check your API key or model in Settings.'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
      setActiveScreenImage(null); // Clear staged image once sent
    }
  };

  const handleDownloadZip = async () => {
    try {
      const blob = await generateProjectZip();
      downloadBlob(blob, 'WinGemini-Windows-Desktop-App.zip');
    } catch (err) {
      console.error('Failed to create ZIP package:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <HeaderNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onDownloadZip={handleDownloadZip}
        settings={settings}
        onToggleOverlay={() => {
          setIsOverlayOpen((prev) => {
            const next = !prev;
            if (next) playChime('open');
            return next;
          });
        }}
        isOverlayOpen={isOverlayOpen}
      />

      {/* Main Tab Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {currentTab === 'simulator' ? (
          <DesktopMockup
            onToggleOverlay={() => {
              setIsOverlayOpen((prev) => {
                const next = !prev;
                if (next) playChime('open');
                return next;
              });
            }}
            isOverlayOpen={isOverlayOpen}
            onSelectScreenPreset={handleSelectScreenPreset}
            onCaptureRealScreen={handleCaptureRealScreen}
            globalHotkey={settings.globalHotkey}
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <GitHubWorkflowStudio />
          </div>
        )}
      </main>

      {/* Floating Gemini Overlay Component (Always Available) */}
      <GeminiOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onUpdateSettings={handleUpdateSettings}
        activeScreenImage={activeScreenImage}
        onCaptureRealScreen={handleCaptureRealScreen}
        onClearScreenImage={() => setActiveScreenImage(null)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

    </div>
  );
}
