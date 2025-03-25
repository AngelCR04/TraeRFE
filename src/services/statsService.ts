import axios from "axios";
const API_URL = 'https://localhost:7251';

export const getTotalUsers = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/api/Usuarios/count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    console.log('Total Users:', response.data.total);
    return response.data.total;
  } catch (error) {
    console.error('Error al obtener el total de usuarios :(', error);
    throw error;
  }
};

export const getTotalRutas = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    console.log('Total Rutas:', response.data.total);
    return response.data.total;
  } catch (error) {
    console.error('Error al obtener el total de rutas :(', error);
    throw error;
  }
};

export const getTotalAutobuses = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/api/Autobus/count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    console.log('Total Autobuses:', response.data.total);
    return response.data.total;
  } catch (error) {
    console.error('Error al obtener el total de autobuses :(', error);
    throw error;
  }
};

export const getTotalSolicitudes = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/api/Solicitud/count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    console.log('Total Solicitudes:', response.data.total);
    return response.data.total;
  } catch (error) {
    console.error('Error al obtener el total de solicitudes :(', error);
    throw error;
  }
};