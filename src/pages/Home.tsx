import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">
          <span className="glow">DTS</span>
        </h1>
        <p className="hero-subtitle">Don't Tell Admins</p>
        <p className="hero-desc">
          Your secret hub for games during free time. Bookmark it. Guard it. Enjoy it.
        </p>
      </section>

      <section className="home-cards">
        <Link to="/games" className="home-card">
          <span className="home-card-icon">🎮</span>
          <h2>Games</h2>
          <p>Browse our curated list of the best browser games</p>
        </Link>
        <Link to="/about" className="home-card">
          <span className="home-card-icon">👥</span>
          <h2>About Us</h2>
          <p>Meet the legends who built this site</p>
        </Link>
      </section>
    </div>
  )
}
