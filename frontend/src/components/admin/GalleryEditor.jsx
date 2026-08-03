import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { uploadMediaFile } from '../../api/uploadApi';

export const GalleryEditor = ({ images = [], onChange }) => {
  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    for (const file of files) {
      const url = await uploadMediaFile(file, 'gallery');
      newImages.push({ url, caption: '' });
    }
    onChange([...images, ...newImages]);
  };

  const handleUpdateCaption = (index, caption) => {
    const updated = images.map((img, i) => i === index ? { ...img, caption } : img);
    onChange(updated);
  };

  const handleRemoveImage = (index) => {
    const filtered = images.filter((_, i) => i !== index);
    onChange(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-400" /> Photo Gallery Masonry
          </h3>
          <p className="text-xs text-slate-400">Upload favorite snapshot memories together. (If empty, an emotional empty-state page will render).</p>
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/25 transition-all">
          <Upload className="w-4 h-4" /> Upload Photos
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center">
          <p className="text-sm text-slate-400 mb-1">No gallery photos uploaded yet.</p>
          <p className="text-xs text-slate-500">Your friend will see a dedicated sweet emotional letter page if no photos are uploaded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative group">
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950">
                <img src={img.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Input
                placeholder="Caption (Optional)..."
                value={img.caption || ''}
                onChange={(e) => handleUpdateCaption(index, e.target.value)}
                className="text-xs py-1.5"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
