import { Link } from 'react-router';
import '../Styles/App.scss';
import '../Styles/Footer.scss';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useEffect, useRef } from 'react';
const Footer = () => {
  ////test
  const chatwayLoaded = useRef(false);

  useEffect(() => {
    // Check if Chatway script is already loaded
    if (window.$chatway) {
      chatwayLoaded.current = true;
      return;
    }

    // Load Chatway script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.chatway.app/widget.js'; // Replace with your actual Chatway script URL
    script.async = true;
    script.onload = () => {
      chatwayLoaded.current = true;
      console.log('Chatway widget loaded');
    };
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const openChatWindow = (e) => {
    e.preventDefault();

    // Check if Chatway widget is available and open it
    if (chatwayLoaded.current && window.$chatway && window.$chatway.openChatwayWidget) {
      window.$chatway.openChatwayWidget();
    } else {
      console.log('Chatway widget not yet loaded');
      // Optional: Retry after a short delay
      setTimeout(() => {
        if (window.$chatway && window.$chatway.openChatwayWidget) {
          window.$chatway.openChatwayWidget();
        }
      }, 500);
    }
  };

  ////test
  const handleScroll = () => {
    // 1. Get the existing instance
    const smoother = ScrollSmoother.get();

    if (smoother) {
      // 2. Tell GSAP to scroll to the top (0) smoothly
      smoother.scrollTo(0, true);
    }
  };
  const handleNavClick = (e, sectionId) => {
    // If we are already on the home page, just scroll smoothly
    if (window.location.pathname === '/') {
      e.preventDefault(); // Stop the page from reloading/navigating
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTo(sectionId, true, 'top 80px'); // 80px offset for header
      }
    }
  };
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <div className="logo">
            <span className="logo-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="23"
                fill="none"
                overflow="visible"
              >
                <g>
                  <path
                    d="M 21.821 0.929 C 22.354 0.38 23.092 0.068 23.865 0.065 L 33.762 0.065 C 40.198 0.065 43.42 8.011 38.869 12.659 L 28.958 22.783 C 28.503 23.247 27.725 22.918 27.725 22.26 L 27.725 13.345 L 28.87 12.174 C 29.78 11.245 29.136 9.656 27.848 9.656 L 13.276 9.656 L 21.821 0.929 Z"
                    fill="rgb(255, 255, 255)"
                  ></path>
                  <path
                    d="M 19.179 22.071 C 18.646 22.62 17.908 22.932 17.135 22.935 L 7.238 22.935 C 0.802 22.935 -2.42 14.988 2.131 10.341 L 12.042 0.217 C 12.497 -0.247 13.276 0.082 13.276 0.739 L 13.276 9.655 L 12.13 10.825 C 11.22 11.755 11.864 13.344 13.152 13.344 L 27.724 13.344 L 19.178 22.071 Z"
                    fill="rgb(255, 255, 255)"
                  ></path>
                </g>
              </svg>{' '}
            </span>
            <span className="logo-text">Clario</span>
          </div>

          <p className="description">
            Your all-in-one driving school management system. Manage students, schedule lessons,
            track progress, and organize your operations – effortlessly.
          </p>

          <p className="credit">
            <span style={{ color: '#8cff2e' }}>❤︎ ⁠</span> Developed by <span>Chaouki Ismail</span>{' '}
            ©2026
          </p>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <div className="footer-column">
            <h4>Quick Menu</h4>
            <ul>
              <Link
                onClick={(e) => handleNavClick(e, '#how-it-works')}
                className="nav-link"
                to={'/'}
              >
                <li className="nav-item">
                  <a className="nav-link">How it works</a>
                </li>
              </Link>
              <Link onClick={(e) => handleNavClick(e, '#features')} className="nav-link" to={'/'}>
                <li className="nav-item">
                  <a className="nav-link">Features</a>
                </li>
              </Link>
              <Link onClick={(e) => handleNavClick(e, '#pricing')} className="nav-link" to={'/'}>
                <li className="nav-item">
                  <a className="nav-link">Pricing</a>
                </li>
              </Link>
              <Link onClick={(e) => handleNavClick(e, '#blog')} className="nav-link" to={'/'}>
                <li className="nav-item">
                  <a className="nav-link">Blog</a>
                </li>
              </Link>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Information</h4>
            <ul>
              <li className="nav-item">
                <button
                  className="nav-link contact-button"
                  onClick={openChatWindow}
                  aria-label="Open chat support"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  Contact
                </button>
              </li>

              <Link onClick={handleScroll} className="nav-link" to={'/privacy-policy'}>
                <li className="nav-item">
                  <a className="nav-link">Privacy Policy</a>
                </li>
              </Link>
              <Link onClick={handleScroll} className="nav-link" to={'/terms'}>
                <li className="nav-item">
                  <a className="nav-link">Terms</a>
                </li>
              </Link>
              <Link onClick={handleScroll} className="nav-link" to={'/blog'}>
                <li className="nav-item">
                  <a className="nav-link">Blogs</a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
