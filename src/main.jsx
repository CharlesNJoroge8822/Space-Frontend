import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>

<GoogleOAuthProvider clientId="788323417243-i9hmnobo7otrd1plan9lu3q9mqibq8qh.apps.googleusercontent.com">

<GoogleOAuthProvider clientId="237814971706-mhjbkrji361igblgu701f5vv53rl5sde.apps.googleusercontent.com">
      <App />
</GoogleOAuthProvider>
  </StrictMode>,
)
