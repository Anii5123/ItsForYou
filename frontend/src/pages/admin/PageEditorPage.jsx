import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { TimelineEditor } from '../../components/admin/TimelineEditor';
import { GalleryEditor } from '../../components/admin/GalleryEditor';
import { PoemEditor } from '../../components/admin/PoemEditor';
import { VoiceNoteEditor } from '../../components/admin/VoiceNoteEditor';
import { ThemePicker } from '../../components/admin/ThemePicker';
import { LivePreviewModal } from '../../components/admin/LivePreviewModal';
import { fetchPageById, updatePage, togglePublish } from '../../api/pagesApi';
import {
  Save,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Mic,
  Palette,
  Gift,
  Heart,
  Globe
} from 'lucide-react';

export const PageEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const loadPage = async () => {
    try {
      setLoading(true);
      const data = await fetchPageById(id);
      setPageData(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load experience details.');
      navigate('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [id]);

  const handleSave = async (auto = false) => {
    if (!pageData) return;
    setSaving(true);
    try {
      const updated = await updatePage(id, pageData);
      setPageData(updated);
      setLastSaved(new Date());
    } catch (err) {
      if (!auto) alert(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      const updated = await togglePublish(id);
      setPageData(updated);
    } catch (err) {
      alert('Failed to update publish status.');
    }
  };

  if (loading || !pageData) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 mx-auto border-2 border-rose-500 border-t-transparent rounded-full mb-3" />
          Loading experience editor...
        </div>
      </AdminLayout>
    );
  }

  const secretUrl = `/${pageData.randomId}/${pageData.friendSlug}`;

  const tabs = [
    { id: 'hero', label: 'Hero & Greeting', icon: Heart },
    { id: 'theme', label: 'Theme & Audio', icon: Palette },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'voice', label: 'Voice Note', icon: Mic },
    { id: 'poem', label: 'Poem & Surprise', icon: BookOpen },
    { id: 'ending', label: 'Ending Message', icon: Gift }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Editor Top Bar */}
        <div className="glass-panel sticky top-20 z-30 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <h1 className="text-xl font-bold font-display text-white">{pageData.friendName}</h1>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  pageData.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {pageData.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono font-semibold">{secretUrl}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {lastSaved && (
              <span className="text-xs text-slate-400 font-medium hidden lg:inline">
                Saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="gap-1.5"
            >
              <Eye className="w-4 h-4" /> Preview
            </Button>

            <Button
              variant={pageData.status === 'published' ? 'outline' : 'success'}
              size="sm"
              onClick={handleTogglePublish}
              className="gap-1.5"
            >
              <Globe className="w-4 h-4" />
              {pageData.status === 'published' ? 'Unpublish' : 'Publish Page'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSave(false)}
              isLoading={saving}
              className="gap-1.5 shadow-lg shadow-rose-600/30"
            >
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Editor Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                    : 'glass-panel text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <Card className="p-6 md:p-8">
          {activeTab === 'hero' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">General & Hero Message</h3>
                <p className="text-xs text-slate-400">Configure your friend's name, secret URL slug, and opening hero greeting.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Friend's Name"
                  value={pageData.friendName}
                  onChange={(e) => setPageData({ ...pageData, friendName: e.target.value })}
                />
                <Input
                  label="URL Slug Segment"
                  value={pageData.friendSlug}
                  onChange={(e) => setPageData({ ...pageData, friendSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                />
              </div>

              <Textarea
                label="Opening Hero Message"
                rows={3}
                value={pageData.heroMessage}
                onChange={(e) => setPageData({ ...pageData, heroMessage: e.target.value })}
                placeholder="A special journey crafted just for you..."
              />

              <Textarea
                label="Friendship Day Greeting"
                rows={4}
                value={pageData.friendshipDayMessage}
                onChange={(e) => setPageData({ ...pageData, friendshipDayMessage: e.target.value })}
                placeholder="Happy Friendship Day! Write your main emotional message here..."
              />
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6 max-w-4xl">
              <ThemePicker
                selectedTheme={pageData.themeName || 'mickey'}
                onChange={(themeName) => setPageData({ ...pageData, themeName })}
              />

              <Input
                label="Background Music Audio URL (Optional)"
                value={pageData.backgroundMusicUrl || ''}
                onChange={(e) => setPageData({ ...pageData, backgroundMusicUrl: e.target.value })}
                placeholder="https://res.cloudinary.com/.../ambient.mp3"
                helperText="Audio will play ambiently in the background during the gift experience."
              />
            </div>
          )}

          {activeTab === 'timeline' && (
            <TimelineEditor
              events={pageData.timelineEvents || []}
              onChange={(timelineEvents) => setPageData({ ...pageData, timelineEvents })}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryEditor
              images={pageData.galleryImages || []}
              fallbackMessage={pageData.galleryFallbackMessage || ''}
              onChangeImages={(galleryImages) => setPageData({ ...pageData, galleryImages })}
              onChangeFallback={(galleryFallbackMessage) => setPageData({ ...pageData, galleryFallbackMessage })}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceNoteEditor
              voiceNoteUrl={pageData.voiceNoteUrl || ''}
              onChange={(voiceNoteUrl) => setPageData({ ...pageData, voiceNoteUrl })}
            />
          )}

          {activeTab === 'poem' && (
            <div className="space-y-8 max-w-4xl">
              <PoemEditor
                stanzas={pageData.poemStanzas || []}
                onChange={(poemStanzas) => setPageData({ ...pageData, poemStanzas })}
              />

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rose-400" /> Surprise Gift Block
                </h3>
                <Input
                  label="Surprise Title"
                  value={pageData.surpriseGiftContent?.title || ''}
                  onChange={(e) => setPageData({
                    ...pageData,
                    surpriseGiftContent: { ...pageData.surpriseGiftContent, title: e.target.value }
                  })}
                />
                <Textarea
                  label="Surprise Message / Gift Note"
                  rows={3}
                  value={pageData.surpriseGiftContent?.body || ''}
                  onChange={(e) => setPageData({
                    ...pageData,
                    surpriseGiftContent: { ...pageData.surpriseGiftContent, body: e.target.value }
                  })}
                />
                <Input
                  label="Surprise External Link / Voucher URL (Optional)"
                  value={pageData.surpriseGiftContent?.linkUrl || ''}
                  onChange={(e) => setPageData({
                    ...pageData,
                    surpriseGiftContent: { ...pageData.surpriseGiftContent, linkUrl: e.target.value }
                  })}
                />
              </div>
            </div>
          )}

          {activeTab === 'ending' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Ending Emotional Climax</h3>
                <p className="text-xs text-slate-400">The final message displayed alongside confetti & heart animations at the climax.</p>
              </div>

              <Textarea
                label="Ending Closing Message"
                rows={5}
                value={pageData.endingMessage}
                onChange={(e) => setPageData({ ...pageData, endingMessage: e.target.value })}
                placeholder="Write your grand closing words here..."
              />
            </div>
          )}
        </Card>
      </div>

      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pageData={pageData}
      />
    </AdminLayout>
  );
};
