import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Quote } from 'lucide-react';

export const GreetingStep = ({ pageData, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4"
    >
      <div className="max-w-2xl w-full p-8 md:p-12 rounded-3xl glass-panel relative overflow-hidden space-y-6 shadow-2xl border border-rose-500/20">
        <Quote className="w-12 h-12 text-rose-500/20 absolute top-4 left-4 pointer-events-none" />

        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/30 text-rose-400">
          <Heart className="w-6 h-6 fill-rose-400" />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-rose-400 block">
          Happy Friendship Day
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
          A Message From My Heart
        </h2>

        <p className="text-base sm:text-lg text-slate-200 font-serif leading-relaxed whitespace-pre-line italic">
          "{pageData.friendshipDayMessage}"
        </p>

        <div className="pt-6 border-t border-slate-800/80 flex justify-center">
          <button
            onClick={onNext}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm border border-slate-700 transition-all flex items-center gap-2"
          >
            <span>Continue to Next Chapter</span>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
