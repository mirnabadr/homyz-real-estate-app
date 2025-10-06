import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "./appwrite";

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      console.log('Fetching user data...');
      const userData = await getCurrentUser();
      console.log('User data fetched:', userData);
      setUser(userData);
    } catch (error: any) {
      console.log('Error fetching user:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isLogged = !!user;

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;