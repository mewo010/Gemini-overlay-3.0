import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '35mb' }));

// Server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Gemini Chat & Multimodal Screen Vision API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, imageBase64, model = 'gemini-3.8-flash', systemInstruction } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image content is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please provide an API key in Settings or add GEMINI_API_KEY to the environment.',
      });
    }

    const parts: any[] = [];
    if (imageBase64) {
      const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      const mimeType = match ? match[1] : 'image/png';
      const data = match ? match[2] : imageBase64;
      parts.push({
        inlineData: {
          mimeType,
          data,
        },
      });
    }

    parts.push({
      text: prompt || 'Analyze this screen screenshot and provide a helpful, concise summary and suggested actions.',
    });

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents: { parts },
      config: systemInstruction
        ? { systemInstruction }
        : {
            systemInstruction:
              'You are WinGemini, a fast Windows desktop AI overlay modeled after the mobile Gemini assistant. Provide clear, direct, and actionable answers. Use markdown formatting for code snippets, bullet points, and key takeaways.',
          },
    });

    res.json({ text: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while generating response from Gemini API.',
    });
  }
});

// Generic proxy endpoint for OpenRouter or custom OpenAI-compatible endpoints to avoid browser CORS issues
app.post('/api/proxy/openrouter', async (req, res) => {
  try {
    const { apiKey, model, messages, maxTokens = 1024, temperature = 0.7 } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'OpenRouter API Key is required.' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wingemini.app',
        'X-Title': 'WinGemini Windows Overlay',
      },
      body: JSON.stringify({
        model: model || 'deepseek/deepseek-r1:free',
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const reply = data.choices?.[0]?.message?.content || 'No response returned from OpenRouter.';
    res.json({ text: reply, raw: data });
  } catch (error: any) {
    console.error('OpenRouter proxy error:', error);
    res.status(500).json({ error: error.message || 'Failed to call OpenRouter API.' });
  }
});

// Start dev or production server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WinGemini server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
