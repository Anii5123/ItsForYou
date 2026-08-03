import React from 'react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Plus, Trash2, Image as ImageIcon, Upload, MessageSquare } from 'lucide-react';
import { uploadMediaFile } from '../../api/uploadApi';

export const GalleryEditor = ({ images = [], fallbackMessage = '', onChangeImages, onChangeFallback }) => {
  const handleUploadImage = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    for (const file of files) {
      const url = await uploadMediaFile(file, 'gallery');
      newImages.push({ url, caption: '' });
    }
    onChangeImages([...images, ...newImages]);
  };

  const handleUpdateCaption = (index, caption) => {
    const updated = images.map((img, i) => i === index ? { ...img, caption } : img);
    onChangeImages(updated);
  };

  const handleRemoveImage = (index) => {
    const filtered = images.filter((_, i) => i !== index);
    onChangeImages(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-400" /> Photo Memories & Custom Notes
          </h3>
          <p className="text-xs text-slate-400">
            Upload photo memories one by one with a dedicated note/story for each photo. If no photos exist, your custom note below will be shown.
          </p>
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

      {/* Fallback Custom Note when no photos uploaded */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-rose-400" /> Custom Letter / Note (If No Photos Are Uploaded)
        </label>
        <p className="text-xs text-slate-400">This custom letter will be displayed to your friend if no gallery photos are uploaded.</p>
        <Textarea
          rows={3}
          value={fallbackMessage}
          onChange={(e) => onChangeFallback(e.target.value)}
          placeholder="Write a sweet letter or note to your friend when there are no photos..."
        />
      </div>

      {/* Photos List */}
      {images.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center">
          <p className="text-sm text-slate-400 mb-1">No gallery photos uploaded yet.</p>
          <p className="text-xs text-slate-500">Your friend will see the custom letter written above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative group">
              <div className="relative h-48 rounded-xl overflow-hidden bg-slate-950">
                <img src={img.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[10px] font-bold text-rose-300 border border-white/10">
                  Photo #{index + 1}
                </span>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Textarea
                placeholder="Write a note / memory story for this photo..."
                rows={2}
                value={img.caption || ''}
                onChange={(e) => handleUpdateCaption(index, e.target.value)}
                className="text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
