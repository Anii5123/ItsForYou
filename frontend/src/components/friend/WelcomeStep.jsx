import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, Play, Volume2 } from 'lucide-react';

export const WelcomeStep = ({ pageData, onNext, onPlayAudio }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-2xl shadow-rose-600/40 border border-rose-400/30">
          <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
      </motion.div>

      <div className="space-y-4 max-w-xl">
        <span className="text-xs uppercase font-bold tracking-widest text-rose-400 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block">
          Personalized Gift Experience
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold font-display text-white tracking-wide leading-tight">
          Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-amber-200">{pageData.friendName}</span>!
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-serif italic leading-relaxed">
          "{pageData.heroMessage}"
        </p>
      </div>

      <div className="pt-4 space-y-3">
        <button
          onClick={() => {
            if (onPlayAudio) onPlayAudio();
            onNext();
          }}
          className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-500 text-white font-semibold text-base shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Unwrap Your Journey</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {pageData.backgroundMusicUrl && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center">
            <Volume2 className="w-3.5 h-3.5 text-rose-400" /> Background music included
          </p>
        )}
      </div>
    </motion.div>
  );
};
