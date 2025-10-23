import React, { useState, useEffect } from 'react';
import { BookOpen, ThumbsUp, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  'general', 'world', 'nation', 'business', 'technology',
  'entertainment', 'sports', 'science', 'health',
];

const countries = [
  { name: 'Australia', code: 'au' }, { name: 'Brazil', code: 'br' },
  { name: 'Canada', code: 'ca' }, { name: 'China', code: 'cn' },
  { name: 'Egypt', code: 'eg' }, { name: 'France', code: 'fr' },
  { name: 'Germany', code: 'de' }, { name: 'Greece', code: 'gr' },
  { name: 'Hong Kong', code: 'hk' }, { name: 'India', code: 'in' },
  { name: 'Ireland', code: 'ie' }, { name: 'Israel', code: 'il' },
  { name: 'Italy', code: 'it' }, { name: 'Japan', code: 'jp' },
  { name: 'Netherlands', code: 'nl' }, { name: 'Norway', code: 'no' },
  { name: 'Pakistan', code: 'pk' }, { name: 'Peru', code: 'pe' },
  { name: 'Philippines', code: 'ph' }, { name: 'Portugal', code: 'pt' },
  { name: 'Romania', code: 'ro' }, { name: 'Russia', code: 'ru' },
  { name: 'Singapore', code: 'sg' }, { name: 'Spain', code: 'es' },
  { name: 'Sweden', code: 'se' }, { name: 'Switzerland', code: 'ch' },
  { name: 'Taiwan', code: 'tw' }, { name: 'Ukraine', code: 'ua' },
  { name: 'United Kingdom', code: 'gb' }, { name: 'United States', code: 'us' },
];

const speakText = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
};

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedCountry, setSelectedCountry] = useState('us');

  const navigate = useNavigate();

  useEffect(() => {
    fetchGoogleNews(selectedCategory, selectedCountry);
  }, [selectedCategory, selectedCountry]);

  const fetchGoogleNews = async (category: string, country: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?lang=en&country=${country}&topic=${category}&apikey=f12c9d23435f4ea1ad882d96fef980b8`
      );
      const data = await response.json();

      const formattedArticles = data.articles.map((article: any, index: number) => ({
        _id: index,
        title: article.title,
        description: article.description,
        imageUrl: article.image,
        url: article.url,
      }));

      setArticles(formattedArticles);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Google News Feed</h1>

        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-gray-700"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-gray-700"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: any) => (
            <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.description}</p>

                <div className="flex flex-wrap items-center justify-between text-gray-500 gap-2">
                  <button
                    onClick={() => window.open(article.url, '_blank')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Read</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <ThumbsUp className="h-5 w-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => speakText(`${article.title}. ${article.description}`)}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    🔊 <span>Listen</span>
                  </button>
                  <button
                    onClick={() => navigate('/fake-news', { state: { headline: article.description } })}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
