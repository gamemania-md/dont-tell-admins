import { Link } from 'react-router-dom'
import ZombieFight from '../games/ZombieFight'

export default function Play() {
  return (
    <div className="play-page">
      <div className="play-header">
        <Link to="/games" className="back-btn">← Back to Games</Link>
        <h1 className="play-title">Zombie Fight</h1>
      </div>
      <div className="play-container">
        <ZombieFight />
      </div>
    </div>
  )
}
