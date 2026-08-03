import React from 'react';
import { VoiceRecorder } from '../ui/VoiceRecorder';
import { Input } from '../ui/Input';
import { Mic } from 'lucide-react';

export const VoiceNoteEditor = ({ voiceNoteUrl = '', onChange }) => {
  return (
    <div className="space-y-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-rose-400" /> Custom Voice Note Message
        </h3>
        <p className="text-xs text-slate-400">
          Record directly using your microphone or select an audio file from your computer to upload. Listen back to confirm before saving!
        </p>
      </div>

      <VoiceRecorder
        onAudioUploaded={(url) => onChange(url)}
        existingUrl={voiceNoteUrl}
        folder="voice_notes"
        label="Admin Voice Note"
      />

      <Input
        label="Audio Cloud URL"
        value={voiceNoteUrl}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Audio URL will auto-populate after confirmation..."
      />
    </div>
  );
};
