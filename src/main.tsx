import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/special-elite/latin-400.css'
import '@fontsource/newsreader/latin-400.css'
import '@fontsource/newsreader/latin-600.css'
import '@fontsource/newsreader/latin-400-italic.css'
import './styles.css'
import App from './App'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
