// src/pages/ForgotPassword.jsx
import { useEffect, useRef, useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import gsap from 'gsap';
import '../../Styles/Login.scss';

const API_URL = 'http://localhost:8000/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const badgeRef = useRef(null);

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
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${API_URL}/password/email`, { email });

      if (response.data.success) {
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.email?.[0] || 'Invalid email address');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send reset link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__box">
        <div className="login__header">
          <span className="login__badge" ref={badgeRef}>
            Reset Password
          </span>
          <h1 ref={titleRef}>Forgot Password?</h1>
          <p ref={subtitleRef}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
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
              <strong>Check your email!</strong>
              <p>We've sent a password reset link to your email address.</p>
            </div>
          </div>
        )}

        {!success && (
          <form className="login__form" onSubmit={handleSubmit} ref={formRef}>
            <div className="login__field">
              <label>Email Address</label>
              <div className="login__input">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
            </div>

            <button className="login__submit" type="submit" disabled={isLoading}>
              {isLoading ? <Loader size={18} className="spinner" /> : null}
              {isLoading ? 'Sending...' : 'Send Reset Link'}
              <span>›</span>
            </button>
          </form>
        )}

        <div className="login__footer">
          <Link to="/login" className="back-to-login">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
