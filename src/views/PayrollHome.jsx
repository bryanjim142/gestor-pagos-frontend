//GESTOR DE NOMINA 

// Ubicación recomendada: src/views/PayrollHome.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/apiService'; // Asegúrate que la ruta a tu API sea correcta

const PayrollHome = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const employeesData = await api.getEmployees();
                setEmployees(employeesData);
            } catch (err) {
                setError('Error al cargar los empleados.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Esta función te llevará a la pantalla de detalle de cada empleado
    const handleEmployeeClick = (employeeId) => {
        navigate(`/admin/nomina/empleado/${employeeId}`);
    };

    const filteredEmployees = employees.filter(emp => {
        const fullName = `${emp.nombre} ${emp.apellido}`.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();
        return fullName.includes(searchTermLower) ||
               (emp.dni && emp.dni.toLowerCase().includes(searchTermLower)) ||
               (emp.cargo && emp.cargo.toLowerCase().includes(searchTermLower));
    });

    if (loading) return <p className="text-center mt-5">Cargando empleados...</p>;
    if (error) return <p className="alert alert-danger text-center mt-5">{error}</p>;

    return (
        <div className="container py-5">
            <h2 className="mb-4">Gestor de Nómina</h2>
            <p className="text-muted">Selecciona un empleado para ver su historial o generar una nueva nómina.</p>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, DNI o cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre Completo</th>
                            <th>Cargo</th>
                            <th>DNI</th>
                            <th>Salario Base</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.idEmpleado} onClick={() => handleEmployeeClick(emp.idEmpleado)} style={{ cursor: 'pointer' }}>
                                <td>{`${emp.nombre} ${emp.apellido}`}</td>
                                <td>{emp.cargo || 'No especificado'}</td>
                                <td>{emp.idEmpleado || 'No especificado'}</td>
                                <td>
                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(emp.salarioBase || 0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollHome;