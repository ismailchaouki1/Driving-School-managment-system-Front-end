import '../Styles/App.scss';
import '../Styles/Features.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faChartLine,
  faClipboardCheck,
  faBell,
  faComments,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
export default function Features() {
  const container = useRef();
  const title = useRef();
  const badge = useRef();
  const features = useRef();
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%', // when section enters viewport
          end: 'bottom 20%',
          toggleActions: 'play none none none', // play once
          scrub: false, // set to true if you want scroll-controlled animation
          // markers: true,     // enable for debugging
        },
        defaults: {
          duration: 1.2,
          ease: 'power3.out', // smoother easing
        },
      });

      tl.from([title.current, badge.current], {
        y: 180,
        opacity: 0,
        stagger: 0.3, // smooth stagger animation
      }).from(features.current, { y: 180, opacity: 0, stagger: 0.3 });
    }, container);

    return () => ctx.revert(); // proper cleanup
  }, []);
  const listFeatures = [
    {
      icon: faCalendarCheck,
      title: 'Course Scheduling',
      description: 'Easily book and manage your driving lessons with available instructors.',
    },
    {
      icon: faChartLine,
      title: 'Progress Tracking',
      description:
        'Monitor your learning progress and see how close you are to passing your driving exam.',
    },
    {
      icon: faClipboardCheck,
      title: 'Practice Tests',
      description: 'Access theory exam simulations to prepare for the official driving test.',
    },
    {
      icon: faBell,
      title: 'Lesson Reminders',
      description: 'Receive reminders for upcoming lessons and exams so you never miss a session.',
    },
    {
      icon: faComments,
      title: 'Instructor Feedback',
      description: 'Get personalized feedback from instructors after each lesson.',
    },
    {
      icon: faUserShield,
      title: 'Secure Student Dashboard',
      description: 'All your lessons, payments, and results are stored safely in one dashboard.',
    },
  ];
  return (
    <div className="container-md feature" ref={container}>
      <div className="title-badge-feature" ref={badge}>
        • Features
      </div>
      <h1 className="title-feature" ref={title}>
        Drive your progress with clarity and confidence.
      </h1>
      <div className="features-cards" ref={features}>
        {listFeatures.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="icon">
              <FontAwesomeIcon icon={feature.icon} />
            </div>
            <h5 className="feature-card-title">{feature.title}</h5>
            <p className="feature-card-text">{feature.description}</p>
          </div>
        ))}
      </div>
      <button className="feature-getStarted  rounded-pill">
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
    </div>
  );
}
