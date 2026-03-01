import type { GameSite } from '../data/games'

interface GameCardProps {
  game: GameSite
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <a
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      className="game-card"
    >
      <div className="game-card-emoji">{game.emoji}</div>
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-desc">{game.description}</p>
        <div className="game-card-tags">
          {game.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  )
}
