import '../Styles/HearFromUser.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import Video from './video';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import vid from '../assets/client.mp4';
const videoSrc = vid;
export default function HearFromUser() {
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const container1 = useRef(null);
  const container2 = useRef(null);
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
          duration: 0.6,
          ease: 'power3.out', // smoother easing
        },
      });

      tl.from(container1.current, {
        x: -180,
        opacity: 0,
        stagger: 0.3,
        delay: 0.6, // smooth stagger animation
      }).from(container2.current, { x: 180, opacity: 0, stagger: 0.3 });
    }, container);

    return () => ctx.revert(); // proper cleanup
  }, []);
  return (
    <div className="hear-from-user " ref={container}>
      <div className="user-video" ref={container1}>
        <div className="user-video">
          <div className="overlay"></div>
          <div className="cont">
            <div className="video-play" onClick={() => setOpen(true)}>
              <div className="circle">
                <FontAwesomeIcon icon={faPlay} className="fa-play" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Video opened={open} src={videoSrc} onClose={() => setOpen(false)} />
      <div className="user-review" ref={container2}>
        <div className="user-badge">
          <span className="heart">❤︎</span> ⁠ Hear from our users
        </div>
        <span>
          "Clario makes managing my driving school so easy! I can focus on teaching students
          safely."
        </span>
        <Link to={'/signup'} className="getInTouch  rounded-pill text-decoration-none">
          Start Now !
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
      </div>
    </div>
  );
}
