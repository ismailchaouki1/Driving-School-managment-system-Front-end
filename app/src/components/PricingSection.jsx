import { useState } from 'react';
import '../Styles/App.scss';
import '../Styles/PricingSection.scss';

const plans = [
  {
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

const logos = [
  ['🚗', '📋', '🎓', '📅', '💳', '📊'],
  ['🔔', '🛡️', '📍', '🧑‍🏫', '📱', '⚙️'],
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

  const handleToggle = (next) => {
    if (next === yearly) return;
    setPrevYearly(yearly);
    setYearly(next);
  };

  // slideUp when going monthly→yearly (price goes up visually)
  // slideDown when going yearly→monthly (price comes down)
  const priceClass =
    yearly !== prevYearly
      ? yearly
        ? 'pricing-card__amount' // monthly → yearly: slide up
        : 'pricing-card__amount down' // yearly → monthly: slide down
      : 'pricing-card__amount';

  return (
    <div className="pricing-section">
      <div className="pricing-badge">
        <span className="pricing-badge__dot" />
        Pricing
      </div>

      <div className="pricing-headline-wrap">
        <h1 className="pricing-headline">Drive your school forward.</h1>
      </div>

      <p className="pricing-subtext">
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
          Yearly
        </span>
      </div>

      <div className="pricing-cards">
        {plans.map((plan) => {
          const data = yearly ? plan.yearly : plan.monthly;
          return (
            <div key={plan.name} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <span className="pricing-card__popular-badge">Popular</span>}

              <div className="pricing-card__name">{plan.name}</div>

              <div className="pricing-card__price-wrap">
                <span key={`${plan.name}-${yearly}`} className={priceClass}>
                  ${data.price}
                </span>
                <span className="pricing-card__period">/{yearly ? 'year' : 'month'}</span>
              </div>

              <p className="pricing-card__desc">{data.desc}</p>

              <button className={`pricing-card__btn ${plan.popular ? 'green' : 'outline'}`}>
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
              {row.map((l, j) => (
                <span key={j} className="pricing-trust__logo">
                  {l}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
