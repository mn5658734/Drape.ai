import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import WardrobePage from './pages/WardrobePage';
import WardrobeCarouselPage from './pages/WardrobeCarouselPage';
import DashboardPage from './pages/DashboardPage';
import OutfitSwipePage from './pages/OutfitSwipePage';
import RushModePage from './pages/RushModePage';
import DonatePage from './pages/DonatePage';
import ProfilePage from './pages/ProfilePage';
import ShoppingRecommendationsPage from './pages/ShoppingRecommendationsPage';

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useApp();
  if (user && user.isProfileComplete) return <Navigate to="/" replace />;
  if (user && !user.isProfileComplete) return <Navigate to="/profile-setup" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
      <Route path="/wardrobe" element={<ProtectedRoute><WardrobePage /></ProtectedRoute>} />
      <Route path="/wardrobe-view" element={<ProtectedRoute><WardrobeCarouselPage /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/outfit-swipe" element={<ProtectedRoute><OutfitSwipePage /></ProtectedRoute>} />
      <Route path="/rush-mode" element={<ProtectedRoute><RushModePage /></ProtectedRoute>} />
      <Route path="/donate" element={<ProtectedRoute><DonatePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/shopping" element={<ProtectedRoute><ShoppingRecommendationsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
