import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Games from './pages/Games'
import About from './pages/About'
import Play from './pages/Play'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/about" element={<About />} />
          <Route path="/play/zombie-fight" element={<Play />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
