import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from '../Pages/Home';
import BlogPage from '../Pages/Blog';
import BlogPost from '../Pages/BlogPost';
import TermsPage from '../Pages/Terms';
import PrivacyPage from '../Pages/Privacy';
import LoginPage from '../Pages/LoginPage';
import SignUpPage from '../Pages/SignUpPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}
