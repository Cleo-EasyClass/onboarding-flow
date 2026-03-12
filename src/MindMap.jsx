import { useEffect, useRef, useState } from 'react'

const PURPLE = '#8a6bfc'
const PINK   = '#fe69ea'
const GREEN  = '#4ade80'
const YELLOW = '#fbbf24'
const GRAY   = '#94a3b8'

// All nodes in the spider diagram
const NODES = {
  root: {
    id: 'root', label: 'Onboarding 2.0', emoji: '🎯',
    x: 0, y: 0, color: PURPLE, size: 80, ring: 0
  },

  // Ring 1 — main phases
  wizard:  { id: 'wizard',  label: 'Wizard',          emoji: '🧙', color: PURPLE, size: 60, ring: 1, angle: 210 },
  gen:     { id: 'gen',     label: 'Generation',      emoji: '⚡', color: PINK,   size: 60, ring: 1, angle: 270 },
  tour:    { id: 'tour',    label: 'Dashboard Tour',  emoji: '🎯', color: GREEN,  size: 60, ring: 1, angle: 330 },
  paywall: { id: 'paywall', label: 'Pro Paywall',     emoji: '💎', color: YELLOW, size: 60, ring: 1, angle: 30  },
  optB:    { id: 'optB',    label: 'Split Panel ✅',  emoji: '📐', color: PURPLE, size: 60, ring: 1, angle: 150 },
  lavender:{ id: 'lavender',label: 'Lavender Panel ✅',emoji:'🎨', color: PURPLE, size: 60, ring: 1, angle: 90  },

  // Wizard steps — ring 2 (left cluster)
  s1: { id: 's1', label: 'Step 1\nName',    emoji: '👤', url: 'https://files.catbox.moe/jo5v1p.png', color: PURPLE, size: 44, ring: 2, parent: 'wizard', angle: 195 },
  s2: { id: 's2', label: 'Step 2\nRole',    emoji: '🎓', url: 'https://files.catbox.moe/m7ingg.png', color: PURPLE, size: 44, ring: 2, parent: 'wizard', angle: 215 },
  s3: { id: 's3', label: 'Step 3\nGrade',   emoji: '📚', url: 'https://files.catbox.moe/1dpge0.png', color: PURPLE, size: 44, ring: 2, parent: 'wizard', angle: 235 },
  s4: { id: 's4', label: 'Step 4\nSubject', emoji: '🔬', url: 'https://files.catbox.moe/dq0uzv.png', color: PURPLE, size: 44, ring: 2, parent: 'wizard', angle: 255 },
  s5: { id: 's5', label: 'Step 5\nTopic',   emoji: '✨', url: 'https://files.catbox.moe/jls496.png', color: PURPLE, size: 44, ring: 2, parent: 'wizard', angle: 275 },

  // Tour stops — ring 2 (right cluster)
  t1: { id: 't1', label: 'Stop 1\nLP Row',   emoji: '📝', url: 'https://files.catbox.moe/rnt663.png', color: GREEN, size: 44, ring: 2, parent: 'tour', angle: 305 },
  t2: { id: 't2', label: 'Stop 2\n5 Dots',   emoji: '🔵', url: 'https://files.catbox.moe/a8uacv.png', color: GREEN, size: 44, ring: 2, parent: 'tour', angle: 325 },
  t3: { id: 't3', label: 'Stop 3\nGen All',  emoji: '⚡', url: 'https://files.catbox.moe/tma75x.png', color: GREEN, size: 44, ring: 2, parent: 'tour', angle: 345 },
  t4: { id: 't4', label: 'Stop 4\nNew LP',   emoji: '➕', url: 'https://files.catbox.moe/x3isxw.png', color: GREEN, size: 44, ring: 2, parent: 'tour', angle: 5   },
  t5: { id: 't5', label: 'Stop 5\nBoards',   emoji: '🖼️', url: 'https://files.catbox.moe/cudu30.png', color: GREEN, size: 44, ring: 2, parent: 'tour', angle: 25  },
}

const EDGES = [
  ['root','wizard'], ['root','gen'], ['root','tour'], ['root','paywall'], ['root','optB'], ['root','lavender'],
  ['wizard','s1'],['wizard','s2'],['wizard','s3'],['wizard','s4'],['wizard','s5'],
  ['s1','s2'],['s2','s3'],['s3','s4'],['s4','s5'],['s5','gen'],
  ['tour','t1'],['tour','t2'],['tour','t3'],['tour','t4'],['tour','t5'],
  ['t5','paywall'],
]

const RING_R = { 0: 0, 1: 280, 2: 520 }

function getPos(node) {
  if (node.ring === 0) return { x: 0, y: 0 }
  const r = RING_R[node.ring]
  const a = (node.angle * Math.PI) / 180
  return { x: r * Math.cos(a), y: r * Math.sin(a) }
}

// Pre-compute positions
const positions = {}
Object.values(NODES).forEach(n => { positions[n.id] = getPos(n) })

export default function MindMap() {
  const [hovered, setHovered] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [tick, setTick] = useState(0)
  const animRef = useRef()

  useEffect(() => {
    let t = 0
    const animate = () => {
      t++
      setTick(t)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const cx = 720, cy = 440  // canvas center

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a14', overflow: 'hidden' }}>

      {/* Animated SVG canvas */}
      <svg width="100%" height="100%" viewBox={`${-cx} ${-cy} ${cx*2} ${cy*2}`}
        style={{ position: 'absolute', inset: 0 }}>
        <defs>
          {/* Glow filters */}
          <filter id="glow-purple"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-pink"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-green"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>

          {/* Radial bg gradient */}
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0a2e" stopOpacity="1"/>
            <stop offset="100%" stopColor="#0a0a14" stopOpacity="1"/>
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle cx={0} cy={0} r={600} fill="url(#bg-grad)" opacity={0.6}/>

        {/* Ring guides */}
        {[1,2].map(r => (
          <circle key={r} cx={0} cy={0} r={RING_R[r]}
            fill="none" stroke="#ffffff08" strokeWidth={1} strokeDasharray="4 8"/>
        ))}

        {/* Edges */}
        {EDGES.map(([a, b]) => {
          const pa = positions[a], pb = positions[b]
          const na = NODES[a], nb = NODES[b]
          const isHighlighted = hovered === a || hovered === b
          const edgeColor = na.color
          const dashOffset = -(tick * 0.8) % 20
          return (
            <g key={`${a}-${b}`}>
              {/* Glow line */}
              <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={edgeColor} strokeWidth={isHighlighted ? 3 : 1.5}
                strokeOpacity={isHighlighted ? 0.9 : 0.3}
                strokeDasharray="8 6"
                strokeDashoffset={dashOffset}
                filter={isHighlighted ? `url(#glow-${edgeColor === PURPLE ? 'purple' : edgeColor === PINK ? 'pink' : 'green'})` : undefined}
              />
              {/* Traveling dot */}
              {isHighlighted && (
                <circle r={4} fill={edgeColor} filter="url(#glow-purple)">
                  <animateMotion dur="1.5s" repeatCount="indefinite">
                    <mpath href={`#path-${a}-${b}`}/>
                  </animateMotion>
                </circle>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {Object.values(NODES).map(node => {
          const { x, y } = positions[node.id]
          const isHov = hovered === node.id
          const r = isHov ? node.size / 2 + 6 : node.size / 2

          return (
            <g key={node.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setExpanded(expanded === node.id ? null : node.id)}
            >
              {/* Pulse ring */}
              <circle cx={x} cy={y} r={r + 10} fill="none"
                stroke={node.color} strokeWidth={1.5}
                opacity={isHov ? 0.4 : 0.1}
              />
              {/* Node circle */}
              <circle cx={x} cy={y} r={r}
                fill={node.color + '22'}
                stroke={node.color}
                strokeWidth={isHov ? 2.5 : 1.5}
                filter={`url(#glow-${node.color === PURPLE ? 'purple' : node.color === PINK ? 'pink' : 'green'})`}
              />
              {/* Emoji */}
              <text x={x} y={y + (node.ring === 0 ? 6 : 5)}
                textAnchor="middle" fontSize={node.ring === 0 ? 28 : node.ring === 1 ? 22 : 16}
                dominantBaseline="middle"
              >{node.emoji}</text>
              {/* Label */}
              {node.ring <= 1 && node.label.split('\n').map((line, li) => (
                <text key={li} x={x} y={y + r + 18 + li * 16}
                  textAnchor="middle" fontSize={node.ring === 0 ? 14 : 13}
                  fill={node.color} fontWeight="700" fontFamily="sans-serif"
                >{line}</text>
              ))}
              {node.ring === 2 && (
                <text x={x} y={y + r + 14}
                  textAnchor="middle" fontSize={11}
                  fill={node.color} fontWeight="600" fontFamily="sans-serif"
                >{node.label.split('\n')[0]}</text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Expanded screenshot panel */}
      {expanded && NODES[expanded]?.url && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#1a1a2e', border: `2px solid ${NODES[expanded].color}`,
          borderRadius: 16, padding: 16, zIndex: 100,
          boxShadow: `0 0 60px ${NODES[expanded].color}44`,
          maxWidth: '80vw',
        }} onClick={() => setExpanded(null)}>
          <div style={{ fontSize: 13, fontWeight: 700, color: NODES[expanded].color, marginBottom: 8 }}>
            {NODES[expanded].emoji} {NODES[expanded].label.replace('\n', ' ')} — click to close
          </div>
          <img src={NODES[expanded].url} style={{ maxWidth: '75vw', maxHeight: '70vh', borderRadius: 8, display: 'block' }} alt=""/>
        </div>
      )}

      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16,
        background: 'rgba(10,10,20,.85)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #ffffff12', zIndex: 50,
        fontFamily: 'sans-serif',
      }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: PURPLE }}>🎯 EasyClass Onboarding 2.0</span>
        <span style={{ fontSize: 12, color: '#4b5563' }}>|</span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>Hover to highlight connections · Click wizard/tour nodes to expand screenshots</span>
        <span style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
          {[[PURPLE,'Wizard'],[PINK,'Generation'],[GREEN,'Tour'],[YELLOW,'Paywall']].map(([c,l]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }}/>
              <span style={{ color: '#94a3b8' }}>{l}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hint */}
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        fontSize: 12, color: '#4b5563', background: '#1a1a2e',
        padding: '6px 16px', borderRadius: 20, fontFamily: 'sans-serif',
      }}>
        💡 Click any step or tour stop to see the full screenshot
      </div>
    </div>
  )
}
