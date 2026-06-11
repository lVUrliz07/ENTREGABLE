import React, { useState } from 'react';
import { ShieldCheck, LogIn, Sparkles, UserCheck, AlertCircle, Key, Mail } from 'lucide-react';

interface LoginScreenProps {
  onSignIn: () => void;
  onAdminSignIn: (email?: string) => void;
  loading: boolean;
}

export default function LoginScreen({ onSignIn, onAdminSignIn, loading }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError("Por favor, ingrese su correo institucional y su contraseña.");
      return;
    }
    
    if (email.trim().toLowerCase() === 'admin@yau.gob.pe' && password === 'admin2026') {
      onAdminSignIn(email.trim().toLowerCase());
    } else {
      setLocalError("Credenciales inválidas para la Mesa de Control de Yau. Pruebe usando las credenciales de Administración provistas abajo.");
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@yau.gob.pe');
    setPassword('admin2026');
    setLocalError(null);
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl animate-fade-in animate-duration-300" id="login-container">
      {/* Visual Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-center text-white relative">
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-indigo-600/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <span className="text-[9px] tracking-wider uppercase font-bold text-indigo-300 bg-indigo-500/25 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
          Acceso Restringido - Mesa de Control Yau
        </span>
        
        <h3 className="text-xl font-bold tracking-tight mt-3 text-white">Sistema de Gestión de Trámites</h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Uso autorizado para Administradores de Mesa de Partes, Jefes de Oficinas y Especialistas de Recursos Humanos de Yau.
        </p>
      </div>

      {/* Login Body */}
      <div className="p-6 space-y-5">
        
        {/* Google Sign In option */}
        <div>
          <button
            type="button"
            onClick={onSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
            id="btn-google-login"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Iniciar Sesión con Google
              </>
            )}
          </button>
        </div>

        {/* Divider badge */}
        <div className="flex items-center align-middle justify-center py-1">
          <div className="border-t border-slate-200 flex-grow"></div>
          <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white">
            ó usar Credenciales de Admin
          </span>
          <div className="border-t border-slate-200 flex-grow"></div>
        </div>

        {/* Credential login form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="credential-login-form">
          {localError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{localError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-650" htmlFor="admin-email">
              Correo Institucional
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                id="admin-email"
                type="email"
                placeholder="admin@yau.gob.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-250 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-350 text-slate-850"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-650" htmlFor="admin-password">
              Contraseña
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-250 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-350 text-slate-850"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
            id="btn-credential-submit"
          >
            Acceder a la Mesa de Control
          </button>
        </form>

        {/* Demo credentials helper alert */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
          <div className="flex gap-2 items-center text-xs text-indigo-900 font-bold">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Credenciales de Administrador (Demo)</span>
          </div>
          <div className="text-[11px] text-slate-600 font-mono space-y-1 bg-white p-2 rounded-lg border border-slate-100">
            <div><span className="text-slate-400 select-none">Usuario: </span><strong>admin@yau.gob.pe</strong></div>
            <div><span className="text-slate-400 select-none">Clave: </span><strong>admin2026</strong></div>
          </div>
          
          <button
            type="button"
            onClick={handleQuickFill}
            className="w-full text-indigo-600 hover:text-indigo-800 text-[11px] font-bold py-1.5 hover:bg-indigo-50 rounded-lg transition-all border border-indigo-200 border-dashed"
            id="btn-quickfill"
          >
            ⚡ Autocompletar Credenciales de Admin
          </button>
        </div>

        <div className="text-center">
          <p className="text-[9px] text-slate-400 font-medium">
            Red Integrada de Yau &middot; SENATI 2026
          </p>
        </div>
      </div>
    </div>
  );
}
