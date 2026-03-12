import { useEffect, useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { SECTIONS, W_DEFAULT, H_DEFAULT, GAP_X, GAP_Y, SECTION_HEADER_H } from './scene-data'
import MindMap from './MindMap'

const PURPLE = '#8a6bfc'
const PINK   = '#fe69ea'

async function urlToDataURL(url) {
  const resp = await fetch(url)
  const blob = await resp.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

function hashId(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i)
  return Math.abs(h).toString(16).padStart(8, '0')
}

async function buildScene(onProgress) {
  const elements = []
  const files = {}
  let eid = 1
  const id = () => `el-${eid++}`

  for (const section of SECTIONS) {
    const sx = section.x
    const sy = section.y
    const color = section.color

    elements.push({
      id: id(), type: 'rectangle',
      x: sx - 30, y: sy - 20, width: 3200, height: 60,
      strokeColor: 'transparent', backgroundColor: color + '18', fillStyle: 'solid',
      strokeWidth: 0, roughness: 0, opacity: 80,
      groupIds: [], frameId: null, roundness: { type: 3, value: 10 },
      seed: 1, version: 1, isDeleted: false, angle: 0,
      boundElements: [], updated: 1, link: null, locked: false,
    })
    elements.push({
      id: id(), type: 'text', x: sx, y: sy, width: 1200, height: 36,
      text: section.title, fontSize: 28, fontFamily: 1,
      textAlign: 'left', verticalAlign: 'top', containerId: null,
      strokeColor: color, backgroundColor: 'transparent', fillStyle: 'solid',
      strokeWidth: 1, strokeStyle: 'solid', roughness: 0, opacity: 100,
      groupIds: [], frameId: null, roundness: null,
      seed: 1, version: 1, isDeleted: false, angle: 0,
      boundElements: [], updated: 1, link: null, locked: false,
      originalText: section.title, lineHeight: 1.25, autoResize: true,
    })
    elements.push({
      id: id(), type: 'text', x: sx, y: sy + 36, width: 1200, height: 20,
      text: section.subtitle, fontSize: 16, fontFamily: 1,
      textAlign: 'left', verticalAlign: 'top', containerId: null,
      strokeColor: '#6b7280', backgroundColor: 'transparent', fillStyle: 'solid',
      strokeWidth: 1, strokeStyle: 'solid', roughness: 0, opacity: 100,
      groupIds: [], frameId: null, roundness: null,
      seed: 1, version: 1, isDeleted: false, angle: 0,
      boundElements: [], updated: 1, link: null, locked: false,
      originalText: section.subtitle, lineHeight: 1.25, autoResize: true,
    })

    const rowY = sy + SECTION_HEADER_H
    let rowIdx = 0
    const positions = []

    for (const row of section.rows) {
      let colX = sx
      for (let ci = 0; ci < row.length; ci++) {
        const item = row[ci]
        if (!item) { colX += W_DEFAULT + GAP_X; continue }
        const w = item.w || W_DEFAULT, h = item.h || H_DEFAULT
        const imgX = colX, imgY = rowY + rowIdx * (H_DEFAULT + GAP_Y + 40)
        positions.push({ x: imgX, y: imgY, w, h, idx: ci })

        onProgress(`Loading: ${item.id}`)
        try {
          const dataURL = await urlToDataURL(item.url)
          const fileId = hashId(item.id)
          files[fileId] = { mimeType: 'image/png', id: fileId, dataURL, created: Date.now(), lastRetrieved: Date.now() }
          elements.push({
            id: id(), type: 'image', x: imgX, y: imgY, width: w, height: h,
            fileId, scale: [1, 1], status: 'saved',
            strokeColor: color, backgroundColor: 'transparent', fillStyle: 'solid',
            strokeWidth: 2, strokeStyle: 'solid', roughness: 0, opacity: 100,
            groupIds: [], frameId: null, roundness: null,
            seed: 1, version: 1, isDeleted: false, angle: 0,
            boundElements: [], updated: 1, link: null, locked: false,
          })
          const labelText = item.label + (item.tag ? `\n[${item.tag}]` : '')
          elements.push({
            id: id(), type: 'text', x: imgX, y: imgY + h + 8, width: w, height: 30,
            text: labelText, fontSize: 15, fontFamily: 1,
            textAlign: 'center', verticalAlign: 'top', containerId: null,
            strokeColor: item.tag?.includes('LOCKED') ? '#4ade80' : item.tag?.includes('REJECTED') ? '#ef4444' : item.tag?.includes('PROPOSED') ? '#f59e0b' : color,
            backgroundColor: 'transparent', fillStyle: 'solid',
            strokeWidth: 1, strokeStyle: 'solid', roughness: 0, opacity: 100,
            groupIds: [], frameId: null, roundness: null,
            seed: 1, version: 1, isDeleted: false, angle: 0,
            boundElements: [], updated: 1, link: null, locked: false,
            originalText: labelText, lineHeight: 1.25, autoResize: true,
          })
        } catch (e) { console.warn(`Failed: ${item.id}`, e) }

        colX += (item.w || W_DEFAULT) + GAP_X
      }
      rowIdx++
    }

    if (section.arrows && positions.length > 0) {
      for (const [from, to] of section.arrows) {
        const a = positions.find(p => p.idx === from), b = positions.find(p => p.idx === to)
        if (!a || !b) continue
        elements.push({
          id: id(), type: 'arrow', x: 0, y: 0, width: 0, height: 0,
          points: [[a.x + a.w + 4, a.y + a.h / 2], [b.x - 4, b.y + b.h / 2]],
          strokeColor: section.arrowColor || color,
          backgroundColor: 'transparent', fillStyle: 'solid',
          strokeWidth: 2.5, strokeStyle: 'solid', roughness: 0, opacity: 75,
          groupIds: [], frameId: null, roundness: { type: 2 },
          seed: 1, version: 1, isDeleted: false, angle: 0,
          startArrowhead: null, endArrowhead: 'arrow',
          boundElements: [], updated: 1, link: null, locked: false,
          startBinding: null, endBinding: null,
          lastCommittedPoint: null, startPoint: null, endPoint: null,
        })
      }
    }
  }
  return { elements, files }
}

const TABS = [
  { id: 'mindmap',  label: '🕸️ Mind Map',   desc: 'Animated spider view' },
  { id: 'canvas',   label: '🗂️ All Screens', desc: 'Every screenshot organized' },
]

export default function App() {
  const [tab, setTab] = useState('mindmap')
  const [initialData, setInitialData] = useState(null)
  const [progress, setProgress] = useState('Initializing...')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  function loadCanvas() {
    if (loaded) return
    setLoading(true)
    buildScene(setProgress)
      .then(({ elements, files }) => {
        setInitialData({ elements, files, appState: { viewBackgroundColor: '#141414', theme: 'dark' } })
        setLoading(false)
        setLoaded(true)
      })
      .catch(console.error)
  }

  useEffect(() => { if (tab === 'canvas') loadCanvas() }, [tab])

  return (
    <div style={{ position: 'fixed', inset: 0, fontFamily: 'sans-serif' }}>

      {/* Tab bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 52, zIndex: 200,
        background: 'rgba(10,10,20,.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #ffffff14',
        display: 'flex', alignItems: 'center', gap: 4, padding: '0 20px',
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: PURPLE, marginRight: 12 }}>
          🎯 EasyClass Onboarding 2.0
        </span>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: tab === t.id ? PURPLE : 'transparent',
            color: tab === t.id ? 'white' : '#6b7280',
            fontWeight: 700, fontSize: 13, transition: 'all .15s',
          }}>
            {t.label}
          </button>
        ))}
        <span style={{ marginLeft: 8, fontSize: 11, color: '#4b5563' }}>
          {TABS.find(t => t.id === tab)?.desc}
        </span>
      </div>

      {/* Content */}
      <div style={{ position: 'fixed', top: 52, left: 0, right: 0, bottom: 0 }}>
        {tab === 'mindmap' && <MindMap />}

        {tab === 'canvas' && loading && (
          <div style={{
            position: 'absolute', inset: 0, background: '#141414',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16, color: PURPLE,
          }}>
            <div style={{ fontSize: 36 }}>🗂️</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Loading all screenshots...</div>
            <div style={{ fontSize: 13, color: '#94a3b8', maxWidth: 360, textAlign: 'center' }}>{progress}</div>
            <div style={{ width: 280, height: 4, background: '#2d2d4a', borderRadius: 2 }}>
              <div style={{ height: '100%', background: PURPLE, borderRadius: 2, width: '60%' }} />
            </div>
          </div>
        )}

        {tab === 'canvas' && !loading && initialData && (
          <Excalidraw
            initialData={initialData}
            theme="dark"
            UIOptions={{ canvasActions: { export: { saveFileToDisk: true } } }}
          />
        )}
      </div>
    </div>
  )
}
