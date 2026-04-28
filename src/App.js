import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';
import AdminFeedback from './pages/AdminFeedback';

import 'sweetalert2/dist/sweetalert2.min.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        <ToastContainer />
        {!isAdminRoute ? <Navbar /> : null}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <AdminEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute>
                  <AdminFeedback />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<div className="px-4 py-24 text-center">Page Not Found</div>} />
          </Routes>
        </main>
        {!isAdminRoute ? <Footer /> : null}
      </div>
    </AuthProvider>
  );
}

export default App;
