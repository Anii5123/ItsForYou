import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { PageCard } from '../../components/admin/PageCard';
import { LivePreviewModal } from '../../components/admin/LivePreviewModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { fetchPages, createPage, duplicatePage, deletePage } from '../../api/pagesApi';
import { Plus, Sparkles, Heart, Users, CheckCircle2, Search, X } from 'lucide-react';

export const DashboardPage = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendSlug, setNewFriendSlug] = useState('');
  const [creating, setCreating] = useState(false);

  // Live Preview modal state
  const [previewPage, setPreviewPage] = useState(null);

  const navigate = useNavigate();

  const loadPages = async () => {
    try {
      setLoading(true);
      const data = await fetchPages();
      setPages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load friend pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    setCreating(true);
    try {
      const created = await createPage(newFriendName, newFriendSlug);
      setIsCreateOpen(false);
      setNewFriendName('');
      setNewFriendSlug('');
      navigate(`/admin/pages/${created._id}/edit`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create friend experience.');
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicatePage(id);
      loadPages();
    } catch (err) {
      alert('Failed to duplicate experience.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience? This action cannot be undone.')) return;
    try {
      await deletePage(id);
      loadPages();
    } catch (err) {
      alert('Failed to delete experience.');
    }
  };

  const filteredPages = pages.filter(p =>
    p.friendName.toLowerCase().includes(search.toLowerCase()) ||
    p.friendSlug.toLowerCase().includes(search.toLowerCase())
  );

  const totalVisits = pages.reduce((acc, p) => acc + (p.stats?.totalVisits || 0), 0);
  const publishedCount = pages.filter(p => p.status === 'published').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Banner & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Experience Management
            </span>
            <h1 className="text-3xl font-bold font-display text-white">Friendship Experiences</h1>
            <p className="text-sm text-slate-400">Author, customize, and publish story-driven gift pages for your friends.</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 shadow-lg shadow-rose-600/30"
          >
            <Plus className="w-5 h-5" /> Create New Experience
          </Button>
        </div>

        {/* Dashboard Quick Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Total Experiences</p>
              <h3 className="text-2xl font-bold text-white">{pages.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Published Live</p>
              <h3 className="text-2xl font-bold text-white">{publishedCount}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Total Friend Visits</p>
              <h3 className="text-2xl font-bold text-white">{totalVisits}</h3>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search experiences by friend name or slug..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
            />
          </div>
        </div>

        {/* Experiences Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <div className="animate-spin w-8 h-8 mx-auto border-2 border-rose-500 border-t-transparent rounded-full mb-3" />
            Loading friend experiences...
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400">
              <Heart className="w-8 h-8 text-rose-500/50" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Friend Experiences Found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                {search ? 'No matches found for your search query.' : 'Create your first personalized gift page to begin!'}
              </p>
            </div>
            {!search && (
              <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Create First Experience
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <PageCard
                key={page._id}
                page={page}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onPreview={(p) => setPreviewPage(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Experience Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-display text-white">New Friend Experience</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <Input
                label="Friend's Name"
                required
                value={newFriendName}
                onChange={(e) => {
                  setNewFriendName(e.target.value);
                  setNewFriendSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                }}
                placeholder="e.g. Riya Sharma"
              />

              <Input
                label="URL Slug Segment"
                value={newFriendSlug}
                onChange={(e) => setNewFriendSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                placeholder="e.g. riya"
                helperText="Will form the URL path: /:randomId/riya"
              />

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <Button variant="secondary" size="md" onClick={() => setIsCreateOpen(false)} type="button">
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" isLoading={creating}>
                  Create & Launch Editor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={!!previewPage}
        onClose={() => setPreviewPage(null)}
        pageData={previewPage}
      />
    </AdminLayout>
  );
};
