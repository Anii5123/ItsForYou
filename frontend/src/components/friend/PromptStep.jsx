import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Smile, Heart } from 'lucide-react';

export const PromptStep = ({ pageData, onNext }) => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [teaseText, setTeaseText] = useState('No 😜');
  const [showHearts, setShowHearts] = useState(false);

  const maxDodges = 5;

  const handleNoDodge = () => {
    if (dodgeCount >= maxDodges) {
      setTeaseText('nope, try Yes 😄');
      return;
    }

    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    const randomX = (Math.random() - 0.5) * 260; // -130 to +130
    const randomY = (Math.random() - 0.5) * 180; // -90 to +90

    setNoPosition({ x: randomX, y: randomY });

    if (nextCount === 2) setTeaseText('Too slow! 😄');
    if (nextCount === 3) setTeaseText('Nope! Try again 😜');
    if (nextCount === 4) setTeaseText('Almost... not! 🙈');
    if (nextCount >= maxDodges) setTeaseText('nope, try Yes 😄');
  };

  const handleYesClick = () => {
    setShowHearts(true);
    setTimeout(() => {
      onNext();
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 px-4 relative overflow-hidden"
    >
      <div className="max-w-xl w-full p-8 md:p-12 rounded-3xl glass-panel relative space-y-8 shadow-2xl border border-rose-500/20">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 flex items-center justify-center border border-rose-500/40 text-rose-400 shadow-xl shadow-rose-500/10"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Relive Our Journey?
          </h2>
          <p className="text-sm sm:text-lg text-slate-200 font-serif leading-relaxed">
            I've put together our fondest shared memories, photos, and messages. Ready to step down memory lane together?
          </p>
        </div>

        {/* Buttons Container */}
        <div className="relative min-h-[130px] flex items-center justify-center gap-6 pt-4">
          {/* YES Button */}
          <button
            onClick={handleYesClick}
            className="group px-9 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-base shadow-2xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 z-10 overflow-hidden"
          >
            <Check className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span>Yes, let's go! ❤️</span>
          </button>

          {/* Evasive NO Button */}
          <motion.button
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            onMouseEnter={handleNoDodge}
            onTouchStart={handleNoDodge}
            onClick={handleNoDodge}
            className="px-7 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-colors flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Smile className="w-4 h-4 text-amber-400" />
            <span>{teaseText}</span>
          </motion.button>
        </div>

        {dodgeCount > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-rose-400 font-medium animate-pulse"
          >
            {dodgeCount >= maxDodges ? "You can only click YES! 😄" : `Nice try dodging! (${dodgeCount}/${maxDodges})`}
          </motion.p>
        )}
      </div>

      {/* Heart Particles on Yes Click */}
      <AnimatePresence>
        {showHearts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 300
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute text-rose-500"
              >
                <Heart className="w-8 h-8 fill-rose-500" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
