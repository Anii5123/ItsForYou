import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart2,
  Share2,
  Activity
} from 'lucide-react';

export const PageCard = ({ page, onDuplicate, onDelete, onPreview }) => {
  const [copied, setCopied] = useState(false);

  const publicPath = `/${page.randomId}/${page.friendSlug}`;
  const fullUrl = `${window.location.origin}${publicPath}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    if (page.status === 'published') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Clock className="w-3.5 h-3.5" /> Draft
      </span>
    );
  };

  return (
    <Card className="hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="text-xs text-rose-400 font-medium tracking-wide uppercase">Friend Experience</span>
            <h3 className="text-xl font-bold font-display text-white group-hover:text-rose-300 transition-colors">
              {page.friendName}
            </h3>
          </div>
          {getStatusBadge()}
        </div>

        {/* Secret URL Box */}
        <div className="bg-slate-900/80 rounded-xl p-3 mb-5 border border-slate-800 flex items-center justify-between gap-2">
          <div className="overflow-hidden">
            <p className="text-[10px] uppercase font-semibold text-slate-400">Secret URL</p>
            <p className="text-xs text-slate-300 font-mono truncate font-semibold">{publicPath}</p>
          </div>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-colors flex-shrink-0"
            title="Copy Secret Link"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
            <p className="text-[10px] text-slate-400 font-medium">Visits</p>
            <p className="text-base font-bold text-slate-100">{page.stats?.totalVisits || 0}</p>
          </div>
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
            <p className="text-[10px] text-slate-400 font-medium">Completed</p>
            <p className="text-base font-bold text-slate-100">{page.stats?.completedVisits || 0}</p>
          </div>
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
            <p className="text-[10px] text-slate-400 font-medium">Completion</p>
            <p className="text-base font-bold text-rose-400">{page.stats?.completionRate || 0}%</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Link to={`/admin/pages/${page._id}/edit`}>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Edit className="w-3.5 h-3.5" /> Edit
            </Button>
          </Link>

          <Link to={`/admin/pages/${page._id}/analytics`}>
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Analytics
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(page)}
            title="Preview Experience"
            className="p-2"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <button
            onClick={() => onDuplicate(page._id)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Duplicate Experience"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(page._id)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            title="Delete Experience"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
