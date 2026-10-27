import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Monitor,
  X,
  Minimize2,
  Maximize2,
  Settings,
  Copy,
  Check,
  ChevronDown,
  Volume2,
  Pin,
  RefreshCw,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { AppSettings, ChatMessage, AIModel } from '../types';
import { AVAILABLE_MODELS, QUICK_PROMPTS } from '../constants/defaultSettings';

interface GeminiOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onOpenSettings: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  activeScreenImage: string | null;
  onCaptureRealScreen: () => void;
  onClearScreenImage: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, screenImage?: string | null) => void;
  isGenerating: boolean;
}

export const GeminiOverlay: React.FC<GeminiOverlayProps> = ({
  isOpen,
  onClose,
  settings,
  onOpenSettings,
  onUpdateSettings,
  activeScreenImage,
  onCaptureRealScreen,
  onClearScreenImage,
  messages,
  onSendMessage,
  isGenerating,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMinimizedPill, setIsMinimizedPill] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimizedPill) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimizedPill]);

  const handleSend = () => {
    if ((!inputText.trim() && !activeScreenImage) || isGenerating) return;
    onSendMessage(inputText.trim(), activeScreenImage);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape' && !isPinned) {
      onClose();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. You can type your query directly.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Determine current active model display name
  const currentModelName = (() => {
    if (settings.activeProvider === 'gemini') {
      return (
        AVAILABLE_MODELS.find((m) => m.id === settings.geminiModel)?.name ||
        settings.geminiModel ||
        'Gemini 3.8 Flash'
      );
    }
    if (settings.activeProvider === 'openrouter') {
      return (
        AVAILABLE_MODELS.find((m) => m.id === settings.openRouterModel)?.name ||
        settings.openRouterModel ||
        'OpenRouter'
      );
    }
    if (settings.activeProvider === 'openai') {
      return settings.openaiModel || 'GPT-4o';
    }
    if (settings.activeProvider === 'groq') {
      return settings.groqModel || 'Groq LPU';
    }
    return settings.customModel || 'Custom AI';
  })();

  if (!isOpen) return null;

  // Minimized floating pill mode (like mobile assistant pill when minimized)
  if (isMinimizedPill) {
    return (
      <div
        className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/95 border border-sky-500/40 shadow-2xl backdrop-blur-xl cursor-pointer hover:border-sky-400 transition-all transform hover:scale-105 group"
        onClick={() => setIsMinimizedPill(false)}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-pink-500 flex items-center justify-center animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-medium text-slate-200">
          Ask WinGemini <span className="text-xs text-sky-400 font-mono">[{settings.globalHotkey}]</span>
        </span>
        <div className="flex items-center gap-1.5 ml-2 border-l border-slate-700/80 pl-2 text-xs text-slate-400">
          <Maximize2 className="w-3.5 h-3.5 group-hover:text-white" />
        </div>
      </div>
    );
  }

  // Positioning styles
  const positionClasses = {
    'bottom-center': 'bottom-12 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-12 right-6',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    floating: 'bottom-16 left-1/2 -translate-x-1/2',
  }[settings.overlayPosition];

  return (
    <div
      className={`fixed ${positionClasses} z-50 w-full max-w-[620px] transition-all duration-200`}
      style={{ opacity: settings.windowOpacity }}
    >
      {/* Outer Glow Wrapper - Mobile Gemini Animated Iridescent Gradient Border */}
      <div className="relative rounded-3xl p-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 shadow-[0_0_40px_rgba(56,189,248,0.25)] animate-gradient-x">
        {/* Main Card Container */}
        <div className="relative rounded-[22px] bg-slate-950/90 backdrop-blur-2xl border border-white/10 overflow-hidden flex flex-col max-h-[82vh] shadow-2xl">
          
          {/* Top Iridescent Ambient Shimmer Line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-sky-400 to-pink-500 opacity-80" />

          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
            {/* Left: Brand & Mobile Style Sparkle */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white tracking-tight">WinGemini</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    Windows Overlay
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Active Model Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-colors"
                title="Change active AI model"
              >
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span className="truncate max-w-[130px]">{currentModelName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Model Dropdown */}
              {showModelPicker && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs backdrop-blur-xl">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Active Model
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          if (model.provider === 'gemini') {
                            onUpdateSettings({ activeProvider: 'gemini', geminiModel: model.id });
                          } else if (model.provider === 'openrouter') {
                            onUpdateSettings({ activeProvider: 'openrouter', openRouterModel: model.id });
                          } else if (model.provider === 'openai') {
                            onUpdateSettings({ activeProvider: 'openai', openaiModel: model.id });
                          } else if (model.provider === 'groq') {
                            onUpdateSettings({ activeProvider: 'groq', groqModel: model.id });
                          }
                          setShowModelPicker(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-800/90 flex items-center justify-between transition-colors group"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-200 group-hover:text-sky-300">
                            {model.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{model.provider.toUpperCase()}</span>
                        </div>
                        {model.isVisionCapable && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Vision
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 px-3 pt-2">
                    <button
                      onClick={() => {
                        setShowModelPicker(false);
                        onOpenSettings();
                      }}
                      className="w-full text-center text-sky-400 hover:text-sky-300 text-xs py-1 flex items-center justify-center gap-1"
                    >
                      Configure API Keys <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Window Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              {/* Hotkey Tag */}
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800/90 text-[10px] font-mono text-slate-400 border border-slate-700 mr-1">
                {settings.globalHotkey}
              </span>

              {/* Pin / Always On Top */}
              <button
                onClick={() => setIsPinned(!isPinned)}
                className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                  isPinned ? 'text-sky-400 bg-sky-500/10' : 'text-slate-400'
                }`}
                title={isPinned ? 'Always on Top (Active)' : 'Pin on Top'}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>

              {/* Minimize to Pill */}
              <button
                onClick={() => setIsMinimizedPill(true)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title="Minimize to Floating Pill"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>

              {/* Settings */}
              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title="Overlay & API Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {/* Close / Dismiss */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors ml-0.5"
                title="Dismiss Overlay [Esc]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[180px] max-h-[460px] text-sm">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 px-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-sky-400" />
                </div>
                <h3 className="text-base font-medium text-slate-100 mb-1">
                  Hi, how can I help with your Windows screen?
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Ask questions, summarize documents, debug code in your editor, or draft messages right over your desktop.
                </p>

                {/* Quick Screen Vision Callout */}
                <div className="w-full bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Screen Context Ready</div>
                      <div className="text-[11px] text-slate-400">
                        Ask about the current active window or capture your full screen.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onCaptureRealScreen}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-colors"
                  >
                    Capture Real Screen
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  } group`}
                >
                  {/* Sender badge */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                    {msg.role === 'user' ? (
                      <span>You</span>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-sky-400" />
                        <span className="font-medium text-slate-300">WinGemini</span>
                        {msg.modelUsed && (
                          <span className="text-[10px] text-slate-400">({msg.modelUsed})</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`relative rounded-2xl px-4 py-2.5 max-w-[90%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {/* Attached Screen Thumbnail */}
                    {msg.screenshot && (
                      <div className="mb-2.5 rounded-lg overflow-hidden border border-white/20 bg-black/40">
                        <img
                          src={msg.screenshot}
                          alt="Screen Context"
                          className="max-h-36 w-full object-cover"
                        />
                        <div className="px-2 py-1 bg-slate-950/80 text-[10px] text-slate-300 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3 h-3 text-sky-400" /> Attached Screen Context
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Text Message */}
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {msg.content}
                    </div>

                    {/* Copy Button for Assistant */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-slate-200 flex items-center gap-1 transition-colors"
                          title="Copy reply to clipboard"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Shimmering Loading Animation */}
            {isGenerating && (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping delay-100" />
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping delay-200" />
                    <span className="text-xs text-slate-400 ml-1">WinGemini is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attached Screen Context Pill (if staged) */}
          {activeScreenImage && (
            <div className="mx-4 mb-2 p-2 rounded-xl bg-slate-900/90 border border-sky-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={activeScreenImage}
                  alt="Captured Screen"
                  className="w-12 h-8 rounded object-cover border border-slate-700 shrink-0"
                />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-medium text-sky-300 truncate flex items-center gap-1">
                    <Monitor className="w-3 h-3" /> Desktop Screen Staged
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    Ready to send with your question
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onCaptureRealScreen}
                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                  title="Re-capture screen"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClearScreenImage}
                  className="p-1 rounded text-slate-400 hover:text-red-400"
                  title="Remove screen context"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Prompt Chips (Mobile Gemini Style) */}
          <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-850 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {/* Screen Context Quick Trigger Button */}
            <button
              onClick={() => {
                if (!activeScreenImage) {
                  onCaptureRealScreen();
                } else {
                  onSendMessage('Summarize what is currently displayed on this screen in 3 clear bullet points.', activeScreenImage);
                }
              }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 font-medium transition-colors"
            >
              <Monitor className="w-3 h-3 text-sky-400" />
              Ask about screen
            </button>

            {QUICK_PROMPTS.map((qp, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(qp.prompt, activeScreenImage)}
                disabled={isGenerating}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors text-[11px]"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Prompt Input Section */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            <div className="relative flex items-center bg-slate-950/80 rounded-2xl border border-slate-700/80 focus-within:border-sky-500/70 focus-within:ring-1 focus-within:ring-sky-500/40 transition-all px-2 py-1">
              {/* Screen Capture button */}
              <button
                type="button"
                onClick={onCaptureRealScreen}
                className="p-2 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                title="Capture screen for vision analysis"
              >
                <Monitor className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeScreenImage
                    ? 'Ask anything about this screen...'
                    : 'Ask WinGemini or type a command...'
                }
                disabled={isGenerating}
                className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-2 py-2 focus:outline-none"
              />

              {/* Mic / Voice Dictation Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice Input (Dictation)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={(!inputText.trim() && !activeScreenImage) || isGenerating}
                className={`p-2 rounded-xl transition-all ml-1 ${
                  (inputText.trim() || activeScreenImage) && !isGenerating
                    ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md hover:opacity-90'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
                title="Send message [Enter]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Bottom Status Tip */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Press <kbd className="font-mono text-slate-400 font-semibold">{settings.globalHotkey}</kbd> to toggle</span>
              <span>Windows 11 Mica &bull; Fluid Glass</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
