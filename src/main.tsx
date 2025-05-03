import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if authentication is enabled
const USE_AUTH = import.meta.env.VITE_USE_AUTH === 'true'

// Only log in development
if (import.meta.env.DEV) {
  console.log('Authentication enabled:', USE_AUTH)
  if (USE_AUTH) {
    console.log('Clerk Key:', PUBLISHABLE_KEY ? 'Provided' : 'Missing')
  }
}

// Only require the key if authentication is enabled
if (USE_AUTH && !PUBLISHABLE_KEY) {
  throw new Error("Authentication is enabled but Publishable Key is missing")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {USE_AUTH ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
