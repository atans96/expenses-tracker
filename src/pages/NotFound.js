import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
