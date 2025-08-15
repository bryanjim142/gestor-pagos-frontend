import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  // Obtenemos los datos directamente del contexto
  const { isAuthenticated, userType, loading } = useAuth();

  // 1. Si todavía está cargando la información de la sesión, mostramos un mensaje
  if (loading) {
    return <div>Cargando...</div>;
  }

  // 2. Si ya terminó de cargar y el usuario es un admin autenticado, le damos paso
  if (isAuthenticated && userType === 'admin') {
    return children;
  }

  // 3. Si no, lo redirigimos al login de administradores
  return <Navigate to="/login-admin" replace />;
};

export default AdminRoute;