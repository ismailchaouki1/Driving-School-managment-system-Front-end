import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../Styles/SignUp.scss';
import gsap from 'gsap';
import { Link } from 'react-router';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔥 Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  // 🔥 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // handle scroll
  const handleScroll = () => {
    // 1. Get the existing instance
    const smoother = ScrollSmoother.get();

    if (smoother) {
      // 2. Tell GSAP to scroll to the top (0) smoothly
      smoother.scrollTo(0, true);
    }
  };
  // 🔥 Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirm) {
      alert('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirm) {
      alert('Passwords do not match');
      return;
    }
    console.log('SignUp Data:', formData);
  };

  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  // 🔥 GSAP Animations
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

  return (
    <div className="signup" id="smooth-wrapper">
      <div className="signup__box" id="smooth-content">
        {/* Header */}
        <div className="signup__header">
          <span className="signup__badge" ref={badgeRef}>
            Join Us
          </span>
          <h1 ref={titleRef}>Create Your Account</h1>
          <p ref={subtitleRef}>Sign up and start managing your finances securely</p>
        </div>

        {/* Form */}
        <form className="signup__form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="signup__field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="signup__field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="signup__field">
            <label>Password</label>
            <div className="signup__input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="signup__field">
            <label>Confirm Password</label>
            <div className="signup__input">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirm"
                placeholder="Confirm Password"
                value={formData.confirm}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button className="signup__submit" type="submit">
            Sign Up <span>›</span>
          </button>

          {/* Divider */}
          <div className="signup__divider">
            <span>Or sign up with</span>
          </div>

          {/* Social */}
          <div className="signup__social">
            <button type="button" className="signup__social-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              Google
            </button>
          </div>

          {/* Footer */}
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
