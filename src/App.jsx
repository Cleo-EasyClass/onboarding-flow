import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const SCREENS = [
  { key: 'wiz1', url: 'https://files.catbox.moe/jo5v1p.png', label: 'Step 1 — Name',    row: 0, col: 0 },
  { key: 'wiz2', url: 'https://files.catbox.moe/m7ingg.png', label: 'Step 2 — Role',    row: 0, col: 1 },
  { key: 'wiz3', url: 'https://files.catbox.moe/1dpge0.png', label: 'Step 3 — Grade',   row: 0, col: 2 },
  { key: 'wiz4', url: 'https://files.catbox.moe/dq0uzv.png', label: 'Step 4 — Subject', row: 0, col: 3 },
  { key: 'wiz5', url: 'https://files.catbox.moe/jls496.png', label: 'Step 5 — Topic',   row: 0, col: 4 },
  { key: 'gen',  url: 'https://files.catbox.moe/2f2yzj.png', label: '⚡ Generating',    row: 0, col: 5 },
  { key: 't1',   url: 'https://files.catbox.moe/rnt663.png', label: 'Tour 1 — LP Row',  row: 1, col: 0 },
  { key: 't2',   url: 'https://files.catbox.moe/a8uacv.png', label: 'Tour 2 — 5 Dots',  row: 1, col: 1 },
  { key: 't3',   url: 'https://files.catbox.moe/tma75x.png', label: 'Tour 3 — Gen All', row: 1, col: 2 },
  { key: 't4',   url: 'https://files.catbox.moe/x3isxw.png', label: 'Tour 4 — New LP',  row: 1, col: 3 },
  { key: 't5',   url: 'https://files.catbox.moe/cudu30.png', label: 'Tour 5 — Boards',  row: 1, col: 4 },
]

const W = 480, H = 300, GAP_X = 60, GAP_Y = 200
const MARGIN_X = 200, MARGIN_Y = 200, ROW2_OFFSET = 100

function screenPos(row, col) {
  return {
    x: MARGIN_X + (row === 1 ? ROW2_OFFSET : 0) + col * (W + GAP_X),
    y: MARGIN_Y + row * (H + GAP_Y),
  }
}

async function buildCanvas(editor) {
  const shapes = []

  // Section labels
  shapes.push({
    id: 'shape:lbl-wizard',
    type: 'text', x: MARGIN_X, y: MARGIN_Y - 70,
    props: { text: '🧙  Onboarding Wizard — 5 Steps  →  Generation', size: 'xl', font: 'sans', align: 'start', color: 'violet', autoSize: true }
  })
  shapes.push({
    id: 'shape:lbl-tour',
    type: 'text', x: MARGIN_X + ROW2_OFFSET, y: MARGIN_Y + H + GAP_Y - 70,
    props: { text: '🎯  Dashboard Tour — 5 Stops  →  Pro Paywall', size: 'xl', font: 'sans', align: 'start', color: 'green', autoSize: true }
  })

  // Images — use direct https:// URLs (tldraw rejects blob: URLs)
  for (const s of SCREENS) {
    const { x, y } = screenPos(s.row, s.col)
    const color = s.row === 0 ? 'violet' : 'green'

    const assetId = `asset:${s.key}`

    editor.createAssets([{
      id: assetId,
      type: 'image',
      typeName: 'asset',
      props: { src: s.url, w: 1440, h: 900, name: s.key, mimeType: 'image/png', isAnimated: false },
      meta: {}
    }])

    shapes.push({
      id: `shape:img-${s.key}`,
      type: 'image', x, y,
      props: { w: W, h: H, assetId, crop: null }
    })

    shapes.push({
      id: `shape:txt-${s.key}`,
      type: 'text',
      x: x + W / 2 - 100,
      y: y + H + 8,
      props: { text: s.label, size: 'm', font: 'sans', align: 'middle', color, autoSize: true }
    })
  }

  // Wizard arrows →
  for (let c = 0; c < 5; c++) {
    const a = screenPos(0, c), b = screenPos(0, c + 1)
    shapes.push({
      id: `shape:aw-${c}`, type: 'arrow', x: 0, y: 0,
      props: {
        start: { type: 'point', x: a.x + W + 4, y: a.y + H / 2 },
        end:   { type: 'point', x: b.x - 4,     y: b.y + H / 2 },
        color: 'violet', size: 'm', arrowheadEnd: 'arrow', arrowheadStart: 'none', bend: 0, dash: 'solid',
      }
    })
  }

  // Drop arrow gen → tour
  const gen = screenPos(0, 5), t1 = screenPos(1, 0)
  shapes.push({
    id: 'shape:drop', type: 'arrow', x: 0, y: 0,
    props: {
      start: { type: 'point', x: gen.x + W / 2, y: gen.y + H + 4 },
      end:   { type: 'point', x: t1.x + W / 2,  y: t1.y - 4 },
      color: 'pink', size: 'm', arrowheadEnd: 'arrow', arrowheadStart: 'none', bend: -40, dash: 'dashed',
    }
  })

  // Tour arrows →
  for (let c = 0; c < 4; c++) {
    const a = screenPos(1, c), b = screenPos(1, c + 1)
    shapes.push({
      id: `shape:at-${c}`, type: 'arrow', x: 0, y: 0,
      props: {
        start: { type: 'point', x: a.x + W + 4, y: a.y + H / 2 },
        end:   { type: 'point', x: b.x - 4,     y: b.y + H / 2 },
        color: 'green', size: 'm', arrowheadEnd: 'arrow', arrowheadStart: 'none', bend: 0, dash: 'solid',
      }
    })
  }

  // Pro paywall note
  const t5 = screenPos(1, 4)
  shapes.push({
    id: 'shape:paywall', type: 'text',
    x: t5.x + W + GAP_X, y: t5.y + H / 2 - 20,
    props: { text: '→  💎 Pro Paywall', size: 'xl', font: 'sans', align: 'start', color: 'yellow', autoSize: true }
  })

  editor.createShapes(shapes)
  editor.zoomToFit({ animation: { duration: 800 } })
}

export default function App() {
  function handleMount(editor) {
    buildCanvas(editor).catch(console.error)
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw onMount={handleMount} inferDarkMode />
    </div>
  )
}
