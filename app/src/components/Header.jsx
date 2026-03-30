import '../Styles/Header.scss';
import '../Styles/App.scss';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
export default function Header({ appear = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleScroll = () => {
    // 1. Get the existing instance
    const smoother = ScrollSmoother.get();

    if (smoother) {
      // 2. Tell GSAP to scroll to the top (0) smoothly
      smoother.scrollTo(0, true);
    }
  };
  useEffect(() => {
    const links = document.querySelectorAll('.nav-link');

    const handleScroll = (e) => {
      const href = e.currentTarget.getAttribute('href');

      // Only trigger if it's an internal hash link
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: {
              y: target,
              offsetY: 80, // Matches your header height
              autoKill: true, // Allows user to interrupt scroll
            },
            ease: 'power3.inOut',
          });

          // Logic to close the mobile menu after clicking
          const menu = document.querySelector('.navbar-collapse');
          if (menu.classList.contains('show')) {
            // If using Bootstrap's JS, trigger the toggle
            // Or if using a state-based menu, setMenuOpen(false)
            menu.classList.remove('show');

            // Also reset your hamburger icon state if it has an "open" class
            const toggler = document.querySelector('.navbar-toggler');
            toggler.classList.remove('open');
          }
        }
      }
    };

    links.forEach((link) => link.addEventListener('click', handleScroll));

    // Cleanup listeners on unmount
    return () => {
      links.forEach((link) => link.removeEventListener('click', handleScroll));
    };
  }, []);
  if (appear) {
    return (
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-md">
          <Link className="navbar-brand" to={'/'} onClick={handleScroll}>
            <a className="navbar-brand" href="#">
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
              Clario
            </a>
          </Link>
          <button
            className={`navbar-toggler border-0 shadow-none ${isOpen ? 'open' : ''}`}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="toggler-icon top-bar"></span>
            <span className="toggler-icon middle-bar"></span>
            <span className="toggler-icon bottom-bar"></span>
          </button>
          <div className={`navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <Link className="nav-link" to={'/'}>
                <li className="nav-item">
                  <a className="nav-link" href="#how-it-works">
                    How it works
                  </a>
                </li>
              </Link>
              <Link className="nav-link" to={'/'}>
                <li className="nav-item">
                  <a className="nav-link" href="#features">
                    Features
                  </a>
                </li>
              </Link>
              <Link className="nav-link" to={'/'}>
                <li className="nav-item">
                  <a className="nav-link" href="#pricing">
                    Pricing
                  </a>
                </li>
              </Link>
              <Link className="nav-link" to={'/'}>
                <li className="nav-item">
                  <a className="nav-link" href="#blog">
                    Blog
                  </a>
                </li>
              </Link>
            </ul>
            <form className="d-flex gap-2" role="search">
              <Link onClick={handleScroll} to={'/login'}>
                <button className="loginIn rounded-pill">
                  Login In
                  <span className="arrow-box">
                    {/* FIRST ARROW */}
                    <svg
                      className="arrow first"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>

                    {/* SECOND ARROW */}
                    <svg
                      className="arrow second"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </button>
              </Link>
              <Link onClick={handleScroll} to={'/signup'}>
                <button className="getStarted  rounded-pill">
                  Get Started
                  <span className="arrow-box">
                    {/* FIRST ARROW */}
                    <svg
                      className="arrow first"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>

                    {/* SECOND ARROW */}
                    <svg
                      className="arrow second"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </button>
              </Link>
            </form>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-md">
          <Link onClick={handleScroll} className="navbar-brand" to={'/'}>
            <a className="navbar-brand" href="#">
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
              Clario
            </a>
          </Link>
          <button
            className={`navbar-toggler border-0 shadow-none ${isOpen ? 'open' : ''}`}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="toggler-icon top-bar"></span>
            <span className="toggler-icon middle-bar"></span>
            <span className="toggler-icon bottom-bar"></span>
          </button>
          <div className={`navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0"></ul>
            <form className="d-flex gap-2" role="search">
              <Link onClick={handleScroll} to={'/login'}>
                <button className="loginIn rounded-pill">
                  Login In
                  <span className="arrow-box">
                    {/* FIRST ARROW */}
                    <svg
                      className="arrow first"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>

                    {/* SECOND ARROW */}
                    <svg
                      className="arrow second"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </button>
              </Link>
              <Link onClick={handleScroll} to={'/signup'}>
                <button className="getStarted  rounded-pill">
                  Get Started
                  <span className="arrow-box">
                    {/* FIRST ARROW */}
                    <svg
                      className="arrow first"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>

                    {/* SECOND ARROW */}
                    <svg
                      className="arrow second"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </button>
              </Link>
            </form>
          </div>
        </div>
      </nav>
    );
  }
}
