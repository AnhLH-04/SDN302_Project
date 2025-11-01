import axiosClient from './axiosClient';

const API_BASE = '/api/auth';

export const login = (data) => axiosClient.post(`${API_BASE}/login`, data);
export const register = (data) => axiosClient.post(`${API_BASE}/register`, data);
export const getProfile = () => axiosClient.get(`${API_BASE}/me`);
export const updateProfile = (data) => axiosClient.put(`${API_BASE}/me`, data);
export const changePassword = (data) => axiosClient.put(`${API_BASE}/change-password`, data);
