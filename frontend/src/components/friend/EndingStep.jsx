import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, Award, Gift } from 'lucide-react';

export const EndingStep = ({ pageData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 px-4 relative overflow-hidden"
    >
      {/* Floating confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * (window.innerWidth || 400),
              y: -30,
              scale: Math.random() * 0.7 + 0.5,
              opacity: 1
            }}
            animate={{
              y: (window.innerHeight || 800) + 50,
              rotate: Math.random() * 540,
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
            className="absolute"
          >
            {i % 3 === 0 ? (
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500 shadow-md" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-5 h-5 text-amber-300" />
            ) : (
              <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl w-full p-8 md:p-14 rounded-3xl glass-panel border border-rose-500/30 space-y-8 shadow-2xl relative z-10 group hover:border-rose-500/50 transition-colors">
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-rose-600/50 border border-white/20 relative"
        >
          <Heart className="w-14 h-14 text-white fill-white animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </motion.div>

        <div className="space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-300 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 inline-block shadow-sm">
            Happy Friendship Day 2026
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-bold font-display text-white tracking-wide">
            Thank You, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-amber-200">{pageData.friendName}</span>!
          </h1>
        </div>

        <p className="text-lg sm:text-2xl text-slate-100 font-serif leading-relaxed italic whitespace-pre-line px-4">
          "{pageData.endingMessage || 'Thank you for reliving our journey. Here’s to many more memories together!'}"
        </p>

        <div className="pt-8 border-t border-slate-800/80 space-y-2">
          <p className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-rose-400" /> Forever & Always Friends <Heart className="w-4 h-4 fill-rose-400" />
          </p>
          <p className="text-xs text-slate-400">
            You have reached the end of this personalized gift experience.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
