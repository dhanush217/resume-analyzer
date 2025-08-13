import React from 'react';
import './index.css';
import App from './App';

// React 18 compatible rendering
let ReactDOM;
let createRoot;

try {
  // Try to import React 18 createRoot
  const ReactDOMClient = require('react-dom/client');
  createRoot = ReactDOMClient.createRoot;
} catch (e) {
  // Fallback to React 17 render
  ReactDOM = require('react-dom');
}

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (createRoot) {
  // React 18
  const root = createRoot(container);
  root.render(app);
} else {
  // React 17 fallback
  ReactDOM.render(app, container);
}
