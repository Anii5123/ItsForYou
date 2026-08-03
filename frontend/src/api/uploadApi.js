import api from './client';
import axios from 'axios';

export const uploadMediaFile = async (file, folder = 'for_you_app') => {
  try {
    // 1. Get signed params from backend
    const { data: sig } = await api.post('/admin/upload-signature', { folder });

    // 2. Prepare FormData for direct Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('timestamp', sig.timestamp);
    formData.append('signature', sig.signature);
    formData.append('folder', sig.folder);

    const resourceType = file.type.startsWith('audio') ? 'video' : 'image'; // Cloudinary handles audio under video resource type
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;

    const response = await axios.post(cloudinaryUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.secure_url;
  } catch (error) {
    console.warn('[Cloudinary Direct Upload Warning] Falling back to Data URL preview due to Cloudinary credentials:', error.message);
    // Local fallback to Data URL if Cloudinary is unconfigured in dev
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
};
