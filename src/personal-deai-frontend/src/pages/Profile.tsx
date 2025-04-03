
import { useAuth } from '../contexts/AuthContext';
import { Shield, Server, Cpu } from 'lucide-react';

const Profile = () => {
  const { principal, isAuthenticated, actor } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Your Profile
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Internet Identity
              </h3>
              <p className="mt-1 text-lg text-gray-800 dark:text-white break-all">
                {principal ? principal.toString() : 'Not logged in'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Authentication Status
              </h3>
              <p className="mt-1 text-lg text-gray-800 dark:text-white">
                {isAuthenticated ? (
                  <span className="text-green-500 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Authenticated with Internet Identity
                  </span>
                ) : (
                  <span className="text-red-500">Not Authenticated</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
              About DEAI Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              DEAI is a fully decentralized AI assistant powered by Llama 3.1 8B running on Internet Computer canisters. Your data stays secure and private on the blockchain.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center">
                <Shield className="text-purple-600 dark:text-purple-400 mr-2" size={20} />
                <span className="text-sm text-gray-600 dark:text-gray-300">Secure Blockchain Data</span>
              </div>
              <div className="flex items-center">
                <Server className="text-purple-600 dark:text-purple-400 mr-2" size={20} />
                <span className="text-sm text-gray-600 dark:text-gray-300">Internet Computer</span>
              </div>
              <div className="flex items-center">
                <Cpu className="text-purple-600 dark:text-purple-400 mr-2" size={20} />
                <span className="text-sm text-gray-600 dark:text-gray-300">Llama 3.1 8B Model</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
