import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Voting from './pages/Voting';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import NewsPage from './pages/NewsPage';
import { apiService } from './services/votingService';
import { UserRole } from './types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Sembunyikan navbar publik di halaman admin
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <div className="bg-navy-900 min-h-screen text-slate-light selection:bg-gold-400 selection:text-navy-900">
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  );
};

// Guard Component untuk melindungi Admin Routes
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = apiService.auth.getSession();
  
  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Voting />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;