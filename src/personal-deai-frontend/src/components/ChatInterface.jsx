
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const ChatInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actor, isAuthenticated } = useAuth();
  const [chatId, setChatId] = useState(id || null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) {
      setChatId(id);
      fetchChatMessages(id);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatMessages = async (chatId) => {
    if (!isAuthenticated || !actor) return;
    
    setIsLoading(true);
    try {
      const result = await actor.getChat(Number(chatId));
      if ('ok' in result) {
        setMessages(result.ok.messages);
      } else {
        toast.error(`Error fetching chat: ${result.err}`);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      toast.error('Failed to load chat messages');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!isAuthenticated || !actor) {
      toast.error('Please login to start a chat');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await actor.createChat(`Chat ${new Date().toLocaleString()}`);
      if ('ok' in result) {
        const newChatId = result.ok;
        setChatId(newChatId);
        setMessages([]);
        navigate(`/chat/${newChatId}`);
      } else {
        toast.error(`Error creating chat: ${result.err}`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create a new chat');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      return;
    }
    
    if (!chatId) {
      await createNewChat();
    }
    
    const messageToSend = inputMessage;
    setInputMessage('');
    
    // Optimistically add user message to UI
    const tempUserMessage = {
      id: Date.now(),
      timestamp: Date.now() * 1000000,
      sender: 'user',
      content: messageToSend,
    };
    
    setMessages((prev) => [...prev, tempUserMessage]);
    
    // Show typing indicator
    const tempAiMessage = {
      id: Date.now() + 1,
      timestamp: (Date.now() + 1) * 1000000,
      sender: 'assistant',
      content: '...',
      isLoading: true,
    };
    
    setMessages((prev) => [...prev, tempAiMessage]);
    
    try {
      const result = await actor.sendMessage(Number(chatId), messageToSend);
      
      // Remove typing indicator and update with real messages
      setMessages((prev) => 
        prev.filter((msg) => !msg.isLoading)
      );
      
      // Fetch updated messages
      fetchChatMessages(chatId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      // Remove typing indicator on error
      setMessages((prev) => 
        prev.filter((msg) => !msg.isLoading)
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Please login to use the chat feature
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Chat header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {chatId ? `Chat #${chatId}` : 'New Chat'}
        </h2>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                } ${message.isLoading ? 'animate-pulse' : ''}`}
              >
                {message.isLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <img
              src="/public/bot.svg"
              alt="AI Assistant"
              className="w-16 h-16 mb-4 opacity-60"
            />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Ask anything, and our on-chain AI will provide answers powered by Llama 3.1 8B.
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
