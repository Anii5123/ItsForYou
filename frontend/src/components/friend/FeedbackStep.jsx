import React from 'react';
import { motion } from 'framer-motion';
import { useFriendStore } from '../../store/friendStore';
import { Heart, ThumbsUp, ThumbsDown, ArrowRight, MessageCircle } from 'lucide-react';
import { Textarea } from '../ui/Input';

export const FeedbackStep = ({ onNext }) => {
  const { feedback, updateFeedback } = useFriendStore();

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
      <div className="max-w-lg w-full p-8 rounded-3xl glass-panel border border-rose-500/20 space-y-6 shadow-2xl text-left">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30 text-rose-400">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Your Feedback</span>
          <h2 className="text-2xl font-bold font-display text-white">How Did You Enjoy This Experience?</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Branching Yes/No Prompt */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Did this journey bring a smile to your face?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateFeedback('likedGift', true)}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                  feedback.likedGift
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/25'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" /> I Loved It! ❤️
              </button>
              <button
                type="button"
                onClick={() => updateFeedback('likedGift', false)}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                  !feedback.likedGift
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/25'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ThumbsDown className="w-4 h-4" /> Could be better
              </button>
            </div>
          </div>

          <Textarea
            label={feedback.likedGift ? "What was your favourite moment?" : "What could be improved?"}
            rows={3}
            value={feedback.likedGift ? feedback.likedMostText : feedback.didntLikeText}
            onChange={(e) => updateFeedback(feedback.likedGift ? 'likedMostText' : 'didntLikeText', e.target.value)}
            placeholder="Write your thoughts here (Optional)..."
          />

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Reflections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
