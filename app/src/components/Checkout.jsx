// src/pages/Checkout.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios'; // Import your configured axios
import '../Styles/Checkout.scss';

// Debug: Check if Stripe key is loaded
console.log('Stripe Public Key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = {
  basic: { name: 'Basic', monthly: 29, yearly: 85 },
  pro: { name: 'Pro', monthly: 59, yearly: 150 },
  enterprise: { name: 'Enterprise', monthly: 99, yearly: 210 },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plan = searchParams.get('plan') || 'pro';
  const billing = searchParams.get('billing') || 'monthly';
  const planDetails = plans[plan];
  const amount = planDetails[billing];
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/checkout?plan=${plan}&billing=${billing}`);
      return;
    }
  }, [isAuthenticated, navigate, plan, billing]);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Sending request to create checkout session...');
      const response = await axiosInstance.post('/stripe/create-checkout-session', {
        plan: plan,
        billing: billing,
      });

      console.log('Response received:', response.data);

      if (response.data.success) {
        // ✅ FIX: Use window.location.href instead of stripe.redirectToCheckout
        window.location.href = response.data.session_url;
      } else {
        setError(response.data.message || 'Failed to start checkout');
      }
    } catch (err) {
      console.error('Checkout error details:', err);

      if (err.response) {
        setError(`Server error: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Cannot connect to server. Please ensure Laravel backend is running on port 8000');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <div className="checkout-header">
          <h1>Complete Your Purchase</h1>
          <p>Secure checkout powered by Stripe</p>
        </div>

        <div className="checkout-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="plan-details">
              <div className="plan-name">{planDetails.name} Plan</div>
              <div className="plan-billing">
                {billing === 'yearly' ? 'Yearly' : 'Monthly'} Subscription
              </div>
            </div>

            <div className="price-breakdown">
              <div className="price-row total">
                <span>Total</span>
                <span>${amount}</span>
              </div>
              <div className="billing-note">
                {billing === 'yearly'
                  ? `Billed annually at $${amount}/year`
                  : `Billed monthly at $${amount}/month`}
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Details</h3>

            {error && (
              <div
                className="error-message"
                style={{
                  color: 'red',
                  padding: '10px',
                  margin: '10px 0',
                  background: '#ffeeee',
                  borderRadius: '5px',
                  border: '1px solid #ffcccc',
                }}
              >
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="pay-button"
              style={{
                width: '100%',
                padding: '15px',
                background: loading ? '#ccc' : '#8cff2e',
                color: loading ? '#666' : '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {loading
                ? 'Processing...'
                : `Pay $${amount} ${billing === 'yearly' ? '/year' : '/month'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
