import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
// Add this to your main index.js or App.jsx
const originalError = console.error;
console.error = function (...args) {
  if (
    args[0]?.includes?.('Unchecked runtime.lastError') ||
    args[0]?.includes?.('message channel closed')
  ) {
    return;
  }
  originalError.apply(console, args);
};
