import React from 'react';
import { motion } from 'framer-motion';
import { useFriendStore } from '../../store/friendStore';
import { Textarea } from '../ui/Input';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export const ReflectionStep = ({ onNext }) => {
  const { reflections, updateReflection } = useFriendStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4"
    >
      <div className="max-w-xl w-full p-8 rounded-3xl glass-panel border border-rose-500/20 space-y-6 shadow-2xl text-left">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30 text-rose-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Friendship Reflections</span>
          <h2 className="text-2xl font-bold font-display text-white">Words for Our Friendship</h2>
          <p className="text-xs text-slate-400">Share your thoughts on our bond (All questions are optional).</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            label="What am I to you?"
            rows={2}
            value={reflections.whatAmIToYou}
            onChange={(e) => updateReflection('whatAmIToYou', e.target.value)}
            placeholder="A best friend, a confidant..."
          />

          <Textarea
            label="Describe our friendship in 3 words"
            rows={2}
            value={reflections.describeOurFriendship}
            onChange={(e) => updateReflection('describeOurFriendship', e.target.value)}
            placeholder="Unconditional, joyful, eternal..."
          />

          <Textarea
            label="What is your absolute favourite memory of us?"
            rows={2}
            value={reflections.favouriteMemory}
            onChange={(e) => updateReflection('favouriteMemory', e.target.value)}
            placeholder="That time when we..."
          />

          <Textarea
            label="Anything else you want to say to me?"
            rows={2}
            value={reflections.anythingElse}
            onChange={(e) => updateReflection('anythingElse', e.target.value)}
            placeholder="Write any message from your heart..."
          />

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Finale</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
