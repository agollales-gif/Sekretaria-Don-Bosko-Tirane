import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SuperAdminLogin } from './pages/SuperAdminLogin';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { getSession } from './lib/auth';

function RequireAuth({ children, superAdmin = false }: { children: React.ReactNode; superAdmin?: boolean }) {
  const session = getSession();
  if (superAdmin) {
    return session.role === 'SuperAdmin' ? <>{children}</> : <Navigate to="/superadmin/login" replace />;
  }
  const isAdmin = session.role === 'Sec_9_vjecare' || session.role === 'Sec_Gjimnazi';
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router basename="/sekretaria">
      <div className="min-h-screen font-sans text-text-primary bg-off-white">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route path="/superadmin/dashboard" element={<RequireAuth superAdmin><SuperAdminDashboard /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}
