// src/contexts/StripeContext.jsx

import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const StripeContext = createContext();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function StripeProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const createCheckoutSession = async (plan, billing) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = `/login?redirect=/pricing&plan=${plan}&billing=${billing}`;
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        '/api/stripe/create-checkout-session',
        {
          plan,
          billing,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: response.data.session_id });
      } else {
        throw new Error(response.data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('/api/stripe/subscription-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSubscription(response.data.data);
      }
    } catch (error) {
      console.error('Failed to get subscription:', error);
    }
  };

  const cancelSubscription = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await axios.post(
        '/api/stripe/cancel-subscription',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        await getSubscriptionStatus();
      }
      return response.data;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  };

  return (
    <StripeContext.Provider
      value={{
        createCheckoutSession,
        getSubscriptionStatus,
        cancelSubscription,
        subscription,
        loading,
        stripePromise,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStripe = () => useContext(StripeContext);
