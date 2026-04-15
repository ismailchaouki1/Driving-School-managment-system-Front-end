import '../Styles/HeroSection.scss';
import { gsap } from 'gsap';
import { useRef, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/all';
import { Link } from 'react-router-dom';
gsap.registerPlugin(ScrollTrigger);
export default function HeroSection() {
  const badge = useRef(null);
  const title = useRef(null);
  const subtitle = useRef(null);
  const btnStart = useRef(null);
  const img = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badge.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          title.current,
          {
            y: 50,
            opacity: 0,
            duration: 1,
          },
          '-=0.4',
        )
        .from(
          subtitle.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.6',
        )
        .from(
          btnStart.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.6',
        );
      gsap.set(img.current.parentElement, {
        perspective: 1400,
      });

      gsap.fromTo(
        img.current,
        {
          rotationX: 50,
          transformOrigin: 'center center',
        },
        {
          rotationX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: img.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1.5,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);
  return (
    <div className="container-md heroSection">
      <div className="hero-badge" ref={badge}>
        {' '}
        All-in-One Management Platform
      </div>
      <h1 className="hero-title" ref={title}>
        Take control of your Business — with Clario
      </h1>
      <p className="hero-subtitle" ref={subtitle}>
        Organize your driving school’s operations from students to invoices through one powerful and
        unified interface.
      </p>
      <Link to={'/login'} className="btn hero-button rounded-pill" ref={btnStart}>
        Get Started Free Trial
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
      </Link>
      <div className="hero-image" ref={img}>
        <div className="image"></div>
      </div>
    </div>
  );
}
