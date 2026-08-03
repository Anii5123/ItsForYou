import React from 'react';

export const StepDwellChart = ({ pageBreakdown = [] }) => {
  const maxDwell = Math.max(...pageBreakdown.map(p => p.avgDwellSeconds), 1);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-200">Average Dwell Time per Step (Seconds)</h4>
      <div className="space-y-2">
        {pageBreakdown.map((item, i) => {
          const percent = Math.round((item.avgDwellSeconds / maxDwell) * 100);
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span className="capitalize">{item.pageKey} (Step {i + 1})</span>
                <span>{item.avgDwellSeconds}s ({item.visitCount} visits)</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(percent, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CompletionFunnelChart = ({ pageBreakdown = [] }) => {
  const firstCount = pageBreakdown[0]?.visitCount || 1;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-200">Journey Completion Funnel</h4>
      <div className="space-y-2">
        {pageBreakdown.map((item, i) => {
          const funnelPercent = Math.round((item.visitCount / firstCount) * 100);
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span className="capitalize">{item.pageKey}</span>
                <span>{funnelPercent}% ({item.visitCount})</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-purple-600 to-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(funnelPercent, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
