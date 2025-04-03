
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, ListTodo, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { principal } = useAuth();
  
  const navLinks = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/chat', icon: <MessageSquare size={20} />, label: 'Chat' },
    { to: '/tasks', icon: <ListTodo size={20} />, label: 'Tasks' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' }
  ];

  return (
    <div className="hidden sm:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-center">
          <img 
            src="/bot.svg" 
            alt="DEAI Logo" 
            className="h-10 w-10" 
          />
          <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">DEAI Assistant</h1>
        </div>
        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          Decentralized AI on Internet Computer
        </p>
      </div>
      
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center">
            <User size={16} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Internet Identity
            </p>
            {principal && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                {principal.toString().substring(0, 15)}...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
