import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginSuperAdmin, saveSuperAdminSession } from '@/src/lib/auth';

export const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Plotësoni të gjitha fushat.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (loginSuperAdmin(username, password)) {
      saveSuperAdminSession(username);
      navigate('/superadmin/dashboard');
    } else {
      setError('Kredencialet janë të gabuara.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-[380px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <img src="/logoo.png" alt="Don Bosko" className="w-14 h-14 object-contain mb-4" />
          <div className="font-serif text-xl font-bold text-text-primary">Don Bosko</div>
          <div className="text-[11px] text-text-muted tracking-[1.5px] uppercase mt-1">Paneli i Administrimit</div>
        </div>

        {/* Animated shield hero */}
        <div className="w-full h-[100px] mb-2 opacity-70">
          <svg viewBox="0 0 320 160" fill="none" className="w-full h-full" aria-hidden="true">
            <path d="M160,15 L220,40 L220,90 Q220,130 160,148 Q100,130 100,90 L100,40 Z" fill="#AF1E23" opacity="0.1">
              <animate attributeName="opacity" values="0.1;0.18;0.1" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M160,25 L210,46 L210,88 Q210,122 160,138 Q110,122 110,88 L110,46 Z" stroke="#AF1E23" strokeWidth="2" fill="none" opacity="0.2" />
            <polyline points="138,82 153,97 182,68" stroke="#AF1E23" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
            </polyline>
            {[0,120,240].map((deg, i) => (
              <circle key={i} cx="160" cy="80" r="3" fill="#AF1E23" opacity="0.2">
                <animateTransform attributeName="transform" type="rotate" values={`${deg},160,80;${deg+360},160,80`} dur={`${6+i}s`} repeatCount="indefinite" additive="sum" />
                <animateTransform attributeName="transform" type="translate" values="0,-52;0,-52" additive="sum" />
              </circle>
            ))}
          </svg>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-brand" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-text-primary">Super Admin</div>
              <div className="text-[11px] text-text-muted">Hyni me email, telefon ose username</div>
            </div>
          </div>

          {error && (
            <div className="bg-error-bg border border-brand-mid rounded-xl px-4 py-3 text-[13px] text-brand-dark mb-5 flex items-center gap-2">
              <span className="text-brand">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-text-secondary tracking-[0.8px] uppercase mb-2">
                Emri i Përdoruesit
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="superadmin / email / telefon"
                className="w-full px-4 py-3 border border-border rounded-xl text-[14px] text-text-primary bg-surface outline-none transition-all focus:border-brand focus:bg-white focus:ring-3 focus:ring-brand/8 placeholder:text-text-light"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-text-secondary tracking-[0.8px] uppercase mb-2">
                Fjalëkalimi
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-11 py-3 border border-border rounded-xl text-[14px] text-text-primary bg-surface outline-none transition-all focus:border-brand focus:bg-white focus:ring-3 focus:ring-brand/8"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted transition-colors p-1">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-xl bg-brand text-white font-semibold text-[14px] tracking-[0.2px] transition-all hover:bg-brand-dark active:scale-[0.99] disabled:opacity-50 shadow-[0_2px_12px_rgba(175,30,35,0.25)]"
            >
              {loading ? 'Duke u kyçur...' : 'Hyrje si Super Admin'}
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <a href="/" className="text-[12px] text-text-muted hover:text-brand transition-colors">
            ← Kthehu te hyrja e sekretarisë
          </a>
        </div>
      </div>
    </div>
  );
};
