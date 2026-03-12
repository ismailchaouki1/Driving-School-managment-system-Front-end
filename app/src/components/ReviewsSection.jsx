import '../Styles/App.scss';
import '../Styles/ReviewsSection.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function ReviewsSection() {
  const container = useRef(null);
  const title = useRef(null);
  const subtitle = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.from(title.current, {
        x: 120,
        opacity: 0,
        duration: 1,
      }).from(
        subtitle.current,
        {
          x: -120,
          opacity: 0,
          duration: 1,
        },
        '-=0.6',
      );
    }, container);

    return () => ctx.revert();
  }, []);

  const reviews = [
    {
      text: 'Managing students is so much easier now.',
      name: 'Yassine El Amrani',
      role: 'Driving Instructor',
    },
    {
      text: 'Everything I need for lessons and payments in one place.',
      name: 'Leila Benjelloun',
      role: 'Auto-école Owner',
    },
    {
      text: 'Tracking my practice keeps me consistent and focused.',
      name: 'Omar Hakam',
      role: 'Student Driver',
    },
    {
      text: 'Schedules and instructors are easy to manage now.',
      name: 'Fatima Zahra Idrissi',
      role: 'School Manager',
    },
    {
      text: 'Lesson tracking and admin tasks are simple and clear.',
      name: 'Rachid El Fassi',
      role: 'Administrator',
    },
  ];

  const infinite = [...reviews, ...reviews, ...reviews];

  return (
    <div className="review" ref={container}>
      <div className="review-titles">
        <div className="review-title" ref={title}>
          <h1>Built for driving schools and future drivers</h1>
        </div>

        <div className="review-subtitle" ref={subtitle}>
          <p>
            Learners and driving schools rely on our platform to manage lessons, track progress, and
            simplify scheduling — all in one smart dashboard.
          </p>
        </div>
      </div>

      {/* ROW 1 */}

      <section className="reviews">
        <div className="reviews-wrapper">
          <div className="reviews-track">
            {infinite.map((review, i) => (
              <div className="review-card" key={i}>
                <div className="review-content">
                  <FontAwesomeIcon className="quote-icon" icon={faQuoteLeft} />

                  <p className="review-text">{review.text}</p>
                </div>

                <div className="review-user">
                  <img src={`https://i.pravatar.cc/50?img=${i + 10}`} alt="" />

                  <div>
                    <h4>{review.name}</h4>
                    <span>{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROW 2 */}

      <section className="reviews reverse">
        <div className="reviews-wrapper">
          <div className="reviews-track reverse-track">
            {infinite.map((review, i) => (
              <div className="review-card" key={i}>
                <div className="review-content">
                  <FontAwesomeIcon className="quote-icon" icon={faQuoteLeft} />

                  <p className="review-text">{review.text}</p>
                </div>

                <div className="review-user">
                  <img src={`https://i.pravatar.cc/50?img=${i + 30}`} alt="" />

                  <div>
                    <h4>{review.name}</h4>
                    <span>{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
