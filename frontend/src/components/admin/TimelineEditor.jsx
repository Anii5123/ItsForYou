import React from 'react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Calendar } from 'lucide-react';
import { uploadMediaFile } from '../../api/uploadApi';

export const TimelineEditor = ({ events = [], onChange }) => {
  const handleAddEvent = () => {
    const newEvent = {
      order: events.length + 1,
      title: `Memory #${events.length + 1}`,
      description: '',
      date: '',
      imageUrl: ''
    };
    onChange([...events, newEvent]);
  };

  const handleUpdateEvent = (index, field, value) => {
    const updated = events.map((ev, i) => i === index ? { ...ev, [field]: value } : ev);
    onChange(updated);
  };

  const handleRemoveEvent = (index) => {
    const filtered = events.filter((_, i) => i !== index).map((ev, i) => ({ ...ev, order: i + 1 }));
    onChange(filtered);
  };

  const handleMove = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === events.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...events];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    const reordered = copy.map((ev, i) => ({ ...ev, order: i + 1 }));
    onChange(reordered);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;
    const url = await uploadMediaFile(file, 'timeline');
    handleUpdateEvent(index, 'imageUrl', url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-400" /> Interactive Timeline Memories
          </h3>
          <p className="text-xs text-slate-400">Add key shared memories to guide your friend through your friendship journey.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleAddEvent} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Memory Card
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center">
          <p className="text-sm text-slate-400 mb-3">No memories added to the timeline yet.</p>
          <Button variant="primary" size="sm" onClick={handleAddEvent} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add First Memory
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Memory #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === events.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveEvent(index)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title / Headline"
                  value={event.title}
                  onChange={(e) => handleUpdateEvent(index, 'title', e.target.value)}
                  placeholder="e.g. Our First Road Trip!"
                />
                <Input
                  label="Date / Time period (Optional)"
                  value={event.date}
                  onChange={(e) => handleUpdateEvent(index, 'date', e.target.value)}
                  placeholder="e.g. Summer 2022"
                />
              </div>

              <Textarea
                label="Story / Description"
                rows={3}
                value={event.description}
                onChange={(e) => handleUpdateEvent(index, 'description', e.target.value)}
                placeholder="Write a sweet memory or funny story that happened..."
              />

              {/* Image Uploader */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Memory Image (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {event.imageUrl ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 group flex-shrink-0">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleUpdateEvent(index, 'imageUrl', '')}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-rose-400 hover:file:bg-slate-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
