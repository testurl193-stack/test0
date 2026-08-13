import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// تسجيل الـ Service Worker لتفعيل التخزين المؤقت والعمل بدون إنترنت (Browser Caching & SW Cache)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('Service Worker registered successfully:', reg.scope);
    }).catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
  });
}
