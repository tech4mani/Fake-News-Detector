import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Newspaper, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const genAI = new GoogleGenerativeAI("AIzaSyD_MzbcVf7HlCHzJRQJoByKAgf9w9x-HBo");

interface AnalysisResult {
  prediction: 'Real' | 'Fake' | null;
  confidence: number;
  reasoning: string;
}

const FakeNewsDetector = () => {
  const location = useLocation();
  const headline = location.state?.headline || '';

  const [input, setInput] = useState(headline);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (headline) analyzeText();
  }, [headline]);

  const analyzeText = async () => {
    if (!input.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Analyze if the following text is real or fake news. Return only in this format:
      Prediction: [Real or Fake]
      Confidence: [0-100]
      Reasoning: [One sentence explanation]

      Text to analyze: "${input}"`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const lines = text.split('\n');
      const prediction = lines[0].split(': ')[1].trim() as 'Real' | 'Fake';
      const confidence = parseInt(lines[1].split(': ')[1]);
      const reasoning = lines[2].split(': ')[1];

      setResult({ prediction, confidence, reasoning });
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakResult = () => {
    if (result) {
      const text = `Prediction: ${result.prediction}. Confidence: ${result.confidence} percent. Reasoning: ${result.reasoning}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Newspaper className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">Fake News Detector</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <textarea
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Enter a news headline or article content to analyze..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            onClick={analyzeText}
            disabled={isLoading}
            className="mt-4 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Text'
            )}
          </button>

          {result && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                {result.prediction === 'Real' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-xl font-semibold">
                  Prediction: {result.prediction}
                </h3>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Confidence Score</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${result.prediction === 'Real' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600 mt-1">
                  {result.confidence}%
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Reasoning</div>
                <p className="text-gray-800">{result.reasoning}</p>
              </div>

              <button
                onClick={speakResult}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                🔊 Read Aloud
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakeNewsDetector;
