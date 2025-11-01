import axiosClient from './axiosClient';

const API_BASE = '/api';

// Xe điện
export const fetchVehicles = (params) => axiosClient.get(`${API_BASE}/vehicles`, { params });
export const fetchVehicleById = (id) => axiosClient.get(`${API_BASE}/vehicles/${id}`);
export const createVehicle = (data) => axiosClient.post(`${API_BASE}/vehicles`, data);
export const updateVehicle = (id, data) => axiosClient.put(`${API_BASE}/vehicles/${id}`, data);
export const deleteVehicle = (id) => axiosClient.delete(`${API_BASE}/vehicles/${id}`);
export const fetchMyVehicles = () => axiosClient.get(`${API_BASE}/vehicles/my/vehicles`);

// Pin
export const fetchBatteries = (params) => axiosClient.get(`${API_BASE}/batteries`, { params });
export const fetchBatteryById = (id) => axiosClient.get(`${API_BASE}/batteries/${id}`);
export const createBattery = (data) => axiosClient.post(`${API_BASE}/batteries`, data);
export const updateBattery = (id, data) => axiosClient.put(`${API_BASE}/batteries/${id}`, data);
export const deleteBattery = (id) => axiosClient.delete(`${API_BASE}/batteries/${id}`);
export const fetchMyBatteries = () => axiosClient.get(`${API_BASE}/batteries/my/batteries`);

// Tìm kiếm, lọc sẽ dùng params truyền vào fetchVehicles/fetchBatteries
