import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/firebase';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking authentication state:', error);
      }
    };

    checkAuthState();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center content-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md flex flex-col items-center justify-center content-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Expense Tracker</h1>
        <p className="mb-4">This is a simple expense tracking application built with React and Firebase.</p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
