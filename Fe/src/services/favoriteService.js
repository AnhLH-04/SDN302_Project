import axiosClient from './axiosClient';

const API_BASE = '/api/favorites';

export const fetchFavorites = (params) => axiosClient.get(API_BASE, { params });
export const fetchFavoriteIds = (itemType) =>
  axiosClient.get(`${API_BASE}/ids`, { params: { itemType } });
export const addFavorite = (itemType, itemId) => axiosClient.post(API_BASE, { itemType, itemId });
export const removeFavorite = (itemType, itemId) =>
  axiosClient.delete(`${API_BASE}/${itemType}/${itemId}`);

export default {
  fetchFavorites,
  fetchFavoriteIds,
  addFavorite,
  removeFavorite,
};
