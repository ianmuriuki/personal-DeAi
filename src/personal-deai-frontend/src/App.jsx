import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Hooks
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { isAuthenticated, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background dark:bg-darkBackground text-black dark:text-white">
      <Toaster position="top-right" />
      
      {isAuthenticated && <Sidebar />}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:id?" element={<Chat />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

<div className="bg-red-500 text-white p-4 text-center">Tailwind is Working!</div>


export default App;
