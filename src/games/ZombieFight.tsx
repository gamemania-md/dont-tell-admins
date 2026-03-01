import { useEffect, useRef, useCallback } from 'react'

interface Entity {
  x: number
  y: number
  radius: number
  speed: number
}

interface Player extends Entity {
  health: number
  maxHealth: number
  damageTimer: number
}

interface Zombie extends Entity {
  hp: number
  maxHp: number
  type: 'normal' | 'fast' | 'tank'
}

interface Bullet extends Entity {
  dx: number
  dy: number
}

interface GameState {
  player: Player
  zombies: Zombie[]
  bullets: Bullet[]
  score: number
  wave: number
  zombiesLeftInWave: number
  spawnTimer: number
  gameOver: boolean
  paused: boolean
  keys: Set<string>
  mouse: { x: number; y: number }
  screenShake: number
  particles: Particle[]
}

interface Particle {
  x: number
  y: number
  dx: number
  dy: number
  life: number
  maxLife: number
  color: string
  radius: number
}

export default function ZombieFight() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState | null>(null)
  const animFrameRef = useRef<number>(0)

  const createInitialState = useCallback((w: number, h: number): GameState => ({
    player: {
      x: w / 2,
      y: h / 2,
      radius: 18,
      speed: 4,
      health: 100,
      maxHealth: 100,
      damageTimer: 0,
    },
    zombies: [],
    bullets: [],
    score: 0,
    wave: 1,
    zombiesLeftInWave: 5,
    spawnTimer: 0,
    gameOver: false,
    paused: false,
    keys: new Set(),
    mouse: { x: w / 2, y: h / 2 },
    screenShake: 0,
    particles: [],
  }), [])

  const spawnZombie = useCallback((state: GameState, w: number, h: number) => {
    const side = Math.floor(Math.random() * 4)
    let x: number, y: number

    switch (side) {
      case 0: x = Math.random() * w; y = -30; break
      case 1: x = w + 30; y = Math.random() * h; break
      case 2: x = Math.random() * w; y = h + 30; break
      default: x = -30; y = Math.random() * h; break
    }

    const roll = Math.random()
    const waveBonus = state.wave * 0.1

    let type: Zombie['type'] = 'normal'
    let hp = 2
    let speed = 1.2 + waveBonus
    let radius = 16

    if (roll > 0.85 && state.wave >= 2) {
      type = 'tank'
      hp = 5
      speed = 0.8 + waveBonus * 0.5
      radius = 24
    } else if (roll > 0.65 && state.wave >= 2) {
      type = 'fast'
      hp = 1
      speed = 2.2 + waveBonus
      radius = 12
    }

    state.zombies.push({ x, y, radius, speed, hp, maxHp: hp, type })
  }, [])

  const addParticles = useCallback((state: GameState, x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 3
      state.particles.push({
        x, y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        life: 20 + Math.random() * 20,
        maxLife: 40,
        color,
        radius: 2 + Math.random() * 3,
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    resize()

    const state = createInitialState(canvas.width, canvas.height)
    stateRef.current = state

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const key = e.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault()
        if (down) state.keys.add(key); else state.keys.delete(key)
      }
      if (key === ' ' && down && state.gameOver) {
        Object.assign(state, createInitialState(canvas.width, canvas.height))
        state.keys = new Set()
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      state.mouse.x = e.clientX - rect.left
      state.mouse.y = e.clientY - rect.top
    }

    const shootCooldownRef = { value: 0 }

    const onMouseDown = (e: MouseEvent) => {
      if (state.gameOver) {
        Object.assign(state, createInitialState(canvas.width, canvas.height))
        state.keys = new Set()
        return
      }
      if (shootCooldownRef.value > 0) return

      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      const angle = Math.atan2(my - state.player.y, mx - state.player.x)
      state.bullets.push({
        x: state.player.x,
        y: state.player.y,
        radius: 4,
        speed: 8,
        dx: Math.cos(angle) * 8,
        dy: Math.sin(angle) * 8,
      })
      shootCooldownRef.value = 8
    }

    window.addEventListener('keydown', (e) => onKey(e, true))
    window.addEventListener('keyup', (e) => onKey(e, false))
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('resize', resize)

    const drawGrid = (w: number, h: number) => {
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.06)'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
    }

    const drawPlayer = (p: Player) => {
      ctx.save()

      // Glow
      ctx.shadowColor = '#22c55e'
      ctx.shadowBlur = 15

      // Body
      ctx.fillStyle = p.damageTimer > 0 ? '#ff4444' : '#22c55e'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0

      // Eyes - look toward mouse
      const angle = Math.atan2(state.mouse.y - p.y, state.mouse.x - p.x)
      const eyeDist = 6
      const eyeOffset = 5

      for (const side of [-1, 1]) {
        const perpAngle = angle + (Math.PI / 2) * side
        const ex = p.x + Math.cos(angle) * eyeDist + Math.cos(perpAngle) * eyeOffset
        const ey = p.y + Math.sin(angle) * eyeDist + Math.sin(perpAngle) * eyeOffset
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(ex, ey, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(ex + Math.cos(angle) * 2, ey + Math.sin(angle) * 2, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const drawZombie = (z: Zombie) => {
      ctx.save()

      const colors = {
        normal: { body: '#9333ea', glow: '#a855f7' },
        fast: { body: '#dc2626', glow: '#ef4444' },
        tank: { body: '#7c2d12', glow: '#ea580c' },
      }
      const c = colors[z.type]

      ctx.shadowColor = c.glow
      ctx.shadowBlur = 10

      ctx.fillStyle = c.body
      ctx.beginPath()
      ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0

      // Angry eyes
      const angle = Math.atan2(state.player.y - z.y, state.player.x - z.x)
      for (const side of [-1, 1]) {
        const perpAngle = angle + (Math.PI / 2) * side
        const ex = z.x + Math.cos(angle) * (z.radius * 0.3) + Math.cos(perpAngle) * (z.radius * 0.25)
        const ey = z.y + Math.sin(angle) * (z.radius * 0.3) + Math.sin(perpAngle) * (z.radius * 0.25)
        ctx.fillStyle = '#ff0'
        ctx.beginPath()
        ctx.arc(ex, ey, z.radius * 0.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(ex + Math.cos(angle) * 1, ey + Math.sin(angle) * 1, z.radius * 0.1, 0, Math.PI * 2)
        ctx.fill()
      }

      // HP bar
      if (z.hp < z.maxHp) {
        const barW = z.radius * 2
        const barH = 4
        const barX = z.x - barW / 2
        const barY = z.y - z.radius - 10
        ctx.fillStyle = '#333'
        ctx.fillRect(barX, barY, barW, barH)
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(barX, barY, barW * (z.hp / z.maxHp), barH)
      }

      ctx.restore()
    }

    const drawBullet = (b: Bullet) => {
      ctx.save()
      ctx.shadowColor = '#facc15'
      ctx.shadowBlur = 8
      ctx.fillStyle = '#facc15'
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawHUD = (w: number) => {
      // Health bar
      const barW = 200
      const barH = 16
      const barX = 20
      const barY = 20
      const hpRatio = state.player.health / state.player.maxHealth

      ctx.fillStyle = '#1a1a2e'
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(barX, barY, barW, barH, 8)
      ctx.fill()
      ctx.stroke()

      const gradient = ctx.createLinearGradient(barX, 0, barX + barW * hpRatio, 0)
      gradient.addColorStop(0, '#22c55e')
      gradient.addColorStop(1, hpRatio > 0.3 ? '#16a34a' : '#ef4444')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(barX, barY, barW * hpRatio, barH, 8)
      ctx.fill()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(`${Math.ceil(state.player.health)} HP`, barX + barW / 2, barY + 12)

      // Score + Wave
      ctx.textAlign = 'right'
      ctx.font = 'bold 20px system-ui'
      ctx.fillStyle = '#facc15'
      ctx.fillText(`Score: ${state.score}`, w - 20, 35)
      ctx.font = 'bold 14px system-ui'
      ctx.fillStyle = '#a855f7'
      ctx.fillText(`Wave ${state.wave}`, w - 20, 55)
    }

    const drawGameOver = (w: number, h: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, w, h)

      ctx.textAlign = 'center'

      ctx.save()
      ctx.shadowColor = '#ef4444'
      ctx.shadowBlur = 20
      ctx.font = 'bold 60px system-ui'
      ctx.fillStyle = '#ef4444'
      ctx.fillText('GAME OVER', w / 2, h / 2 - 40)
      ctx.restore()

      ctx.font = 'bold 24px system-ui'
      ctx.fillStyle = '#facc15'
      ctx.fillText(`Score: ${state.score}  |  Wave: ${state.wave}`, w / 2, h / 2 + 10)

      ctx.font = '18px system-ui'
      ctx.fillStyle = '#888'
      ctx.fillText('Click or press Space to play again', w / 2, h / 2 + 50)
    }

    const drawParticles = () => {
      for (const p of state.particles) {
        ctx.globalAlpha = p.life / p.maxLife
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * (p.life / p.maxLife), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)

    const loop = () => {
      const w = canvas.width
      const h = canvas.height

      if (!state.gameOver) {
        // Move player
        const p = state.player
        let dx = 0, dy = 0
        if (state.keys.has('w') || state.keys.has('arrowup')) dy -= 1
        if (state.keys.has('s') || state.keys.has('arrowdown')) dy += 1
        if (state.keys.has('a') || state.keys.has('arrowleft')) dx -= 1
        if (state.keys.has('d') || state.keys.has('arrowright')) dx += 1

        if (dx !== 0 && dy !== 0) {
          dx *= 0.707; dy *= 0.707
        }
        p.x = Math.max(p.radius, Math.min(w - p.radius, p.x + dx * p.speed))
        p.y = Math.max(p.radius, Math.min(h - p.radius, p.y + dy * p.speed))

        if (p.damageTimer > 0) p.damageTimer--

        // Shoot cooldown
        if (shootCooldownRef.value > 0) shootCooldownRef.value--

        // Spawn zombies
        state.spawnTimer++
        const spawnRate = Math.max(20, 60 - state.wave * 5)
        if (state.spawnTimer >= spawnRate && state.zombiesLeftInWave > 0) {
          spawnZombie(state, w, h)
          state.zombiesLeftInWave--
          state.spawnTimer = 0
        }

        // Check wave complete
        if (state.zombiesLeftInWave <= 0 && state.zombies.length === 0) {
          state.wave++
          state.zombiesLeftInWave = 5 + state.wave * 3
          state.player.health = Math.min(state.player.maxHealth, state.player.health + 20)
          addParticles(state, p.x, p.y, '#22c55e', 20)
        }

        // Move bullets
        state.bullets = state.bullets.filter((b) => {
          b.x += b.dx
          b.y += b.dy
          return b.x > -10 && b.x < w + 10 && b.y > -10 && b.y < h + 10
        })

        // Move zombies + check collisions
        for (let i = state.zombies.length - 1; i >= 0; i--) {
          const z = state.zombies[i]
          const angle = Math.atan2(p.y - z.y, p.x - z.x)
          z.x += Math.cos(angle) * z.speed
          z.y += Math.sin(angle) * z.speed

          // Bullet hit
          for (let j = state.bullets.length - 1; j >= 0; j--) {
            if (dist(z, state.bullets[j]) < z.radius + state.bullets[j].radius) {
              z.hp--
              addParticles(state, state.bullets[j].x, state.bullets[j].y, '#facc15', 5)
              state.bullets.splice(j, 1)
              if (z.hp <= 0) {
                state.score += z.type === 'tank' ? 30 : z.type === 'fast' ? 15 : 10
                addParticles(state, z.x, z.y, z.type === 'tank' ? '#ea580c' : '#a855f7', 12)
                state.zombies.splice(i, 1)
                state.screenShake = 5
              }
              break
            }
          }

          // Player hit
          if (i < state.zombies.length && dist(z, p) < z.radius + p.radius) {
            if (p.damageTimer <= 0) {
              p.health -= z.type === 'tank' ? 20 : z.type === 'fast' ? 8 : 12
              p.damageTimer = 30
              state.screenShake = 8
              addParticles(state, p.x, p.y, '#ef4444', 8)
              if (p.health <= 0) {
                p.health = 0
                state.gameOver = true
              }
            }
          }
        }

        // Update particles
        state.particles = state.particles.filter((p) => {
          p.x += p.dx
          p.y += p.dy
          p.dx *= 0.95
          p.dy *= 0.95
          p.life--
          return p.life > 0
        })

        if (state.screenShake > 0) state.screenShake--
      }

      // Draw
      ctx.save()

      if (state.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.screenShake * 2
        const shakeY = (Math.random() - 0.5) * state.screenShake * 2
        ctx.translate(shakeX, shakeY)
      }

      ctx.fillStyle = '#0d0d1a'
      ctx.fillRect(-5, -5, w + 10, h + 10)

      drawGrid(w, h)
      drawParticles()

      for (const b of state.bullets) drawBullet(b)
      for (const z of state.zombies) drawZombie(z)
      drawPlayer(state.player)
      drawHUD(w)

      if (state.gameOver) drawGameOver(w, h)

      // Start screen hint
      if (!state.gameOver && state.score === 0 && state.zombies.length === 0 && state.wave === 1) {
        ctx.textAlign = 'center'
        ctx.font = '16px system-ui'
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillText('WASD / Arrow Keys to move  •  Click to shoot', w / 2, h - 40)
      }

      ctx.restore()

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('keydown', (e) => onKey(e, true))
      window.removeEventListener('keyup', (e) => onKey(e, false))
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('resize', resize)
    }
  }, [createInitialState, spawnZombie, addParticles])

  return (
    <canvas
      ref={canvasRef}
      className="zombie-canvas"
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
    />
  )
}
