import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mic, Upload, Play, Pause, Trash2, Volume2 } from 'lucide-react';
import { uploadMediaFile } from '../../api/uploadApi';

export const VoiceNoteEditor = ({ voiceNoteUrl = '', onChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef] = useState(() => new Audio());
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadMediaFile(file, 'voice_notes');
      onChange(url);
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlay = () => {
    if (!voiceNoteUrl) return;
    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else {
      audioRef.src = voiceNoteUrl;
      audioRef.play();
      setIsPlaying(true);
      audioRef.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-rose-400" /> Custom Voice Note Message
        </h3>
        <p className="text-xs text-slate-400">Record or upload a personal audio message to add an authentic emotional voice moment.</p>
      </div>

      <div className="space-y-3">
        <Input
          label="Direct Audio URL / Link"
          value={voiceNoteUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/.../voice.mp3"
        />

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all">
            <Upload className="w-4 h-4 text-rose-400" />
            {isUploading ? 'Uploading Audio...' : 'Upload MP3 / WAV Audio'}
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          {voiceNoteUrl ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={togglePlay}
                className="gap-2 text-xs"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                {isPlaying ? 'Pause Preview' : 'Play Preview'}
              </Button>
              <button
                onClick={() => onChange('')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                title="Remove Voice Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
