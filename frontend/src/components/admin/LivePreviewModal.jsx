import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

export const LivePreviewModal = ({ isOpen, onClose, pageData }) => {
  if (!isOpen || !pageData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-base">
              Live Preview: <span className="text-rose-300">{pageData.friendName}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Simulation */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-rose-950/40 to-slate-900 border border-rose-500/20 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
              <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">{pageData.heroMessage}</h2>
            <p className="text-sm text-slate-300 italic font-serif">"{pageData.friendshipDayMessage}"</p>
          </div>

          <div className="space-y-3 text-left">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs uppercase text-slate-400 font-semibold">Timeline Memories Count</span>
              <p className="text-lg font-bold text-rose-300">{pageData.timelineEvents?.length || 0} Memories</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs uppercase text-slate-400 font-semibold">Gallery Photos</span>
              <p className="text-lg font-bold text-rose-300">{pageData.galleryImages?.length || 0} Photos</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs uppercase text-slate-400 font-semibold">Poem Stanzas</span>
              <p className="text-lg font-bold text-rose-300">{pageData.poemStanzas?.length || 0} Stanzas</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
