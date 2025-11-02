import axiosClient from './axiosClient';

export const fetchBrands = (type = 'vehicle') =>
  axiosClient.get('/api/brands', { params: { type } });
