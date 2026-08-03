import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Heart, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/admin/pages" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-wide text-white group-hover:text-rose-300 transition-colors">
                For You <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-sans font-normal border border-rose-500/30">Admin CMS</span>
              </h1>
              <p className="text-xs text-slate-400">Friendship Experience Manager</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/pages"
              className={`flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl transition-all ${
                location.pathname === '/admin/pages'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <div className="h-5 w-px bg-slate-800" />

            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{admin?.email}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Admin Authenticated
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© 2026 For You App • Crafted with care for Friendship Day experiences</p>
      </footer>
    </div>
  );
};
