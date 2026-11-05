import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './styles.css'
import { BrowserRouter as Router } from 'react-router-dom'
import MainRouter from '../MainRouter.jsx'

function App() {

  return (
    <Router>
      <MainRouter />
    </Router>
  )
}

export default App
