// All screenshots organized by section
// Each image references a catbox.moe URL — fetched at runtime and injected as base64

export const SECTIONS = [
  {
    id: 'layout-vote',
    title: '📐 Layout Vote — Option A vs Option B',
    subtitle: 'Option B (split panel) locked ✅',
    color: '#94a3b8',
    x: 0, y: 0,
    rows: [
      [
        { id: 'optA-s1', url: 'https://files.catbox.moe/3sxxl4.png', label: 'Option A — Step 1\n(Single column)', tag: 'REJECTED' },
        { id: 'optA-s3', url: 'https://files.catbox.moe/hjhigk.png', label: 'Option A — Step 3', tag: 'REJECTED' },
        null,
        { id: 'optB-s1', url: 'https://files.catbox.moe/3ef1rn.png', label: 'Option B — Step 1\n(Split panel)', tag: 'LOCKED ✅' },
        { id: 'optB-s5', url: 'https://files.catbox.moe/3vv6jj.png', label: 'Option B — Step 5', tag: 'LOCKED ✅' },
      ]
    ]
  },
  {
    id: 'color-vote',
    title: '🎨 Left Panel Color Vote',
    subtitle: 'Option D — Soft Lavender #f3f0ff locked ✅',
    color: '#c4b5f7',
    x: 1800, y: 0,
    rows: [
      [
        { id: 'panel-vote', url: 'https://files.catbox.moe/1nz4lg.png', label: 'Color vote — Josh chose\nOption D (Lavender)', tag: 'LOCKED ✅', w: 600 },
      ]
    ]
  },
  {
    id: 'wizard-current',
    title: '🧙 Onboarding Wizard — CURRENT (with persistent roadmap)',
    subtitle: 'Split panel, lavender left, roadmap always visible, individual K–12 grade pills',
    color: '#8a6bfc',
    x: 0, y: 700,
    rows: [
      [
        { id: 'wiz1', url: 'https://files.catbox.moe/jo5v1p.png', label: 'Step 1 — Name' },
        { id: 'wiz2', url: 'https://files.catbox.moe/m7ingg.png', label: 'Step 2 — Role' },
        { id: 'wiz3', url: 'https://files.catbox.moe/1dpge0.png', label: 'Step 3 — Grade' },
        { id: 'wiz4', url: 'https://files.catbox.moe/dq0uzv.png', label: 'Step 4 — Subject' },
        { id: 'wiz5', url: 'https://files.catbox.moe/jls496.png', label: 'Step 5 — Topic' },
        { id: 'gen',  url: 'https://files.catbox.moe/2f2yzj.png', label: '⚡ Generation Screen', tag: 'LP fires first' },
      ]
    ],
    arrows: [[0,1],[1,2],[2,3],[3,4],[4,5]],
    arrowColor: '#8a6bfc',
  },
  {
    id: 'tour-current',
    title: '🎯 Dashboard Tour — CURRENT (pixel-perfect real dashboard)',
    subtitle: 'Spotlight coordinates pulled from live DOM. Stop 3 = proposed "Generate All" button.',
    color: '#4ade80',
    x: 0, y: 1500,
    rows: [
      [
        { id: 't1', url: 'https://files.catbox.moe/rnt663.png', label: 'Tour Stop 1\nLP Row spotlight' },
        { id: 't2', url: 'https://files.catbox.moe/a8uacv.png', label: 'Tour Stop 2\n5 resource dots' },
        { id: 't3', url: 'https://files.catbox.moe/tma75x.png', label: 'Tour Stop 3\n⚡ Generate All (new)', tag: 'PROPOSED' },
        { id: 't4', url: 'https://files.catbox.moe/x3isxw.png', label: 'Tour Stop 4\nNew Lesson Plan btn' },
        { id: 't5', url: 'https://files.catbox.moe/cudu30.png', label: 'Tour Stop 5\nDisplay Boards → Pro' },
      ]
    ],
    arrows: [[0,1],[1,2],[2,3],[3,4]],
    arrowColor: '#4ade80',
  },
  {
    id: 'tour-v1',
    title: '🎯 Dashboard Tour — v1 (original 3 stops)',
    subtitle: 'First iteration before pixel-perfect overlays',
    color: '#94a3b8',
    x: 0, y: 2200,
    rows: [
      [
        { id: 'tour-s1-orig', url: 'https://files.catbox.moe/ld5tda.png', label: 'v1 Stop 1 — LP Row' },
        { id: 'tour-s2-orig', url: 'https://files.catbox.moe/jb1zrk.png', label: 'v1 Stop 2 — Quick Gen' },
        { id: 'tour-paywall', url: 'https://files.catbox.moe/u3u3hp.png', label: 'v1 Stop 3 — Pro Paywall' },
      ]
    ],
    arrows: [[0,1],[1,2]],
    arrowColor: '#94a3b8',
  },
  {
    id: 'storyboard',
    title: '📊 Flow Storyboard v2 — Full Journey Map',
    subtitle: 'Overview: wizard → generation → tour → paywall with all 5 resource types (WORK/PRES/READ/QUIZ/RUBR)',
    color: '#fe69ea',
    x: 2200, y: 700,
    rows: [
      [
        { id: 'flow-top',    url: 'https://files.catbox.moe/ec1722.png', label: 'Storyboard — Top half\n(Wizard + Gen screen + Tour stops 1–2)', w: 700 },
        { id: 'flow-bottom', url: 'https://files.catbox.moe/dwuuam.png', label: 'Storyboard — Bottom half\n(5 quick-generate resource cards)', w: 700 },
      ]
    ]
  },
]

export const W_DEFAULT = 480
export const H_DEFAULT = 300
export const GAP_X = 50
export const GAP_Y = 80
export const SECTION_HEADER_H = 110
