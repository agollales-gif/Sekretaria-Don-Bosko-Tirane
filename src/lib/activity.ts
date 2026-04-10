// Shared activity log — written by admins, read by super admin
// Stored in localStorage so it persists across sessions in the same browser.

export interface ActivityEntry {
  id: string;
  adminId: string;
  adminName: string;
  type: 'message_sent' | 'correction_sent' | 'password_changed' | 'template_edited' | 'login' | 'logout';
  detail: string;
  timestamp: string; // ISO string
}

const STORAGE_KEY = 'activity_log';
const MAX_ENTRIES = 200;

export function logActivity(
  adminId: string,
  adminName: string,
  type: ActivityEntry['type'],
  detail: string
) {
  const entries = getActivityLog();
  const entry: ActivityEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    adminId,
    adminName,
    type,
    detail,
    timestamp: new Date().toISOString(),
  };
  const updated = [entry, ...entries].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getActivityLog(): ActivityEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearActivityLog() {
  localStorage.removeItem(STORAGE_KEY);
}

export const ACTIVITY_LABELS: Record<ActivityEntry['type'], string> = {
  message_sent:     'Mesazh i Dërguar',
  correction_sent:  'Korrigjim i Dërguar',
  password_changed: 'Fjalëkalim i Ndryshuar',
  template_edited:  'Model i Edituar',
  login:            'Hyrje në Sistem',
  logout:           'Dalje nga Sistemi',
};

export const ACTIVITY_COLORS: Record<ActivityEntry['type'], string> = {
  message_sent:     'bg-brand-light text-brand',
  correction_sent:  'bg-[#FFF8E6] text-[#D97706]',
  password_changed: 'bg-[#EEF2FF] text-[#4338CA]',
  template_edited:  'bg-[#F0FDF4] text-[#15803D]',
  login:            'bg-success-bg text-success',
  logout:           'bg-surface text-text-muted',
};
