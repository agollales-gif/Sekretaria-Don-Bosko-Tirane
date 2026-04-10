// Auth store — all credentials live here (frontend-only demo)
// In production these would be server-side with hashed passwords.

export type Role = 'Sec_9_vjecare' | 'Sec_Gjimnazi' | 'SuperAdmin';

export interface AdminUser {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  passwordKey: string;
  defaultPassword: string;
}

// One super admin — same email/phone as secretaries, separate password
export const SUPER_ADMIN = {
  username: 'superadmin',
  email: 'qfp_donbosko@yahoo.it',
  phone: '+355 69 405 4009',
  password: 'P@55w0rd',
};

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'sec9',
    name: 'Sekretaria 9-vjeçare',
    role: 'Sec_9_vjecare',
    email: 'qfp_donbosko@yahoo.it',
    phone: '+355 69 405 4009',
    passwordKey: 'pwd_sec9',
    defaultPassword: '12345678',
  },
  {
    id: 'secgj',
    name: 'Sekretaria Gjimnaz',
    role: 'Sec_Gjimnazi',
    email: 'qfp_donbosko@yahoo.it',
    phone: '+355 69 405 4009',
    passwordKey: 'pwd_secgj',
    defaultPassword: '87654321',
  },
];

export function getAdminPassword(user: AdminUser): string {
  return localStorage.getItem(user.passwordKey) || user.defaultPassword;
}

export function setAdminPassword(user: AdminUser, newPassword: string): void {
  localStorage.setItem(user.passwordKey, newPassword);
}

export function loginAdmin(identifier: string, password: string): AdminUser | null {
  const clean = identifier.trim();
  for (const user of ADMIN_USERS) {
    const isEmailOrPhone =
      clean.toLowerCase() === user.email.toLowerCase() ||
      clean.replace(/\s/g, '') === user.phone.replace(/\s/g, '');
    if (isEmailOrPhone && password === getAdminPassword(user)) {
      return user;
    }
  }
  return null;
}

export function loginSuperAdmin(identifier: string, password: string): boolean {
  const clean = identifier.trim();
  const isMatch =
    clean.toLowerCase() === SUPER_ADMIN.username.toLowerCase() ||
    clean.toLowerCase() === SUPER_ADMIN.email.toLowerCase() ||
    clean.replace(/\s/g, '') === SUPER_ADMIN.phone.replace(/\s/g, '');
  return isMatch && password === SUPER_ADMIN.password;
}

export function saveSession(user: AdminUser) {
  localStorage.setItem('session_role', user.role);
  localStorage.setItem('session_name', user.name);
  localStorage.setItem('session_id', user.id);
}

export function saveSuperAdminSession(identifier: string) {
  localStorage.setItem('session_role', 'SuperAdmin');
  localStorage.setItem('session_name', 'Super Admin');
  localStorage.setItem('session_id', 'superadmin');
}

export function getSession() {
  return {
    role: localStorage.getItem('session_role') as Role | null,
    name: localStorage.getItem('session_name'),
    id: localStorage.getItem('session_id'),
  };
}

export function clearSession() {
  localStorage.removeItem('session_role');
  localStorage.removeItem('session_name');
  localStorage.removeItem('session_id');
}
