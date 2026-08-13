import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const s = { navy: '#001F3F', turquoise: '#40E0D0' }

const cards = [
  { icon: '📚', title: 'My Subjects', description: 'View your subjects and learning materials', path: '/student/academics' },
  { icon: '📅', title: 'Schedule', description: 'View your class timetable and schedule', path: '/student/academics' },
  { icon: '📝', title: 'Homework', description: 'View and submit your homework assignments', path: '/student/academics' },
  { icon: '📊', title: 'My Progress', description: 'Track your academic performance and grades', path: '/student/academics' },
  { icon: '📖', title: 'Resources', description: 'Access past papers, textbooks and study materials', path: '/student/resources' },
  { icon: '🤖', title: 'AI Tutor', description: 'Get 24/7 help from your personal AI tutor', path: '/student/ai-tutor' },
  { icon: '💬', title: 'Messages', description: 'Communicate with teachers and classmates', path: '/student/messages' },
  { icon: '⚙️', title: 'Contact Admin', description: 'Get help from Montemy support', path: '/student/contact-admin' },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [student, setStudent] = useState({ name: 'Student', avatar: '🎓', profilePicture: null })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      if (!user) return navigate('/')
      try {
        let snap = await getDoc(doc(db, 'students', user.uid))
        if (!snap.exists()) snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          const d = snap.data()
          setStudent({
            name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Student',
            avatar: d.avatar || '🎓',
            profilePicture: d.profilePicture || null
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
      <nav style={{ background: s.turquoise, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ color: s.navy, fontSize: '1.5rem', fontWeight: 'bold' }}>MONTEMY</div>
        <div onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '10px', background: s.navy, borderRadius: '50%', width: '45px', height: '45px', justifyContent: 'center', alignItems: 'center' }}>
          {[0,1,2].map(i => <div key={i} style={{ width: '20px', height: '2px', background: s.turquoise, margin: '2px 0', borderRadius: '2px' }} />)}
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: 'absolute', top: '80px', right: '20px', background: s.turquoise, padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          {[['Edit Profile', () => navigate('/student/edit-profile')], ['Logout', handleLogout]].map(([label, fn]) => (
            <div key={label} onClick={() => { setMenuOpen(false); fn() }}
              style={{ color: s.navy, textDecoration: 'none', display: 'block', padding: '0.5rem 1rem', margin: '0.5rem 0', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,31,63,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{label}</div>
          ))}
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div onClick={() => navigate('/student/edit-profile')} style={{ textAlign: 'center', marginBottom: '2rem', cursor: 'pointer' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: s.turquoise, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: s.navy, border: `3px solid ${s.turquoise}`, boxShadow: `0 0 20px ${s.turquoise}`, overflow: 'hidden' }}>
            {student.profilePicture ? <img src={student.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : student.avatar}
          </div>
          <h1 style={{ fontSize: '2rem', color: s.turquoise }}>{student.name}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {cards.map(card => (
            <div key={card.title} onClick={() => navigate(card.path)}
              style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '15px', borderLeft: `4px solid ${s.turquoise}`, cursor: 'pointer', textAlign: 'center', transition: 'transform 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{card.icon}</div>
              <h3 style={{ color: s.turquoise, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{card.title}</h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.4' }}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
