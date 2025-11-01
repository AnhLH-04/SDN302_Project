import axiosClient from './axiosClient';

const API_BASE = '/api/admin';

export const fetchUsers = (params) => axiosClient.get(`${API_BASE}/users`, { params });
export const fetchReports = (params) => axiosClient.get(`${API_BASE}/reports`, { params });
export const fetchStats = () => axiosClient.get(`${API_BASE}/stats`);
export const fetchInventoryReport = () => axiosClient.get(`${API_BASE}/inventory-report`);
export const deleteUser = (id) => axiosClient.delete(`${API_BASE}/users/${id}`);
// Admin user status
export const updateUserStatus = (id, data) =>
  axiosClient.put(`${API_BASE}/users/${id}/status`, data);

// Verify listings
export const verifyVehicle = (id, data) =>
  axiosClient.put(`${API_BASE}/vehicles/${id}/verify`, data);
export const verifyBattery = (id, data) =>
  axiosClient.put(`${API_BASE}/batteries/${id}/verify`, data);

// Resolve report
export const resolveReport = (id, data) => axiosClient.put(`${API_BASE}/reports/${id}`, data);
