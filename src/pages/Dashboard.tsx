import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, MoreVertical, CheckCircle2, AlertCircle, Search,
         LayoutDashboard, History, BarChart2, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Role, Student, getClassesByRole, getStudentsByClass } from '@/src/lib/data';
import { generateMessage, MessageTemplate } from '@/src/lib/messages';
import { PageHero } from '@/src/components/PageHero';
import { cn } from '@/src/lib/utils';
import { getSession, clearSession } from '@/src/lib/auth';
import { Settings } from './Settings';
import { logActivity } from '@/src/lib/activity';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'roster' | 'history' | 'stats' | 'settings'>('roster');
  const [isLateModalOpen, setIsLateModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedHour, setSelectedHour] = useState<1 | 2 | null>(null);
  const [actionType, setActionType] = useState<MessageTemplate | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [failedStudents, setFailedStudents] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ late: 0, sick: 0, teacher: 0, principal: 0 });
  const [messageLog, setMessageLog] = useState<any[]>([]);
  const [correctionModal, setCorrectionModal] = useState<{ log: any; index: number } | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session.role || session.role === 'SuperAdmin') { navigate('/'); return; }
    setRole(session.role as Role);
    setUserName(session.name || 'Sekretaria');
    setClasses(getClassesByRole(session.role as Role));
    logActivity(session.id || '', session.name || '', 'login', 'Hyrje në dashboard');
  }, [navigate]);

  useEffect(() => {
    if (selectedClass) setStudents(getStudentsByClass(selectedClass));
  }, [selectedClass]);

  const handleLogout = () => {
    const session = getSession();
    logActivity(session.id || '', session.name || '', 'logout', 'Dalje nga sistemi');
    clearSession();
    navigate('/');
  };

  const openLateModal = (student: Student) => {
    setSelectedStudent(student); setSelectedHour(null);
    setIsLateModalOpen(true); setActiveDropdown(null);
  };
  const openActionModal = (student: Student, type: MessageTemplate) => {
    setSelectedStudent(student); setActionType(type);
    setIsActionModalOpen(true); setActiveDropdown(null);
  };
  const handleSendLate = async () => {
    if (!selectedStudent || !selectedHour) return;
    await executeAction(selectedStudent, selectedHour === 1 ? 'late_1st_hour' : 'late_2nd_hour',
      selectedHour === 1 ? 'Ora e Parë' : 'Pret Orën e Dytë', true);
    setIsLateModalOpen(false);
  };
  const handleSendAction = async () => {
    if (!selectedStudent || !actionType) return;
    const labels: Record<string, string> = {
      teacher_meeting: 'Takim me Mësuesin',
      principal_meeting: 'Takim me Drejtorin',
      sickness: 'Sëmundje',
    };
    await executeAction(selectedStudent, actionType, labels[actionType], false);
    setIsActionModalOpen(false);
  };
  const executeAction = async (student: Student, template: MessageTemplate, reasonLabel: string, isLate: boolean) => {
    const now = new Date();
    const time = format(now, 'HH:mm');
    const date = format(now, 'dd/MM/yyyy');
    const message = generateMessage(template, { studentName: student.name, time, date });
    setStats(prev => ({
      ...prev,
      late: isLate ? prev.late + 1 : prev.late,
      sick: template === 'sickness' ? prev.sick + 1 : prev.sick,
      teacher: template === 'teacher_meeting' ? prev.teacher + 1 : prev.teacher,
      principal: template === 'principal_meeting' ? prev.principal + 1 : prev.principal,
    }));
    setMessageLog(prev => [{ name: student.name, label: reasonLabel, time, msg: message }, ...prev]);
    const session = getSession();
    logActivity(session.id || '', session.name || '', 'message_sent', `${reasonLabel} — ${student.name} (Klasa ${student.class})`);
    try {
      await new Promise(r => setTimeout(r, 700));
      toast.success(`Mesazhi u dërgua për ${student.name}`, { duration: 4000 });
    } catch {
      toast.error(`Dërgimi dështoi për ${student.name}`);
      setFailedStudents(prev => new Set(prev).add(student.id));
    }
  };

  const handleSendCorrection = async (logEntry: any, index: number) => {
    const now = new Date();
    const time = format(now, 'HH:mm');
    const date = format(now, 'dd/MM/yyyy');
    const correctionMsg = generateMessage('mistake', { studentName: logEntry.name, time, date });
    setMessageLog(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], corrected: true };
      return updated;
    });
    setMessageLog(prev => [{ name: logEntry.name, label: 'Korrigjim — Mesazh Gabim', time, msg: correctionMsg, isCorrection: true }, ...prev]);
    setCorrectionModal(null);
    const session = getSession();
    logActivity(session.id || '', session.name || '', 'correction_sent', `Korrigjim për ${logEntry.name}`);
    toast.success(`Mesazhi i korrigjimit u dërgua për ${logEntry.name}.`, { duration: 4000 });
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!role) return null;
  const roleLabel = role === 'Sec_9_vjecare' ? 'Sekretaria 9-vjeçare' : 'Sekretaria Gjimnaz';

  const navItems = [
    { id: 'roster',   icon: LayoutDashboard, label: 'Regjistri',   section: 'main' },
    { id: 'history',  icon: History,          label: 'Historia',    section: 'main' },
    { id: 'stats',    icon: BarChart2,         label: 'Statistikat', section: 'main' },
    { id: 'settings', icon: SettingsIcon,      label: 'Cilësimet',   section: 'account' },
  ] as const;

  // Hero config per view
  const heroConfig = {
    roster: selectedClass
      ? { variant: 'class' as const, badge: selectedClass, title: `Klasa ${selectedClass}`, subtitle: `${students.length} nxënës · ${roleLabel}` }
      : { variant: 'roster' as const, badge: roleLabel, title: 'Regjistri i Nxënësve', subtitle: 'Zgjidhni klasën për të parë listën e nxënësve.' },
    history:  { variant: 'history'  as const, badge: 'Sot', title: 'Historia e Mesazheve', subtitle: 'Të gjitha njoftimet e dërguara sot.' },
    stats:    { variant: 'stats'    as const, badge: 'Sot', title: 'Statistikat e Ditës',  subtitle: 'Pasqyrë e vonesave, sëmundjeve dhe takimeve.' },
    settings: { variant: 'settings' as const, badge: undefined, title: 'Cilësimet e Llogarisë', subtitle: 'Ndryshoni fjalëkalimin tuaj.' },
  };
  const hero = heroConfig[activeView];

  return (
    <div className="min-h-screen bg-surface flex font-sans text-text-primary">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col z-50 sidebar-bg print:hidden">
        <div className="px-5 h-[60px] flex items-center gap-3 border-b border-border shrink-0">
          <img src="/logoo.png" alt="Don Bosko" className="w-8 h-8 object-contain shrink-0" />
          <div>
            <div className="font-serif text-[14px] font-bold text-text-primary leading-tight">Don Bosko</div>
            <div className="text-[10px] text-text-muted tracking-[1px] uppercase">Shkolla</div>
          </div>
        </div>
        <div className="px-4 py-3.5 border-b border-border flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center text-brand text-xs font-bold shrink-0">
            {userName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-text-primary truncate">{userName}</div>
            <div className="text-[10px] text-text-muted truncate">{roleLabel}</div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="text-[10px] font-semibold text-text-light tracking-[1.5px] uppercase px-2 mb-2">Menuja</div>
          {navItems.filter(n => n.section === 'main').map(item => (
            <button key={item.id}
              onClick={() => { setActiveView(item.id); if (item.id !== 'roster') setSelectedClass(null); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all mb-0.5',
                activeView === item.id ? 'bg-brand-light text-brand' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
              )}>
              <item.icon className="w-4 h-4 shrink-0" />{item.label}
            </button>
          ))}
          <div className="text-[10px] font-semibold text-text-light tracking-[1.5px] uppercase px-2 mt-5 mb-2">Llogaria</div>
          {navItems.filter(n => n.section === 'account').map(item => (
            <button key={item.id} onClick={() => setActiveView(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all mb-0.5',
                activeView === item.id ? 'bg-brand-light text-brand' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
              )}>
              <item.icon className="w-4 h-4 shrink-0" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border shrink-0">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-border text-[13px] text-text-secondary hover:border-brand hover:text-brand hover:bg-brand-light transition-all">
            <LogOut className="w-3.5 h-3.5" /> Dilni
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-[240px] flex-1 flex flex-col min-h-screen print:ml-0">

        {/* Full-bleed hero — replaces topbar */}
        <PageHero
          variant={hero.variant}
          title={hero.title}
          subtitle={hero.subtitle}
          badge={hero.badge}
          fullBleed
        />

        {/* Content */}
        <div className="flex-1 p-8 print:p-0">

          {/* ── Settings ── */}
          {activeView === 'settings' && <Settings onBack={() => setActiveView('roster')} />}

          {/* ── Roster: class grid ── */}
          {activeView === 'roster' && !selectedClass && (
            <div className="animate-in fade-in duration-200">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4">
                {classes.map(c => (
                  <button key={c}
                    onClick={() => { setSelectedClass(c); setSearchQuery(''); }}
                    className="bg-white border-2 border-border rounded-2xl p-5 text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md hover:border-brand-mid group">
                    <div className="font-serif text-[28px] font-bold text-brand leading-none group-hover:scale-105 transition-transform">{c}</div>
                    <div className="text-[11px] text-text-muted mt-2">{getStudentsByClass(c).length} nxënës</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Roster: student list ── */}
          {activeView === 'roster' && selectedClass && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              {/* Back + search bar */}
              <div className="flex items-center justify-between mb-5">
                <button onClick={() => { setSelectedClass(null); setSearchQuery(''); }}
                  className="flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-brand transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Kthehu te klasat
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-light" />
                  <input type="text" placeholder="Kërko nxënës..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-border rounded-xl text-[13px] bg-white outline-none transition-all focus:border-brand w-[180px] focus:w-[220px] placeholder:text-text-light" />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-border">
                      <th className="w-10 px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.8px]">#</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.8px]">Emri</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.8px]">Statusi</th>
                      <th className="w-44 px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-[0.8px]">Veprime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, i) => (
                      <tr key={student.id} className={cn(
                        'border-b border-border last:border-0 transition-colors',
                        failedStudents.has(student.id) ? 'bg-error-bg' : 'hover:bg-surface'
                      )}>
                        <td className="px-4 py-3 text-[12px] text-text-muted">{i + 1}</td>
                        <td className="px-4 py-3 text-[14px] font-medium text-text-primary">{student.name}</td>
                        <td className="px-4 py-3">
                          {failedStudents.has(student.id)
                            ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FEF0E6] text-[#B54D0E]">✗ Dështoi</span>
                            : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-success-bg text-success">✓ Prezent</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openLateModal(student)}
                              className="bg-brand text-white rounded-lg px-4 py-1.5 text-[13px] font-semibold hover:bg-brand-dark transition-all shadow-sm">
                              Vonoi
                            </button>
                            <div className="relative">
                              <button onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                                className="w-8 h-8 border border-border rounded-lg flex items-center justify-center text-text-muted hover:border-brand-mid hover:bg-surface transition-all text-lg font-bold">
                                ⋯
                              </button>
                              {activeDropdown === student.id && (
                                <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-border rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50 min-w-[190px] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                  {[
                                    { type: 'teacher_meeting'  as MessageTemplate, icon: MoreVertical, label: 'Takim me Mësuesin' },
                                    { type: 'principal_meeting' as MessageTemplate, icon: AlertCircle,  label: 'Takim me Drejtorin' },
                                    { type: 'sickness'         as MessageTemplate, icon: Clock,        label: 'Sëmurë' },
                                  ].map(item => (
                                    <div key={item.type} onClick={() => openActionModal(student, item.type)}
                                      className="px-4 py-2.5 text-[13px] text-text-primary cursor-pointer flex items-center gap-2.5 hover:bg-surface transition-colors">
                                      <item.icon className="w-3.5 h-3.5 text-text-muted" /> {item.label}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── History ── */}
          {activeView === 'history' && (
            <div className="animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                {messageLog.length === 0
                  ? <div className="p-12 text-center text-[14px] text-text-muted">Nuk ka mesazhe sot.</div>
                  : messageLog.map((log, i) => (
                    <div key={i} className={cn(
                      'px-5 py-4 border-b border-border last:border-0 flex items-center gap-4',
                      log.isCorrection && 'bg-[#FFF8E6]'
                    )}>
                      <div className={cn('w-2 h-2 rounded-full shrink-0', log.isCorrection ? 'bg-[#D97706]' : 'bg-brand')} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-text-primary">{log.name}</div>
                        <div className={cn('text-[12px] mt-0.5', log.isCorrection ? 'text-[#D97706] font-medium' : 'text-text-muted')}>
                          {log.label}
                        </div>
                        {log.corrected && (
                          <div className="text-[11px] text-[#D97706] mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Korrigjim u dërgua
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-[12px] text-text-muted">{log.time}</div>
                        {!log.isCorrection && !log.corrected && (
                          <button
                            onClick={() => setCorrectionModal({ log, index: i })}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[#FCA5A5] text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors">
                            Gabim?
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* ── Stats ── */}
          {activeView === 'stats' && (
            <div className="animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Vonesa Totale',    value: stats.late,      color: 'text-brand' },
                  { label: 'Sëmundje',         value: stats.sick,      color: 'text-[#1E5FAD]' },
                  { label: 'Takim me Mësues',  value: stats.teacher,   color: 'text-[#5B3DB3]' },
                  { label: 'Takim me Drejtor', value: stats.principal, color: 'text-[#B54D0E]' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-border p-8">
                    <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px] mb-3">{s.label}</div>
                    <div className={cn('text-[48px] font-bold leading-none', s.color)}>{s.value}</div>
                    <div className="text-[12px] text-text-muted mt-2">sot</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Late Modal ── */}
      {isLateModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[500] bg-black/30 backdrop-blur-[2px] flex items-center justify-center print:hidden"
             onClick={e => { if (e.target === e.currentTarget) setIsLateModalOpen(false); }}>
          <div className="bg-white rounded-2xl p-8 w-[440px] max-w-[92vw] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-border relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsLateModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-xl bg-surface flex items-center justify-center text-text-muted hover:bg-brand-light hover:text-brand transition-colors text-lg">✕</button>
            <div className="font-serif text-[20px] font-bold text-text-primary mb-1">Nxënës ka Vonuar</div>
            <div className="text-[13px] text-text-muted mb-5">Nxënësi: <span className="font-semibold text-text-primary">{selectedStudent.name}</span></div>
            <div className="bg-surface rounded-xl border border-border p-4 mb-5 flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand" />
              <div>
                <div className="font-serif text-[22px] font-bold text-brand leading-none">{format(new Date(), 'HH:mm')}</div>
                <div className="text-[12px] text-text-muted mt-0.5">Ora aktuale</div>
              </div>
            </div>
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px] mb-2">Zgjidhni Orën</div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {([1, 2] as const).map(h => (
                <button key={h} onClick={() => setSelectedHour(h)}
                  className={cn('p-4 border-2 rounded-xl text-center transition-all cursor-pointer',
                    selectedHour === h ? 'border-brand bg-brand-light' : 'border-border hover:border-brand-mid hover:bg-brand-light')}>
                  <span className="block text-[22px] font-bold text-brand">{h}</span>
                  <span className="block text-[11px] text-text-muted mt-1">{h === 1 ? 'Ora e Parë' : 'Pret Orën e Dytë'}</span>
                </button>
              ))}
            </div>
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px] mb-2">Mesazhi</div>
            <div className="bg-[#F0FAF5] border border-[#B8DDB0] rounded-xl p-4 text-[13px] leading-relaxed text-[#1A4D0A] mb-5 whitespace-pre-wrap">
              {selectedHour
                ? generateMessage(selectedHour === 1 ? 'late_1st_hour' : 'late_2nd_hour', { studentName: selectedStudent.name, time: format(new Date(), 'HH:mm'), date: format(new Date(), 'dd/MM/yyyy') })
                : '— Zgjidhni orën për të parë mesazhin —'}
            </div>
            <button onClick={handleSendLate} disabled={!selectedHour}
              className="w-full py-3.5 rounded-xl bg-brand text-white font-semibold text-[14px] hover:bg-brand-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
              Dërgo Mesazhin
            </button>
          </div>
        </div>
      )}

      {/* ── Action Modal ── */}
      {isActionModalOpen && selectedStudent && actionType && (
        <div className="fixed inset-0 z-[500] bg-black/30 backdrop-blur-[2px] flex items-center justify-center print:hidden"
             onClick={e => { if (e.target === e.currentTarget) setIsActionModalOpen(false); }}>
          <div className="bg-white rounded-2xl p-8 w-[440px] max-w-[92vw] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-border relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsActionModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-xl bg-surface flex items-center justify-center text-text-muted hover:bg-brand-light hover:text-brand transition-colors text-lg">✕</button>
            <div className="font-serif text-[20px] font-bold text-text-primary mb-1">
              {actionType === 'teacher_meeting' ? 'Takim me Mësuesin' : actionType === 'principal_meeting' ? 'Takim me Drejtorin' : 'Sëmurë – Njofto Prindërit'}
            </div>
            <div className="text-[13px] text-text-muted mb-5">Nxënësi: <span className="font-semibold text-text-primary">{selectedStudent.name}</span></div>
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px] mb-2">Mesazhi</div>
            <div className="bg-[#F0FAF5] border border-[#B8DDB0] rounded-xl p-4 text-[13px] leading-relaxed text-[#1A4D0A] mb-5 whitespace-pre-wrap">
              {generateMessage(actionType, { studentName: selectedStudent.name, time: format(new Date(), 'HH:mm'), date: format(new Date(), 'dd/MM/yyyy') })}
            </div>
            <button onClick={handleSendAction}
              className="w-full py-3.5 rounded-xl bg-brand text-white font-semibold text-[14px] hover:bg-brand-dark transition-all shadow-sm">
              Dërgo Mesazhin
            </button>
          </div>
        </div>
      )}

      {/* ── Correction Modal ── */}
      {correctionModal && (
        <div className="fixed inset-0 z-[500] bg-black/30 backdrop-blur-[2px] flex items-center justify-center print:hidden"
             onClick={e => { if (e.target === e.currentTarget) setCorrectionModal(null); }}>
          <div className="bg-white rounded-2xl p-8 w-[440px] max-w-[92vw] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-border relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setCorrectionModal(null)}
              className="absolute right-5 top-5 w-8 h-8 rounded-xl bg-surface flex items-center justify-center text-text-muted hover:bg-brand-light hover:text-brand transition-colors text-lg">✕</button>
            <div className="font-serif text-[20px] font-bold text-text-primary mb-1">Mesazh i Dërguar Gabimisht</div>
            <div className="text-[13px] text-text-muted mb-5">
              Nxënësi: <span className="font-semibold text-text-primary">{correctionModal.log.name}</span>
              <span className="mx-2">·</span>
              <span className="text-text-muted">{correctionModal.log.label}</span>
            </div>
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px] mb-2">Mesazhi i Korrigjimit</div>
            <div className="bg-[#FFF8E6] border border-[#FCD34D] rounded-xl p-4 text-[13px] leading-relaxed text-[#92400E] mb-5 whitespace-pre-wrap">
              {generateMessage('mistake', {
                studentName: correctionModal.log.name,
                time: format(new Date(), 'HH:mm'),
                date: format(new Date(), 'dd/MM/yyyy')
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCorrectionModal(null)}
                className="flex-1 py-3 rounded-xl border border-border text-[14px] font-semibold text-text-secondary hover:bg-surface transition-all">
                Anulo
              </button>
              <button onClick={() => handleSendCorrection(correctionModal.log, correctionModal.index)}
                className="flex-1 py-3 rounded-xl bg-[#D97706] text-white font-semibold text-[14px] hover:bg-[#B45309] transition-all shadow-sm">
                Dërgo Korrigjimin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
