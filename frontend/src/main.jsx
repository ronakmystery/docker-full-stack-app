import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


 // Register Service Worker
 let registration = await navigator.serviceWorker.register("/sw.js");
 console.log("Service Worker Registered!",registration);

 

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>
)
