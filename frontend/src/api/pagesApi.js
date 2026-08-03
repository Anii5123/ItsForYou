import api from './client';

export const fetchPages = async () => {
  const response = await api.get('/admin/pages');
  return response.data;
};

export const fetchPageById = async (id) => {
  const response = await api.get(`/admin/pages/${id}`);
  return response.data;
};

export const createPage = async (friendName, friendSlug) => {
  const response = await api.post('/admin/pages', { friendName, friendSlug });
  return response.data;
};

export const updatePage = async (id, pageData) => {
  const response = await api.put(`/admin/pages/${id}`, pageData);
  return response.data;
};

export const duplicatePage = async (id) => {
  const response = await api.post(`/admin/pages/${id}/duplicate`);
  return response.data;
};

export const deletePage = async (id) => {
  const response = await api.delete(`/admin/pages/${id}`);
  return response.data;
};

export const togglePublish = async (id) => {
  const response = await api.post(`/admin/pages/${id}/publish`);
  return response.data;
};

export const fetchPublicPage = async (randomId, friendSlug, isPreview = false) => {
  const response = await api.get(`/f/${randomId}/${friendSlug}${isPreview ? '?preview=true' : ''}`);
  return response.data;
};
