import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import HomePage from '../Pages/Home';
import BlogPage from '../Pages/Blog';
import BlogPost from '../Pages/BlogPost';
import TermsPage from '../Pages/Terms';
import PrivacyPage from '../Pages/Privacy';
import LoginPage from '../Pages/LoginPage';
import SignUpPage from '../Pages/SignUpPage';
import MainLayout from '../Pages/System/MainLayout';
import Dashboard from '../Pages/System/Dashboard';
import Students from '../Pages/System/Students';
import Sessions from '../Pages/System/Sessions';
import Vehicles from '../Pages/System/Vehicles';
import Payments from '../Pages/System/Payments';
import Statistics from '../Pages/System/Statistics';
import Settings from '../Pages/System/Settings';
import Calendar from '../Pages/System/Calendar';
import { NotificationProvider } from '../contexts/NotificationContext';
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/system" element={<MainLayout />}>
            <Route index element={<Navigate to="/system/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="payments" element={<Payments />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}
