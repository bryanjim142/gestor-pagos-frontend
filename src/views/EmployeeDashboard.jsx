// src/views/EmployeeDashboard.jsx (Modificado)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiService';
import ReceiptHistory from '../components/ReceiptHistory'; // <-- Importa el historial
import PaymentReceipt from '../components/PaymentReceipt'; // <-- Asumo que este es el path de tu componente

const EmployeeDashboard = () => {
    const { userData, logout } = useAuth();

    // 1. Estados para manejar los datos y la vista
    const [employeeProfile, setEmployeeProfile] = useState(null);
    const [receipts, setReceipts] = useState([]);
    const [selectedReceiptId, setSelectedReceiptId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 2. Efecto para cargar los datos del empleado y sus recibos
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                // Usamos Promise.all para cargar ambos al mismo tiempo
                const [profileData, receiptsData] = await Promise.all([
                    api.getCurrentEmployeeProfile(),
                    api.getReceiptsForCurrentUser()
                ]);
                setEmployeeProfile(profileData);
                setReceipts(receiptsData);
            } catch (err) {
                setError('Hubo un error al cargar la información de tu panel. Inténtalo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    useEffect(() => {
        // Tu código para cargar Bootstrap sigue siendo útil
        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        const iconLink = document.createElement('link');
        iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css';
        iconLink.rel = 'stylesheet';
        document.head.appendChild(iconLink);
        return () => {
            document.head.removeChild(link);
            document.head.removeChild(iconLink);
        };
    }, []);

    // 3. Funciones para manejar la selección de vistas
    const handleSelectReceipt = (receiptId) => {
        setSelectedReceiptId(receiptId);
    };

    const handleBackToHistory = () => {
        setSelectedReceiptId(null);
    };

    // Pantalla de carga mientras se obtienen los datos
    if (loading || !userData || !employeeProfile) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100" style={{background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)'}}>
                <div className="text-center text-white">
                    <div className="spinner-border mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando datos del empleado...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{/* ... Tus estilos permanecen igual ... */`
                body { 
                  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
                  min-height: 100vh;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                /* ... Pega el resto de tus estilos aquí ... */
            `}</style>
            
            <div className="min-vh-100">
                {/* Header */}
                <nav className="navbar navbar-expand-lg nav-header shadow-sm" style={{background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'}}>
                    <div className="container-fluid px-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-white bg-opacity-20 rounded-3 p-2 me-3">
                                <i className="bi bi-person-workspace text-white fs-5"></i>
                            </div>
                            <div>
                                <h1 className="navbar-brand mb-0 text-white fw-bold fs-3">Panel de Empleado</h1>
                                {/* Usamos el nombre del perfil del empleado */}
                                <small className="text-white-50">Bienvenido, {employeeProfile.nombre || userData.nombreUsuario} 👋</small>
                            </div>
                        </div>
                        <button onClick={logout} className="btn btn-outline-light">
                            <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                        </button>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="container-fluid px-4 py-4">
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* 4. Renderizado condicional del contenido principal */}
                    {selectedReceiptId ? (
                        // Vista de Detalle del Recibo
                        <PaymentReceipt 
                            receiptId={selectedReceiptId} 
                            employee={employeeProfile} 
                            onBack={handleBackToHistory} 
                        />
                    ) : (
                        // Vista de Historial de Recibos
                        <ReceiptHistory 
                            receipts={receipts}
                            onSelectReceipt={handleSelectReceipt}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="container-fluid px-4 py-3 mt-4">
                    <div className="text-center">
                        <small className="text-white-50">© 2025 Piscicola El Manantial. Panel de Empleado.</small>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeDashboard;