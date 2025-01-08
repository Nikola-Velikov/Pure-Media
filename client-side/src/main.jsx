import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HighlightProvider } from './contexts/HighlightContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <HighlightProvider>
    <App />
    </HighlightProvider>
  </BrowserRouter>,
)
