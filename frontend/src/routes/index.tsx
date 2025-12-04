import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { TodoList } from '../components/TodoList';
import { UsersPage } from '../components/UsersPage';
import { AuthPage } from '../components/AuthForms';
import { useAuth } from '../context/AuthContext';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex items-center gap-3 text-white/70">
        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.is_admin) {
    return <Navigate to="/todos" replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-start justify-center py-8 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="w-full max-w-4xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
}

function TodosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <TodoList onShowUsers={user?.is_admin ? () => navigate('/users') : undefined} />
    </AppLayout>
  );
}

function UsersPageWrapper() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <UsersPage onBack={() => navigate('/todos')} />
    </AppLayout>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/todos" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <TodosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AdminRoute>
            <UsersPageWrapper />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/todos" replace />} />
    </Routes>
  );
}
