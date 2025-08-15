import axios from 'axios';

// Define la URL base de tu API de forma absoluta
const API_BASE_URL = "https://localhost:7074";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// *** INTERCEPTOR PARA INCLUIR EL TOKEN JWT EN LAS SOLICITUDES ***
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Obtenemos el token guardado
    if (token) {
      // Si existe, lo agregamos al header de autorización
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===================================================================
// --- FUNCIÓN DE AUTENTICACIÓN ---
// ===================================================================
/**
 * Autentica a un usuario y devuelve un objeto con el resultado.
 * @param {string} nombreUsuario - El nombre de usuario para el login.
 * @param {string} contraseña - La contraseña del usuario.
 * @param {string} userType - El tipo de usuario (si tu API lo requiere).
 * @returns {Promise<object>} Un objeto que indica el éxito/fracaso de la operación.
 * En caso de éxito: { success: true, authToken: '...', userData: {...}, userType: '...' }
 * En caso de error: { success: false, message: '...' }
 */
const login = async (nombreUsuario, contraseña, userType) => {
  try {
    console.log('🔍 Enviando login:', { nombreUsuario, contraseña, userType });
    
    // Se mantiene la llamada a tu endpoint de login existente
    const response = await axiosInstance.post('/api/usuarios/login', {
      NombreUsuario: nombreUsuario,
      Contraseña: contraseña,
      TipoUsuario: userType // Agregar si tu API lo necesita
    });

    console.log('📥 Respuesta completa del servidor:', response.data);

    // Si el login es exitoso, la API debe devolver el token y los datos del usuario.
    if (response.data) {
      // Adaptarse a diferentes formatos de respuesta
      const authToken = response.data.token || response.data.authToken || response.data.Token;
      const userData = response.data.usuario || response.data.user || response.data;
      
      if (authToken) {
        return {
          success: true,
          authToken: authToken,
          userData: userData,
          userType: userType
        };
      } else {
        console.warn('⚠️ Token no encontrado en la respuesta');
        // Retornar los datos que sí lleguen para debug
        return {
          success: true,
          authToken: 'debug_token', // Token temporal para debug
          userData: response.data,
          userType: userType
        };
      }
    } else {
      throw new Error("Respuesta vacía del servidor.");
    }

  } catch (error) {
    console.error('❌ Error en login:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return {
      success: false,
      message: error.response?.data?.message || 
               error.response?.data || 
               'Error de autenticación. Verifique sus credenciales.'
    };
  }
};


// Objeto `api` con todas tus funciones

export const api = {
  // función de login
  login,

  //FUNCIONES PARA NÓMINA Y RECIBOS 
  getPayroll: async () => {
    try {
      const response = await axiosInstance.get('/api/nomina');
      return response.data;
    } catch (error) {
      console.error('Error al obtener la nómina:', error.response?.data || error.message);
      throw new Error('No se pudo cargar la información de la nómina.');
    }
  },
getRecibos: async () => {
    try {
        const response = await axiosInstance.get('/api/recibospago');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los recibos de pago:', error.response?.data || error.message);
        throw new Error('No se pudieron cargar los recibos de pago.');
    }
},

  getEmployeePaymentHistory: async (idEmpleado) => {
    try {
      const response = await axiosInstance.get(`/api/recibospago/empleados/${idEmpleado}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el historial de pagos:', error.response?.data || error.message);
      throw new Error('No se pudo cargar el historial de pagos del empleado.');
    }
  },
  
  // Obtiene los detalles de un recibo específico para el panel de administración
  getReceiptDetails: async (receiptId) => {
    try {
      const response = await axiosInstance.get(`/api/recibospago/${receiptId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los detalles del recibo:', error.response?.data || error.message);
      throw new Error('No se pudieron cargar los detalles del recibo.');
    }
  },

// Obtiene un solo empleado por su ID en nomina
 getEmployee: async (employeeId) => {
    try {
      const response = await axiosInstance.get(`/api/empleados/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el empleado ${employeeId}:`, error.response?.data || error.message);
      throw new Error('No se pudo cargar la información del empleado.');
    }
  },
// Obtiene el historial de nóminas para un empleado específico
   getPayrollForEmployee: async (employeeId) => {
    try {
      // URL de tu API empleado/ID
    
      const response = await axiosInstance.get(`/api/nomina/empleado/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la nómina para el empleado ${employeeId}:`, error.response?.data || error.message);
      throw new Error('No se pudo cargar el historial de nómina del empleado.');
    }
  },
//usuarios 
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/usuarios', userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error.response?.data || error.message);
      throw new Error('No se pudo crear el usuario.');
    }
  },

  getUsers: async () => {
    try {
      const response = await axiosInstance.get('/api/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error.response?.data || error.message);
      throw new Error('No se pudo cargar la lista de usuarios.');
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/api/usuarios/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error.response?.data || error.message);
      throw new Error('No se pudo actualizar el usuario.');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/api/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error.response?.data || error.message);
      throw new Error('No se pudo eliminar el usuario.');
    }
  },

 // Función para crear una nueva nómina
createPayroll: async (payrollData) => {
    // La URL apunta a la ruta explícita del backend
    const response = await axios.post(`${baseURL}/Nomina/RegistrarNomina`, payrollData);
    return response.data;
},

  updatePayroll: async (payrollId, payrollData) => {
    try {
      const response = await axiosInstance.put(`/api/nomina/${payrollId}`, payrollData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar registro de nómina:', error.response?.data || error.message);
      throw new Error('No se pudo actualizar el registro de nómina.');
    }
  },

  deletePayroll: async (payrollId) => {
    try {
      const response = await axiosInstance.delete(`/api/nomina/${payrollId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar registro de nómina:', error.response?.data || error.message);
      throw new Error('No se pudo eliminar el registro de nómina.');
    }
  },
  
  // --- FUNCIONES PARA EMPLEADOS ---
  getEmployees: async () => {
    try {
      const response = await axiosInstance.get('/api/empleados');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los empleados:', error.response?.data || error.message);
      throw new Error('No se pudo cargar la lista de empleados.');
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await axiosInstance.post('/api/empleados', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error al crear empleado:', error.response?.data || error.message);
      throw new Error('No se pudo crear el empleado.');
    }
  },

  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await axiosInstance.put(`/api/empleados/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar empleado:', error.response?.data || error.message);
      throw new Error('No se pudo actualizar el empleado.');
    }
  },
  
  deleteEmployee: async (employeeId) => {
    try {
      const response = await axiosInstance.delete(`/api/empleados/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar empleado:', error.response?.data || error.message);
      throw new Error('No se pudo eliminar el empleado.');
    }
  },

  // FUNCIONES PARA EL PANEL DEL EMPLEADO 
  // Obtiene el perfil del empleado que ha iniciado sesión a través del token
  getCurrentEmployeeProfile: async () => {
    try { 
      const response = await axiosInstance.get('/api/empleados/me/perfil');
      return response.data;
    } catch (error) {
      console.error('Error al obtener el perfil del empleado:', error.response?.data || error.message);
      throw new Error('No se pudo cargar el perfil del empleado.');
    }
  },
  
  // Obtiene la lista de recibos para el empleado logueado
  getReceiptsForCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/api/recibospago/me');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los recibos:', error.response?.data || error.message);
      throw new Error('No se pudo cargar el historial de recibos.');
    }
  },

  // Obtiene los detalles de un recibo específico para el panel de empleado
  getReceiptForUser: async (receiptId) => {
    try {
      const response = await axiosInstance.get(`/api/recibospago/${receiptId}/details`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los detalles del recibo:', error.response?.data || error.message);
      throw new Error('No se pudieron cargar los detalles del recibo.');
    }
  },
};