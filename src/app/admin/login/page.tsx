'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Identifiants invalides');
      }

      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-phone-void flex items-center justify-center p-4 hardware-grid">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <BrandLogo size="md" asLink={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-phone-surface-elevated border border-phone-border text-[11px] font-mono font-bold text-phone-emerald">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portail Administrateur Sécurisé</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-phone-frost">
            Gestion de la Boutique
          </h1>
          <p className="text-xs text-phone-muted">
            Accédez à vos commandes, stocks et expéditions sans services tiers.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-phone-danger/10 border border-phone-danger/30 text-phone-danger text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
              Adresse Email Admin
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-phone-dim absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@abdouphone.dz"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm focus:outline-none focus:border-phone-emerald/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
              Mot de Passe
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-phone-dim absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm focus:outline-none focus:border-phone-emerald/60"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-phone-frost hover:bg-white text-phone-void font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Vérification...' : 'Se Connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-phone-void border border-phone-border text-center text-[11px] font-mono text-phone-dim">
          Identifiants par défaut : admin@abdouphone.dz / adminabdou2026
        </div>
      </div>
    </div>
  );
}
