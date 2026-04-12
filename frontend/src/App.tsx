import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import AppLayout from './components/Layout/AppLayout';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import DataList from './pages/DataManagement/DataList';
import DataUpload from './pages/DataManagement/DataUpload';
import DataDetail from './pages/DataManagement/DataDetail';
import AccessControl from './pages/AccessControl/AccessControl';
import AuditLog from './pages/AuditLog/AuditLog';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Custom Private Route Component
const PrivateRoute = ({ children, requireAdmin = false }: { children: JSX.Element, requireAdmin?: boolean }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  
  return children;
};

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public / Guest Routes */}
      <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

      {/* Private Authenticated Routes */}
      <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Data Management */}
        <Route path="/data" element={<DataList />} />
        <Route path="/data/upload" element={<DataUpload />} />
        <Route path="/data/:id" element={<DataDetail />} />
        
        {/* Core Features */}
        <Route path="/access" element={<AccessControl />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute requireAdmin><AdminDashboard /></PrivateRoute>} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <WalletProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </WalletProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
