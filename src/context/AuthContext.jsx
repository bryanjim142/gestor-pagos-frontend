import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Comprobar si hay una sesión al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    if (token && user) {
      setUserData(JSON.parse(user));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (user, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    setUserData(user);
    setIsAuthenticated(true);
  };

  // --- ¡AQUÍ ESTÁ LA FUNCIÓN QUE FALTA! ---
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUserData(null);
    setIsAuthenticated(false);
    navigate('/'); // Redirige al inicio después de cerrar sesión
  };

  const value = {
    userData,
    isAuthenticated,
    loading,
    userType: userData?.tipoUsuario,
    login,
    logout, // <-- Asegúrate de exportarla en el value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};