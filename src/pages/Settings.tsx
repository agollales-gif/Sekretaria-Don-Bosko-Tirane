import React, { useState, useEffect } from 'react';
import {
  Eye, EyeOff, Save, CheckCircle2, Mail, Phone,
  HelpCircle, MessageSquare, ShieldCheck, ChevronDown, ChevronUp,
  FileText, Bell, User, LogOut, RefreshCw, Info
} from 'lucide-react';
import { getSession, ADMIN_USERS, getAdminPassword, setAdminPassword, clearSession } from '@/src/lib/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { logActivity } from '@/src/lib/activity';

// ── localStorage keys for configurable settings ──────────────────────────────
const TEMPLATE_KEYS: Record<string, string> = {
  late_1st_hour:      'tpl_late1',
  late_2nd_hour:      'tpl_late2',
  teacher_meeting:    'tpl_teacher',
  principal_meeting:  'tpl_principal',
  sickness:           'tpl_sickness',
};

const DEFAULT_TEMPLATES: Record<string, string> = {
  late_1st_hour:     'Të nderuar prindër, ju njoftojmë se nxënësi/ja [Emri] është paraqitur me vonesë në shkollë sot më datë [Data], në orën [Ora]. (Ora e 1-rë). Qendra Don Bosko.',
  late_2nd_hour:     'Të nderuar prindër, ju njoftojmë se nxënësi/ja [Emri] është paraqitur me vonesë në shkollë sot më datë [Data], në orën [Ora]. (Në pritje të orës së 2-të). Qendra Don Bosko.',
  teacher_meeting:   'Të nderuar prindër, ju ftojmë për një takim me mësuesin kujdestar të nxënësit/es [Emri]. Ju lutem na kontaktoni për të caktuar orarin. Qendra Don Bosko.',
  principal_meeting: 'Të nderuar prindër, kërkohet prania juaj për një takim me Drejtorinë e shkollës lidhur me nxënësin/en [Emri]. Ju lutem paraqituni sa më parë. Qendra Don Bosko.',
  sickness:          'Të nderuar prindër, ju njoftojmë se nxënësi/ja [Emri] nuk ndihet mirë (arsye shëndetësore) dhe është larguar nga ambientet e shkollës në orën [Ora]. Qendra Don Bosko.',
};

const TEMPLATE_LABELS: Record<string, string> = {
  late_1st_hour:     'Vonesë — Ora e Parë',
  late_2nd_hour:     'Vonesë — Ora e Dytë',
  teacher_meeting:   'Takim me Mësuesin',
  principal_meeting: 'Takim me Drejtorin',
  sickness:          'Sëmundje',
};

export function getTemplate(key: string): string {
  return localStorage.getItem(TEMPLATE_KEYS[key]) || DEFAULT_TEMPLATES[key] || '';
}

function saveTemplate(key: string, value: string) {
  localStorage.setItem(TEMPLATE_KEYS[key], value);
}

const FAQ = [
  { q: 'Si të dërgoj një mesazh vonese?', a: 'Shkoni te Regjistri, zgjidhni klasën, gjeni nxënësin dhe klikoni "Vonoi". Zgjidhni orën dhe konfirmoni.' },
  { q: 'Çfarë ndodh nëse dërgoj mesazhin gabimisht?', a: 'Shkoni te Historia dhe klikoni "Gabim?". Sistemi dërgon automatikisht mesazhin e korrigjimit.' },
  { q: 'Si të ndryshoj fjalëkalimin?', a: 'Plotësoni seksionin "Fjalëkalimi" me fjalëkalimin aktual dhe atë të ri.' },
  { q: 'Kush mund të shohë fjalëkalimin tim?', a: 'Vetëm Super Admini mund të shohë dhe ndryshojë fjalëkalimet e llogarive të sekretarisë.' },
  { q: 'Si të ndryshoj tekstin e mesazheve?', a: 'Shkoni te seksioni "Modelet e Mesazheve" dhe editoni çdo model. Përdorni [Emri], [Ora], [Data] si variabla.' },
];

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-border overflow-hidden mb-5">
    <div className="px-6 py-4 border-b border-border flex items-center gap-2">
      <Icon className="w-4 h-4 text-brand" />
      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px]">{title}</span>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
export const Settings = ({ onBack }: { onBack: () => void }) => {
  const navigate = useNavigate();
  const session = getSession();
  const user = ADMIN_USERS.find(u => u.id === session.id);

  // Password
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd]         = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd]       = useState({ current: false, new: false, confirm: false });
  const [pwdSaved, setPwdSaved]     = useState(false);

  // Message templates
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const [tplSaved, setTplSaved]   = useState<Record<string, boolean>>({});

  // Notifications toggle (stored in localStorage)
  const [notifSound, setNotifSound]   = useState(() => localStorage.getItem('pref_sound') !== 'off');
  const [notifToast, setNotifToast]   = useState(() => localStorage.getItem('pref_toast') !== 'off');

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const loaded: Record<string, string> = {};
    Object.keys(DEFAULT_TEMPLATES).forEach(k => { loaded[k] = getTemplate(k); });
    setTemplates(loaded);
  }, []);

  if (!user) return null;

  // ── Password save ──
  const handleSavePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd || !newPwd || !confirmPwd) { toast.error('Plotësoni të gjitha fushat.'); return; }
    if (currentPwd !== getAdminPassword(user))  { toast.error('Fjalëkalimi aktual është i gabuar.'); return; }
    if (newPwd.length < 6)                       { toast.error('Minimum 6 karaktere.'); return; }
    if (newPwd !== confirmPwd)                   { toast.error('Fjalëkalimet nuk përputhen.'); return; }
    setAdminPassword(user, newPwd);
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    setPwdSaved(true);
    logActivity(user.id, user.name, 'password_changed', 'Fjalëkalimi u ndryshua nga vetë admini');
    toast.success('Fjalëkalimi u ndryshua.');
    setTimeout(() => setPwdSaved(false), 3000);
  };

  // ── Template save ──
  const handleSaveTpl = (key: string) => {
    saveTemplate(key, templates[key]);
    setTplSaved(p => ({ ...p, [key]: true }));
    logActivity(user.id, user.name, 'template_edited', `Model i edituar: ${TEMPLATE_LABELS[key]}`);
    toast.success(`Modeli "${TEMPLATE_LABELS[key]}" u ruajt.`);
    setTimeout(() => setTplSaved(p => ({ ...p, [key]: false })), 2500);
  };

  const handleResetTpl = (key: string) => {
    setTemplates(p => ({ ...p, [key]: DEFAULT_TEMPLATES[key] }));
    localStorage.removeItem(TEMPLATE_KEYS[key]);
    toast.success('Modeli u rivendos në origjinal.');
  };

  // ── Notification prefs ──
  const toggleSound = () => {
    const next = !notifSound;
    setNotifSound(next);
    localStorage.setItem('pref_sound', next ? 'on' : 'off');
    toast.success(next ? 'Tingulli i njoftimeve u aktivizua.' : 'Tingulli i njoftimeve u çaktivizua.');
  };
  const toggleToast = () => {
    const next = !notifToast;
    setNotifToast(next);
    localStorage.setItem('pref_toast', next ? 'on' : 'off');
    toast.success(next ? 'Njoftimet u aktivizuan.' : 'Njoftimet u çaktivizuan.');
  };

  const PwdField = ({ label, value, onChange, field, placeholder }: {
    label: string; value: string; onChange: (v: string) => void;
    field: 'current' | 'new' | 'confirm'; placeholder: string;
  }) => (
    <div>
      <label className="block text-[12px] font-semibold text-text-secondary tracking-[0.8px] uppercase mb-2">{label}</label>
      <div className="relative">
        <input type={showPwd[field] ? 'text' : 'password'} value={value}
          onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 pr-11 py-3 border border-border rounded-xl text-[14px] bg-surface outline-none transition-all focus:border-brand focus:bg-white placeholder:text-text-light" />
        <button type="button" onClick={() => setShowPwd(s => ({ ...s, [field]: !s[field] }))}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted transition-colors p-1">
          {showPwd[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  const Toggle = ({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-[14px] font-medium text-text-primary">{label}</div>
        <div className="text-[12px] text-text-muted mt-0.5">{desc}</div>
      </div>
      <button onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-brand' : 'bg-border'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl">

      {/* ── Account info ── */}
      <Section icon={User} title="Llogaria Juaj">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand font-bold text-base">
            {user.name[0]}
          </div>
          <div>
            <div className="font-semibold text-[15px] text-text-primary">{user.name}</div>
            <div className="text-[12px] text-text-muted">{user.role === 'Sec_9_vjecare' ? 'Sekretaria 9-vjeçare' : 'Sekretaria Gjimnaz'}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <Mail className="w-3.5 h-3.5 text-text-light shrink-0" /> {user.email}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <Phone className="w-3.5 h-3.5 text-text-light shrink-0" /> {user.phone}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-[11px] text-text-muted">
            Për të ndryshuar email-in ose numrin e telefonit, kontaktoni Super Adminin.
          </div>
        </div>
      </Section>

      {/* ── Password ── */}
      <Section icon={ShieldCheck} title="Ndrysho Fjalëkalimin">
        <form onSubmit={handleSavePwd} className="flex flex-col gap-4">
          <PwdField label="Fjalëkalimi Aktual"   value={currentPwd} onChange={setCurrentPwd} field="current" placeholder="Fjalëkalimi juaj aktual" />
          <PwdField label="Fjalëkalimi i Ri"      value={newPwd}     onChange={setNewPwd}     field="new"     placeholder="Minimum 6 karaktere" />
          <PwdField label="Konfirmo Fjalëkalimin" value={confirmPwd} onChange={setConfirmPwd} field="confirm" placeholder="Përsëritni fjalëkalimin e ri" />
          <button type="submit"
            className="mt-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white font-semibold text-[14px] hover:bg-brand-dark transition-all shadow-sm">
            {pwdSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {pwdSaved ? 'U Ruajt!' : 'Ruaj Fjalëkalimin'}
          </button>
        </form>
      </Section>

      {/* ── Message templates ── */}
      <Section icon={FileText} title="Modelet e Mesazheve">
        <p className="text-[12.5px] text-text-muted mb-5 leading-relaxed">
          Editoni tekstin e çdo mesazhi. Përdorni <code className="bg-surface px-1.5 py-0.5 rounded text-brand font-mono text-[11px]">[Emri]</code>, <code className="bg-surface px-1.5 py-0.5 rounded text-brand font-mono text-[11px]">[Ora]</code>, <code className="bg-surface px-1.5 py-0.5 rounded text-brand font-mono text-[11px]">[Data]</code> si variabla dinamike.
        </p>
        <div className="flex flex-col gap-5">
          {Object.keys(DEFAULT_TEMPLATES).map(key => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-text-secondary tracking-[0.8px] uppercase">{TEMPLATE_LABELS[key]}</label>
                <button onClick={() => handleResetTpl(key)}
                  className="flex items-center gap-1 text-[11px] text-text-muted hover:text-brand transition-colors">
                  <RefreshCw className="w-3 h-3" /> Rivendos
                </button>
              </div>
              <textarea
                value={templates[key] || ''}
                onChange={e => setTemplates(p => ({ ...p, [key]: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-xl text-[13px] text-text-primary bg-surface outline-none transition-all focus:border-brand focus:bg-white resize-none leading-relaxed"
              />
              <button onClick={() => handleSaveTpl(key)}
                className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-[12px] font-semibold hover:bg-brand-dark transition-all shadow-sm">
                {tplSaved[key] ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {tplSaved[key] ? 'U Ruajt' : 'Ruaj'}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Notifications ── */}
      <Section icon={Bell} title="Preferencat e Njoftimeve">
        <Toggle
          label="Njoftimet vizuale (toast)"
          desc="Shfaq mesazhe konfirmimi pas çdo veprimi."
          value={notifToast}
          onChange={toggleToast}
        />
        <Toggle
          label="Tingulli i njoftimeve"
          desc="Luaj tingull kur dërgohet mesazhi me sukses."
          value={notifSound}
          onChange={toggleSound}
        />
      </Section>

      {/* ── Session ── */}
      <Section icon={Info} title="Sesioni Aktual">
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted">Llogaria</span>
            <span className="font-medium text-text-primary">{user.name}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted">Roli</span>
            <span className="font-medium text-text-primary">{user.role === 'Sec_9_vjecare' ? 'Sekretaria 9-vjeçare' : 'Sekretaria Gjimnaz'}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted">Statusi</span>
            <span className="flex items-center gap-1.5 text-success font-medium">
              <span className="w-2 h-2 rounded-full bg-success inline-block" /> Aktiv
            </span>
          </div>
        </div>
        <button onClick={() => { logActivity(user.id, user.name, 'logout', 'Dalje nga sistemi'); clearSession(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-[13px] text-text-secondary hover:border-brand hover:text-brand hover:bg-brand-light transition-all">
          <LogOut className="w-3.5 h-3.5" /> Dilni nga Sistemi
        </button>
      </Section>

      {/* ── FAQ ── */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand" />
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[1px]">Pyetje të Shpeshta</span>
        </div>
        {FAQ.map((item, i) => (
          <div key={i} className="border-b border-border last:border-0">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface transition-colors">
              <span className="text-[13.5px] font-medium text-text-primary pr-4">{item.q}</span>
              {openFaq === i ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
            </button>
            {openFaq === i && (
              <div className="px-6 pb-4 text-[13px] text-text-secondary leading-relaxed animate-in fade-in duration-150">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
