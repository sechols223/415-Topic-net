import React, { useState, useEffect, createContext, useContext } from 'react';

import { LoginDto, Optional, User } from '../types';
import { Api } from '../config';
import { getCurrentUser } from './common';

type AuthContextValue = {
  user: User | null | undefined;
  login: (request: LoginDto) => Promise<void>;
  register: (inputData: Registration) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<Optional<User>>;
};

type Registration = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  address: string;
  email: string;
  roles: Array<string>;
};

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getCurrentUser: () => Promise.resolve() as Promise<Optional<User>>,
});

/**
 * Hook that returns the current authentication context.
 * @returns {AuthContextValue} The authentication context value containing user data and auth functions
 * @throws {Error} If the hook is not used within an AuthProvider
 */

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Authentication context provider component that wraps its children components and provides authentication-related data and functions to them.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 *
 * @returns {JSX.Element} The authentication context provider component.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    const getUser = async () => {
      const response = await getCurrentUser();
      setUser(response);
    };
    getUser();
  }, [user]);

  async function login(request: LoginDto) {
    try {
      const { data, status } = await Api.post<User>('/auth/login', { ...request });
      if (status === 200) {
        setUser(data);
      } else {
        throw Error;
      }
    } catch {
      throw Error;
    }
  }

  async function register(inputData: Registration) {
    try {
      const { data, status } = await Api.post<User>('/users', inputData);

      if (status === 200) {
        setUser(data);
      } else {
        throw Error;
      }
    } catch {
      throw Error;
    }
  }

  async function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
