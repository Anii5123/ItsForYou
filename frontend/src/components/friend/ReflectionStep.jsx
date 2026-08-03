import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFriendStore } from '../../store/friendStore';
import { Textarea } from '../ui/Input';
import { Sparkles, ArrowRight, Mic, Upload, CheckCircle2, AlertCircle, Play, Pause, Trash2 } from 'lucide-react';
import { uploadMediaFile } from '../../api/uploadApi';

export const ReflectionStep = ({ onNext }) => {
  const { reflections, updateReflection } = useFriendStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewAudio] = useState(() => new Audio());

  const handleVoiceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    try {
      const url = await uploadMediaFile(file, 'friend_voice_notes');
      updateReflection('friendVoiceNoteUrl', url);
    } catch (err) {
      setError('Failed to upload voice note. Please try another audio file.');
    } finally {
      setIsUploading(false);
    }
  };

  const togglePreview = () => {
    if (!reflections.friendVoiceNoteUrl) return;
    if (isPlaying) {
      previewAudio.pause();
      setIsPlaying(false);
    } else {
      previewAudio.src = reflections.friendVoiceNoteUrl;
      previewAudio.play();
      setIsPlaying(true);
      previewAudio.onended = () => setIsPlaying(false);
    }
  };

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
      setError('Please upload or record a Voice Note message for me 🎙️');
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

          {/* Mandatory Friend Voice Note Field */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30">
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-rose-400" /> Voice Note Message For Me *
            </label>
            <p className="text-xs text-slate-400">Upload an audio recording or voice note file from your device for me to listen to.</p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading Voice Note...' : 'Select Audio File'}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {reflections.friendVoiceNoteUrl && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pause' : 'Play My Voice Note'}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateReflection('friendVoiceNoteUrl', '')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400"
                    title="Remove Voice Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {reflections.friendVoiceNoteUrl && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Voice note attached successfully!
              </p>
            )}
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
