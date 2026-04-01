import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

// Layout
import BottomNav from './components/layout/BottomNav';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DoctorsListPage from './pages/DoctorsListPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPanelPage from './pages/AdminPanelPage';

// Store
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
  },
});

const NO_NAV_PREFIXES = ['/login', '/register', '/booking', '/booking-success', '/payment', '/admin-panel'];

function AppContent() {
  const { initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const showNav = !NO_NAV_PREFIXES.some((p) => location.pathname.startsWith(p));

  return (
    <div className="app-container">
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main */}
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorsListPage />} />
        <Route path="/doctors/:id" element={<DoctorDetailPage />} />
        <Route path="/booking/:doctorId" element={<BookingPage />} />
        <Route path="/payment/:appointmentId" element={<PaymentPage />} />
        <Route path="/booking-success/:appointmentId" element={<BookingSuccessPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin-panel" element={<AdminPanelPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
