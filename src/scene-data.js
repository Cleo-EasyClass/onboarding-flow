export const W_DEFAULT = 576
export const H_DEFAULT = 360
export const GAP_X = 48
export const GAP_Y = 80
export const SECTION_HEADER_H = 80

export const SECTIONS = []

SECTIONS.push({
  id: 'onboarding-v2',
  title: '✅ Onboarding 2.0 — 6-Step Full Flow (Name → Role → Grade → Subject → Attribution → Topic)',
  subtitle: 'Full-screen, lavender sidebar, persistent roadmap. Click any screen to open it live.',
  color: '#8a6bfc',
  x: 0, y: 0,
  rows: [[
    { id: 'f1', url: 'https://files.catbox.moe/pvcmy9.png', label: 'Step 1 — Name',        tag: 'Step 1', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s1.html' },
    { id: 'f2', url: 'https://files.catbox.moe/jmwmvi.png', label: 'Step 2 — Role',        tag: 'Step 2', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s2.html' },
    { id: 'f3', url: 'https://files.catbox.moe/z2txpf.png', label: 'Step 3 — Grade',       tag: 'Step 3', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s3.html' },
    { id: 'f4', url: 'https://files.catbox.moe/v7jkaf.png', label: 'Step 4 — Subject',     tag: 'Step 4', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s4.html' },
    { id: 'f5', url: 'https://files.catbox.moe/esdo08.png', label: 'Step 5 — How Found Us',tag: 'Step 5', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s5.html' },
    { id: 'f6', url: 'https://files.catbox.moe/2kfsci.png', label: 'Step 6 — Topic → Generate ✨', tag: 'Step 6 🚀', w: 576, h: 360, link: 'https://easyclass-onboarding-flow.netlify.app/s6.html' },
  ]],
})
