import React, { useState } from 'react';
import {
  X,
  Key,
  Sliders,
  Keyboard,
  Check,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AppSettings, AIProvider } from '../types';
import { AVAILABLE_MODELS, DEFAULT_SETTINGS } from '../constants/defaultSettings';
import { sendAIMessage } from '../utils/aiClient';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'providers' | 'windows'>('providers');
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });
  const [isRecordingHotkey, setIsRecordingHotkey] = useState(false);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleProviderChange = (provider: AIProvider) => {
    setLocalSettings((prev) => ({ ...prev, activeProvider: provider }));
    setTestingStatus('idle');
  };

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setTestMessage('Pinging AI model...');
    try {
      const reply = await sendAIMessage({
        prompt: 'Hello! Respond with: "WinGemini connection successful." and nothing else.',
        settings: localSettings,
      });
      setTestingStatus('success');
      setTestMessage(reply);
    } catch (err: any) {
      setTestingStatus('error');
      setTestMessage(err.message || 'Connection test failed.');
    }
  };

  const handleSaveAndClose = () => {
    onSave(localSettings);
    onClose();
  };

  const handleResetDefaults = () => {
    setLocalSettings({ ...DEFAULT_SETTINGS });
    setTestingStatus('idle');
  };

  // Hotkey recording listener
  const handleHotkeyKeyDown = (e: React.KeyboardEvent) => {
    if (!isRecordingHotkey) return;
    e.preventDefault();
    e.stopPropagation();

    const parts: string[] = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Win');

    const keyName = e.key;
    if (!['Control', 'Alt', 'Shift', 'Meta'].includes(keyName)) {
      parts.push(keyName === ' ' ? 'Space' : keyName.length === 1 ? keyName.toUpperCase() : keyName);
      if (parts.length > 0) {
        setLocalSettings((prev) => ({ ...prev, globalHotkey: parts.join('+') }));
        setIsRecordingHotkey(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">WinGemini Settings</h2>
              <p className="text-xs text-slate-400">
                Configure AI API keys, default models, and Windows hotkey behavior
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-2">
          <button
            onClick={() => setActiveTab('providers')}
            className={`pb-3 px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'providers'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" /> AI Models & APIs
          </button>
          <button
            onClick={() => setActiveTab('windows')}
            className={`pb-3 px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'windows'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-4 h-4" /> Hotkeys & Windows Overlay
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-200">
          {activeTab === 'providers' ? (
            <>
              {/* Provider Selector Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Active AI Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'gemini', name: 'Google Gemini', sub: 'Native Server Key' },
                    { id: 'openrouter', name: 'OpenRouter', sub: 'DeepSeek / Claude' },
                    { id: 'openai', name: 'OpenAI', sub: 'GPT-4o Direct' },
                    { id: 'groq', name: 'Groq LPU', sub: 'High-speed' },
                    { id: 'custom', name: 'Custom / Ollama', sub: 'Local endpoint' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProviderChange(p.id as AIProvider)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        localSettings.activeProvider === p.id
                          ? 'border-sky-500 bg-sky-500/10 text-white shadow-md'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-semibold">{p.name}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{p.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Provider Form Fields */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                {/* 1. GEMINI */}
                {localSettings.activeProvider === 'gemini' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400">
                        <Sparkles className="w-3.5 h-3.5" /> Google Gemini Configuration
                      </div>
                      <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Connected to Server GEMINI_API_KEY
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Select Gemini Model</label>
                      <select
                        value={localSettings.geminiModel}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, geminiModel: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      >
                        {AVAILABLE_MODELS.filter((m) => m.provider === 'gemini').map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} - {m.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Custom Gemini API Key (Optional)
                      </label>
                      <input
                        type="password"
                        placeholder="Leave blank to use pre-configured environment key"
                        value={localSettings.geminiApiKey}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, geminiApiKey: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        By default, the server's injected GEMINI_API_KEY is used automatically.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. OPENROUTER */}
                {localSettings.activeProvider === 'openrouter' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400">
                        <Zap className="w-3.5 h-3.5" /> OpenRouter Configuration
                      </div>
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                      >
                        Get OpenRouter Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">OpenRouter API Key</label>
                      <input
                        type="password"
                        placeholder="sk-or-v1-..."
                        value={localSettings.openRouterApiKey}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, openRouterApiKey: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Select OpenRouter Model</label>
                      <select
                        value={localSettings.openRouterModel}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, openRouterModel: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      >
                        {AVAILABLE_MODELS.filter((m) => m.provider === 'openrouter').map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. OPENAI */}
                {localSettings.activeProvider === 'openai' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400">
                        OpenAI Configuration
                      </div>
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                      >
                        Get OpenAI Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">OpenAI API Key</label>
                      <input
                        type="password"
                        placeholder="sk-proj-..."
                        value={localSettings.openaiApiKey}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, openaiApiKey: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">OpenAI Model</label>
                      <select
                        value={localSettings.openaiModel}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, openaiModel: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      >
                        <option value="gpt-4o">GPT-4o (Multimodal Vision)</option>
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 4. GROQ */}
                {localSettings.activeProvider === 'groq' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400">
                        Groq LPU Configuration
                      </div>
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                      >
                        Get Groq Key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Groq API Key</label>
                      <input
                        type="password"
                        placeholder="gsk_..."
                        value={localSettings.groqApiKey}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, groqApiKey: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Groq Model</label>
                      <select
                        value={localSettings.groqModel}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, groqModel: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      >
                        <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
                        <option value="llama-3.2-11b-vision-preview">
                          Llama 3.2 11B Vision (Multimodal)
                        </option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 5. CUSTOM / OLLAMA */}
                {localSettings.activeProvider === 'custom' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400">
                      Custom OpenAI-compatible / Local Ollama
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">API Base URL</label>
                      <input
                        type="text"
                        placeholder="http://localhost:11434/v1"
                        value={localSettings.customBaseUrl}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({ ...prev, customBaseUrl: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Model Name</label>
                        <input
                          type="text"
                          placeholder="llama3:latest"
                          value={localSettings.customModel}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({ ...prev, customModel: e.target.value }))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">API Key / Token</label>
                        <input
                          type="password"
                          placeholder="ollama or token"
                          value={localSettings.customApiKey}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({ ...prev, customApiKey: e.target.value }))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* System Instruction */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  System Instruction / Prompt Persona
                </label>
                <textarea
                  rows={2}
                  value={localSettings.systemInstruction}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, systemInstruction: e.target.value }))
                  }
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Creativity / Temperature
                  </label>
                  <span className="text-xs font-mono text-sky-400">{localSettings.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.1"
                  value={localSettings.temperature}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      temperature: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-sky-500"
                />
              </div>

              {/* Connection Test Output */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleTestConnection}
                  disabled={testingStatus === 'testing'}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  {testingStatus === 'testing' ? 'Testing Connection...' : 'Test Connection'}
                </button>

                {testingStatus === 'success' && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> API Connected Successfully!
                  </span>
                )}
                {testingStatus === 'error' && (
                  <span className="text-xs text-red-400 flex items-center gap-1 max-w-xs truncate" title={testMessage}>
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {testMessage}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Hotkeys and Windows Behavior */}
              <div className="space-y-4">
                {/* Global Hotkey Config */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Global Windows Shortcut Keybind
                  </label>
                  <p className="text-xs text-slate-400">
                    Press this shortcut anywhere in Windows to summon or hide the WinGemini overlay.
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <div
                      onKeyDown={handleHotkeyKeyDown}
                      tabIndex={0}
                      className={`px-4 py-2 rounded-xl border font-mono text-sm flex items-center gap-2 focus:outline-none transition-all ${
                        isRecordingHotkey
                          ? 'border-sky-400 bg-sky-500/10 text-sky-300 ring-2 ring-sky-500/30 animate-pulse'
                          : 'border-slate-700 bg-slate-900 text-slate-200'
                      }`}
                    >
                      <Keyboard className="w-4 h-4 text-sky-400" />
                      <span>{isRecordingHotkey ? 'Press keys on keyboard...' : localSettings.globalHotkey}</span>
                    </div>

                    <button
                      onClick={() => setIsRecordingHotkey(!isRecordingHotkey)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                    >
                      {isRecordingHotkey ? 'Cancel' : 'Change Keybind'}
                    </button>

                    <button
                      onClick={() =>
                        setLocalSettings((prev) => ({ ...prev, globalHotkey: 'Alt+Space' }))
                      }
                      className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                      title="Reset to default (Alt+Space)"
                    >
                      Default
                    </button>
                  </div>
                </div>

                {/* Overlay Position */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Default Overlay Screen Position
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'bottom-center', name: 'Bottom Center', desc: 'Mobile Gemini style' },
                      { id: 'bottom-right', name: 'Bottom Right', desc: 'Windows Copilot dock' },
                      { id: 'center', name: 'Center Screen', desc: 'Spotlight mode' },
                      { id: 'floating', name: 'Floating Dock', desc: 'Above taskbar' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            overlayPosition: pos.id as any,
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          localSettings.overlayPosition === pos.id
                            ? 'border-sky-500 bg-sky-500/10 text-white'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-semibold">{pos.name}</span>
                        <span className="text-[10px] text-slate-400 mt-1">{pos.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Window Opacity Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Glass / Mica Opacity
                    </label>
                    <span className="text-xs font-mono text-sky-400">
                      {Math.round(localSettings.windowOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.0"
                    step="0.05"
                    value={localSettings.windowOpacity}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        windowOpacity: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-sky-500"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <div>
                      <div className="text-xs font-medium text-slate-200">
                        Start with Windows on Login
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Runs WinGemini silently in the background system tray.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.startWithWindows}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          startWithWindows: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-sky-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <div>
                      <div className="text-xs font-medium text-slate-200">
                        Sound Effects on Trigger
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Play subtle audio chime when opening or receiving replies.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.soundEffects}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          soundEffects: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-sky-500"
                    />
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg hover:opacity-95 transition-opacity"
            >
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
