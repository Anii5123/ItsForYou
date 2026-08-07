import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, Volume2, Star, User, Mail, Lock, X } from 'lucide-react';
import { CuteMascots } from './CuteMascots';
import { useFriendStore } from '../../store/friendStore';

export const WelcomeStep = ({ pageData, onNext, onPlayAudio }) => {
  const { visitorName, visitorEmail, setVisitorDetails } = useFriendStore();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(visitorName || '');
  const [email, setEmail] = useState(visitorEmail || '');
  const [error, setError] = useState('');

  const handleStart = () => {
    // If visitor already entered name/email, proceed directly
    if (visitorName && visitorEmail) {
      if (onPlayAudio) onPlayAudio();
      onNext();
    } else {
      setShowModal(true);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setVisitorDetails(name.trim(), email.trim());
    setShowModal(false);
    if (onPlayAudio) onPlayAudio();
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 px-4 relative overflow-hidden"
    >
      {/* Background Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5
            }}
            className="absolute text-rose-400/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`
            }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ))}
      </div>

      {/* Main Animated Gift Icon & Mascot */}
      <div className="flex flex-col items-center gap-2">
        <CuteMascots type={pageData.themeName || 'mickey'} />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative group cursor-pointer"
          onClick={handleStart}
        >
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-600 via-purple-600 to-rose-400 blur-xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-400 flex items-center justify-center shadow-2xl shadow-rose-600/50 border border-white/20 transform group-hover:scale-105 transition-transform duration-300">
            <Heart className="w-14 h-14 text-white fill-white animate-pulse" />
          </div>
          <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center shadow-lg">
            <Star className="w-4 h-4 text-amber-300 fill-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </motion.div>
      </div>

      {/* Hero Typography */}
      <div className="space-y-4 max-w-2xl relative z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase font-bold tracking-widest text-rose-300 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 inline-flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" /> A Personalized Gift Experience
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-6xl font-bold font-display text-white tracking-wide leading-tight"
        >
          Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-amber-200">{pageData.friendName}</span>!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg sm:text-2xl text-slate-200 font-serif italic leading-relaxed px-4"
        >
          "{pageData.heroMessage}"
        </motion.p>
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-4 space-y-4 relative z-10"
      >
        <button
          onClick={handleStart}
          className="group relative px-9 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-base shadow-2xl shadow-rose-600/40 hover:shadow-rose-600/60 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span>Unwrap Your Journey</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>

        {pageData.backgroundMusicUrl && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center">
            <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Background ambient music included
          </p>
        )}
      </motion.div>

      {/* Visitor Access Credentials Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full p-6 sm:p-8 rounded-3xl glass-panel border border-rose-500/30 shadow-2xl space-y-6 text-left relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">Unlock Gift Experience</h3>
                <p className="text-xs text-slate-300">
                  Please enter your name and email to personalize and unlock your storybook journey.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-rose-400" /> Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ani patil"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-rose-500 text-white text-xs outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-rose-400" /> Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. anipatil@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-rose-500 text-white text-xs outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Begin Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
