export const W_DEFAULT = 576
export const H_DEFAULT = 360
export const GAP_X = 60
export const GAP_Y = 80
export const SECTION_HEADER_H = 80

export const SECTIONS = []

// ── THE FLOW: 5 screens, full-screen split panel, lavender sidebar + roadmap ──
SECTIONS.push({
  id: 'onboarding-flow',
  title: '✅ Onboarding 2.0 — Full Flow (Full Screen, Lavender Sidebar, Persistent Roadmap)',
  subtitle: 'Click any screen to open it live and interactive',
  color: '#8a6bfc',
  x: 0, y: 0,
  rows: [[
    { id: 'sc1', url: 'https://files.catbox.moe/v3k5ih.png', label: 'Screen 1 — Name',    tag: 'Step 1', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s1-clean.html' },
    { id: 'sc2', url: 'https://files.catbox.moe/v9gard.png', label: 'Screen 2 — Role',    tag: 'Step 2', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s2-clean.html' },
    { id: 'sc3', url: 'https://files.catbox.moe/v9rry1.png', label: 'Screen 3 — Grades',  tag: 'Step 3', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s3-clean.html' },
    { id: 'sc4', url: 'https://files.catbox.moe/f4kvm6.png', label: 'Screen 4 — Subject', tag: 'Step 4', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s4-clean.html' },
    { id: 'sc5', url: 'https://files.catbox.moe/n77z9c.png', label: 'Screen 5 — Topic + Generate', tag: 'Step 5 ✨', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s5-clean.html' },
  ]],
})
