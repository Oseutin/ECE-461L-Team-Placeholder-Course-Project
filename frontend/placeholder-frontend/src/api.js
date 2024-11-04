// frontend/src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Checks in hardware.
 * @param {number} projectId 
 * @param {number} qty 
 * @param {string} hardwareSetId 
 * @param {string} auth 
 * @returns {Promise<Object>} Message and newAvailability.
 */
export const checkInHardware = async (projectId, qty, hardwareSetId, auth) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/checkin/${projectId}/${qty}`, {
      hardwareSetId
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
 * Checks out hardware.
 * @param {number} projectId 
 * @param {number} qty 
 * @param {string} hardwareSetId 
 * @param {string} auth 
 * @returns {Promise<Object>} Message, newAvailability, and checkedOutQty.
 */
export const checkOutHardware = async (projectId, qty, hardwareSetId, auth) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/checkout/${projectId}/${qty}`, {
      hardwareSetId
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
 * Joins a project.
 * @param {number} projectId 
 * @param {string} auth 
 * @returns {Promise<string>} Message from backend.
 */
export const joinProject = async (projectId, auth) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/join/${projectId}`, {}, {
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
 * Leaves a project.
 * @param {number} projectId 
 * @param {string} auth 
 * @returns {Promise<string>} Message from backend.
 */
export const leaveProject = async (projectId, auth) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/leave/${projectId}`, {}, {
      headers: {
        'Authorization': `Bearer ${auth}`
      }
    });
    return response.data.message;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
