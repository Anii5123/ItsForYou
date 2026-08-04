import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StepDwellChart, CompletionFunnelChart } from '../../components/admin/AnalyticsCharts';
import { fetchPageById } from '../../api/pagesApi';
import { fetchPageAnalytics, fetchLiveStatus } from '../../api/analyticsApi';
import {
  ArrowLeft,
  Activity,
  Users,
  Clock,
  CheckCircle2,
  TrendingDown,
  Mic,
  BookOpen,
  MessageCircle,
  Sparkles,
  Heart,
  Radio
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [liveStatus, setLiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const pageData = await fetchPageById(id);
      const analyticsData = await fetchPageAnalytics(id);
      const liveData = await fetchLiveStatus(id);

      setPage(pageData);
      setAnalytics(analyticsData);
      setLiveStatus(liveData);
    } catch (err) {
      alert('Failed to load analytics data.');
      navigate('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Poll live status every 5 seconds
    const interval = setInterval(async () => {
      try {
        const liveData = await fetchLiveStatus(id);
        setLiveStatus(liveData);
      } catch (e) {}
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading || !page || !analytics) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 mx-auto border-2 border-rose-500 border-t-transparent rounded-full mb-3" />
          Loading engagement analytics & live monitor...
        </div>
      </AdminLayout>
    );
  }

  const { summary, pageBreakdown, voiceStats, poemStats, feedbackList } = analytics;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/pages')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-white">{page.friendName}'s Analytics</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                  {page.randomId}
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-time visitor telemetry, dwell time, and reflection answers.</p>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={loadData} className="gap-2">
            <Activity className="w-4 h-4" /> Refresh Analytics
          </Button>
        </div>

        {/* Live Visitor Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          liveStatus?.isLive
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${liveStatus?.isLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                {liveStatus?.isLive ? 'LIVE NOW: Visitor Active on Page' : 'Offline: No Active Visitors'}
              </p>
              <p className="text-xs font-mono">
                {liveStatus?.isLive
                  ? `${liveStatus.activeVisitorCount} active session (${liveStatus.activeSessions[0]?.deviceType || 'mobile'})`
                  : 'Last activity checked via heartbeat'}
              </p>
            </div>
          </div>
          <Radio className={`w-5 h-5 ${liveStatus?.isLive ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="p-4 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Visits</p>
            <h3 className="text-2xl font-bold text-white mt-1">{summary.totalVisits}</h3>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Avg Duration</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">{summary.avgSessionSeconds}s</h3>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Completion Rate</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{summary.completionRate}%</h3>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Completed</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">{summary.completedVisits}</h3>
          </Card>

          <Card className="p-4 text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Bounce Rate</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{summary.bounceRate}%</h3>
          </Card>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <StepDwellChart pageBreakdown={pageBreakdown} />
          </Card>
          <Card className="p-6">
            <CompletionFunnelChart pageBreakdown={pageBreakdown} />
          </Card>
        </div>

        {/* Audio & Poem Specific Engagement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Voice Note Listens</p>
              <h4 className="text-xl font-bold text-white">
                {voiceStats.totalVoiceListens} <span className="text-xs font-normal text-rose-400">({voiceStats.voiceCompletions} completed)</span>
              </h4>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Poem Stanza Reads</p>
              <h4 className="text-xl font-bold text-white">{poemStats.totalPoemReads} Reads</h4>
            </div>
          </Card>
        </div>

        {/* Detailed Per-Visitor Device & Duration Sessions List */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-400" /> Visitor Sessions & Duration Breakdown
              </h3>
              <p className="text-xs text-slate-400">Track individual visitor devices, time spent per session, and current step reached.</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-rose-300 font-mono">
              {analytics.visitorSessions?.length || 0} Total Sessions
            </span>
          </div>

          {(!analytics.visitorSessions || analytics.visitorSessions.length === 0) ? (
            <p className="text-xs text-slate-500 py-4 text-center">No visitor sessions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Device / Visitor</th>
                    <th className="p-3">Started At</th>
                    <th className="p-3">Duration Spent</th>
                    <th className="p-3">Step Progress</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {analytics.visitorSessions.map((session, idx) => {
                    const mins = Math.floor((session.totalTimeSeconds || 0) / 60);
                    const secs = (session.totalTimeSeconds || 0) % 60;
                    const durationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

                    return (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">
                              {session.deviceType === 'mobile' ? '📱' : session.deviceType === 'tablet' ? '📲' : '💻'}
                            </span>
                            <div>
                              <p className="font-semibold text-white uppercase">{session.deviceType}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{session.sessionId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-400 font-mono">
                          {new Date(session.startedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="p-3 font-semibold text-rose-300 font-mono">
                          {durationStr}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 font-bold text-[11px]">
                            Step {session.currentStep}/11
                          </span>
                        </td>
                        <td className="p-3">
                          {session.completed ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                              Completed 🎉
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                              In Progress
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Received Reflections & Feedback Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-rose-400" /> Submitted Reflections & Feedback ({feedbackList.length})
          </h3>

          {feedbackList.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 text-sm">
              No feedback or reflection responses submitted yet by your friend.
            </Card>
          ) : (
            <div className="space-y-4">
              {feedbackList.map((fb, idx) => (
                <Card key={idx} className="p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-rose-400 uppercase">
                      Response #{feedbackList.length - idx}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(fb.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Liked Gift?</p>
                      <p className="text-sm font-semibold text-rose-300">{fb.likedGift ? 'Loved It! ❤️' : 'Could be better'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Favourite Moment</p>
                      <p className="text-sm text-slate-200">{fb.likedMostText || 'No text submitted'}</p>
                    </div>
                  </div>

                  {/* Reflection Answers */}
                  {fb.reflectionAnswers && (
                    <div className="pt-2 space-y-2 border-t border-slate-800">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-400">Reflection Answers</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {fb.reflectionAnswers.whatAmIToYou && (
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                            <p className="text-[10px] text-slate-400 uppercase">What am I to you?</p>
                            <p className="text-xs text-slate-200 italic font-serif">"{fb.reflectionAnswers.whatAmIToYou}"</p>
                          </div>
                        )}
                        {fb.reflectionAnswers.describeOurFriendship && (
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                            <p className="text-[10px] text-slate-400 uppercase">Friendship in 3 words</p>
                            <p className="text-xs text-slate-200 italic font-serif">"{fb.reflectionAnswers.describeOurFriendship}"</p>
                          </div>
                        )}
                        {fb.reflectionAnswers.favouriteMemory && (
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                            <p className="text-[10px] text-slate-400 uppercase">Favourite Memory</p>
                            <p className="text-xs text-slate-200 italic font-serif">"{fb.reflectionAnswers.favouriteMemory}"</p>
                          </div>
                        )}
                        {fb.reflectionAnswers.anythingElse && (
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                            <p className="text-[10px] text-slate-400 uppercase">Anything Else</p>
                            <p className="text-xs text-slate-200 italic font-serif">"{fb.reflectionAnswers.anythingElse}"</p>
                          </div>
                        )}
                        {fb.reflectionAnswers.friendVoiceNoteUrl && (
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30 col-span-1 sm:col-span-2 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1">
                                <Mic className="w-3.5 h-3.5" /> Friend's Voice Note Reply
                              </p>
                              <p className="text-[11px] text-slate-400">Audio message sent by {page.friendName}</p>
                            </div>
                            <audio controls src={fb.reflectionAnswers.friendVoiceNoteUrl} className="h-8 max-w-[200px]" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
