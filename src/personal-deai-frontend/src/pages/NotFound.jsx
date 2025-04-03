
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        Oops! Page not found
      </p>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
        The page you are looking for is temporarily unavailable.We are currently working on that.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
