
// SOLO EMPLEADOS 

// src/views/EmployeeManagement.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiService';

const EmployeeManagement = () => {
    // Estado para la lista de empleados y el formulario
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]); // Para el dropdown de usuarios sin perfil de empleado
    const [formData, setFormData] = useState({
        idUsuario: '',
        nombre: '',
        apellido: '',
        correoElectronico: '',
        cargo: '',
        salarioBase: '',
        estado: 'activo'
    });
    const [editingEmployee, setEditingEmployee] = useState(null);

    // Estados para notificaciones y carga
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Carga inicial de datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeesData = await api.getEmployees();
                const usersData = await api.getUsers();
                setEmployees(employeesData);
                
                // Filtramos los usuarios que ya tienen un perfil de empleado creado
                const employeeUserIds = employeesData.map(emp => emp.idUsuario);
                const availableUsers = usersData.filter(user => user.tipoUsuario === 'empleado' && !employeeUserIds.includes(user.idUsuario));
                setUsers(availableUsers);

            } catch (err) {
                setError('Error al cargar los datos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectForEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            idUsuario: employee.idUsuario,
            nombre: employee.nombre,
            apellido: employee.apellido,
            correoElectronico: employee.correoElectronico,
            cargo: employee.cargo,
            salarioBase: employee.salarioBase,
            estado: employee.estado
        });
        window.scrollTo(0, 0);
    };

    const cancelEdit = () => {
        setEditingEmployee(null);
        setFormData({
            idUsuario: '', nombre: '', apellido: '', correoElectronico: '', cargo: '', salarioBase: '', estado: 'activo'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingEmployee) {
                // Modo Actualización
                await api.updateEmployee(editingEmployee.idEmpleado, formData);
                setSuccess('¡Empleado actualizado con éxito!');
            } else {
                // Modo Creación
                await api.createEmployee(formData);
                setSuccess('¡Empleado creado con éxito!');
            }
            // Recargar datos para ver los cambios
            setLoading(true);
            const employeesData = await api.getEmployees();
            setEmployees(employeesData);
            cancelEdit();
        } catch (err) {
            setError('Error al guardar el empleado. Verifique los datos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // Aquí iría la lógica para eliminar, si la necesitas.

    return (
        <div className="container py-5">
            <Link to="/admin/dashboard" className="btn btn-secondary mb-4">
                <i className="bi bi-arrow-left-circle me-2"></i> Volver al Panel
            </Link>

            <div className="row">
                {/* --- FORMULARIO --- */}
                <div className="col-md-5 mb-4">
                    <h2 className="mb-4">{editingEmployee ? 'Editar Empleado' : 'Crear Nuevo Empleado'}</h2>
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {success && <div className="alert alert-success">{success}</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                
                                {!editingEmployee && (
                                <div className="mb-3">
                                    <label htmlFor="idUsuario" className="form-label">Usuario del Sistema</label>
                                    <select id="idUsuario" name="idUsuario" className="form-select" value={formData.idUsuario} onChange={handleChange} required>
                                        <option value="" disabled>Seleccione un usuario para vincular</option>
                                        {users.map(user => (
                                            <option key={user.idUsuario} value={user.idUsuario}>{user.nombreUsuario}</option>
                                        ))}
                                    </select>
                                    <small className="form-text text-muted">
                                        Solo aparecen usuarios de tipo "empleado" sin un perfil creado.
                                    </small>
                                </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input type="text" id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="apellido" className="form-label">Apellido</label>
                                    <input type="text" id="apellido" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="correoElectronico" className="form-label">Correo Electrónico</label>
                                    <input type="email" id="correoElectronico" name="correoElectronico" className="form-control" value={formData.correoElectronico} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cargo" className="form-label">Cargo</label>
                                    <input type="text" id="cargo" name="cargo" className="form-control" value={formData.cargo} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="salarioBase" className="form-label">Salario Base</label>
                                    <input type="number" step="0.01" id="salarioBase" name="salarioBase" className="form-control" value={formData.salarioBase} onChange={handleChange} />
                                </div>

                                <div className="d-flex justify-content-start">
                                    <button type="submit" className="btn btn-primary">{editingEmployee ? 'Actualizar' : 'Crear Empleado'}</button>
                                    {editingEmployee && <button type="button" className="btn btn-secondary ms-2" onClick={cancelEdit}>Cancelar</button>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- LISTA DE EMPLEADOS --- */}
                <div className="col-md-7">
                    <h2 className="mb-4">Empleados Registrados</h2>
                    {loading && <p>Cargando...</p>}
                    <ul className="list-group">
                        {employees.map(emp => (
                            <li key={emp.idEmpleado} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold">{emp.nombre} {emp.apellido}</span>
                                    <br />
                                    <span className="text-muted">{emp.cargo}</span>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleSelectForEdit(emp)}>
                                        <i className="bi bi-pencil-fill"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;