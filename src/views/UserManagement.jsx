//GESTOR DE USUARIOS

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiService';

const UserManagement = () => {
    // Estados de la lista y el formulario
    const [users, setUsers] = useState([]);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('empleado');

    // Estado para saber si estamos editando o creando
    const [editingUser, setEditingUser] = useState(null);

    // Estados para notificaciones y carga
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // --- Carga inicial de usuarios ---
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.getUsers();
                setUsers(data);
            } catch (error) {
                setErrorMessage('Error al cargar los usuarios.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // --- Lógica para seleccionar un usuario para editar ---
    const handleSelectUserForEdit = (user) => {
        setEditingUser(user);
        setNombreUsuario(user.nombreUsuario); 
        setTipoUsuario(user.tipoUsuario);
        setContraseña(''); // La contraseña no se carga por seguridad
        setSuccessMessage('');
        setErrorMessage('');
        window.scrollTo(0, 0); // Sube al inicio de la página para ver el formulario
    };

    // --- Lógica para cancelar la edición ---
    const cancelEdit = () => {
        setEditingUser(null);
        setNombreUsuario('');
        setContraseña('');
        setTipoUsuario('empleado');
    };

    // --- Lógica para eliminar un usuario ---
    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
            try {
                await api.deleteUser(userId);
                setUsers(users.filter(user => user.idUsuario !== userId));
                setSuccessMessage('Usuario eliminado con éxito.');
            } catch (error) {
                setErrorMessage('Error al eliminar el usuario.');
                console.error(error);
            }
        }
    };

    // --- Lógica para manejar el envío del formulario (Crear o Actualizar) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const userData = {
            NombreUsuario: nombreUsuario,
            TipoUsuario: tipoUsuario,
        };
        if (contraseña) {
            userData.Contraseña = contraseña;
        }

        try {
            if (editingUser) {
                // --- MODO ACTUALIZACIÓN ---
                const updatedUser = await api.updateUser(editingUser.idUsuario, userData);
                setUsers(users.map(user => user.idUsuario === editingUser.idUsuario ? updatedUser : user));
                setSuccessMessage('¡Usuario actualizado con éxito!');
            } else {
                // --- MODO CREACIÓN ---
                const createdUser = await api.createUser(userData);
                setUsers([...users, createdUser]);
                setSuccessMessage(`¡Usuario ${createdUser.nombreUsuario} creado con éxito!`);
            }
            cancelEdit(); // Limpia el formulario y sale del modo edición
        } catch (error) {
            setErrorMessage(editingUser ? 'Error al actualizar el usuario.' : 'Error al crear el usuario.');
            console.error(error);
        }
    };

    return (
        <div className="container py-5">
            <Link to="/admin/dashboard" className="btn btn-secondary mb-4">
                <i className="bi bi-arrow-left-circle me-2"></i>
                Volver al Panel
            </Link>

            <div className="row">
                {/* --- FORMULARIO DE CREACIÓN / EDICIÓN --- */}
                <div className="col-md-5 mb-4">
                    <h2 className="mb-4">{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                
                                <div className="mb-3">
                                    <label htmlFor="new-username" className="form-label">Nombre de Usuario</label>
                                    <input type="text" id="new-username" className="form-control" value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="new-password" className="form-label">Contraseña</label>
                                    <input type="password" id="new-password" className="form-control" value={contraseña} onChange={e => setContraseña(e.target.value)} placeholder={editingUser ? 'Dejar en blanco para no cambiar' : ''} required={!editingUser} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="user-type" className="form-label">Tipo de Usuario</label>
                                    <select id="user-type" className="form-select" value={tipoUsuario} onChange={e => setTipoUsuario(e.target.value)}>
                                        <option value="empleado">Empleado</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>

                                <div className="d-flex justify-content-start">
                                    <button type="submit" className={`btn ${editingUser ? 'btn-primary' : 'btn-success'}`}>
                                        <i className={`bi ${editingUser ? 'bi-check-circle-fill' : 'bi-person-plus-fill'} me-2`}></i>
                                        {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                                    </button>
                                    {editingUser && (
                                        <button type="button" className="btn btn-secondary ms-2" onClick={cancelEdit}>
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- LISTA DE USUARIOS EXISTENTES --- */}
                <div className="col-md-7">
                    <h2 className="mb-4">Usuarios Existentes</h2>
                    {loading && <p>Cargando usuarios...</p>}
                    <ul className="list-group">
                        {/* CORRECCIONES EN LA LISTA COMPLETA */}
                        {users.map(u => (
                            <li key={u.idUsuario} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold">{u.nombreUsuario}</span>
                                    <br />
                                    <span className={`badge ${u.tipoUsuario === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.tipoUsuario}</span>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleSelectUserForEdit(u)}>
                                        <i className="bi bi-pencil-fill"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.idUsuario)}>
                                        <i className="bi bi-trash-fill"></i>
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

export default UserManagement;