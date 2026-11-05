import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './acessibilidade.js'
import App from './app.jsx'
import './estilos.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
