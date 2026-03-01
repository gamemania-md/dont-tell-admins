import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard'
import { gameSites } from '../data/games'

export default function Games() {
  return (
    <div className="games-page">
      <h1 className="page-title">Games</h1>

      <h2 className="section-title">Built-in Games</h2>
      <p className="page-subtitle">These work even if external sites are blocked</p>
      <div className="games-grid">
        <Link to="/play/zombie-fight" className="game-card builtin-card">
          <div className="game-card-emoji">🧟</div>
          <div className="game-card-content">
            <h3 className="game-card-title">Zombie Fight</h3>
            <p className="game-card-desc">Survive waves of zombies! Move with WASD, click to shoot.</p>
            <div className="game-card-tags">
              <span className="tag tag-builtin">Built-in</span>
              <span className="tag">Shooter</span>
              <span className="tag">Survival</span>
            </div>
          </div>
        </Link>
      </div>

      <h2 className="section-title">External Game Sites</h2>
      <p className="page-subtitle">Click any card to open the game in a new tab</p>
      <div className="games-grid">
        {gameSites.map((game) => (
          <GameCard key={game.name} game={game} />
        ))}
      </div>
    </div>
  )
}
