import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginAdmin, saveSession } from '@/src/lib/auth';
import { logActivity } from '@/src/lib/activity';

export const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) { setError('Plotësoni të gjitha fushat.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const user = loginAdmin(identifier, password);
    if (!user) {
      setError('Kredencialet janë të gabuara.');
      setLoading(false);
      return;
    }
    saveSession(user);
    logActivity(user.id, user.name, 'login', 'Hyrje e suksesshme në sistem');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-surface border-r border-border p-12">
        <div className="flex items-center gap-3">
          <img src="/logoo.png" alt="Don Bosko" className="w-10 h-10 object-contain" />
          <div>
            <div className="font-serif text-[15px] font-bold text-text-primary">Don Bosko</div>
            <div className="text-[10px] text-text-muted tracking-[1.5px] uppercase">Tiranë</div>
          </div>
        </div>

        <div>
          <div className="w-10 h-[3px] bg-brand rounded-full mb-6" />
          {/* Animated school silhouette */}
          <div className="w-full h-[120px] mb-6 opacity-80">
            <svg viewBox="0 0 320 160" fill="none" className="w-full h-full" aria-hidden="true">
              <rect x="80" y="60" width="160" height="80" rx="4" fill="#AF1E23" opacity="0.12">
                <animate attributeName="opacity" values="0.12;0.2;0.12" dur="4s" repeatCount="indefinite" />
              </rect>
              <polygon points="70,60 160,18 250,60" fill="#AF1E23" opacity="0.18">
                <animate attributeName="opacity" values="0.18;0.28;0.18" dur="4s" repeatCount="indefinite" />
              </polygon>
              <line x1="160" y1="18" x2="160" y2="4" stroke="#AF1E23" strokeWidth="2" opacity="0.3" />
              <rect x="160" y="4" width="18" height="10" rx="1" fill="#AF1E23" opacity="0.4">
                <animateTransform attributeName="transform" type="rotate" values="-4,160,9;4,160,9;-4,160,9" dur="2s" repeatCount="indefinite" />
              </rect>
              <rect x="145" y="100" width="30" height="40" rx="3" fill="#AF1E23" opacity="0.18" />
              {[100,135,185,220].map((x, i) => (
                <rect key={i} x={x} y="72" width="22" height="18" rx="2" fill="#AF1E23" opacity="0.15">
                  <animate attributeName="opacity" values="0.15;0.28;0.15" dur={`${3+i*0.5}s`} repeatCount="indefinite" />
                </rect>
              ))}
              <ellipse cx="50" cy="120" rx="16" ry="20" fill="#AF1E23" opacity="0.1">
                <animate attributeName="cy" values="120;118;120" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <rect x="47" y="130" width="6" height="12" fill="#AF1E23" opacity="0.1" />
              <ellipse cx="270" cy="118" rx="14" ry="18" fill="#AF1E23" opacity="0.1">
                <animate attributeName="cy" values="118;116;118" dur="3.5s" repeatCount="indefinite" />
              </ellipse>
              <rect x="267" y="128" width="6" height="12" fill="#AF1E23" opacity="0.1" />
              <rect x="0" y="138" width="320" height="4" rx="2" fill="#AF1E23" opacity="0.12" />
              <g opacity="0.22">
                <animateTransform attributeName="transform" type="translate" values="-50,0;370,0" dur="14s" repeatCount="indefinite" />
                <circle cx="30" cy="126" r="5" fill="#AF1E23" />
                <rect x="27" y="131" width="6" height="10" rx="2" fill="#AF1E23" />
                <line x1="27" y1="134" x2="23" y2="141" stroke="#AF1E23" strokeWidth="2" strokeLinecap="round">
                  <animate attributeName="x2" values="23;25;23" dur="0.6s" repeatCount="indefinite" />
                </line>
                <line x1="33" y1="134" x2="37" y2="141" stroke="#AF1E23" strokeWidth="2" strokeLinecap="round">
                  <animate attributeName="x2" values="37;35;37" dur="0.6s" repeatCount="indefinite" />
                </line>
              </g>
            </svg>
          </div>
          <div className="font-serif text-2xl font-bold text-text-primary leading-snug mb-4">
            Sekretaria
          </div>
          <p className="text-text-muted text-sm leading-relaxed italic">
            "Koha është një thesar që mund të gjendet vetëm në këtë botë."
          </p>
          <p className="text-text-light text-xs mt-2">— Shën Gjon Bosko</p>
        </div>

        <div className="text-[11px] text-text-light">
          © 2026 Qendra Sociale Don Bosko Tiranë
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <img src="/logoo.png" alt="Don Bosko" className="w-9 h-9 object-contain" />
            <div className="font-serif text-[16px] font-bold text-text-primary">Don Bosko</div>
          </div>

          <h1 className="font-serif text-2xl font-bold text-text-primary mb-8">Mirë se vini</h1>

          {error && (
            <div className="bg-error-bg border border-brand-mid rounded-xl px-4 py-3 text-[13px] text-brand-dark mb-5 flex items-center gap-2">
              <span className="text-brand">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Email ose numër telefoni"
              className="w-full px-4 py-3 border border-border rounded-xl text-[14px] text-text-primary bg-surface outline-none transition-all focus:border-brand focus:bg-white placeholder:text-text-light"
            />

            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Fjalëkalimi"
                className="w-full px-4 pr-11 py-3 border border-border rounded-xl text-[14px] text-text-primary bg-surface outline-none transition-all focus:border-brand focus:bg-white placeholder:text-text-light"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted transition-colors p-1">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-xl bg-brand text-white font-semibold text-[14px] tracking-[0.2px] transition-all hover:bg-brand-dark active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(175,30,35,0.25)]"
            >
              {loading ? 'Duke u kyçur...' : 'Hyrje në Sistem'}
            </button>
          </form>

          <p className="mt-8 text-center text-[12px] text-text-light">
            Probleme?{' '}
            <a href="mailto:qfp_donbosko@yahoo.it" className="text-brand hover:underline">
              Kontaktoni administratorin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
