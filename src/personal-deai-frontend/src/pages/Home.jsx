
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ListTodo, Lock, Server, Cpu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Decentralized AI Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Powered by on-chain Llama 3.1 8B on the Internet Computer
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chat"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md"
              >
                Start Chatting
              </Link>
              <Link
                to="/tasks"
                className="px-6 py-3 bg-white text-purple-600 border border-purple-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-purple-400"
              >
                Create Tasks
              </Link>
            </div>
          ) : (
            <button
              onClick={login}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md"
            >
              Login to Get Started
            </button>
          )}
        </div>
        
        {/* Features section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
              <MessageSquare size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              On-Chain AI Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Interact with a powerful Llama 3.1 8B model running directly within Internet Computer canisters.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
              <ListTodo size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Autonomous Task Execution
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Delegate tasks to your AI assistant and let it autonomously complete them for you.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
              <Lock size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Data Privacy & Security
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your data stays on-chain, ensuring privacy and security with Internet Computer's robust protection.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
              <Cpu size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Fully Decentralized
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No centralized servers or cloud providers. Everything runs on the decentralized Internet Computer.
            </p>
          </div>
        </div>
        
        {/* How it works section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            How It Works
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 w-8 h-8 flex items-center justify-center rounded-full mr-4 mt-1">
                <span className="text-purple-600 dark:text-purple-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                  Connect with Internet Identity
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Securely authenticate using Internet Computer's native authentication system.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 w-8 h-8 flex items-center justify-center rounded-full mr-4 mt-1">
                <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                  Chat with On-Chain AI
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask questions, seek advice, or brainstorm ideas with the Llama 3.1 8B model running on ICP.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 w-8 h-8 flex items-center justify-center rounded-full mr-4 mt-1">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                  Create Autonomous Tasks
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Define tasks and let the AI work on them autonomously, providing results when completed.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 w-8 h-8 flex items-center justify-center rounded-full mr-4 mt-1">
                <span className="text-purple-600 dark:text-purple-400 font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                  Enjoy Decentralized AI
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Experience the benefits of AI without relying on centralized providers or compromising data privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tech stack */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Powered By
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center">
              <Server size={20} className="mr-2 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-600 dark:text-gray-300">Internet Computer</span>
            </div>
            <div className="flex items-center">
              <Cpu size={20} className="mr-2 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-600 dark:text-gray-300">Llama 3.1 8B</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-300">Motoko</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-300">React</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;