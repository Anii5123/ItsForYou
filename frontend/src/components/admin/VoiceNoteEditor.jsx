import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mic, Upload, Play, Pause, Trash2, CheckCircle2, HardDrive } from 'lucide-react';
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
    } catch (err) {
      alert('Failed to upload audio file.');
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
    <div className="space-y-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-rose-400" /> Custom Voice Note Message
        </h3>
        <p className="text-xs text-slate-400">Select an audio file directly from your computer system to upload it to Cloudinary.</p>
      </div>

      {/* System File Uploader Button (Primary) */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Upload Audio from System</p>
            <p className="text-[11px] text-slate-400">Supports MP3, WAV, M4A, OGG audio files</p>
          </div>
        </div>

        <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading to Cloudinary...' : 'Select File from System'}
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Audio Link & Preview Player */}
      <div className="space-y-3 pt-2">
        <Input
          label="Audio Cloud URL"
          value={voiceNoteUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Audio URL will auto-populate here after file upload..."
        />

        {voiceNoteUrl && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Voice Note Ready for Preview
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={togglePlay}
                className="gap-2 text-xs"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                {isPlaying ? 'Pause' : 'Play Preview'}
              </Button>
              <button
                onClick={() => onChange('')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                title="Remove Voice Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
