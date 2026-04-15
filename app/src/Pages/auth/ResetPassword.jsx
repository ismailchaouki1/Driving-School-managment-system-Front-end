// src/pages/ResetPassword.jsx
import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import gsap from 'gsap';
import '../../Styles/Login.scss';

const API_URL = 'http://localhost:8000/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);

  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  });

  const navigate = useNavigate();
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const badgeRef = useRef(null);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setIsValidToken(false);
        setIsVerifying(false);
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/password/verify-token`, {
          token: token,
          email: decodeURIComponent(email),
        });

        if (!response.data.success) {
          setIsValidToken(false);
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, email]);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      navigate('/system/dashboard');
    }

    if (!isVerifying) {
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
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4',
        )
        .from(
          formRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.2',
        );
      return () => tl.revert();
    }
  }, [navigate, isVerifying]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/password/reset`, {
        email: decodeURIComponent(email),
        token: token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      if (response.data.success) {
        setSuccess(true);
        // Automatically redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        setError(Object.values(errors).flat()[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while verifying token
  if (isVerifying) {
    return (
      <div className="login">
        <div className="login__box">
          <div className="login__header">
            <span className="login__badge">Verifying</span>
            <h1>Please wait...</h1>
            <p>Verifying your reset link.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Loader size={48} className="spinner" style={{ color: '#8cff2e' }} />
          </div>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isValidToken) {
    return (
      <div className="login">
        <div className="login__box">
          <div className="login__header">
            <span className="login__badge">Error</span>
            <h1>Invalid Reset Link</h1>
            <p>This password reset link is invalid or has expired.</p>
          </div>
          <div className="login__error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} />
            The reset link is invalid or has expired.
          </div>
          <button onClick={() => navigate('/forgot-password')} className="login__submit secondary">
            Request New Reset Link
            <span>›</span>
          </button>
          <div className="login__footer">
            <Link to="/login" className="back-to-login">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <div className="login__box">
        <div className="login__header">
          <span className="login__badge" ref={badgeRef}>
            Create New Password
          </span>
          <h1 ref={titleRef}>Reset Password</h1>
          <p ref={subtitleRef}>Please enter your new password below.</p>
        </div>

        {error && (
          <div className="login__error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="login__success">
            <CheckCircle size={18} />
            <div>
              <strong>Password Reset Successful!</strong>
              <p>Your password has been changed. Redirecting to login...</p>
            </div>
          </div>
        )}

        {!success && (
          <form className="login__form" onSubmit={handleSubmit} ref={formRef}>
            <div className="login__field">
              <label>New Password</label>
              <div className="login__input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <small className="field-hint">Password must be at least 6 characters</small>
            </div>

            <div className="login__field">
              <label>Confirm New Password</label>
              <div className="login__input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  placeholder="Confirm new password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="login__submit" type="submit" disabled={isLoading}>
              {isLoading ? <Loader size={18} className="spinner" /> : null}
              {isLoading ? 'Resetting...' : 'Reset Password'}
              <span>›</span>
            </button>
          </form>
        )}

        {!success && (
          <div className="login__footer">
            <Link to="/login" className="back-to-login">
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
