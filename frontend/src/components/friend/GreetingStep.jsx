import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Quote, Sparkles } from 'lucide-react';

export const GreetingStep = ({ pageData, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 px-4"
    >
      <div className="max-w-2xl w-full p-8 md:p-12 rounded-3xl glass-panel relative overflow-hidden space-y-6 shadow-2xl border border-rose-500/20 group hover:border-rose-500/40 transition-colors">
        {/* Decorative Quote Icon Background */}
        <Quote className="w-20 h-20 text-rose-500/10 absolute -top-4 -left-4 pointer-events-none transform -rotate-12" />

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500/20 to-rose-400/20 flex items-center justify-center border border-rose-500/40 text-rose-400 shadow-lg shadow-rose-500/10"
        >
          <Heart className="w-7 h-7 fill-rose-400" />
        </motion.div>

        <span className="text-xs uppercase font-bold tracking-widest text-rose-300 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block">
          Happy Friendship Day
        </span>

        <h2 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-wide">
          A Message From My Heart
        </h2>

        <div className="relative py-2">
          <p className="text-base sm:text-xl text-slate-100 font-serif leading-relaxed whitespace-pre-line italic">
            "{pageData.friendshipDayMessage}"
          </p>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex justify-center">
          <button
            onClick={onNext}
            className="group px-7 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 hover:border-rose-500/30 transition-all flex items-center gap-2 shadow-lg hover:shadow-rose-500/10 transform hover:-translate-y-0.5"
          >
            <span>Continue to Next Chapter</span>
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
