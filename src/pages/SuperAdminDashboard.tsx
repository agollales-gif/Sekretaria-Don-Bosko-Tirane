import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Users, Key, Eye, EyeOff, RefreshCw, CheckCircle2,
         Mail, Phone, Activity, Trash2 } from 'lucide-react';
import { getSession, clearSession, ADMIN_USERS, getAdminPassword, setAdminPassword } from '@/src/lib/auth';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { PageHero } from '@/src/components/PageHero';
import { getActivityLog, clearActivityLog, ACTIVITY_LABELS, ACTIVITY_COLORS, ActivityEntry, logActivity } from '@/src/lib/activity';
import { format } from 'date-fns';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [newPwds, setNewPwds] = useState<Record<string, string>>({});
  const [showPwds, setShowPwds] = useState<Record<string, boolean>>({});
  const [showNewPwds, setShowNewPwds] = useState<Record<string, boolean>>({});
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [activityFilter, setActivityFilter] = useState<'all' | 'sec9' | 'secgj'>('all');

  useEffect(() => {
    const session = getSession();
    if (session.role !== 'SuperAdmin') { navigate('/superadmin/login'); return; }
    setAdminName(session.name || 'Super Admin');
    const map: Record<string, string> = {};
    ADMIN_USERS.forEach(u => { map[u.id] = getAdminPassword(u); });
    setPasswords(map);
    setActivityLog(getActivityLog());
  }, [navigate]);

  const handleReset = (userId: string) => {
    const user = ADMIN_USERS.find(u => u.id === userId)!;
    const val = newPwds[userId]?.trim();
    if (!val || val.length < 6) { toast.error('Minimum 6 karaktere.'); return; }
    setAdminPassword(user, val);
    setPasswords(p => ({ ...p, [userId]: val }));
    setNewPwds(p => ({ ...p, [userId]: '' }));
    const session = getSession();
    logActivity('superadmin', session.name || 'Super Admin', 'password_changed', `Fjalëkalimi i ${user.name} u ndryshua nga Super Admini`);
    setActivityLog(getActivityLog());
    toast.success(`Fjalëkalimi i ${user.name} u ndryshua.`);
  };

  const handleClearLog = () => {
    clearActivityLog();
    setActivityLog([]);
    toast.success('Regjistri i aktivitetit u fshi.');
  };

  const filteredLog = activityLog.filter(e =>
    activityFilter === 'all' ? true : e.adminId === activityFilter
  );

  return (
    <div className="min-h-screen bg-surface font-sans text-text-primary">
      {/* Topbar */}
      <header className="bg-white border-b border-border h-[60px] px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logoo.png" alt="Don Bosko" className="w-7 h-7 object-contain" />
          <span className="font-serif text-[15px] font-bold text-text-primary">Don Bosko</span>
          <span className="text-border mx-1">·</span>
          <span className="text-[13px] text-text-muted">Super Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-light rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-brand" />
            <span className="text-[12px] font-semibold text-brand">{adminName}</span>
          </div>
          <button onClick={() => { clearSession(); navigate('/superadmin/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[13px] text-text-secondary hover:border-brand hover:text-brand transition-all">
            <LogOut className="w-3.5 h-3.5" /> Dilni
          </button>
        </div>
      </header>

      <PageHero variant="superadmin" title={`Mirë se vini, ${adminName}`} subtitle="Menaxhoni llogaritë dhe fjalëkalimet e sekretarisë." badge="Super Admin" fullBleed />
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <div>
              <div className="text-[26px] font-bold text-text-primary leading-none">{ADMIN_USERS.length}</div>
              <div className="text-[12px] text-text-muted mt-0.5">Llogari Aktive</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center">
              <Key className="w-5 h-5 text-brand" />
            </div>
            <div>
              <div className="text-[26px] font-bold text-text-primary leading-none">1</div>
              <div className="text-[12px] text-text-muted mt-0.5">Super Admin</div>
            </div>
          </div>
        </div>

        {/* Admin accounts */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border">
            <div className="font-semibold text-[14px] text-text-primary">Llogaritë e Sekretarisë</div>
            <div className="text-[12px] text-text-muted mt-0.5">Shikoni dhe ndryshoni fjalëkalimet</div>
          </div>

          {ADMIN_USERS.map((user, idx) => (
            <div key={user.id} className={cn('px-6 py-6', idx < ADMIN_USERS.length - 1 && 'border-b border-border')}>
              {/* User info */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand font-bold text-sm">
                    {user.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[14px] text-text-primary">{user.name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[12px] text-text-muted">
                        <Mail className="w-3 h-3" /> {user.email}
                      </span>
                      <span className="flex items-center gap-1 text-[12px] text-text-muted">
                        <Phone className="w-3 h-3" /> {user.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-medium text-success bg-success-bg px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Aktive
                </span>
              </div>

              {/* Current password */}
              <div className="bg-surface rounded-xl border border-border p-4 mb-4">
                <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px] mb-2">Fjalëkalimi Aktual</div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-[14px] font-mono text-text-primary tracking-widest">
                    {showPwds[user.id] ? passwords[user.id] : '•'.repeat((passwords[user.id] || '').length)}
                  </code>
                  <button onClick={() => setShowPwds(p => ({ ...p, [user.id]: !p[user.id] }))}
                    className="text-text-light hover:text-brand transition-colors">
                    {showPwds[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Change password */}
              <div>
                <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px] mb-2">Ndrysho Fjalëkalimin</div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showNewPwds[user.id] ? 'text' : 'password'}
                      value={newPwds[user.id] || ''}
                      onChange={e => setNewPwds(p => ({ ...p, [user.id]: e.target.value }))}
                      placeholder="Fjalëkalim i ri (min. 6 karaktere)"
                      className="w-full px-4 pr-10 py-2.5 border border-border rounded-xl text-[13px] bg-surface outline-none focus:border-brand focus:bg-white focus:ring-3 focus:ring-brand/8 transition-all placeholder:text-text-light"
                    />
                    <button type="button"
                      onClick={() => setShowNewPwds(p => ({ ...p, [user.id]: !p[user.id] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-brand transition-colors">
                      {showNewPwds[user.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button onClick={() => handleReset(user.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand text-white text-[13px] font-semibold hover:bg-brand-dark transition-all shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5" /> Ndrysho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Super admin info */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand" />
            </div>
            <div>
              <div className="font-semibold text-[14px] text-text-primary">Super Admin</div>
              <div className="text-[12px] text-text-muted">Një llogari · akses i plotë</div>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[11px] font-medium text-success bg-success-bg px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Aktiv
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand" />
              <span className="font-semibold text-[14px] text-text-primary">Aktiviteti i Përdoruesve</span>
              <span className="text-[11px] text-text-muted bg-surface px-2 py-0.5 rounded-full">{activityLog.length}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter */}
              <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
                {[
                  { id: 'all',   label: 'Të gjithë' },
                  { id: 'sec9',  label: '9-vjeçare' },
                  { id: 'secgj', label: 'Gjimnaz' },
                ].map(f => (
                  <button key={f.id} onClick={() => setActivityFilter(f.id as any)}
                    className={cn('px-3 py-1 rounded-md text-[12px] font-medium transition-all',
                      activityFilter === f.id ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary')}>
                    {f.label}
                  </button>
                ))}
              </div>
              <button onClick={handleClearLog}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] text-text-muted hover:border-brand hover:text-brand transition-all">
                <Trash2 className="w-3.5 h-3.5" /> Fshi
              </button>
            </div>
          </div>

          {filteredLog.length === 0 ? (
            <div className="p-10 text-center text-[14px] text-text-muted">Nuk ka aktivitet të regjistruar.</div>
          ) : (
            <div className="divide-y divide-border max-h-[520px] overflow-y-auto">
              {filteredLog.map(entry => (
                <div key={entry.id} className="px-6 py-3.5 flex items-start gap-4 hover:bg-surface transition-colors">
                  <span className={cn('px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 mt-0.5', ACTIVITY_COLORS[entry.type])}>
                    {ACTIVITY_LABELS[entry.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-text-primary">{entry.adminName}</div>
                    <div className="text-[12px] text-text-muted mt-0.5 truncate">{entry.detail}</div>
                  </div>
                  <div className="text-[11px] text-text-muted shrink-0 text-right">
                    <div>{format(new Date(entry.timestamp), 'HH:mm')}</div>
                    <div className="mt-0.5">{format(new Date(entry.timestamp), 'dd/MM/yy')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
