import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>

<GoogleOAuthProvider clientId="237814971706-tn2hf81nue3fi42ejb876hpkulr78g94.apps.googleusercontent.com">
      <App />
</GoogleOAuthProvider>
  </StrictMode>
)
