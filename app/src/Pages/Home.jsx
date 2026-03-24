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
import FAQ from '../components/FAQ';
import BlogSection from '../components/BlogSection';
import ReadyToStartCard from '../components/ReadyToStartCard';
import Footer from '../components/Footer';

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
      <header className="container-xl">
        <Header />
      </header>
      <div id="smooth-content">
        <div className="mainContainer">
          <ChatwayWidget />

          <section className="container-md">
            <HeroSection />
          </section>

          <section className="container-md">
            <HowItWorks />
          </section>
          <section className="container-md">
            <Why />
          </section>
          <section className="container-md">
            <ReviewsSection />
          </section>
          <section className="container-md">
            <Features />
          </section>
          <section className="container-md">
            <HearFromUser />
          </section>
          <section className="container-md">
            <PricingSection />
          </section>
          <section className="container-md">
            <FAQ />
          </section>
          <section className="container-md">
            <BlogSection />
          </section>
          <section className="container-md">
            <ReadyToStartCard />
          </section>
          <section className="container-fluid">
            <Footer />
          </section>
        </div>
      </div>
    </div>
  );
}
