import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { api } from '../api/apiService';

const AdminDashboard = () => {
    const { userData, logout } = useAuth();
    const [stats, setStats] = useState({ totalEmployees: 0, totalPayrolls: 0, activeUsers: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const usersData = await api.getUsers();
                const employeesData = await api.getEmployees();
                // Si la API puede devolver el conteo de nóminas
                const payrollsData = await api.getPayroll();

                const activeCount = usersData.filter(u => u.Estado === 'activo').length;
                
                setStats({ 
                    totalEmployees: employeesData.length,
                    totalPayrolls: payrollsData.length, // Conteo dinámico de nóminas
                    activeUsers: activeCount
                });
            } catch (error) {
                console.error("Error al cargar los datos del dashboard:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        // Cargar Bootstrap CSS
        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Cargar Bootstrap Icons
        const iconLink = document.createElement('link');
        iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css';
        iconLink.rel = 'stylesheet';
        document.head.appendChild(iconLink);

        // Cargar Bootstrap JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js';
        document.body.appendChild(script);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(iconLink);
            document.body.removeChild(script);
        };
    }, []);

    if (!userData) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <style>{`
                body { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .card {
                    border: none;
                    border-radius: 15px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                }
                .stat-card {
                    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
                }
                .nav-header {
                    background: linear-gradient(135deg, #4c63d2 0%, #6c5ce7 100%);
                }
                .btn-custom {
                    border-radius: 10px;
                    padding: 10px 20px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .btn-custom:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .icon-wrapper {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .quick-access-btn {
                    background: white;
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    padding: 20px;
                    text-decoration: none;
                    color: #495057;
                    transition: all 0.3s ease;
                }
                .quick-access-btn:hover {
                    border-color: #6c5ce7;
                    color: #6c5ce7;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 20px rgba(108, 92, 231, 0.2);
                }
                .module-card {
                    border-radius: 15px;
                    overflow: hidden;
                }
                .module-header {
                    padding: 20px;
                    color: white;
                }
                /* --- INICIO: ESTILO PERSONALIZADO PARA NUEVO MÓDULO --- */
                .bg-purple-custom {
                    background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
                }
                .btn-purple-custom {
                    background-color: #9b59b6;
                    border-color: #9b59b6;
                    color: white;
                }
                /* --- FIN: ESTILO PERSONALIZADO --- */
            `}</style>

            <div className="min-vh-100">
                {/* Header */}
                <nav className="navbar navbar-expand-lg nav-header shadow-sm">
                    <div className="container-fluid px-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-white bg-opacity-20 rounded-3 p-2 me-3">
                                <i className="bi bi-speedometer2 text-white fs-5"></i>
                            </div>
                            <div>
                                <h1 className="navbar-brand mb-0 text-white fw-bold fs-3">Panel Administrativo</h1>
                                <small className="text-white-50">Hola, {userData.NombreUsuario || 'Administrador'} 👋</small>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-outline-light btn-custom"
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="container-fluid px-4 py-4">
                    {/* Statistics Cards */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            {/* Card Empleados */}
                            <div className="card stat-card h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="icon-wrapper bg-primary bg-opacity-10 text-primary me-3">
                                        <i className="bi bi-people fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="card-subtitle mb-1 text-muted">Empleados</h6>
                                        <h3 className="card-title mb-0 fw-bold">
                                            {loadingStats ? '...' : stats.totalEmployees}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                             {/* Card Nóminas */}
                            <div className="card stat-card h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="icon-wrapper bg-success bg-opacity-10 text-success me-3">
                                        <i className="bi bi-cash-stack fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="card-subtitle mb-1 text-muted">Nóminas</h6>
                                        <h3 className="card-title mb-0 fw-bold">
                                            {loadingStats ? '...' : stats.totalPayrolls}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                             {/* Card Usuarios Activos */}
                            <div className="card stat-card h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="icon-wrapper bg-warning bg-opacity-10 text-warning me-3">
                                        <i className="bi bi-lightning fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="card-subtitle mb-1 text-muted">Usuarios Activos</h6>
                                        <h3 className="card-title mb-0 fw-bold">
                                            {loadingStats ? '...' : stats.activeUsers}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Management Modules */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-3">
                            {/* Módulo de Gestión de Usuarios */}
                            <div className="card module-card h-100">
                                <div className="module-header bg-primary">
                                    <div className="d-flex align-items-center"> <i className="bi bi-person-lock me-3 fs-4"></i>
                                        <div>
                                            <h5 className="mb-1 fw-bold">Usuarios</h5>
                                            <p className="mb-0 opacity-75 small">Controla accesos</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column"><p className="text-muted small">Administra las cuentas de acceso, roles y estados de los usuarios.</p>
                                    <div className="mt-auto">
                                        <Link to="/admin/usuarios" className="btn btn-primary btn-custom w-100"><i className="bi bi-arrow-right-circle me-2"></i> Acceder</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            {/* Módulo de Gestión de Empleados */}
                            <div className="card module-card h-100">
                                <div className="module-header bg-info">
                                    <div className="d-flex align-items-center"><i className="bi bi-person-badge-fill me-3 fs-4"></i>
                                        <div>
                                            <h5 className="mb-1 fw-bold">Empleados</h5>
                                            <p className="mb-0 opacity-75 small">Administra perfiles</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column"><p className="text-muted small">Gestiona la información de cada empleado, como su cargo y salario.</p>
                                    <div className="mt-auto">
                                        <Link to="/admin/empleados" className="btn btn-info btn-custom w-100 text-white"><i className="bi bi-arrow-right-circle me-2"></i> Acceder</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            {/* Módulo de Gestión de Nómina */}
                            <div className="card module-card h-100">
                                <div className="module-header bg-success">
                                    <div className="d-flex align-items-center"><i className="bi bi-calculator-fill me-3 fs-4"></i>
                                        <div>
                                            <h5 className="mb-1 fw-bold">Nómina</h5>
                                            <p className="mb-0 opacity-75 small">Procesa pagos</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column"><p className="text-muted small">Calcula salarios, genera y edita los registros de pago del personal.</p>
                                    <div className="mt-auto">
                                        <Link to="/admin/nomina" className="btn btn-success btn-custom w-100"><i className="bi bi-arrow-right-circle me-2"></i> Acceder</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- INICIO DEL NUEVO MÓDULO: GESTIÓN DE RECIBOS --- */}
                        <div className="col-lg-3">
                            <div className="card module-card h-100">
                                <div className="module-header bg-purple-custom">
                                    <div className="d-flex align-items-center"><i className="bi bi-receipt-cutoff me-3 fs-4"></i>
                                        <div>
                                            <h5 className="mb-1 fw-bold">Recibos</h5>
                                            <p className="mb-0 opacity-75 small">Genera y revisa</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column"><p className="text-muted small">Visualiza y genera los recibos de pago para los empleados basados en la nómina.</p>
                                    <div className="mt-auto">
                                        <Link to="/admin/recibos" className="btn btn-purple-custom btn-custom w-100"><i className="bi bi-arrow-right-circle me-2"></i> Acceder</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* --- FIN DEL NUEVO MÓDULO --- */}

                    </div>
                    {/* El resto de tu dashboard (Quick Access, etc.) sigue aquí */}
                </div>

                {/* Footer */}
                <div className="container-fluid px-4 pb-3">
                    <div className="text-center">
                        <small className="text-white-50">© 2025 Piscicola El Manantial. Todos los derechos reservados.</small>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;