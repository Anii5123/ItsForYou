import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFriendStore } from '../../store/friendStore';
import { Textarea } from '../ui/Input';
import { VoiceRecorder } from '../ui/VoiceRecorder';
import { Sparkles, ArrowRight, Mic, AlertCircle } from 'lucide-react';

export const ReflectionStep = ({ onNext }) => {
  const { reflections, updateReflection } = useFriendStore();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Strict Mandatory Validation
    if (!reflections.whatAmIToYou?.trim()) {
      setError('Please answer: "What am I to you?"');
      return;
    }
    if (!reflections.describeOurFriendship?.trim()) {
      setError('Please answer: "Describe our friendship in 3 words"');
      return;
    }
    if (!reflections.favouriteMemory?.trim()) {
      setError('Please answer: "What is your absolute favourite memory of us?"');
      return;
    }
    if (!reflections.friendVoiceNoteUrl) {
      setError('Please record or upload a Voice Note message for me 🎙️');
      return;
    }
    if (!reflections.anythingElse?.trim()) {
      setError('Please answer: "Anything else you want to say to me?"');
      return;
    }

    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 px-4"
    >
      <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl glass-panel border border-rose-500/20 space-y-6 shadow-2xl text-left">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30 text-rose-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Friendship Reflections</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Words for Our Friendship</h2>
          <p className="text-xs text-slate-400">Please answer all reflection questions below (All fields are mandatory).</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Textarea
            label="What am I to you? *"
            rows={2}
            required
            value={reflections.whatAmIToYou}
            onChange={(e) => updateReflection('whatAmIToYou', e.target.value)}
            placeholder="A best friend, a confidant..."
          />

          <Textarea
            label="Describe our friendship in 3 words *"
            rows={2}
            required
            value={reflections.describeOurFriendship}
            onChange={(e) => updateReflection('describeOurFriendship', e.target.value)}
            placeholder="Unconditional, joyful, eternal..."
          />

          <Textarea
            label="What is your absolute favourite memory of us? *"
            rows={2}
            required
            value={reflections.favouriteMemory}
            onChange={(e) => updateReflection('favouriteMemory', e.target.value)}
            placeholder="That time when we..."
          />

          {/* Mandatory Microphone Voice Recorder for Friend */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-rose-400" /> Voice Note Message For Me *
            </label>
            <p className="text-xs text-slate-400">Record a voice note directly using your microphone or select an audio file. Listen back to confirm before submitting!</p>
            
            <VoiceRecorder
              onAudioUploaded={(url) => updateReflection('friendVoiceNoteUrl', url)}
              existingUrl={reflections.friendVoiceNoteUrl}
              folder="friend_voice_notes"
              label="Friend Voice Note Reply"
            />
          </div>

          <Textarea
            label="Anything else you want to say to me? *"
            rows={2}
            required
            value={reflections.anythingElse}
            onChange={(e) => updateReflection('anythingElse', e.target.value)}
            placeholder="Write any message from your heart..."
          />

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Proceed to Finale</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
