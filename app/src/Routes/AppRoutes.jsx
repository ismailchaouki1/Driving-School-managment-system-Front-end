import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import HomePage from '../Pages/Home';
import BlogPage from '../Pages/Blog';
import BlogPost from '../Pages/BlogPost';
import TermsPage from '../Pages/Terms';
import PrivacyPage from '../Pages/Privacy';
import LoginPage from '../Pages/auth/LoginPage';
import SignUpPage from '../Pages/auth/SignUpPage';
import MainLayout from '../Pages/System/MainLayout';
import Dashboard from '../Pages/System/Dashboard';
import Students from '../Pages/System/Students';
import Sessions from '../Pages/System/Sessions';
import Vehicles from '../Pages/System/Vehicles';
import Payments from '../Pages/System/Payments';
import Statistics from '../Pages/System/Statistics';
import Calendar from '../Pages/System/Calendar';
import { NotificationProvider } from '../contexts/NotificationContext';
import Instructors from '../Pages/System/Instructors';
import ForgotPassword from '../Pages/auth/ForgotPassword';
import ResetPassword from '../Pages/auth/ResetPassword';
import Checkout from '../components/Checkout';
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/system" element={<MainLayout />}>
            <Route index element={<Navigate to="/system/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="payments" element={<Payments />} />
            <Route path="statistics" element={<Statistics />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}
