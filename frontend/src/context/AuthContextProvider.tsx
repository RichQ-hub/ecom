import React, { ReactNode, createContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string;
  name: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [token, setToken] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const existingToken = localStorage.getItem('token') ? (localStorage.getItem('token') as string) : '';
    const existingName = localStorage.getItem('name') ? (localStorage.getItem('name') as string) : '';
    setToken(existingToken);
    setName(existingName);
  }, []);

  return (
    <AuthContext.Provider value={{ token, name, setToken, setName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
