// Gemini backend proxy using Express and @google/genai
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://nikhil-87.github.io',
    'https://nikhil-87.github.io/chatbot'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    const response = await ai.models.generateContent({
      model: model || 'gemini-2.0-flash',
      contents: prompt,
    });
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Gemini backend listening on port ${port}`);
});
