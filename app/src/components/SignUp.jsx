import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../Styles/SignUp.scss';
import gsap from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import axiosInstance from '../services/axios';

const API_URL = 'http://localhost:8000/api';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors('');

    try {
      const response = await axiosInstance.post('/signup', formData);

      if (response.data.success) {
        // ✅ Store the token immediately
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        // ✅ Store that user needs subscription
        localStorage.setItem('requires_subscription', 'true');

        // ✅ Redirect to pricing page to choose plan
        navigate('/pricing?new=true&from=signup');
      }
    } catch (err) {
      setErrors(err.response?.data?.message || 'Signup failed');
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
    <div className="signup" id="smooth-wrapper">
      <div className="signup__box" id="smooth-content">
        <div className="signup__header">
          <span className="signup__badge" ref={badgeRef}>
            Join Us
          </span>
          <h1 ref={titleRef}>Create Your Account</h1>
          <p ref={subtitleRef}>Sign up and start managing your finances securely</p>
        </div>

        {errors.general && (
          <div
            className="signup__error"
            style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}
          >
            {errors.general}
          </div>
        )}

        <form className="signup__form" onSubmit={handleSubmit}>
          <div className="signup__field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && (
              <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.name}</span>
            )}
          </div>

          <div className="signup__field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && (
              <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email}</span>
            )}
          </div>

          <div className="signup__field">
            <label>Password</label>
            <div className="signup__input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.password}</span>
            )}
          </div>

          <div className="signup__field">
            <label>Confirm Password</label>
            <div className="signup__input">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="password_confirmation"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="signup__submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'} <span>›</span>
          </button>

          <div className="signup__divider">
            <span>Or sign up with</span>
          </div>

          <p className="signup__footer">
            Already have an account?
            <span>
              <Link
                style={{ textDecoration: 'none', color: '#8cff2e' }}
                onClick={handleScroll}
                to={'/login'}
              >
                Sign In
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
