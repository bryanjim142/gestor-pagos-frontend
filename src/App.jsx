import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './api/apiService'; 

// Importa Layouts, Vistas y Componentes de Ruta
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import About from './views/About';
import Products from './views/Products';
import Location from './views/Location';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import PayrollManagement from './views/PayrollManagement';
import UserManagement from './views/UserManagement';
import EmployeeDashboard from './views/EmployeeDashboard';
import AdminRoute from './Components/auth/AdminRoute';
import EmployeeRoute from './Components/auth/EmployeeRoute';
import EmployeeManagement from './views/EmployeeManagement';
import ReceiptManagement from './views/ReceiptManagement';
import PayrollHome from './views/PayrollHome';
import EmployeePayrollDetail from './views/EmployeePayrollDetail'; 


// Componente principal que usa el contexto
function AppContent() {
  const { userData, login, logout: contextLogout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

const onLoginSuccess = (apiResponse) => {
  // apiResponse es el objeto completo que viene de api.login
  // Por ejemplo: { success: true, authToken: "el_token", userData: {...} }

  // 1. Extraemos los datos que necesitamos directamente del objeto
  const user = apiResponse.userData;
  const token = apiResponse.authToken;

  // 2. Verificamos que tengamos lo necesario antes de continuar
  if (user && token) {
    // 3. Llamamos al login del contexto con los argumentos correctos
    login(user, token);
    
    // 4. Redirigimos al panel correspondiente
    const targetPath = user.TipoUsuario === 'admin' ? '/admin/dashboard' : '/empleado/dashboard';
    navigate(targetPath);
  } else {
    // Manejar el caso en que el login fue exitoso pero no vinieron los datos esperados
    console.error("Login exitoso pero faltan datos (usuario o token) en la respuesta de la API.", apiResponse);
    // Opcional: podrías mostrar un error al usuario aquí
  }
};
  const handleLogout = () => {
    api.logout(); // Limpia el token de tu API
    contextLogout(); // Limpia el contexto
    navigate('/'); 
  };


  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={userData} logout={handleLogout} />
      
      <main className="flex-grow-1">
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/ubicacion" element={<Location />} />
          <Route path="/login-admin" element={<Login userType="admin" onLoginSuccess={onLoginSuccess} />} />
          <Route path="/login-empleado" element={<Login userType="empleado" onLoginSuccess={onLoginSuccess} />} />

          {/* --- RUTAS PROTEGIDAS PARA ADMINISTRADOR --- */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute user={userData}>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        
          <Route 
            path="/admin/usuarios" 
            element={
              <AdminRoute user={userData}>
                <UserManagement />
              </AdminRoute>
            } 
          />
          
          {/* --- RUTA PROTEGIDA PARA EMPLEADO --- */}
          <Route 
            path="/empleado/dashboard" 
            element={
              <EmployeeRoute user={userData}>
                <EmployeeDashboard user={userData} />
              </EmployeeRoute>
            } 
            
          />
          <Route 
    path="/admin/empleados" 
    element={
        <AdminRoute>
            <EmployeeManagement />
        </AdminRoute>
    } 
/>

<Route 
    path="/admin/recibos" 
    element={
        <AdminRoute>
            <ReceiptManagement />
        </AdminRoute>
    } 
/>
 {/* RUTA PRINCIPAL DE NÓMINA (NUEVA) */}
            <Route 
                path="/admin/nomina"
                element={
                    <AdminRoute>
                        <PayrollHome />
                    </AdminRoute>
                } 
            />

            {/* RUTA DE DETALLE DE NÓMINA POR EMPLEADO (NUEVA) */}
            <Route 
                path="/admin/nomina/empleado/:employeeId"
                element={
                    <AdminRoute>
                        <EmployeePayrollDetail />
                    </AdminRoute>
                } 
            />
              <Route 
            path="/admin/nomina" 
            element={
              <AdminRoute user={userData}>
                <PayrollManagement />
              </AdminRoute>
            } 
          />

          {/* Ruta para cualquier otra URL no definida, redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// App principal con el Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}