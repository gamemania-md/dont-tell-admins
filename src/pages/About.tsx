interface Creator {
  name: string
  role: string
  bio: string
  emoji: string
}

const creators: Creator[] = [
  {
    name: 'Your Name Here',
    role: 'Founder & Developer',
    bio: 'The mastermind behind DTS. Built this so we could game in peace.',
    emoji: '😎',
  },
  {
    name: 'Friend #1',
    role: 'Co-Creator',
    bio: 'Helped find the best game sites and tested everything.',
    emoji: '🤝',
  },
  {
    name: 'Friend #2',
    role: 'Design Advisor',
    bio: 'Made sure the site looks cool and works on every device.',
    emoji: '🎨',
  },
]

export default function About() {
  return (
    <div className="about-page">
      <h1 className="page-title">About DTS</h1>
      <p className="page-subtitle">
        DTS (Don't Tell Admins) was created by students who just wanted a chill
        place to find games during free time. No ads, no tracking, just vibes.
      </p>

      <h2 className="section-title">The Creators</h2>
      <div className="creators-grid">
        {creators.map((creator) => (
          <div key={creator.name} className="creator-card">
            <div className="creator-emoji">{creator.emoji}</div>
            <h3>{creator.name}</h3>
            <p className="creator-role">{creator.role}</p>
            <p className="creator-bio">{creator.bio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
