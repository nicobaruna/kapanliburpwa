import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext';
import DesktopHeader from './components/DesktopHeader';
import DesktopSidebar from './components/DesktopSidebar';
import BottomNav from './components/BottomNav';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import FinancialPlannerPage from './pages/FinancialPlannerPage';
import InspirationPage from './pages/InspirationPage';
import InspirationDetailPage from './pages/InspirationDetailPage';
import InspirationVideoPage from './pages/InspirationVideoPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';

function AppContent() {
  const { authState } = useUser();
  const location = useLocation();

  if (authState === 'loading') {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  // Allow unauthenticated users to see the landing page
  // Allow unauthenticated access to shared inspiration deep links
  const isInspirationDeepLink = /^\/inspiration\/[^/]+$/.test(location.pathname);
  if (authState === 'unauthenticated' && location.pathname !== '/' && location.pathname !== '/onboarding' && !isInspirationDeepLink) {
    return <LoginPage />;
  }

  if (authState === 'unauthenticated' && isInspirationDeepLink) {
    return (
      <Routes>
        <Route path="/inspiration/:id" element={<InspirationDetailPage />} />
      </Routes>
    );
  }

  if (authState === 'onboarding') {
    return <OnboardingPage />;
  }

  // If authenticated and on landing, redirect to dashboard
  if (authState === 'authenticated' && (location.pathname === '/' || location.pathname === '/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Determine if navigation should be shown
  const hideNavRoutes = ['/', '/onboarding', '/inspiration/video'];
  const showNav = !hideNavRoutes.includes(location.pathname) && !isInspirationDeepLink;

  return (
    <div className="app-shell">
      {showNav && authState === 'authenticated' && <DesktopHeader />}
      
      <div className={showNav && authState === 'authenticated' ? "desktop-layout-wrapper" : ""}>
        {showNav && authState === 'authenticated' && <DesktopSidebar />}
        
        <main className={showNav && authState === 'authenticated' ? "desktop-main-content" : ""}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/financial-planner" element={<FinancialPlannerPage />} />
            <Route path="/inspiration" element={<InspirationPage />} />
            <Route path="/inspiration/video" element={<InspirationVideoPage />} />
            <Route path="/inspiration/:id" element={<InspirationDetailPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Redirect legacy routes if accessed directly */}
            <Route path="/kalender" element={<Navigate to="/calendar" replace />} />
            <Route path="/finansial" element={<Navigate to="/financial-planner" replace />} />
            <Route path="/profil" element={<Navigate to="/profile" replace />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {showNav && authState === 'authenticated' && <BottomNav />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

