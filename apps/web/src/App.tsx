import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import PortariaPanel from './pages/Portaria/PortariaPanel';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { getUser } from './services/auth.service';

function RequireRole({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
}


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/operacao" element={
        <RequireRole roles={['PORTER', 'ADMIN']}>
          <PortariaPanel />
        </RequireRole>
      } />

      <Route path="/admin/*" element={
        <RequireRole roles={['ADMIN']}>
          <AdminDashboard />
        </RequireRole>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

