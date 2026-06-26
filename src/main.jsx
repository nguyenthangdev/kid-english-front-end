import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import App from './App'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// GlobalProviders đã được loại bỏ — client pages tự fetch data qua API
// import { GlobalProviders } from './AppProviders'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </BrowserRouter>
)
