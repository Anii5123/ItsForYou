import React from 'react';
import { Palette, Check } from 'lucide-react';

const PRESET_THEMES = [
  {
    key: 'rose_gold',
    name: 'Rose Gold Elegance',
    primary: '#E11D48',
    secondary: '#F43F5E',
    bg: '#18181B',
    text: '#FFF1F2',
    accent: '#FB7185'
  },
  {
    key: 'midnight_dark',
    name: 'Midnight Starlight',
    primary: '#6366F1',
    secondary: '#818CF8',
    bg: '#0F172A',
    text: '#F8FAFC',
    accent: '#A5B4FC'
  },
  {
    key: 'pastel_bloom',
    name: 'Warm Sunset Bloom',
    primary: '#F97316',
    secondary: '#FB923C',
    bg: '#1C1917',
    text: '#FFEDD5',
    accent: '#FDBA74'
  },
  {
    key: 'emerald_friendship',
    name: 'Emerald Harmony',
    primary: '#10B981',
    secondary: '#34D399',
    bg: '#064E3B',
    text: '#ECFDF5',
    accent: '#6EE7B7'
  }
];

export const ThemePicker = ({ theme = {}, onChange }) => {
  const currentKey = theme.key || 'rose_gold';

  const handleSelectPreset = (preset) => {
    onChange({
      key: preset.key,
      customColors: {
        primary: preset.primary,
        secondary: preset.secondary,
        background: preset.bg,
        text: preset.text,
        accent: preset.accent
      }
    });
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-400" /> Visual Theme & Palette
        </h3>
        <p className="text-xs text-slate-400">Choose a visual aesthetic tailored to your friend's personality.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {PRESET_THEMES.map((preset) => {
          const isSelected = currentKey === preset.key;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/50'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                {isSelected && <Check className="w-4 h-4 text-rose-400" />}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }} />
                <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.secondary }} />
                <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.bg }} />
                <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.accent }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
