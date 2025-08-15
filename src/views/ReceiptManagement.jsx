
//GESTOR DE RECIBOS 

// src/views/ReceiptManagement.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiService';
import ReceiptViewModal from './ReceiptViewModal';

const ReceiptManagement = () => {
    const [recibos, setRecibos] = useState([]);
    const [employees, setEmployees] = useState([]);
    // Estado para la nómina
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Ahora se obtienen los datos de Recibos, Empleados y Nómina
                const [recibosData, employeesData, payrollsData] = await Promise.all([
                    api.getRecibos(), 
                    api.getEmployees(),
                    api.getPayroll() // Se necesita para obtener el salario
                ]);
                setRecibos(recibosData);
                setEmployees(employeesData);
                setPayrolls(payrollsData); // Almacena los datos de nómina
                setError('');
            } catch (err) {
                setError('Error al cargar los datos. Por favor, inténtelo de nuevo.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleViewReceipt = (reciboItem) => {
        const employee = employees.find(e => e.idEmpleado === reciboItem.idEmpleado);
        const payroll = payrolls.find(p => p.idNomina === reciboItem.idNomina);
        setSelectedReceipt({ ...reciboItem, employee, payroll });
    };

    const handleCloseModal = () => {
        setSelectedReceipt(null);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
    if (error) return <p className="alert alert-danger text-center mt-5">{error}</p>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Gestión de Recibos de Pago</h2>
                <Link to="/admin/dashboard" className="btn btn-secondary">
                    <i className="bi bi-arrow-left-circle me-2"></i>Volver al Panel
                </Link>
            </div>
            
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID Recibo</th>
                            <th>ID Nómina</th>
                            <th>Empleado</th>
                            <th>Salario Neto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recibos.length > 0 ? (
                            recibos.map((recibo) => {
                                const employee = employees.find(e => e.idEmpleado === recibo.idEmpleado);
                                // Relaciona el recibo con la nómina para obtener el salario
                                const payroll = payrolls.find(p => p.idNomina === recibo.idNomina);
                                return (
                                    <tr key={recibo.idRecibo}>
                                        <td>{recibo.idRecibo}</td>
                                        <td>{recibo.idNomina}</td>
                                        <td>{employee ? `${employee.nombre} ${employee.apellido}` : 'Empleado no encontrado'}</td>
                                        {/* Muestra el salario neto desde el objeto de nómina */}
                                        <td>{payroll ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(payroll.salarioNeto) : 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn btn-info btn-sm me-2"
                                                onClick={() => handleViewReceipt(recibo)}
                                            >
                                                Ver Recibo
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No se encontraron recibos de pago.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ReceiptViewModal
                show={!!selectedReceipt}
                onHide={handleCloseModal}
                receipt={selectedReceipt}
            />
        </div>
    );
};

export default ReceiptManagement;