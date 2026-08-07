import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export const TimelineStep = ({ pageData, onNext }) => {
  const events = pageData.timelineEvents || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[65vh] text-center space-y-6 px-4"
      >
        <div className="p-8 rounded-3xl glass-panel max-w-md w-full space-y-4 border border-rose-500/20">
          <Calendar className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-2xl font-bold font-display text-white">Our Timeline</h3>
          <p className="text-sm text-slate-300">Every moment with you has been a cherished memory.</p>
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all"
          >
            Continue Journey
          </button>
        </div>
      </motion.div>
    );
  }

  const currentEvent = events[currentIndex];

  const handleNextMemory = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onNext();
    }
  };

  const handlePrevMemory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-6 px-3 sm:px-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs uppercase font-bold tracking-widest text-rose-300 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block shadow-sm">
          Memory {currentIndex + 1} of {events.length}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white flex items-center justify-center gap-2 pt-1">
          <Calendar className="w-6 h-6 text-rose-400" /> Reliving Our Journey
        </h2>
      </div>

      {/* Memory Card */}
      <div className="w-full max-w-xl min-h-[420px] flex flex-col justify-between p-5 sm:p-8 rounded-3xl glass-panel border border-rose-500/20 shadow-2xl relative overflow-hidden group hover:border-rose-500/40 transition-colors">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            {currentEvent.imageUrl && (
              <div className="h-44 sm:h-60 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group/img">
                <img
                  src={currentEvent.imageUrl}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">{currentEvent.title}</h3>
                {currentEvent.date && (
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-rose-300 border border-slate-700 font-mono whitespace-nowrap">
                    {currentEvent.date}
                  </span>
                )}
              </div>
              <p className="text-base sm:text-lg text-slate-200 font-serif leading-relaxed">
                {currentEvent.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Card Controls & Centered Next Button */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {events.map((_, i) => (
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

          {/* Action Buttons Area: Centered Primary Next Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {currentIndex > 0 && (
              <button
                onClick={handlePrevMemory}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Memory
              </button>
            )}

            <button
              onClick={handleNextMemory}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-xl shadow-rose-600/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{currentIndex === events.length - 1 ? 'Next Chapter 🚀' : 'Next Memory'}</span>
              {currentIndex === events.length - 1 ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
