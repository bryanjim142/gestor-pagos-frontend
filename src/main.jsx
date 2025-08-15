import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

// --- IMPORTACIONES DE BOOTSTRAP ---
import 'bootstrap/dist/css/bootstrap.min.css';
// Importa los iconos de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { AuthProvider } from './context/AuthContext';


ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
