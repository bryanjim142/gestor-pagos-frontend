import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiService';

const Login = ({ userType }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  // ---> ¡ESTA LÍNEA ES CLAVE! Aquí se define el estado del error que faltaba.
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) {
      setError(''); // Limpia el error cuando el usuario empieza a escribir
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiResponse = await api.login(formData.username, formData.password, userType);

      if (apiResponse.success) {
        // El login fue exitoso, usamos los datos de la respuesta
        const { userData, authToken } = apiResponse;
        login(userData, authToken); // Llama al contexto para guardar la sesión
        
        // Redirige al dashboard correcto
        const targetPath = userData.tipoUsuario === 'admin' ? '/admin/dashboard' : '/empleado/dashboard';
        navigate(targetPath);
      } else {
        // El login falló, muestra el mensaje de error de la API
        setError(apiResponse.message || 'Credenciales incorrectas.');
      }
    } catch (err) {
      console.error('Error catastrófico en login:', err);
      setError('Error de conexión. Intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return userType === 'admin' ? 'Acceso de Administrador' : 'Acceso de Empleado';
  };

  const goBack = () => {
    navigate('/'); // Vuelve al inicio
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="h4 text-dark">{getTitle()}</h2>
                   <button onClick={goBack} className="btn btn-link p-0 text-decoration-none">
                     ← Volver al inicio
                   </button>
                </div>

                {/* Este bloque necesita la variable 'error' para funcionar */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <small>{error}</small>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Usuario</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn w-100 ${userType === 'admin' ? 'btn-primary' : 'btn-success'}`}
                    disabled={loading}
                  >
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;