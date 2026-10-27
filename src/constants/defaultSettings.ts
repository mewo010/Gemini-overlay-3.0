import { AIModel, AppSettings } from '../types';

export const AVAILABLE_MODELS: AIModel[] = [
  // Google Gemini
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'gemini',
    contextLength: '1M tokens',
    isVisionCapable: true,
    description: 'Fastest, highly capable multimodal model. Default recommendation for instant screen Q&A.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    provider: 'gemini',
    contextLength: '1M tokens',
    isVisionCapable: true,
    description: 'Ultra-low latency model for quick replies, text translations, and instant lookups.',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon (Pro)',
    provider: 'gemini',
    contextLength: '2M tokens',
    isVisionCapable: true,
    description: 'Deep reasoning flagship model for complex coding, architecture, and mathematics.',
  },

  // OpenRouter
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 (Free)',
    provider: 'openrouter',
    contextLength: '64K tokens',
    isVisionCapable: false,
    description: 'Open-weights reasoning model with chain-of-thought capabilities via OpenRouter.',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'openrouter',
    contextLength: '200K tokens',
    isVisionCapable: true,
    description: 'Top-tier code and vision comprehension from Anthropic via OpenRouter.',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o (OpenRouter)',
    provider: 'openrouter',
    contextLength: '128K tokens',
    isVisionCapable: true,
    description: 'OpenAI flagship omni model for multimodal chat and screen analysis.',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'openrouter',
    contextLength: '128K tokens',
    isVisionCapable: false,
    description: 'Meta state-of-the-art open weights model on OpenRouter.',
  },

  // OpenAI Direct
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    contextLength: '128K tokens',
    isVisionCapable: true,
    description: 'Direct OpenAI GPT-4o multimodal model.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    contextLength: '128K tokens',
    isVisionCapable: true,
    description: 'Fast, lightweight OpenAI model.',
  },

  // Groq
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B (Groq)',
    provider: 'groq',
    contextLength: '128K tokens',
    isVisionCapable: false,
    description: 'Ultra-fast LPU inference speeds (300+ tokens/sec).',
  },
  {
    id: 'llama-3.2-11b-vision-preview',
    name: 'Llama 3.2 11B Vision (Groq)',
    provider: 'groq',
    contextLength: '128K tokens',
    isVisionCapable: true,
    description: 'Fast multimodal vision inference on Groq hardware.',
  },

  // Custom
  {
    id: 'llama3:latest',
    name: 'Ollama Local / Custom Model',
    provider: 'custom',
    contextLength: 'Custom',
    isVisionCapable: true,
    description: 'Local LLM running via Ollama or custom OpenAI-compatible server.',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  activeProvider: 'gemini',
  geminiApiKey: '', // Server-side environment key is used by default if empty
  geminiModel: 'gemini-3.8-flash',
  
  openRouterApiKey: '',
  openRouterModel: 'deepseek/deepseek-r1:free',
  
  openaiApiKey: '',
  openaiModel: 'gpt-4o',
  
  groqApiKey: '',
  groqModel: 'llama-3.3-70b-versatile',
  
  customBaseUrl: 'http://localhost:11434/v1',
  customApiKey: 'ollama',
  customModel: 'llama3:latest',
  
  systemInstruction:
    'You are WinGemini, a fast Windows desktop AI overlay modeled after the mobile Gemini assistant. Provide clear, direct, and actionable answers. Use markdown formatting for code snippets, bullet points, and key takeaways.',
  temperature: 0.7,
  autoCaptureScreen: true,
  
  globalHotkey: 'Alt+Space',
  overlayPosition: 'bottom-center',
  overlayTheme: 'gemini-dark',
  windowOpacity: 0.95,
  startWithWindows: true,
  soundEffects: true,
  compactMode: false,
};

export const QUICK_PROMPTS = [
  { label: 'Summarize screen', prompt: 'Summarize what is currently displayed on this screen in 3 clear bullet points.' },
  { label: 'Explain this code', prompt: 'Explain what this code does, identify any potential bugs or edge cases, and suggest improvements.' },
  { label: 'Extract text & data', prompt: 'Extract any tables, code, or structured text visible in this screenshot and format it cleanly.' },
  { label: 'Draft a reply', prompt: 'Draft a polite, professional, and concise reply based on the message visible on screen.' },
  { label: 'Find errors / fix', prompt: 'Inspect the screenshot for any error messages, stack traces, or warnings and provide the exact fix.' },
];
