
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { toast } from 'react-hot-toast';

// Create a type for the context
type AuthContextType = {
  authClient: AuthClient | null;
  actor: any | null;
  isAuthenticated: boolean;
  identity: any | null;
  principal: any | null;
  isAuthReady: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<any | null>(null);
  const [principal, setPrincipal] = useState<any | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Initializing AuthClient...");
        const client = await AuthClient.create();
        setAuthClient(client);
        
        const isLoggedIn = await client.isAuthenticated();
        console.log("Is user logged in:", isLoggedIn);
        setIsAuthenticated(isLoggedIn);
        
        if (isLoggedIn) {
          const identity = client.getIdentity();
          setIdentity(identity);
          
          const principal = identity.getPrincipal();
          setPrincipal(principal);
          
          console.log("User principal:", principal.toString());
          initActor(identity);
        }
        
        setIsAuthReady(true);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        toast.error("Failed to initialize authentication");
        setIsAuthReady(true);
      }
    };
    
    initAuth();
  }, []);

  const initActor = (identity: any) => {
    try {
      console.log("Initializing actor with identity");
      const agent = new HttpAgent({ identity });
      
      // When deployed to the IC, we'll need this
      if (process.env.NODE_ENV !== 'development') {
        agent.fetchRootKey().catch(err => {
          console.warn("Unable to fetch root key. Check your deploy environment:", err);
        });
      }
      
      // In a real implementation, create an actor with your canister ID
      // For this demo, we'll just set a placeholder
      // const deaiActor = createActor(canisterId, { agent });
      const mockActor = {
        createChat: async () => ({ ok: 1 }),
        getChats: async () => ({ ok: [] }),
        getChat: async () => ({ ok: { messages: [] } }),
        sendMessage: async () => ({ ok: {} }),
        createTask: async () => ({ ok: 1 }),
        getTasks: async () => ({ ok: [] }),
        getTask: async () => ({ ok: {} }),
        getIdentity: async () => principal,
        getCanisterInfo: async () => "DEAI Demo Actor"
      };
      
      setActor(mockActor);
      console.log("Actor initialized");
    } catch (error) {
      console.error("Actor initialization failed:", error);
      toast.error("Failed to initialize connection to Internet Computer");
    }
  };

  const login = async () => {
    if (!authClient) {
      throw new Error("Auth client not initialized");
    }
    
    console.log("Starting login process...");
    return new Promise<void>((resolve, reject) => {
      authClient.login({
        identityProvider: process.env.DFX_NETWORK === 'ic' 
          ? 'https://identity.ic0.app' 
          : 'https://identity.ic0.app',
        onSuccess: () => {
          console.log("Login successful");
          setIsAuthenticated(true);
          
          const identity = authClient.getIdentity();
          setIdentity(identity);
          
          const principal = identity.getPrincipal();
          setPrincipal(principal);
          console.log("User principal after login:", principal.toString());
          
          initActor(identity);
          resolve();
        },
        onError: (error) => {
          console.error("Login failed:", error);
          reject(new Error("Login failed"));
        }
      });
    });
  };

  const logout = async () => {
    if (!authClient) {
      throw new Error("Auth client not initialized");
    }
    
    console.log("Logging out...");
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setPrincipal(null);
    setActor(null);
    console.log("Logout complete");
  };

  const value = {
    authClient,
    actor,
    isAuthenticated,
    identity,
    principal,
    isAuthReady,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
