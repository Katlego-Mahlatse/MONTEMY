import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const s = { navy: '#001F3F', turquoise: '#40E0D0' }

const cards = [
  { icon: '👶', title: 'My Child', description: "View your child's academic progress and activities", path: '/parent/mychild' },
  { icon: '💬', title: 'Messages', description: 'Communicate with teachers and school staff', path: '/parent/messages' },
  { icon: '📅', title: 'Events', description: 'View upcoming school events and activities', path: '/parent/events' },
  { icon: '⚙️', title: 'Contact Admin', description: 'Get help from Montemy support', path: '/parent/contact-admin' },
]

export default function ParentDashboard() {
  const navigate = useNavigate()
  const [parent, setParent] = useState({ name: 'Parent', avatar: '👨‍👩‍👧' })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      if (!user) return navigate('/')
      try {
        let snap = await getDoc(doc(db, 'parents', user.uid))
        if (!snap.exists()) snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          const d = snap.data()
          setParent({
            name: `${d.parentFirstName || d.firstName || ''} ${d.parentLastName || d.lastName || ''}`.trim() || 'Parent',
            avatar: d.avatar || '👨‍👩‍👧'
          })
        }
      } catch (err) { console.error(err) }
    })
    return () => unsub()
  }, [])

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) { await signOut(auth); navigate('/') }
  }

  return (
    <div style={{ background: s.navy, minHeight: '100vh', color: 'white', fontFamily: 'Arial' }}>
      <nav style={{ background: s.turquoise, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ color: s.navy, fontSize: '1.5rem', fontWeight: 'bold' }}>MONTEMY</div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: s.navy, color: s.turquoise, width: '40px', height: '40px', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '3px', padding: '8px' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: '20px', height: '2px', background: s.turquoise }} />)}
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: '50px', background: s.turquoise, minWidth: '160px', borderRadius: '10px', zIndex: 10, overflow: 'hidden' }}>
              {[['Edit Profile', () => navigate('/parent/edit-profile')], ['Logout', handleLogout]].map(([label, fn]) => (
                <div key={label} onClick={() => { setMenuOpen(false); fn() }} style={{ color: s.navy, padding: '12px 16px', cursor: 'pointer', fontWeight: 'bold' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,31,63,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{label}</div>
              ))}
            </div>
          )}
        </div>
      </nav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', cursor: 'pointer' }} onClick={() => navigate('/parent/edit-profile')}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: s.turquoise, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: s.navy, border: `3px solid ${s.turquoise}`, boxShadow: `0 0 20px ${s.turquoise}` }}>
            {parent.avatar}
          </div>
          <h1 style={{ fontSize: '1.8rem', color: s.turquoise }}>{parent.name}</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {cards.map(card => (
            <div key={card.title} onClick={() => navigate(card.path)}
              style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '15px', borderLeft: `4px solid ${s.turquoise}`, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{card.icon}</div>
              <h3 style={{ color: s.turquoise, fontSize: '1.3rem', marginBottom: '0.5rem' }}>{card.title}</h3>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
