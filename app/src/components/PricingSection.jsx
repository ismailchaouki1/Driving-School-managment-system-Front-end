// src/components/PricingSection.jsx
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../services/axios';
import '../Styles/PricingSection.scss';
import gsap from 'gsap';

// Plans data - PRICE IDs REMOVED (using dynamic pricing now)
const plans = [
  {
    id: 'basic',
    name: 'Basic',
    monthly: {
      price: 29,
      desc: 'Perfect for small driving schools just getting started.',
      features: [
        'Up to 10 students',
        'Schedule management',
        'Basic progress tracking',
        'Email support',
      ],
    },
    yearly: {
      price: 85,
      desc: 'Perfect for small driving schools just getting started.',
      features: [
        'Up to 10 students',
        'Schedule management',
        'Basic progress tracking',
        'Email support',
      ],
    },
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: {
      price: 59,
      desc: 'Advanced tools to manage your driving school smarter and grow faster.',
      features: [
        'Unlimited students',
        'Instructor management',
        'Payments & invoicing',
        'Analytics & reports',
        'Priority support',
      ],
    },
    yearly: {
      price: 150,
      desc: 'Advanced tools to manage your driving school smarter and grow faster.',
      features: [
        'Unlimited students',
        'Instructor management',
        'Payments & invoicing',
        'Analytics & reports',
        'Priority support',
      ],
    },
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: {
      price: 99,
      desc: 'Full-scale solution for large driving school networks and franchises.',
      features: [
        'Multi-branch support',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'SSO & advanced security',
      ],
    },
    yearly: {
      price: 210,
      desc: 'Full-scale solution for large driving school networks and franchises.',
      features: [
        'Multi-branch support',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'SSO & advanced security',
      ],
    },
    popular: false,
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 10 8" fill="none" stroke="#8cff2e" strokeWidth={1.8}>
    <polyline points="1,4 3.5,6.5 9,1" />
  </svg>
);

const ArrowIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const [prevYearly, setPrevYearly] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = (next) => {
    if (next === yearly) return;
    setPrevYearly(yearly);
    setYearly(next);
  };
  const handleSubscribe = async (plan) => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = `/login?redirect=/pricing&plan=${plan.id}&billing=${yearly ? 'yearly' : 'monthly'}`;
      return;
    }

    setProcessingPlan(plan.id);
    setLoading(true);

    try {
      const response = await axiosInstance.post('/stripe/create-checkout-session', {
        plan: plan.id,
        billing: yearly ? 'yearly' : 'monthly',
      });

      if (response.data.success) {
        // ✅ FIX: Use window.location.href instead of stripe.redirectToCheckout
        window.location.href = response.data.session_url;
      } else {
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.response?.status === 401) {
        window.location.href = `/login?redirect=/pricing&plan=${plan.id}&billing=${yearly ? 'yearly' : 'monthly'}`;
      } else {
        alert(error.response?.data?.message || 'Failed to start checkout. Please try again.');
      }
    } finally {
      setProcessingPlan(null);
      setLoading(false);
    }
  };

  const priceClass =
    yearly !== prevYearly
      ? yearly
        ? 'pricing-card__amount'
        : 'pricing-card__amount down'
      : 'pricing-card__amount';

  const container = useRef(null);
  const pricing_badge = useRef(null);
  const pricing_title = useRef(null);
  const pricing_subtitle = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          scrub: false,
        },
        defaults: {
          duration: 1.2,
          ease: 'power3.out',
        },
      });

      tl.from([pricing_badge.current, pricing_title.current, pricing_subtitle.current], {
        y: 100,
        opacity: 0,
        stagger: false,
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const logos = [
    [
      {
        name: 'Google Maps',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        ),
      },
      {
        name: 'Stripe',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
          </svg>
        ),
      },
      {
        name: 'WhatsApp',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        ),
      },
      {
        name: 'Zoom',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM9.25 8.5C7.733 8.5 6.5 9.733 6.5 11.25v3.375c0 .207.168.375.375.375H14.75c1.517 0 2.75-1.233 2.75-2.75V8.875A.375.375 0 0017.125 8.5H9.25zm8.25 1.575v3.85l2.201 1.575A.375.375 0 0020 15.125v-6.25a.375.375 0 00-.299-.366.376.376 0 00-.25.066L17.5 10.075z" />
          </svg>
        ),
      },
      {
        name: 'QuickBooks',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 7.5h2.5A3.75 3.75 0 0117 11.25v1.5A3.75 3.75 0 0113.25 16.5H13V18h-1.5v-1.5H10v-1.5h3.25a2.25 2.25 0 002.25-2.25v-1.5A2.25 2.25 0 0013.25 9h-2.5A2.25 2.25 0 008.5 11.25V12H7v-.75A3.75 3.75 0 0110.75 7.5z" />
          </svg>
        ),
      },
      {
        name: 'Calendly',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
          </svg>
        ),
      },
    ],
    [
      {
        name: 'DocuSign',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        ),
      },
      {
        name: 'PayPal',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106-.077.437zm14.146-14.42a3.35 3.35 0 00-.607-.541c-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 00-.556.479l-1.187 7.527h3.882c.46 0 .85-.334.922-.788l.816-5.09a.932.932 0 01.923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
          </svg>
        ),
      },
      {
        name: 'Twilio',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9zm3.5-11.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
          </svg>
        ),
      },
      {
        name: 'Google Calendar',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zM7 11h5v5H7z" />
          </svg>
        ),
      },
      {
        name: 'Zapier',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.96 14.985a23.8 23.8 0 01-.04.57H0v-3.11h7.03L0 5.08V1.97h3.12L10.49 9.4A23.8 23.8 0 0110.96 5h3.11v5.44l7.43-7.47h3.11v3.11L17.03 13.5H24v3.11h-10.97a23.8 23.8 0 01-.47 5H9.42a23.8 23.8 0 01-.5-5H0v-3.11h6.97l-6.97-6.97V3.11H3.12L10.96 11V5h3.11v9.985h-3.11z" />
          </svg>
        ),
      },
      {
        name: 'Slack',
        svg: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zm2.521-10.123a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" />
          </svg>
        ),
      },
    ],
  ];

  return (
    <div className="pricing-section" ref={container}>
      <div className="pricing-badge" ref={pricing_badge}>
        <span className="pricing-badge__dot" />
        Pricing
      </div>

      <div className="pricing-headline-wrap" ref={pricing_title}>
        <h1 className="pricing-headline">Drive your school forward.</h1>
      </div>

      <p className="pricing-subtext" ref={pricing_subtitle}>
        Simple, transparent pricing for driving schools of every size. No hidden fees, cancel
        anytime.
      </p>

      <div className="pricing-plan-switch">
        <span
          className={`toggle-label ${!yearly ? 'active' : ''}`}
          onClick={() => handleToggle(false)}
        >
          Monthly
        </span>

        <div className="track" onClick={() => handleToggle(!yearly)}>
          <div className={`thumb ${yearly ? 'yearly' : ''}`} />
        </div>

        <span
          className={`toggle-label ${yearly ? 'active' : ''}`}
          onClick={() => handleToggle(true)}
        >
          Yearly <span className="save-badge">Save 20%</span>
        </span>
      </div>

      <div className="pricing-cards">
        {plans.map((plan) => {
          const data = yearly ? plan.yearly : plan.monthly;
          const isProcessing = processingPlan === plan.id;

          return (
            <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <span className="pricing-card__popular-badge">Popular</span>}

              <div className="pricing-card__name">{plan.name}</div>

              <div className="pricing-card__price-wrap">
                <span key={`${plan.id}-${yearly}`} className={priceClass}>
                  ${data.price}
                </span>
                <span className="pricing-card__period">/{yearly ? 'year' : 'month'}</span>
              </div>

              <p className="pricing-card__desc">{data.desc}</p>

              <button
                className={`pricing-card__btn ${plan.popular ? 'green' : 'outline'}`}
                onClick={() => handleSubscribe(plan)}
                disabled={isProcessing || loading}
              >
                {isProcessing || loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    Get Started
                    <span className="arrow-box">
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
                  </>
                )}
              </button>

              <ul className="pricing-card__features">
                {data.features.map((f) => (
                  <li key={f}>
                    <span className="pricing-card__check">
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="pricing-trust">
        <div className="pricing-trust__left">
          <div className="pricing-trust__title">Trusted by driving schools worldwide</div>
          <p className="pricing-trust__desc">
            Join hundreds of driving schools managing students, instructors, and payments all in one
            place.
          </p>
          <div className="pricing-trust__link">
            Talk to Sales <ArrowIcon />
          </div>
        </div>

        <div className="pricing-trust__right">
          {logos.map((row, i) => (
            <div key={i} className="pricing-trust__logo-row">
              {row.map((logo, j) => (
                <span key={j} className="pricing-trust__logo" title={logo.name}>
                  {logo.svg}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
