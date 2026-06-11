import React from 'react';
import { LogOut, User, Sparkles } from 'lucide-react';

interface UserProfileProps {
  user: { displayName?: string; email?: string; photoURL?: string | null } | null;
  onSignOut: () => void;
}

export default function UserProfile({ user, onSignOut }: UserProfileProps) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 bg-slate-800 p-2 pr-3.5 rounded-xl border border-slate-700 shadow-sm" id="user-profile-widget">
      {user.photoURL ? (
        <img 
          src={user.photoURL} 
          alt={user.displayName || "Usuario"} 
          className="w-8 h-8 rounded-lg object-cover border border-slate-600 shrink-0"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0 text-sm">
          <User className="w-4 h-4" />
        </div>
      )}

      <div className="text-left hidden sm:block">
        <p className="text-xs font-bold text-white leading-none line-clamp-1">
          {user.displayName || "Funcionario Yau"}
        </p>
        <span className="text-[9px] text-indigo-300 font-mono tracking-tight block mt-0.5 line-clamp-1">
          {user.email || "yau@gop.pe"}
        </span>
      </div>

      <button
        onClick={onSignOut}
        className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-700/60 hover:bg-rose-600 transition-all px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-semibold"
        title="Cerrar sesión corporativa"
        id="btn-signout"
      >
        <LogOut className="w-3.5 h-3.5 text-rose-400" />
        <span>Salir</span>
      </button>
    </div>
  );
}
