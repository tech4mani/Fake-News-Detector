import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Article from './models/Article.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/api/news/personalized', async (req, res) => {
  try {
    const count = await Article.countDocuments();
    if (count === 0) {
      await Article.create([
        {
          title: 'The Future of AI',
          description: 'Exploring the latest developments in artificial intelligence and their impact on society.',
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
          source: 'Tech News'
        },
        {
          title: 'Climate Change Updates',
          description: 'Recent findings on global climate patterns and their implications.',
          imageUrl: 'https://images.unsplash.com/photo-1692879071717-f8293bee8cfe',
          source: 'Science Daily'
        }
      ]);
    }

    const articles = await Article.find().sort({ date: -1 }).limit(12);
    res.json(articles);
  } catch (error) {
    console.error('Error in /api/news/personalized:', error);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

app.post('/api/news/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze the following news article for potential fake news indicators. 
    Consider factors like source credibility, emotional language, fact verification, and logical consistency.
    Provide a binary classification (true/false) and a confidence score (0-1).
    
    Article: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    const isFake = analysis.toLowerCase().includes('fake');
    const confidence = 0.85;

    res.json({ isFake, confidence });
  } catch (error) {
    res.status(500).json({ error: 'Error analyzing news' });
  }
});

app.get('/api/preferences', async (req, res) => {
  try {
    const preferences = {
      topics: ['Technology', 'Science'],
      sources: ['Reuters', 'BBC'],
      updateFrequency: 'daily'
    };
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching preferences' });
  }
});

app.post('/api/preferences', async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error saving preferences' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});