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
        className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4"
      >
        <div className="p-8 rounded-3xl glass-panel max-w-md w-full space-y-4">
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 px-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
          Memory {currentIndex + 1} of {events.length}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6 text-rose-400" /> Reliving Our Journey
        </h2>
      </div>

      {/* Memory Card */}
      <div className="w-full max-w-xl min-h-[380px] flex flex-col justify-between p-6 sm:p-8 rounded-3xl glass-panel border border-rose-500/20 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {currentEvent.imageUrl && (
              <div className="h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={currentEvent.imageUrl}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-display text-white">{currentEvent.title}</h3>
                {currentEvent.date && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-rose-300 border border-slate-700 font-mono">
                    {currentEvent.date}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-serif leading-relaxed">
                {currentEvent.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Card Controls & Progress Indicators */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevMemory}
            disabled={currentIndex === 0}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {events.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-rose-500'
                    : i < currentIndex
                    ? 'w-2 bg-rose-500/40'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextMemory}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-rose-600/25"
          >
            <span>{currentIndex === events.length - 1 ? 'Next Chapter' : 'Next Memory'}</span>
            {currentIndex === events.length - 1 ? <ArrowRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
