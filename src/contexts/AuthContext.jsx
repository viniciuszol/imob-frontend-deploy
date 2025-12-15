import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, registerRequest } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // Login
  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);
    setUser({ email });
  };

  // Registrar
  const register = async (nome, email, password) => {
    await registerRequest(nome, email, password);
  };

  // Logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
