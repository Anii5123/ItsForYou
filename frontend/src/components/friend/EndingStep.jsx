import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, Award } from 'lucide-react';

export const EndingStep = ({ pageData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 px-4 relative overflow-hidden"
    >
      {/* Floating confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * (window.innerWidth || 400),
              y: -20,
              scale: Math.random() * 0.6 + 0.4,
              opacity: 1
            }}
            animate={{
              y: window.innerHeight || 800,
              rotate: Math.random() * 360,
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
            className="absolute"
          >
            {i % 2 === 0 ? (
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl w-full p-8 md:p-12 rounded-3xl glass-panel border border-rose-500/30 space-y-8 shadow-2xl relative z-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-rose-600/40 border border-white/20"
        >
          <Heart className="w-12 h-12 text-white fill-white" />
        </motion.div>

        <div className="space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-300 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 inline-block">
            Happy Friendship Day 2026
          </span>
          
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-white">
            Thank You, <span className="text-rose-300">{pageData.friendName}</span>!
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-slate-100 font-serif leading-relaxed italic whitespace-pre-line px-4">
          "{pageData.endingMessage || 'Thank you for reliving our journey. Here’s to many more memories together!'}"
        </p>

        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            Forever & Always Friends ❤️
          </p>
          <p className="text-[11px] text-slate-500">
            You have reached the end of this personalized gift experience.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
