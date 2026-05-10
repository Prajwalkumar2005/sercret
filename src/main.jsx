import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ============================================================================
// ENTRY POINT: src/main.jsx
// ============================================================================
// This is the React application entry point that bootstraps the entire app.
// It mounts the App component to the DOM at #root (defined in index.html)
// ============================================================================

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
