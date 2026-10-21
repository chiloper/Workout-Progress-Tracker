import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi, TokenStorage } from "../lib/api";

interface User {
  id: string;
  email: string
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isPublicPage =
    pathname === '/login' ||
    pathname === '/login/' ||
    pathname === '/register' ||
    pathname === '/register/';

  const checkAuth = async () => {

    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      // Automatically store token on email confirmation signup callback
      if (hash.includes('type=signup') || hash.includes('type=email_change')) {
        const hashParams = new URLSearchParams(hash.substring(1));
        const token = hashParams.get('access_token');
        if (token) {
          TokenStorage.setSession(token);
        }
      }
    }



    const token = TokenStorage.getAccessToken()
    if (!token) {
      setUser(null);
      setLoading(false);
      if (!isPublicPage) {
        navigate('/login')
      }
      return;
    }

    const me = TokenStorage.getUser()
    if (me) {
      setUser(me)
    } else {
      TokenStorage.clear()
      setUser(null)
      if (!isPublicPage) {
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const login = async (email: string, pass: string) => {
    const data = await authApi.login(email, pass);
    setUser(data.user)
    navigate('/')
  }

  const register = async (email: string, pass: string) => {
    const data = await authApi.register(email, pass);
    if (data.user) {
      setUser(data.user)
      navigate('/')
    }
    return data
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser: checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)