import axiosClient from './axiosClient';

const API_BASE = '/api/transactions';

export const fetchTransactions = (params) => axiosClient.get(API_BASE, { params });
export const createTransaction = (data) => axiosClient.post(API_BASE, data);

export const fetchMyTransactions = () => axiosClient.get(`${API_BASE}/my-transactions`);
export const fetchTransactionById = (id) => axiosClient.get(`${API_BASE}/${id}`);
export const updateTransactionStatus = (id, data) => axiosClient.put(`${API_BASE}/${id}/status`, data);

// Admin only
export const fetchAllTransactions = (params) => axiosClient.get(API_BASE, { params });
// ... thêm các API khác nếu backend hỗ trợ
