import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, ArrowRight, Heart } from 'lucide-react';

export const PoemStep = ({ pageData, onNext }) => {
  const stanzas = pageData.poemStanzas || [];
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(0);

  if (stanzas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4"
      >
        <div className="max-w-md w-full p-8 rounded-3xl glass-panel space-y-4 border border-rose-500/20">
          <BookOpen className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-2xl font-bold font-display text-white">Friendship Poem</h3>
          <p className="text-sm text-slate-300 font-serif italic">
            "Side by side, or miles apart, we are connected by the heart."
          </p>
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

  const handleNextStanza = () => {
    if (currentStanzaIndex < stanzas.length - 1) {
      setCurrentStanzaIndex(currentStanzaIndex + 1);
    } else {
      onNext();
    }
  };

  const handlePrevStanza = () => {
    if (currentStanzaIndex > 0) {
      setCurrentStanzaIndex(currentStanzaIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 px-4">
      <div className="text-center space-y-1">
        <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
          Stanza {currentStanzaIndex + 1} of {stanzas.length}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-rose-400" /> A Poem Written For Us
        </h2>
      </div>

      <div className="w-full max-w-xl min-h-[320px] flex flex-col justify-between p-8 sm:p-12 rounded-3xl glass-panel border border-rose-500/20 shadow-2xl relative overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStanzaIndex}
            initial={{ opacity: 0, rotateY: 15, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -15, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="my-auto space-y-4"
          >
            <Heart className="w-8 h-8 text-rose-400/40 mx-auto" />
            <p className="text-lg sm:text-xl text-slate-100 font-serif italic leading-loose whitespace-pre-line">
              "{stanzas[currentStanzaIndex]}"
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevStanza}
            disabled={currentStanzaIndex === 0}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Stanza dots */}
          <div className="flex items-center gap-1.5">
            {stanzas.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStanzaIndex ? 'w-6 bg-rose-500' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextStanza}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-rose-600/25"
          >
            <span>{currentStanzaIndex === stanzas.length - 1 ? 'Share Thoughts' : 'Next Stanza'}</span>
            {currentStanzaIndex === stanzas.length - 1 ? <ArrowRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
