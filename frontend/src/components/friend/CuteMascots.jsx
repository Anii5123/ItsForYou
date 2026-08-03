import React from 'react';
import { motion } from 'framer-motion';

export const CuteMascots = ({ type = 'puppy' }) => {
  return (
    <div className="relative inline-flex items-center justify-center my-2 pointer-events-auto cursor-pointer group">
      {type === 'puppy' && (
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 4, -4, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-5xl sm:text-6xl drop-shadow-xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🐶</span>
          <motion.span
            animate={{ scale: [0, 1.2, 0], y: [-10, -35, -45], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-4 -right-2 text-rose-400 text-lg pointer-events-none"
          >
            ❤️
          </motion.span>
        </motion.div>
      )}

      {type === 'kitten' && (
        <motion.div
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-5xl sm:text-6xl drop-shadow-xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🐱</span>
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-3 -right-2 text-amber-300 text-base pointer-events-none"
          >
            ✨
          </motion.span>
        </motion.div>
      )}

      {type === 'teddy' && (
        <motion.div
          animate={{
            rotate: [0, 6, -6, 0]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-5xl sm:text-6xl drop-shadow-xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🧸</span>
          <motion.span
            animate={{ y: [0, -15, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-2 text-rose-400 text-base pointer-events-none"
          >
            💖
          </motion.span>
        </motion.div>
      )}

      {type === 'bunny' && (
        <motion.div
          animate={{
            y: [0, -14, 0],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-5xl sm:text-6xl drop-shadow-xl select-none"
        >
          <span className="inline-block transform group-hover:scale-125 transition-transform duration-300">🐰</span>
          <motion.span
            animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            className="absolute -top-3 -left-2 text-purple-400 text-base pointer-events-none"
          >
            🌸
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};
