import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { DatabaseProvider } from './context/DatabaseContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DatabaseProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DatabaseProvider>
  </React.StrictMode>,
)