import axiosClient from './axiosClient';

const API_BASE = '/api/reviews';

// Create a review for a transaction
export const createReview = (data) => axiosClient.post(`${API_BASE}`, data);

// Get reviews for a product (vehicle or battery)
export const fetchProductReviews = (type, id) =>
    axiosClient.get(`${API_BASE}/product/${type}/${id}`);

// Get reviews for a user (reviews they received)
export const fetchUserReviews = (userId) => axiosClient.get(`${API_BASE}/user/${userId}`);

// Get reviews that current user has written
export const fetchMyReviews = () => axiosClient.get(`${API_BASE}/my`);

// Update a review
export const updateReview = (id, data) => axiosClient.put(`${API_BASE}/${id}`, data);

// Delete a review
export const deleteReview = (id) => axiosClient.delete(`${API_BASE}/${id}`);

// Get review for a specific transaction
export const fetchTransactionReview = (transactionId) =>
    axiosClient.get(`${API_BASE}/transaction/${transactionId}`);

// Respond to a review (seller only)
export const respondToReview = (reviewId, data) =>
    axiosClient.put(`${API_BASE}/${reviewId}/response`, data);
