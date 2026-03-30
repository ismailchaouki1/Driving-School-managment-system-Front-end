import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../Styles/Login.scss';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Link } from 'react-router';
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  // 🔥 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 🔥 Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form Data:', formData);
  };
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
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
  }, []);
  // handle scroll to top
  const handleScroll = () => {
    // 1. Get the existing instance
    const smoother = ScrollSmoother.get();

    if (smoother) {
      // 2. Tell GSAP to scroll to the top (0) smoothly
      smoother.scrollTo(0, true);
    }
  };
  return (
    <div className="login" id="smooth-wrapper">
      <div className="login__box" id="smooth-content">
        {/* Header */}
        <div className="login__header">
          <span className="login__badge" ref={badgeRef}>
            Welcome Back
          </span>
          <h1 ref={titleRef}>Sign in to your account</h1>
          <p ref={subtitleRef}>Access your financial dashboard and insights</p>
        </div>

        {/* Form */}
        <form className="login__form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="login__field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="login__field">
            <label>Password</label>
            <div className="login__input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options */}
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

          {/* Button */}
          <button className="login__submit" type="submit">
            Sign In <span>›</span>
          </button>

          {/* Divider */}
          <div className="login__divider">
            <span>Or continue with</span>
          </div>

          {/* Social */}
          <div className="login__social">
            <button type="button" className="login__social-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" />
              Google
            </button>
          </div>

          {/* Footer */}
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
