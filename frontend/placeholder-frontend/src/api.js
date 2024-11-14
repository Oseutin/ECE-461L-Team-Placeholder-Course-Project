// frontend/src/api.js
import axios from "axios";

const API_BASE_URL =
  "https://paceholder-application-be28c4e1c799.herokuapp.com";

export const checkInHardware = async (
  projectId,
  quantity,
  hardwareSet,
  token,
) => {
  token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectId}/checkin`,
      { hardwareSet, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const checkOutHardware = async (
  projectId,
  quantity,
  hardwareSet,
  token,
) => {
  token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectId}/checkout`,
      { hardwareSet, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
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
    const response = await axios.post(
      `${API_BASE_URL}/join_project`,
      { id: projectId },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      },
    );
    return response.data.message;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
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
    const response = await axios.post(
      `${API_BASE_URL}/leave_project`,
      { id: projectId },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      },
    );
    return response.data.message;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
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
        Authorization: `Bearer ${auth}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};
