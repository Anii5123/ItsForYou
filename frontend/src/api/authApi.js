import api from './client';

export const loginAdmin = async (email, password) => {
  const response = await api.post('/admin/auth/login', { email, password });
  return response.data;
};
