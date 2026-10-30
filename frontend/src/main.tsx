import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'

// Suppress third-party browser extension errors (e.g. translate-page / save-page context menu noise)
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message?.includes('Cannot find menu item with id')) {
    e.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
