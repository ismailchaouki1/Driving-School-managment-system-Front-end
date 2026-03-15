import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import '../Styles/Home.scss';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowitWorks';
import Why from '../components/WhySection';
import ReviewsSection from '../components/ReviewsSection';
import Features from '../components/Features';
import ChatwayWidget from '../api/chatbot/ChatwayWidget';
import HearFromUser from '../components/HearFromUser';
import PricingSection from '../components/PricingSection';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function HomePage() {
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5, // higher = smoother
      effects: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <div className="mainContainer">
          <ChatwayWidget />
          <header className="container-xl">
            <Header />
          </header>

          <section className="container-xl">
            <HeroSection />
          </section>

          <section className="container-xl">
            <HowItWorks />
          </section>
          <section className="container-xl">
            <Why />
          </section>
          <section className="container-xl">
            <ReviewsSection />
          </section>
          <section className="container-xl">
            <Features />
          </section>
          <section className="container-xl">
            <HearFromUser />
          </section>
          <section className="container-xl">
            <PricingSection />
          </section>
        </div>
      </div>
    </div>
  );
}
