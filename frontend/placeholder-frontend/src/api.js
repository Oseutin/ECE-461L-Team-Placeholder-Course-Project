// frontend/src/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Check out hardware for a project.
 * @param {string} projectId 
 * @param {number} qty 
 * @param {string} hwName 
 * @param {string} auth 
 * @returns {Promise<Object>} Message and new availability.
 */
export const checkOutHardware = async (projectId, qty, hwName, auth) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/checkout`, {
      hw_name: hwName,
      quantity: qty,
    }, {
      headers: {
        'Authorization': `Bearer ${auth}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

/**
 * Check in hardware for a project.
 * @param {string} projectId 
 * @param {number} qty 
 * @param {string} hwName 
 * @param {string} auth 
 * @returns {Promise<Object>} Message and new availability.
 */
export const checkInHardware = async (projectId, qty, hwName, auth) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/checkin`, {
      hw_name: hwName,
      quantity: qty,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

/**
 * Joins a project.
 * @param {number} projectId 
 * @param {string} auth 
 * @returns {Promise<string>} Message from backend.
 */
export const joinProject = async (projectId, auth) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_BASE_URL}/join_project`, { id: projectId }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.message;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

/**
 * Leaves a project.
 * @param {number} projectId 
 * @param {string} auth 
 * @returns {Promise<string>} Message from backend.
 */
export const leaveProject = async (projectId, auth) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/leave_project`, { id: projectId }, {
      headers: {
        'Authorization': `Bearer ${auth}`
      }
    });
    return response.data.message;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

/**
 * Fetches inventory and project data.
 * @param {string} auth 
 * @returns {Promise<Object>} Projects and user inventory data.
 */
export const fetchInventory = async (auth) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inventory`, {
      headers: {
        'Authorization': `Bearer ${auth}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
