// src/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    // Get session_id from URL (optional - for tracking)
    const sessionId = searchParams.get('session_id');

    // User is already logged in (token exists from signup)
    const token = localStorage.getItem('token');

    // Log for debugging (optional)
    if (sessionId) {
      console.log('Payment successful for session:', sessionId);
    }

    if (token) {
      // Clear the subscription required flag
      localStorage.removeItem('requires_subscription');
      sessionStorage.removeItem('checkoutInProgress');

      setStatus('success');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/system/dashboard');
      }, 2000);
    } else {
      // Fallback: no token, redirect to login
      setStatus('error');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '400px',
        }}
      >
        {status === 'processing' && (
          <>
            <div
              className="spinner"
              style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #8cff2e',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}
            ></div>
            <h2>Processing Payment...</h2>
            <p>Please wait while we confirm your subscription.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div
              style={{
                width: '60px',
                height: '60px',
                background: '#8cff2e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '30px',
                color: '#000',
              }}
            >
              ✓
            </div>
            <h2>Payment Successful!</h2>
            <p>Your subscription has been activated.</p>
            <p>Redirecting to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div
              style={{
                width: '60px',
                height: '60px',
                background: '#ff4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '30px',
                color: '#fff',
              }}
            >
              ⚠️
            </div>
            <h2>Something Went Wrong</h2>
            <p>Please try logging in manually.</p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '12px 24px',
                background: '#8cff2e',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px',
              }}
            >
              Go to Login
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
