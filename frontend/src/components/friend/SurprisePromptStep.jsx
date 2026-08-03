import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Check, ExternalLink, ArrowRight, X } from 'lucide-react';

export const SurprisePromptStep = ({ pageData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const surprise = pageData.surpriseGiftContent || {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4"
    >
      <div className="max-w-xl w-full p-8 md:p-12 rounded-3xl glass-panel border border-rose-500/20 space-y-6 shadow-2xl">
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-xl shadow-amber-500/20 text-white"
        >
          <Gift className="w-10 h-10" />
        </motion.div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">Bonus Surprise</span>
          <h2 className="text-3xl font-bold font-display text-white">One More Surprise For You!</h2>
          <p className="text-sm text-slate-300">
            Before we read our friendship poem, I have prepared a little bonus surprise token just for you.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-base shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Open Surprise Gift 🎁
          </button>
          
          <button
            onClick={onNext}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <span>Skip to Poem</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Surprise Content Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Gift className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold font-display text-white">{surprise.title || 'Surprise Gift!'}</h3>
              <p className="text-sm text-slate-200 font-serif leading-relaxed italic">"{surprise.body}"</p>

              {surprise.linkUrl && (
                <a
                  href={surprise.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline pt-2"
                >
                  <span>Open Special Voucher / Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  onNext();
                }}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Poem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
