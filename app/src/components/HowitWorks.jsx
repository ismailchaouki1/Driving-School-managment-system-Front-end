import '../Styles/HowItWorks.scss';
import '../Styles/App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import step1 from '../assets/images/1.png';
import step2 from '../assets/images/2.png';
import step3 from '../assets/images/3.png';
import step4 from '../assets/images/4.png';
import step5 from '../assets/images/5.png';
import step6 from '../assets/images/6.png';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Video from './video';
gsap.registerPlugin(ScrollTrigger);
export default function HowItWorks() {
  const container = useRef(null);
  const video = useRef(null);
  const title = useRef(null);
  const step1ref = useRef(null);
  const step2ref = useRef(null);
  const step3ref = useRef(null);
  const step4ref = useRef(null);
  const step5ref = useRef(null);
  const step6ref = useRef(null);
  const [open, setOpen] = useState(false);
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
          duration: 0.7,
          ease: 'power3.out', // smoother easing
        },
      });

      tl.from([video.current, title.current], { x: -180, opacity: 0, stagger: 0.25 }).from(
        [
          step1ref.current,
          step2ref.current,
          step3ref.current,
          step4ref.current,
          step5ref.current,
          step6ref.current,
        ],
        {
          y: 180,
          opacity: 0,
          stagger: 0.3, // smooth stagger animation
        },
      );
    }, container);

    return () => ctx.revert(); // proper cleanup
  }, []);
  const steps = [
    {
      id: 1,
      img: step1,
      title: 'Student Enrollment & Profiles',
      text: 'Digitally register students, securely store documents, and manage complete learner profiles in one centralized system.',
      ref: step1ref,
    },
    {
      id: 2,
      img: step2,
      title: 'Smart Lesson Scheduling',
      text: 'Efficiently schedule driving sessions with real-time availability, automated planning, and optimized instructor allocation.',
      ref: step2ref,
    },
    {
      id: 3,
      img: step3,
      title: 'Instructor Management',
      text: 'Assign certified instructors, monitor performance, and streamline communication between staff and students.',
      ref: step3ref,
    },
    {
      id: 4,
      img: step4,
      title: 'Fleet & Vehicle Control',
      text: 'Track vehicle availability, maintenance records, inspections, and operational status with full fleet visibility.',
      ref: step4ref,
    },
    {
      id: 5,
      img: step5,
      title: 'Progress & Performance Tracking',
      text: 'Monitor lesson completion, skill assessments, and student readiness through detailed performance insights.',
      ref: step5ref,
    },
    {
      id: 6,
      img: step6,
      title: 'Payments & Financial Management',
      text: 'Manage invoices, installment plans, and payment tracking while generating accurate financial reports with ease.',
      ref: step6ref,
    },
  ];
  return (
    <div className="container-md howItWorks" ref={container}>
      <div className="video" ref={video}>
        <FontAwesomeIcon icon={faCirclePlay} className="play" onClick={() => setOpen(true)} />
        <span style={{ color: '#8cff2e' }}>Watch Video</span>
      </div>
      <h1 className="how-title" ref={title}>
        How Clario works
      </h1>
      <Video opened={open} onClose={() => setOpen(false)} />
      <div className="steps ">
        {steps.map((s) => (
          <div class="card" key={s.id} ref={s.ref}>
            <div className="card-img-wrapper">
              <img src={s.img} class="card-img-top" alt={s.title} />
            </div>
            <div class="card-body">
              <div className="card-badge">• Step {s.id}</div>
              <h5 class="card-title">{s.title}</h5>
              <p class="card-text">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
