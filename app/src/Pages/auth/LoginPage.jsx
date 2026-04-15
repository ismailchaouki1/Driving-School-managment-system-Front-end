import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import '../../Styles/Login.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Login from '../../components/Login';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function LoginPage() {
  const smootherRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Smoother
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });
    smootherRef.current = smoother;

    // 2. THE FIX: ResizeObserver
    // This detects if your BlogSection or Card changes height after loading
    const RO = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      smoother.refresh();
    });

    if (contentRef.current) {
      RO.observe(contentRef.current);
    }

    // 3. Handle Hash Links
    if (window.location.hash) {
      const timer = setTimeout(() => {
        smoother.scrollTo(window.location.hash, true, 'top 80px');
      }, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      RO.disconnect();
      if (smoother) smoother.kill();
    };
  }, []);

  return (
    <>
      <header className="fixed-header-container">
        <div className="container-xl">
          <Header appear={false} />
        </div>
      </header>

      <div id="smooth-wrapper">
        <div id="smooth-content" ref={contentRef}>
          <main className="mainContainer">
            <section className="login-section" style={{ marginBottom: '50px' }}>
              <div className="container-md">
                <Login />
              </div>
            </section>

            <footer className="footer-section">
              <div className="container-fluid">
                <Footer />
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
