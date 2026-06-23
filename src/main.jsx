import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { GlobalProviders } from './AppProviders'
import App from './App'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GlobalProviders>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </GlobalProviders>
  </BrowserRouter>
)
