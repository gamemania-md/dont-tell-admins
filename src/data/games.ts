export interface GameSite {
  name: string
  description: string
  url: string
  emoji: string
  tags: string[]
}

export const gameSites: GameSite[] = [
  {
    name: 'CoolMathGames',
    description: 'Classic browser games — puzzles, strategy, and more. Teacher-approved!',
    url: 'https://www.coolmathgames.com',
    emoji: '🧮',
    tags: ['Puzzle', 'Strategy'],
  },
  {
    name: 'Poki',
    description: 'Huge collection of free online games. New games added daily.',
    url: 'https://poki.com',
    emoji: '🕹️',
    tags: ['Arcade', 'Action'],
  },
  {
    name: 'Krunker.io',
    description: 'Fast-paced browser FPS. No download needed.',
    url: 'https://krunker.io',
    emoji: '🔫',
    tags: ['FPS', 'Multiplayer'],
  },
  {
    name: '1v1.LOL',
    description: 'Build and shoot — like Fortnite but in your browser.',
    url: 'https://1v1.lol',
    emoji: '🏗️',
    tags: ['Shooter', 'Building'],
  },
  {
    name: 'Slope',
    description: 'Roll a ball down an endless slope. Simple but addictive.',
    url: 'https://slope-game.github.io',
    emoji: '⚽',
    tags: ['Arcade', 'Endless'],
  },
  {
    name: 'Shell Shockers',
    description: 'Egg-themed multiplayer FPS. Crack your enemies!',
    url: 'https://shellshock.io',
    emoji: '🥚',
    tags: ['FPS', 'Multiplayer'],
  },
  {
    name: 'Paper.io 2',
    description: 'Claim territory by drawing shapes. Don\'t get cut off!',
    url: 'https://paper-io.com',
    emoji: '📄',
    tags: ['IO', 'Strategy'],
  },
  {
    name: 'Retro Bowl',
    description: 'Retro-style American football management game.',
    url: 'https://retrobowl.app',
    emoji: '🏈',
    tags: ['Sports', 'Retro'],
  },
  {
    name: 'Google Dino',
    description: 'The classic Chrome dinosaur game — no wifi needed!',
    url: 'https://chromedino.com',
    emoji: '🦕',
    tags: ['Arcade', 'Classic'],
  },
  {
    name: 'Wordle',
    description: 'Guess the 5-letter word in 6 tries. Daily challenge!',
    url: 'https://www.nytimes.com/games/wordle',
    emoji: '🔤',
    tags: ['Puzzle', 'Word'],
  },
]
