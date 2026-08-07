import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ChevronLeft, ChevronRight, ArrowRight, Heart, Grid, BookOpen } from 'lucide-react';
import { CuteMascots } from './CuteMascots';

export const GalleryStep = ({ pageData, onNext }) => {
  const images = pageData.galleryImages || [];
  const fallbackNote = pageData.galleryFallbackMessage || "Some of our best memories weren't captured on camera — they were lived fully in the moment, etched deep in my heart.";
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('one-by-one'); // 'one-by-one' or 'grid'

  // NO PHOTOS CASE -> Display Admin's Custom Note
  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-6 px-4"
      >
        <div className="max-w-xl w-full p-8 md:p-12 rounded-3xl glass-panel border border-rose-500/30 space-y-6 shadow-2xl relative overflow-hidden">
          <CuteMascots type={pageData.themeName || 'mickey'} />

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-rose-300 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block">
              A Note From My Heart
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Unwritten Memories</h2>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 relative">
            <p className="text-base sm:text-xl text-slate-100 font-serif italic leading-relaxed whitespace-pre-line">
              "{fallbackNote}"
            </p>
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Continue Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  const currentPhoto = images[currentIndex];

  const handleNextPhoto = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onNext();
    }
  };

  const handlePrevPhoto = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-6 px-4">
      {/* Header & View Mode Switcher */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <CuteMascots type={pageData.themeName || 'mickey'} />
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-rose-300 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block">
              Photo Storybook ({currentIndex + 1}/{images.length})
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white flex items-center justify-center gap-2 pt-1">
              <ImageIcon className="w-6 h-6 text-rose-400" /> Photo Memories
            </h2>
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-1">
          <button
            onClick={() => setViewMode('one-by-one')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'one-by-one'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Storybook (One-by-One)
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> All Photos Grid
          </button>
        </div>
      </div>

      {/* ONE-BY-ONE STORYBOOK VIEW */}
      {viewMode === 'one-by-one' ? (
        <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl glass-panel border border-rose-500/30 shadow-2xl space-y-5 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.96 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Photo Display */}
              <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group/img">
                <img
                  src={currentPhoto.url}
                  alt={`Photo ${currentIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-rose-300 border border-white/10">
                  {currentIndex + 1} of {images.length}
                </span>
              </div>

              {/* Dedicated Photo Note / Caption */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-[70px] flex items-center justify-center text-center">
                <p className="text-base sm:text-lg text-slate-100 font-serif italic leading-relaxed">
                  "{currentPhoto.caption || 'A special moment together.'}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls & Centered Next Button */}
          <div className="pt-5 border-t border-slate-800 space-y-4">
            {/* Progress Indicators */}
            <div className="flex items-center justify-center gap-1.5 overflow-x-auto max-w-full py-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-6 bg-rose-500 shadow-md shadow-rose-500/50'
                      : i < currentIndex
                      ? 'w-2 bg-rose-500/50'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Action Buttons: Centered Primary Next Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevPhoto}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Photo
                </button>
              )}

              <button
                onClick={handleNextPhoto}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-xl shadow-rose-600/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{currentIndex === images.length - 1 ? 'Next Chapter 🚀' : 'Next Photo'}</span>
                {currentIndex === images.length - 1 ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MASONRY GRID VIEW */
        <div className="w-full max-w-3xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => {
                  setCurrentIndex(i);
                  setViewMode('one-by-one');
                }}
                className="p-3 rounded-2xl glass-panel border border-slate-800 hover:border-rose-500/40 cursor-pointer group transition-all transform hover:-translate-y-1"
              >
                <div className="h-44 rounded-xl overflow-hidden bg-slate-950 relative">
                  <img src={img.url} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                {img.caption && (
                  <p className="text-xs text-slate-200 font-serif italic pt-2 line-clamp-2">"{img.caption}"</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={onNext}
              className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2"
            >
              <span>Continue to Next Chapter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
