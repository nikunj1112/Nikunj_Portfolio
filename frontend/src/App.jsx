import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/admin/Dashboard';
import ManageProfile from './pages/admin/ManageProfile';
import ManageSkills from './pages/admin/ManageSkills';
import ManageProjects from './pages/admin/ManageProjects';
import ManageMessages from './pages/admin/ManageMessages';
import ProtectedRoute from './components/ProtectedRoute';
import ManageEducation from './pages/admin/ManageEducation';
import ManageStats from './pages/admin/ManageStats';
import ManageCertificates from './pages/admin/Certificates';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Login Page - Unprotected */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes - All nested under AdminDashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
           <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ManageProfile />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="stats" element={<ManageStats />} />
            <Route path="certificates" element={<ManageCertificates />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="messages" element={<ManageMessages />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

