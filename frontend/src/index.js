import React from 'react';
import './index.css';
import App from './App';

// React 18 compatible rendering with fallback for older versions
const renderApp = () => {
  const appElement = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  const rootElement = document.getElementById('root');

  // Try React 18 createRoot API first
  try {
    const { createRoot } = require('react-dom/client');
    const root = createRoot(rootElement);
    root.render(appElement);
  } catch (error) {
    // Fallback to React 17 API if React 18 is not available
    console.warn('React 18 createRoot not available, falling back to ReactDOM.render');
    const ReactDOM = require('react-dom');
    ReactDOM.render(appElement, rootElement);
  }
};

renderApp();
