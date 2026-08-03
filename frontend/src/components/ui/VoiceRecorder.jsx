import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RefreshCw, Upload, CheckCircle2, Volume2, HardDrive } from 'lucide-react';
import { Button } from './Button';
import { uploadMediaFile } from '../../api/uploadApi';

export const VoiceRecorder = ({ onAudioUploaded, existingUrl = '', folder = 'voice_notes', label = 'Voice Note' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPreviewRef = useRef(new Audio());

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Start Recording
  const startRecording = async () => {
    setError('');
    setRecordedBlob(null);
    setPreviewUrl('');
    setRecordingTime(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setPreviewUrl(url);

        // Stop media stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Microphone access denied or not supported on this device.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Play Preview
  const togglePlayPreview = () => {
    const targetUrl = previewUrl || existingUrl;
    if (!targetUrl) return;

    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.src = targetUrl;
      audioPreviewRef.current.play();
      setIsPlayingPreview(true);
      audioPreviewRef.current.onended = () => setIsPlayingPreview(false);
    }
  };

  // Confirm and Upload to Cloudinary
  const handleConfirmUpload = async () => {
    if (!recordedBlob) return;

    setIsUploading(true);
    setError('');
    try {
      const file = new File([recordedBlob], `voice_note_${Date.now()}.webm`, { type: 'audio/webm' });
      const uploadedUrl = await uploadMediaFile(file, folder);
      onAudioUploaded(uploadedUrl);
      setRecordedBlob(null);
    } catch (err) {
      setError('Failed to upload recorded audio to Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  // File Uploader from System fallback
  const handleSystemFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    try {
      const uploadedUrl = await uploadMediaFile(file, folder);
      onAudioUploaded(uploadedUrl);
      setRecordedBlob(null);
      setPreviewUrl('');
    } catch (err) {
      setError('Failed to upload system audio file.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
      {error && (
        <p className="text-xs text-red-400 font-semibold">{error}</p>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Record / Stop Button */}
        {!isRecording && !previewUrl ? (
          <button
            type="button"
            onClick={startRecording}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Mic className="w-4 h-4 text-white animate-pulse" />
            <span>Record Voice Note</span>
          </button>
        ) : isRecording ? (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-red-400">Recording: {formatTime(recordingTime)}</span>
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-white" /> Stop
            </button>
          </div>
        ) : null}

        {/* System File Uploader Fallback */}
        {!isRecording && !previewUrl && (
          <label className="cursor-pointer text-xs text-slate-400 hover:text-slate-200 underline flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Or upload file from system</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleSystemFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Recorded Preview & Confirmation Box */}
      {previewUrl && (
        <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span>Voice Recording Preview</span>
            <span className="text-rose-400 font-mono">{formatTime(recordingTime)}</span>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={togglePlayPreview}
                className="gap-1.5 text-xs"
              >
                {isPlayingPreview ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                {isPlayingPreview ? 'Pause Listen' : 'Listen Back'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setRecordedBlob(null);
                  setPreviewUrl('');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Re-record
              </button>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirmUpload}
              isLoading={isUploading}
              className="gap-1.5 text-xs shadow-lg shadow-rose-600/30"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm & Upload Voice Note
            </Button>
          </div>
        </div>
      )}

      {/* Existing Uploaded Audio Notification */}
      {existingUrl && !previewUrl && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
          <span className="font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Voice Note Uploaded & Saved
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={togglePlayPreview}
            className="text-xs gap-1 text-emerald-400"
          >
            {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlayingPreview ? 'Pause' : 'Play Audio'}
          </Button>
        </div>
      )}
    </div>
  );
};
