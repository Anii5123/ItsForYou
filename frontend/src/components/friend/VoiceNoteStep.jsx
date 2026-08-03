import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Play, Pause, ArrowRight, Volume2 } from 'lucide-react';

export const VoiceNoteStep = ({ pageData, onNext }) => {
  const voiceUrl = pageData.voiceNoteUrl;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio(voiceUrl));

  useEffect(() => {
    if (!voiceUrl) return;

    const audio = audioRef.current;
    audio.src = voiceUrl;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [voiceUrl]);

  const togglePlay = () => {
    if (!voiceUrl) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!voiceUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4"
      >
        <div className="max-w-md w-full p-8 rounded-3xl glass-panel space-y-4 border border-rose-500/20">
          <Mic className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-2xl font-bold font-display text-white">Voice Note</h3>
          <p className="text-sm text-slate-300 font-serif italic">
            "Your voice and laughter stay with me wherever I go."
          </p>
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all"
          >
            Continue Journey
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 px-4"
    >
      <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-rose-500/20 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Pulsing Voice Halo */}
        <motion.div
          animate={isPlaying ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-24 h-24 mx-auto rounded-full bg-rose-500/30 blur-2xl absolute top-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
        />

        <motion.div
          animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-2xl shadow-rose-600/40 text-white border border-white/20 relative z-10"
        >
          <Mic className="w-10 h-10" />
        </motion.div>

        <div className="space-y-1 relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-rose-300 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block">
            Audio Message
          </span>
          <h2 className="text-2xl font-bold font-display text-white pt-1">A Voice Note For You</h2>
          <p className="text-xs text-slate-400">Tap play to listen to a personal audio message.</p>
        </div>

        {/* Custom Audio Player Controls */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 relative z-10">
          {/* Waveform Visualization Simulation */}
          <div className="flex items-center justify-center gap-1.5 h-14">
            {[40, 70, 30, 90, 50, 80, 100, 60, 30, 75, 45, 95, 60, 30, 80, 50, 70, 90, 40].map((h, idx) => (
              <motion.span
                key={idx}
                animate={isPlaying ? { height: [`${h * 0.25}%`, `${h}%`, `${h * 0.35}%`] } : { height: `${h * 0.25}%` }}
                transition={isPlaying ? { duration: 0.7, repeat: Infinity, delay: idx * 0.04 } : {}}
                className={`w-1 rounded-full ${isPlaying ? 'bg-rose-500' : 'bg-slate-700'}`}
              />
            ))}
          </div>

          {/* Scrubber Progress Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
            <div className="bg-gradient-to-r from-rose-500 to-rose-400 h-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{formatTime(audioRef.current.currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 transition-transform active:scale-95 transform hover:scale-105"
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
        >
          <span>Continue to Surprise Gift</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
