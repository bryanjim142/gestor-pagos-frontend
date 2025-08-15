import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Quitamos 'user' y 'logout' de las props, ya no son necesarios
const Navbar = () => {
  // Obtenemos todo lo necesario del contexto, incluyendo logout
  const { userData, isAuthenticated, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // <-- Ahora esta función viene del contexto y funciona
  };

  // Función para obtener la ruta del dashboard basada en el tipo de usuario
  const getDashboardRoute = () => {
    // Verificar diferentes formas en que puede venir el tipo de usuario
    const userType = userData?.TipoUsuario || userData?.tipoUsuario || userData?.tipo;
    
    switch (userType?.toLowerCase()) {
      case 'admin':
      case 'administrador':
      case 'administrativo':
        return '/admin/dashboard';
      case 'empleado':
      case 'employee':
        return '/empleado/dashboard';
      case 'rrhh':
      case 'recursos humanos':
      case 'recursoshumanos':
        return '/rrhh/dashboard';
      default:
        return '/empleado/dashboard'; // Ruta por defecto
    }
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-water me-2"></i>Gestor de Pagos
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/ubicacion">Ubicación</NavLink></li>
          </ul>
          <ul className="navbar-nav">
             {isAuthenticated ? (
               <li className="nav-item dropdown">
                 <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                   <i className="bi bi-person-circle me-1"></i> 
                   Bienvenido, {userData?.NombreUsuario || userData?.NombreCompleto || userData?.username || 'Usuario'}
                 </a>
                 <ul className="dropdown-menu dropdown-menu-end">
                   <li>
                     <Link 
                       className="dropdown-item" 
                       to={getDashboardRoute()}
                     >
                       Mi Panel
                     </Link>
                   </li>
                   <li><hr className="dropdown-divider" /></li>
                   <li><a className="dropdown-item" href="#" onClick={handleLogout}>Cerrar Sesión</a></li>
                 </ul>
               </li>
             ) : (
               <li className="nav-item dropdown">
                 <a className="nav-link dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown">
                   <i className="bi bi-box-arrow-in-right me-1"></i> Corporativo
                 </a>
                 <ul className="dropdown-menu dropdown-menu-end">
                   <li><Link className="dropdown-item" to="/login-admin">Acceso Administrativo</Link></li>
                   <li><Link className="dropdown-item" to="/login-empleado">Acceso Empleados</Link></li>
                 </ul>
               </li>
             )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;