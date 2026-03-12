import { useEffect, useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'

export default function App() {
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    fetch('/scene.excalidraw')
      .then(r => r.json())
      .then(data => setInitialData({
        elements: data.elements,
        appState: {
          ...data.appState,
          viewBackgroundColor: '#141414',
          theme: 'dark',
        },
        files: data.files,
      }))
      .catch(console.error)
  }, [])

  if (!initialData) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#141414',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, fontFamily: 'sans-serif', color: '#8a6bfc'
      }}>
        <div style={{ fontSize: 32 }}>🎯</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Loading EasyClass Onboarding Flow...</div>
        <div style={{ fontSize: 13, color: '#4b5563' }}>Setting up your canvas</div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Excalidraw
        initialData={initialData}
        theme="dark"
        UIOptions={{
          canvasActions: {
            export: { saveFileToDisk: true },
          },
        }}
      />
    </div>
  )
}
