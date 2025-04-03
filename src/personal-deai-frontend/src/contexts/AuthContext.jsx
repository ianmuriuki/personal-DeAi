
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
// import { createActor } from '../declarations';
// import { canisterId } from '../declarations/canister_ids';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        
        const isLoggedIn = await client.isAuthenticated();
        setIsAuthenticated(isLoggedIn);
        
        if (isLoggedIn) {
          const identity = client.getIdentity();
          setIdentity(identity);
          
          const principal = identity.getPrincipal();
          setPrincipal(principal);
          
          initActor(identity);
        }
        
        setIsAuthReady(true);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuthReady(true);
      }
    };
    
    initAuth();
  }, []);

  const initActor = (identity) => {
    const agent = new HttpAgent({ identity });
    
    // When deployed to the IC, we'll need this
    if (process.env.NODE_ENV !== 'development') {
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check your deploy environment:", err);
      });
    }
    
    const deaiActor = createActor(canisterId, { agent });
    setActor(deaiActor);
  };

  const login = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: process.env.DFX_NETWORK === 'ic' 
          ? 'https://identity.ic0.app' 
          : `http://localhost:8000?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`,
        onSuccess: async () => {
          setIsAuthenticated(true);
          
          const identity = authClient.getIdentity();
          setIdentity(identity);
          
          const principal = identity.getPrincipal();
          setPrincipal(principal);
          
          initActor(identity);
        },
        onError: (error) => {
          console.error("Login failed:", error);
        }
      });
    }
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setActor(null);
    }
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