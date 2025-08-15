//GESTOR NOMINA 

//GESTOR NOMINA 

// Ubicación recomendada: src/views/EmployeePayrollDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/apiService';
import PayrollModal from './PayrollModal'; // Importa el modal que ya tienes


const EmployeePayrollDetail = () => {
    const { employeeId } = useParams(); // Obtiene el ID del empleado de la URL
    const [employee, setEmployee] = useState(null);
    const [payrollHistory, setPayrollHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para el modal
    const [showModal, setShowModal] = useState(false);
    const [editingPayroll, setEditingPayroll] = useState(null);

    // Carga los datos del empleado y su historial
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Asumo que tienes endpoints así en tu apiService
                const employeeData = await api.getEmployee(employeeId);
                const payrollData = await api.getPayrollForEmployee(employeeId);
                setEmployee(employeeData);
                setPayrollHistory(payrollData);
            } catch (err) {
                setError('Error al cargar los detalles del empleado.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [employeeId]);

    // Lógica para abrir/cerrar/guardar el modal (como la tenías, pero aplicada aquí)
    const handleOpenModal = (payrollItem = null) => {
        setEditingPayroll(payrollItem);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSavePayroll = async (formData) => {
        const payload = {
            // Se elimina parseInt() para pasar el ID como string
            IdEmpleado: employeeId, 
            PeriodoPago: formData.periodoPago,
            SalarioBruto: formData.salarioBruto,
            Deducciones: formData.deducciones,
            MetodoPago: formData.metodoPago
        };

        try {
            if (editingPayroll) {
                // --- MODO EDICIÓN ---
                const updatedItem = await api.updatePayroll(editingPayroll.idNomina, payload);
                setPayrollHistory(prev => prev.map(item => item.idNomina === editingPayroll.idNomina ? updatedItem : item));
            } else {
                // --- MODO CREACIÓN ---
                const newItemFromApi = await api.createPayroll(payload);

                const newItemWithDate = {
                    ...newItemFromApi,
                    fechaCreacion: newItemFromApi.fechaCreacion || new Date().toISOString()
                };

                setPayrollHistory(prev => [...prev, newItemWithDate]);
            }
            handleCloseModal();
            setError(''); 
        } catch (err) {
            console.error('Error al guardar la nómina:', err);
            setError('No se pudo guardar. Revisa que todos los datos sean correctos.');
        }
    };
    // ... aquí iría la función handleDeletePayroll si la necesitas ...

    if (loading) return <p className="text-center mt-5">Cargando detalles...</p>;
    if (error) return <p className="alert alert-danger text-center mt-5">{error}</p>;
    if (!employee) return <p className="text-center mt-5">Empleado no encontrado.</p>;

    return (
        <div className="container py-5">
            {/* Encabezado con nombre y botón de volver */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">{`${employee.nombre} ${employee.apellido}`}</h2>
                    <p className="text-muted mb-0">{employee.cargo}</p>
                </div>
                <Link to="/admin/nomina" className="btn btn-secondary">Volver al Listado</Link>
            </div>

            {/* Sección 1: Datos Personales */}
            <div className="card mb-4">
                <div className="card-header"><h5 className="mb-0">Datos Personales</h5></div>
                <div className="card-body">
                    <p><strong>DNI:</strong> {employee.idEmpleado}</p>
                    <p><strong>Fecha Contratación:</strong> {new Date(employee.fechaContratacion).toLocaleDateString()}</p>
                    <p><strong>Salario Base:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(employee.salarioBase)}</p>
                </div>
            </div>

            {/* Sección 2 y 3: Historial y Botón para Generar Nómina */}
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Historial de Nóminas</h5>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        Generar Nueva Nómina
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Periodo de Pago</th>
                                    <th>Fecha de Registro</th>
                                    <th>Salario Bruto</th>
                                    <th>Deducciones</th>
                                    <th>Salario Neto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrollHistory.map(item => (
                                    <tr key={item.idNomina}>
                                        <td>{item.periodoPago}</td>
                                        <td>{new Date(item.fechaCreacion).toLocaleDateString()}</td>
                                        <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.salarioBruto)}</td>
                                        <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.deducciones)}</td>
                                        <td className="fw-bold">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.salarioNeto)}</td>
                                        <td>
                                            <button className="btn btn-sm btn-warning" onClick={() => handleOpenModal(item)}>Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para agregar/editar la nómina */}
            <PayrollModal
                show={showModal}
                onHide={handleCloseModal}
                onSave={handleSavePayroll}
                payrollItem={editingPayroll}
            />
        </div>
    );
};

export default EmployeePayrollDetail;