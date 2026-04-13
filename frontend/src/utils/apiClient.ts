// Centralised Axios instance with auth token injection
import axios from 'axios';
import { auth } from '../firebase';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
