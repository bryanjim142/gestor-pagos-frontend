import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiService';
import PayrollModal from './PayrollModal'; // Importamos el modal

const PayrollManagement = () => {
    const [nomina, setNomina] = useState([]);
    const [employees, setEmployees] = useState([]); // Para el dropdown del modal
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para el modal
    const [showModal, setShowModal] = useState(false);
    const [editingPayroll, setEditingPayroll] = useState(null);

   // --- Carga inicial de datos ---
useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const payrollData = await api.getPayroll();
            // ¡CAMBIO CLAVE! Llama a getEmployees en lugar de getUsers
            const employeesData = await api.getEmployees(); 
            
            setNomina(payrollData);
            setEmployees(employeesData); // Ahora el estado 'employees' tiene los datos correctos
        } catch (err) {
            // ... (manejo de error)
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);

    // --- Lógica para manejar el modal ---
    const handleOpenModal = (payrollItem = null) => {
        setEditingPayroll(payrollItem);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPayroll(null);
    };

    // --- Lógica para guardar (Crear o Actualizar) ---
    const handleSavePayroll = async (formData) => {
        // El salario neto se calcula, no se envía
        const dataToSave = { ...formData };
        delete dataToSave.SalarioNeto; 

        try {
            if (editingPayroll) {
                // --- MODO ACTUALIZACIÓN ---
                const updatedItem = await api.updatePayroll(editingPayroll.IdNomina, dataToSave);
                setNomina(nomina.map(item => item.IdNomina === editingPayroll.IdNomina ? updatedItem : item));
            } else {
                // --- MODO CREACIÓN ---
                const newItem = await api.createPayroll(dataToSave);
                setNomina([...nomina, newItem]);
            }
            handleCloseModal();
        } catch (err) {
            setError('Error al guardar el registro de nómina.');
            console.error(err);
        }
    };

    // --- Lógica para eliminar ---
    const handleDeletePayroll = async (payrollId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro de nómina?')) {
            try {
                await api.deletePayroll(payrollId);
                setNomina(nomina.filter(item => item.IdNomina !== payrollId));
            } catch (err) {
                setError('Error al eliminar el registro.');
                console.error(err);
            }
        }
    };

    if (loading) return <p className="text-center mt-5">Cargando datos de nómina...</p>;
    if (error) return <p className="alert alert-danger text-center mt-5">{error}</p>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Gestión de Nómina</h2>
                <div>
                    <button className="btn btn-primary me-2" onClick={() => handleOpenModal()}>
                        <i className="bi bi-plus-circle me-2"></i>Agregar Registro
                    </button>
                    <Link to="/admin/dashboard" className="btn btn-secondary">
                        <i className="bi bi-arrow-left-circle me-2"></i>Volver
                    </Link>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID Nómina</th>
                            <th>Empleado</th>
                            <th>Periodo</th>
                            <th>Salario Bruto</th>
                            <th>Deducciones</th>
                            <th>Salario Neto</th>
                            <th>Método de Pago</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                  <tbody>
      {nomina.map(item => {
        // La lógica de búsqueda ahora usará la lista correcta de empleados
        const employee = employees.find(e => e.idEmpleado === item.idEmpleado);
        // Ahora podemos usar Nombre y Apellido
        const employeeName = employee ? `${employee.nombre} ${employee.apellido}` : 'Empleado no encontrado';

        return (
            <tr key={item.idNomina}>
                <td>{item.idNomina}</td>
                <td>{employeeName}</td> {/* <-- SE MOSTRARÁ EL NOMBRE COMPLETO */}
                <td>{item.periodoPago}</td>
                <td>
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.salarioBruto)}
                </td>
                <td>
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.deducciones)}
                </td>
                <td className="fw-bold">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.salarioNeto)}
                </td>
                <td>{item.metodoPago}</td>
                <td className="text-center">
                    <button className="btn btn-sm btn-warning me-2" title="Editar" onClick={() => handleOpenModal(item)}>
                        <i className="bi bi-pencil-fill"></i>
                    </button>
                    {/* Pasamos el idNomina en camelCase */}
                    <button className="btn btn-sm btn-danger" title="Eliminar" onClick={() => handleDeletePayroll(item.idNomina)}>
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
        );
        
    })}
</tbody>
                </table>
            </div>

            <PayrollModal 
                show={showModal}
                onHide={handleCloseModal}
                onSave={handleSavePayroll}
                payrollItem={editingPayroll}
                employees={employees}
            />
        </div>
    );
};

export default PayrollManagement;
