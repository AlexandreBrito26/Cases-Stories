import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/special-elite/latin-400.css'
import '@fontsource/newsreader/latin-400.css'
import '@fontsource/newsreader/latin-600.css'
import '@fontsource/newsreader/latin-400-italic.css'
import './styles.css'
import App from './App'

// D5: registra o service worker só na versão publicada (build), não no desenvolvimento.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => null))
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
