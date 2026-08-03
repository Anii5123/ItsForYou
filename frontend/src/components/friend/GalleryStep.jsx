import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ArrowRight, Heart } from 'lucide-react';

export const GalleryStep = ({ pageData, onNext }) => {
  const images = pageData.galleryImages || [];
  const [activeImage, setActiveImage] = useState(null);

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4"
      >
        <div className="max-w-xl w-full p-8 sm:p-12 rounded-3xl glass-panel border border-rose-500/20 space-y-6 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30 text-rose-400">
            <Heart className="w-7 h-7 fill-rose-400" />
          </div>

          <h2 className="text-3xl font-bold font-display text-white">Moments Beyond Photos</h2>

          <p className="text-base text-slate-200 font-serif italic leading-relaxed">
            "Some of our best memories weren't captured on camera — they were lived fully in the moment, etched deep in my heart."
          </p>

          <button
            onClick={onNext}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all flex items-center gap-2 mx-auto"
          >
            <span>Continue to Voice Note</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-between min-h-[75vh] space-y-8 px-4 py-4 max-w-5xl mx-auto w-full"
    >
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Photo Moments</span>
        <h2 className="text-3xl font-bold font-display text-white flex items-center justify-center gap-2">
          <ImageIcon className="w-7 h-7 text-rose-400" /> Captured Snapshot Memories
        </h2>
        <p className="text-xs text-slate-400">Tap any photo to view full size.</p>
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
        {images.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveImage(img)}
            className="relative h-44 sm:h-52 rounded-2xl overflow-hidden glass-panel border border-slate-800 cursor-pointer group shadow-lg"
          >
            <img src={img.url} alt={img.caption || `Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 to-transparent text-white text-xs font-medium truncate opacity-90 group-hover:opacity-100">
                {img.caption}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2"
      >
        <span>Proceed to Voice Note</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
              <img src={activeImage.url} alt="Full Size" className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/20" />
              {activeImage.caption && (
                <p className="mt-3 text-sm text-slate-200 font-serif italic text-center px-4">
                  "{activeImage.caption}"
                </p>
              )}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute -top-10 right-0 text-slate-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
