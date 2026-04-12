import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../Styles/Login.scss';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        // Optional: Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;

        // Redirect to dashboard
        navigate('/system/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.email?.[0] || 'Invalid credentials');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/system/dashboard');
    }

    const tl = gsap.timeline();
    tl.from(badgeRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
      .from(
        titleRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power4.out',
        },
        '-=0.3',
      )
      .from(
        subtitleRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.1,
          ease: 'power2.out',
        },
        '-=0.4',
      );
    return () => tl.revert();
  }, [navigate]);

  const handleScroll = () => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, true);
    }
  };

  return (
    <div className="login" id="smooth-wrapper">
      <div className="login__box" id="smooth-content">
        <div className="login__header">
          <span className="login__badge" ref={badgeRef}>
            Welcome Back
          </span>
          <h1 ref={titleRef}>Sign in to your account</h1>
          <p ref={subtitleRef}>Access your financial dashboard and insights</p>
        </div>

        {error && (
          <div
            className="login__error"
            style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}
          >
            {error}
          </div>
        )}

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login__field">
            <label>Password</label>
            <div className="login__input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login__options">
            <label className="login__remember" style={{ color: 'white' }}>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button className="login__submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'} <span>›</span>
          </button>

          <div className="login__divider">
            <span>Or continue with</span>
          </div>

          <p className="login__footer">
            Don't have an account?
            <span>
              <Link
                style={{ textDecoration: 'none', color: '#8cff2e' }}
                onClick={handleScroll}
                to={'/signup'}
              >
                Sign up
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
