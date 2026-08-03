import React from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Plus, Trash2, BookOpen, ArrowUp, ArrowDown } from 'lucide-react';

export const PoemEditor = ({ stanzas = [], onChange }) => {
  const handleAddStanza = () => {
    onChange([...stanzas, '']);
  };

  const handleUpdateStanza = (index, value) => {
    const updated = stanzas.map((s, i) => i === index ? value : s);
    onChange(updated);
  };

  const handleRemoveStanza = (index) => {
    const filtered = stanzas.filter((_, i) => i !== index);
    onChange(filtered);
  };

  const handleMove = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stanzas.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...stanzas];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-400" /> Friendship Poem / Letter Stanzas
          </h3>
          <p className="text-xs text-slate-400">Write an emotional poem or letter split stanza by stanza. Each stanza turns like a book page.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleAddStanza} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Stanza
        </Button>
      </div>

      {stanzas.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-center">
          <p className="text-sm text-slate-400 mb-3">No poem stanzas written yet.</p>
          <Button variant="primary" size="sm" onClick={handleAddStanza} className="gap-1.5">
            <Plus className="w-4 h-4" /> Write First Stanza
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {stanzas.map((stanza, index) => (
            <div key={index} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Stanza #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === stanzas.length - 1}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveStanza(index)}
                    className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <Textarea
                rows={3}
                value={stanza}
                onChange={(e) => handleUpdateStanza(index, e.target.value)}
                placeholder="Write stanza lines here..."
                className="font-serif italic text-base leading-relaxed"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
