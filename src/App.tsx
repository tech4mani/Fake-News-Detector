import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewsFeed from './components/NewsFeed';
import FakeNewsDetector from './components/FakeNewsDetector';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            <Route path="/fake-news" element={<FakeNewsDetector />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;