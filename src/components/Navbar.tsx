import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Shield, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Newspaper className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">AI News Feed</span>
          </Link>

          <div className="flex space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Newspaper className="h-5 w-5" />
              <span>Feed</span>
            </Link>

            <Link
              to="/fake-news"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Shield className="h-5 w-5" />
              <span>Fake News Detector</span>
            </Link>


          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;