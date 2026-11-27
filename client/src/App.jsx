import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './styles.css'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from '../MainRouter.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </AuthProvider>
    // <Router>
    //   <MainRouter />
    // </Router>
  )
}

export default App
