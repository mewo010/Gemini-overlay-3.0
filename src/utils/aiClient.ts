import { AppSettings } from '../types';

export interface SendMessageOptions {
  prompt: string;
  imageBase64?: string | null;
  settings: AppSettings;
  chatHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export async function sendAIMessage(options: SendMessageOptions): Promise<string> {
  const { prompt, imageBase64, settings, chatHistory = [] } = options;
  const provider = settings.activeProvider;

  // 1. GOOGLE GEMINI
  if (provider === 'gemini') {
    // Call server-side /api/chat
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        imageBase64: imageBase64 || undefined,
        model: settings.geminiModel || 'gemini-3.8-flash',
        systemInstruction: settings.systemInstruction,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate response from Gemini API');
    }
    return data.text || 'No response returned from Gemini.';
  }

  // 2. OPENROUTER
  if (provider === 'openrouter') {
    if (!settings.openRouterApiKey) {
      throw new Error('Please enter your OpenRouter API Key in Settings to use OpenRouter models.');
    }

    const messages: any[] = [];
    if (settings.systemInstruction) {
      messages.push({ role: 'system', content: settings.systemInstruction });
    }

    // Previous history
    chatHistory.slice(-4).forEach((msg) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    // Current message
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt || 'Analyze this screen capture.' },
          {
            type: 'image_url',
            image_url: {
              url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}`,
            },
          },
        ],
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    const response = await fetch('/api/proxy/openrouter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: settings.openRouterApiKey,
        model: settings.openRouterModel || 'deepseek/deepseek-r1:free',
        messages,
        temperature: settings.temperature,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'OpenRouter request failed.');
    }
    return data.text || data.choices?.[0]?.message?.content || 'No response from OpenRouter.';
  }

  // 3. OPENAI DIRECT
  if (provider === 'openai') {
    if (!settings.openaiApiKey) {
      throw new Error('Please enter your OpenAI API Key in Settings to use OpenAI models.');
    }

    const messages: any[] = [];
    if (settings.systemInstruction) {
      messages.push({ role: 'system', content: settings.systemInstruction });
    }
    chatHistory.slice(-4).forEach((msg) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: { url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}` },
          },
        ],
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: settings.openaiModel || 'gpt-4o',
        messages,
        temperature: settings.temperature,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to call OpenAI API.');
    }
    return data.choices?.[0]?.message?.content || 'No response from OpenAI.';
  }

  // 4. GROQ
  if (provider === 'groq') {
    if (!settings.groqApiKey) {
      throw new Error('Please enter your Groq API Key in Settings to use Groq models.');
    }

    const messages: any[] = [];
    if (settings.systemInstruction) {
      messages.push({ role: 'system', content: settings.systemInstruction });
    }
    chatHistory.slice(-4).forEach((msg) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: { url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}` },
          },
        ],
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.groqApiKey}`,
      },
      body: JSON.stringify({
        model: settings.groqModel || 'llama-3.3-70b-versatile',
        messages,
        temperature: settings.temperature,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to call Groq API.');
    }
    return data.choices?.[0]?.message?.content || 'No response from Groq.';
  }

  // 5. CUSTOM / OLLAMA
  if (provider === 'custom') {
    const baseUrl = (settings.customBaseUrl || 'http://localhost:11434/v1').replace(/\/$/, '');
    const messages: any[] = [];
    if (settings.systemInstruction) {
      messages.push({ role: 'system', content: settings.systemInstruction });
    }
    chatHistory.slice(-4).forEach((msg) => {
      messages.push({ role: msg.role, content: msg.content });
    });
    messages.push({ role: 'user', content: prompt });

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (settings.customApiKey) {
      headers['Authorization'] = `Bearer ${settings.customApiKey}`;
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: settings.customModel || 'llama3:latest',
        messages,
        temperature: settings.temperature,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to call custom AI endpoint.');
    }
    return data.choices?.[0]?.message?.content || 'No response from custom endpoint.';
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}
