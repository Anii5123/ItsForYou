import React from 'react';
import { motion } from 'framer-motion';

export const CuteMascots = ({ type = 'dog' }) => {
  const normalizedType = (type || 'dog').toLowerCase();

  return (
    <div className="relative inline-flex items-center justify-center my-2 pointer-events-auto cursor-pointer group">
      {/* 1. MICKEY MOUSE THEME MASCOT */}
      {(normalizedType === 'mickey' || normalizedType === 'mickey_mouse') && (
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-6xl sm:text-7xl drop-shadow-2xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🐭</span>
          <motion.span
            animate={{ scale: [0, 1.4, 0], y: [-10, -40, -50], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
            className="absolute -top-4 -right-3 text-amber-300 text-xl pointer-events-none"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ scale: [0, 1.2, 0], y: [-5, -30, -40], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}
            className="absolute -top-3 -left-3 text-red-500 text-lg pointer-events-none"
          >
            ❤️
          </motion.span>
        </motion.div>
      )}

      {/* 2. DOG / PUPPY THEME MASCOT */}
      {(normalizedType === 'dog' || normalizedType === 'puppy' || normalizedType === 'sunset') && (
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 4, -4, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-6xl sm:text-7xl drop-shadow-2xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🐶</span>
          <motion.span
            animate={{ scale: [0, 1.3, 0], y: [-10, -35, -45], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            className="absolute -top-4 -right-2 text-amber-400 text-lg pointer-events-none"
          >
            🦴
          </motion.span>
          <motion.span
            animate={{ scale: [0, 1.2, 0], y: [-5, -25, -35], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 0.9 }}
            className="absolute -top-3 -left-2 text-rose-400 text-base pointer-events-none"
          >
            ❤️
          </motion.span>
        </motion.div>
      )}

      {/* 3. ELEPHANT THEME MASCOT */}
      {(normalizedType === 'elephant' || normalizedType === 'ocean') && (
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -3, 3, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-6xl sm:text-7xl drop-shadow-2xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🐘</span>
          <motion.span
            animate={{ scale: [0, 1.3, 0], y: [-12, -45, -55], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
            className="absolute -top-4 -right-2 text-blue-400 text-xl pointer-events-none"
          >
            💦
          </motion.span>
          <motion.span
            animate={{ scale: [0, 1.2, 0], y: [-8, -30, -40], opacity: [0, 1, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: 0.8 }}
            className="absolute -top-3 -left-2 text-cyan-300 text-base pointer-events-none"
          >
            ⭐
          </motion.span>
        </motion.div>
      )}

      {/* 4. CAT / KITTEN THEME MASCOT */}
      {(normalizedType === 'cat' || normalizedType === 'kitten' || normalizedType === 'rose' || normalizedType === 'violet') && (
        <motion.div
          animate={{
            y: [0, -9, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-6xl sm:text-7xl drop-shadow-2xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🐱</span>
          <motion.span
            animate={{ scale: [0, 1.3, 0], y: [-10, -35, -45], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-4 -right-2 text-pink-400 text-lg pointer-events-none"
          >
            🐾
          </motion.span>
          <motion.span
            animate={{ scale: [0, 1.2, 0], y: [-5, -25, -35], opacity: [0, 1, 0] }}
            transition={{ duration: 2.3, repeat: Infinity, delay: 1 }}
            className="absolute -top-3 -left-2 text-purple-300 text-base pointer-events-none"
          >
            💖
          </motion.span>
        </motion.div>
      )}

      {/* 5. RABBIT / BUNNY THEME MASCOT */}
      {(normalizedType === 'rabbit' || normalizedType === 'bunny' || normalizedType === 'emerald') && (
        <motion.div
          animate={{
            y: [0, -14, 0],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-6xl sm:text-7xl drop-shadow-2xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🐰</span>
          <motion.span
            animate={{ scale: [0, 1.4, 0], y: [-10, -38, -48], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            className="absolute -top-4 -right-2 text-emerald-400 text-lg pointer-events-none"
          >
            🥕
          </motion.span>
          <motion.span
            animate={{ scale: [0, 1.2, 0], y: [-5, -28, -38], opacity: [0, 1, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, delay: 0.8 }}
            className="absolute -top-3 -left-2 text-teal-300 text-base pointer-events-none"
          >
            🌸
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};
