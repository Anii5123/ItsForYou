import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Smile } from 'lucide-react';

export const PromptStep = ({ pageData, onNext }) => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [teaseText, setTeaseText] = useState('No 😜');

  const maxDodges = 5;

  const handleNoDodge = () => {
    if (dodgeCount >= maxDodges) {
      setTeaseText('nope, try Yes 😄');
      return;
    }

    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    // Calculate safe random offset within container bounds
    const randomX = (Math.random() - 0.5) * 240; // -120 to +120
    const randomY = (Math.random() - 0.5) * 160; // -80 to +80

    setNoPosition({ x: randomX, y: randomY });

    if (nextCount === 2) setTeaseText('Too slow! 😄');
    if (nextCount === 3) setTeaseText('Nope! Try again 😜');
    if (nextCount === 4) setTeaseText('Almost... not! 🙈');
    if (nextCount >= maxDodges) setTeaseText('nope, try Yes 😄');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4 relative overflow-hidden"
    >
      <div className="max-w-xl w-full p-8 md:p-12 rounded-3xl glass-panel relative space-y-8 shadow-2xl border border-rose-500/20">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30 text-rose-400">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-display text-white">
            Relive Our Journey?
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            I've put together our fondest memories, photos, and messages. Ready to step down memory lane together?
          </p>
        </div>

        {/* Buttons Container */}
        <div className="relative min-h-[120px] flex items-center justify-center gap-6 pt-4">
          {/* YES Button */}
          <button
            onClick={onNext}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-base shadow-xl shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 z-10"
          >
            <Check className="w-5 h-5" /> Yes, let's go! ❤️
          </button>

          {/* Evasive NO Button */}
          <motion.button
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onMouseEnter={handleNoDodge}
            onTouchStart={handleNoDodge}
            onClick={handleNoDodge}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Smile className="w-4 h-4 text-amber-400" /> {teaseText}
          </motion.button>
        </div>

        {dodgeCount > 0 && (
          <p className="text-xs text-rose-400 font-medium animate-bounce">
            {dodgeCount >= maxDodges ? "You can only click YES! 😄" : `Nice try dodging! (${dodgeCount}/${maxDodges})`}
          </p>
        )}
      </div>
    </motion.div>
  );
};
