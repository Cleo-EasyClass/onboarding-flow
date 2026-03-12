import { useEffect, useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { SECTIONS, W_DEFAULT, H_DEFAULT, GAP_X, GAP_Y, SECTION_HEADER_H } from './scene-data'

const PURPLE = '#8a6bfc'

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
  }
  return { elements, files }
}

export default function App() {
  const [initialData, setInitialData] = useState(null)
  const [progress, setProgress] = useState('Initializing...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    buildScene(setProgress)
      .then(({ elements, files }) => {
        setInitialData({ elements, files, appState: { viewBackgroundColor: '#141414', theme: 'dark' } })
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  if (loading) return (
    <div style={{
      position: 'fixed', inset: 0, background: '#141414',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16, color: PURPLE, fontFamily: 'sans-serif',
    }}>
      <div style={{ fontSize: 36 }}>🗂️</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Loading design archive...</div>
      <div style={{ fontSize: 13, color: '#94a3b8', maxWidth: 360, textAlign: 'center' }}>{progress}</div>
      <div style={{ width: 280, height: 4, background: '#2d2d4a', borderRadius: 2 }}>
        <div style={{ height: '100%', background: PURPLE, borderRadius: 2, width: '60%' }} />
      </div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {initialData && (
        <Excalidraw
          initialData={initialData}
          theme="dark"
          UIOptions={{ canvasActions: { export: { saveFileToDisk: true } } }}
        />
      )}
    </div>
  )
}
