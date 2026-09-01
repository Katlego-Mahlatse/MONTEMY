import React from 'react'

const s = { navy: '#001F3F', turquoise: '#40E0D0' }

export default function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', borderLeft: `4px solid ${s.turquoise}`, padding: '1.5rem', ...style }}>
      {title && <h3 style={{ color: s.turquoise, marginTop: 0, marginBottom: '1rem' }}>{title}</h3>}
      {children}
    </div>
  )
}
