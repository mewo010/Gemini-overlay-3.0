export type AIProvider = 'gemini' | 'openrouter' | 'openai' | 'groq' | 'custom';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  contextLength?: string;
  isVisionCapable?: boolean;
  description?: string;
}

export interface AppSettings {
  // Provider & API
  activeProvider: AIProvider;
  geminiApiKey: string;
  geminiModel: string;
  openRouterApiKey: string;
  openRouterModel: string;
  openaiApiKey: string;
  openaiModel: string;
  groqApiKey: string;
  groqModel: string;
  customBaseUrl: string;
  customApiKey: string;
  customModel: string;
  
  // AI Behavior
  systemInstruction: string;
  temperature: number;
  autoCaptureScreen: boolean;
  
  // Windows Desktop & Hotkey
  globalHotkey: string; // e.g. "Alt+Space", "Ctrl+Shift+G"
  overlayPosition: 'bottom-center' | 'bottom-right' | 'center' | 'floating';
  overlayTheme: 'gemini-dark' | 'win11-mica' | 'win11-light' | 'cyber-glow';
  windowOpacity: number; // 0.8 to 1.0
  startWithWindows: boolean;
  soundEffects: boolean;
  compactMode: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  screenshot?: string; // base64 image if user asked about screen
  modelUsed?: string;
  isStreaming?: boolean;
}

export interface MockDesktopWindow {
  id: string;
  title: string;
  type: 'code' | 'browser' | 'terminal' | 'notes';
  content: string;
  fileName?: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}
