import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmployeeRoute = ({ children }) => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Comprobamos si el tipo de usuario es 'empleado' 
  if (isAuthenticated && userType === 'empleado') {
    return children;
  }

  // Si no es un empleado autenticado, lo redirigimos a su página de login
  return <Navigate to="/login-empleado" replace />;
};

export default EmployeeRoute;