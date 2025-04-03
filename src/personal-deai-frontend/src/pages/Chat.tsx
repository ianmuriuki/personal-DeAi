
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Loader, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actor, isAuthenticated } = useAuth();
  const [chatId, setChatId] = useState<number | null>(id ? parseInt(id) : null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && actor) {
      fetchChats();
      
      if (id) {
        setChatId(parseInt(id));
        fetchChatMessages(parseInt(id));
      }
    }
  }, [isAuthenticated, actor, id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    if (!actor) return;
    
    setIsLoadingChats(true);
    try {
      const result = await actor.getChats();
      if ('ok' in result) {
        setChats(result.ok);
      } else {
        toast.error(`Error fetching chats: ${result.err}`);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chat list');
    } finally {
      setIsLoadingChats(false);
    }
  };

  const fetchChatMessages = async (chatId: number) => {
    if (!actor) return;
    
    setIsLoading(true);
    try {
      const result = await actor.getChat(chatId);
      if ('ok' in result) {
        setMessages(result.ok.messages || []);
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
    if (!actor) {
      toast.error('Connection to Internet Computer not established');
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
        await fetchChats();
        toast.success('New chat created');
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !actor) return;
    
    if (!chatId) {
      await createNewChat();
      return;
    }
    
    const messageText = inputMessage;
    setInputMessage('');
    
    // Optimistically add user message
    const tempUserMessage = {
      id: Date.now(),
      timestamp: Date.now() * 1000000,
      sender: 'user',
      content: messageText,
    };
    
    setMessages((prev) => [...prev, tempUserMessage]);
    
    // Show typing indicator
    const tempAssistantMessage = {
      id: Date.now() + 1,
      timestamp: (Date.now() + 1) * 1000000,
      sender: 'assistant',
      content: '...',
      isLoading: true,
    };
    
    setMessages((prev) => [...prev, tempAssistantMessage]);
    
    try {
      const result = await actor.sendMessage(chatId, messageText);
      
      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));
      
      // Fetch updated messages
      await fetchChatMessages(chatId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      // Remove typing indicator on error
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));
    }
  };

  const switchChat = (newChatId: number) => {
    navigate(`/chat/${newChatId}`);
  };

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Chat list sidebar */}
      <div className="hidden md:block md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Chats</h2>
          <Button 
            size="sm" 
            onClick={createNewChat}
            disabled={isLoadingChats}
            variant="outline"
          >
            <PlusCircle size={16} className="mr-1" />
            New
          </Button>
        </div>
        
        {isLoadingChats ? (
          <div className="flex justify-center p-4">
            <Loader size={20} className="animate-spin text-purple-600" />
          </div>
        ) : chats.length > 0 ? (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                className={`p-2 rounded-md cursor-pointer transition-colors ${
                  chatId === chat.id 
                    ? 'bg-purple-100 dark:bg-purple-900/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => switchChat(chat.id)}
              >
                <div className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {chat.name || `Chat #${chat.id}`}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {chat.messageCount || 0} messages
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500 dark:text-gray-400">
            No chats yet. Start a new conversation!
          </div>
        )}
      </div>
      
      {/* Chat interface */}
      <div className="col-span-1 md:col-span-3 flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Chat header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {chatId ? `Chat #${chatId}` : 'New Chat'}
          </h2>
          <div className="md:hidden">
            <Button 
              size="sm" 
              onClick={createNewChat}
              disabled={isLoadingChats}
              variant="outline"
            >
              <PlusCircle size={16} className="mr-1" />
              New
            </Button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && !messages.length ? (
            <div className="flex justify-center items-center h-full">
              <Loader size={24} className="animate-spin text-purple-600" />
            </div>
          ) : messages.length > 0 ? (
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
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
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
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const MessageSquare = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default Chat;
