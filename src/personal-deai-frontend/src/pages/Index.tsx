import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageSquare, CheckSquare, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, isAuthReady } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = async () => {
    setIsConnecting(true);
    try {
      await login();
      // If login is successful, useEffect will handle navigation
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to Internet Identity");
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 py-16 mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center py-20">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            DEAI Assistant
          </h1>
          <p className="max-w-2xl text-xl text-gray-600 dark:text-gray-300 mb-10">
            Fully decentralized AI assistant powered by Llama 3.1 8B running on Internet Computer canisters.
            Secure, private, and autonomous.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            disabled={isConnecting || !isAuthReady}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isConnecting ? "Connecting to Internet Identity..." : "Get Started with Internet Identity"}
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>On-Chain LLM</CardTitle>
              <CardDescription>
                Powered by Llama 3.1 8B model running directly on ICP canisters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Experience AI inference without relying on centralized cloud services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Smart Chat</CardTitle>
              <CardDescription>
                Natural conversations with context-aware responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Interact naturally with an assistant that remembers your conversation history.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckSquare className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Task Automation</CardTitle>
              <CardDescription>
                Delegate tasks to your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Create tasks and let your assistant handle them autonomously.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Data Privacy</CardTitle>
              <CardDescription>
                Your data stays secure on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                All interactions are processed on-chain, ensuring your privacy is maintained.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <ol className="relative border-l border-gray-300 dark:border-gray-700 ml-3">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <span className="text-blue-800 dark:text-blue-200">1</span>
                </span>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Connect with Internet Identity</h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Securely authenticate using your Internet Identity to access the application.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-purple-900">
                  <span className="text-purple-800 dark:text-purple-200">2</span>
                </span>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Start a Conversation</h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Begin chatting with the AI assistant about anything you need help with.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  <span className="text-green-800 dark:text-green-200">3</span>
                </span>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Create Tasks</h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Define tasks for your assistant to complete autonomously.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-red-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-red-900">
                  <span className="text-red-800 dark:text-red-200">4</span>
                </span>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Review Results</h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Check completed tasks and continue the conversation as needed.
                </p>
              </li>
            </ol>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-10 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future of AI?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Try DEAI now and discover the power of decentralized artificial intelligence.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              disabled={isConnecting || !isAuthReady}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              {isConnecting ? "Connecting to Internet Identity..." : "Login with Internet Identity"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
