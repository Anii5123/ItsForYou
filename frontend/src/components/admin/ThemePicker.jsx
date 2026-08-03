import React from 'react';
import { Palette, CheckCircle2 } from 'lucide-react';

export const THEMES = [
  {
    id: 'mickey',
    name: 'Mickey Mouse 🐭',
    character: '🐭',
    subtitle: 'Disney Magic Red & Gold',
    badgeClass: 'from-red-600 via-amber-500 to-red-800',
    borderClass: 'border-red-500',
    bgPreview: 'bg-gradient-to-br from-red-950/90 via-slate-950 to-amber-950/80',
    textColor: 'text-red-400'
  },
  {
    id: 'dog',
    name: 'Playful Dog 🐶',
    character: '🐶',
    subtitle: 'Warm Amber & Golden Brown',
    badgeClass: 'from-amber-600 via-orange-500 to-amber-800',
    borderClass: 'border-amber-500',
    bgPreview: 'bg-gradient-to-br from-amber-950/90 via-slate-950 to-orange-950/80',
    textColor: 'text-amber-400'
  },
  {
    id: 'elephant',
    name: 'Royal Elephant 🐘',
    character: '🐘',
    subtitle: 'Sapphire Blue & Cyan',
    badgeClass: 'from-blue-600 via-cyan-500 to-blue-800',
    borderClass: 'border-blue-500',
    bgPreview: 'bg-gradient-to-br from-blue-950/90 via-slate-950 to-cyan-950/80',
    textColor: 'text-blue-400'
  },
  {
    id: 'cat',
    name: 'Whimsical Cat 🐱',
    character: '🐱',
    subtitle: 'Rose Pink & Soft Violet',
    badgeClass: 'from-pink-600 via-purple-500 to-pink-800',
    borderClass: 'border-pink-500',
    bgPreview: 'bg-gradient-to-br from-pink-950/90 via-slate-950 to-purple-950/80',
    textColor: 'text-pink-400'
  },
  {
    id: 'rabbit',
    name: 'Pastel Bunny 🐰',
    character: '🐰',
    subtitle: 'Mint Green & Emerald Meadow',
    badgeClass: 'from-emerald-600 via-teal-500 to-emerald-800',
    borderClass: 'border-emerald-500',
    bgPreview: 'bg-gradient-to-br from-emerald-950/90 via-slate-950 to-teal-950/80',
    textColor: 'text-emerald-400'
  }
];

export const ThemePicker = ({ selectedTheme = 'mickey', onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-400" /> Choose Character & Color Theme
        </h3>
        <p className="text-xs text-slate-400">
          Select a character theme. Each theme features a unique mascot (Mickey, Dog, Elephant, Cat, Bunny) and a tailored color palette.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? `${theme.borderClass} ${theme.bgPreview} shadow-xl shadow-slate-950/50 ring-2 ring-offset-2 ring-offset-slate-950 ${theme.borderClass}`
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{theme.character}</span>
                {isSelected && (
                  <CheckCircle2 className={`w-5 h-5 ${theme.textColor}`} />
                )}
              </div>

              <div className="pt-3">
                <h4 className="text-sm font-bold text-white">{theme.name}</h4>
                <p className="text-xs text-slate-400">{theme.subtitle}</p>
              </div>

              {/* Color Palette Gradient Bar */}
              <div className={`mt-3 h-2 rounded-full bg-gradient-to-r ${theme.badgeClass}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
