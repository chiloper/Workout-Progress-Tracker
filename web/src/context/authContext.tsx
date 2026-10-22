import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, TokenStorage } from "../lib/api";
import { AuthContext } from "./auth";

interface User {
  id: string;
  email: string
}


const readStoredUser = (): User | null => {
  if (!TokenStorage.getAccessToken()) return null
  try {
    const me = TokenStorage.getUser()
    if (!me) TokenStorage.clear()
    return me
  } catch {
    return null
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(readStoredUser)
  const navigate = useNavigate()

  const refreshUser = async () => {
    setUser(readStoredUser())
  }

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
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

