import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('admin_token') || null,
  admin: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('admin_token'),
  
  setAuth: (data) => {
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify({ id: data._id, email: data.email }));
    set({
      token: data.token,
      admin: { id: data._id, email: data.email },
      isAuthenticated: true
    });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    set({
      token: null,
      admin: null,
      isAuthenticated: false
    });
  }
}));
