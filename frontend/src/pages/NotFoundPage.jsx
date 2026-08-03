import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
        <Heart className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold font-display text-white mb-2">404 — Gift Not Found</h1>
      <p className="text-slate-400 max-w-md mb-6 text-sm">
        This link appears to be invalid or private. Please verify your secret link with the sender.
      </p>
      <Link to="/admin/login">
        <Button variant="secondary" size="md" className="gap-2">
          <Home className="w-4 h-4" /> Go to Admin Login
        </Button>
      </Link>
    </div>
  );
};
