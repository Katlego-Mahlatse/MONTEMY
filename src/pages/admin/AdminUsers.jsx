import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { db } from '../../firebase/config'
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const COLLECTIONS = ['students', 'teachers', 'parents', 'principals', 'staff']
const s = { navy: '#001F3F', turquoise: '#40E0D0' }

export default function AdminUsers() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(searchParams.get('type') || '')
  const [schoolFilter] = useState(searchParams.get('school') || '')
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  useEffect(() => { loadUsers() }, [])

  useEffect(() => {
    const term = search.toLowerCase()
    setFiltered(users.filter(u => {
      const matchSearch = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.schoolName.toLowerCase().includes(term)
      const matchRole = !roleFilter || u.collection === roleFilter
      const matchSchool = !schoolFilter || u.schoolId === schoolFilter
      return matchSearch && matchRole && matchSchool
    }))
  }, [search, roleFilter, users])

  const loadUsers = async () => {
    setLoading(true)
    const all = []
    for (const col of COLLECTIONS) {
      try {
        const snap = await getDocs(collection(db, col))
        snap.forEach(d => {
          const data = d.data()
          const name = data.name || data.fullName ||
            (data.parentFirstName ? `${data.parentFirstName} ${data.parentLastName}` : '') ||
            `${data.firstName || ''} ${data.lastName || data.LastName || ''}`.trim() || 'No Name'
          all.push({
            id: d.id, collection: col,
            name, email: data.email || 'No Email',
            schoolName: data.schoolName || data.schoolId || 'Unknown',
            schoolId: data.schoolId || '',
            isVerified: data.isVerified !== undefined ? data.isVerified : true,
            grade: data.grade || '', class: data.class || '',
            subjects: data.subjects || [], role: col
          })
        })
      } catch (err) { console.error(err) }
    }
    setUsers(all)
    setFiltered(all)
    setLoading(false)
  }

  const deleteUser = async () => {
    try {
      await deleteDoc(doc(db, deleteModal.collection, deleteModal.id))
      setUsers(prev => prev.filter(u => !(u.id === deleteModal.id && u.collection === deleteModal.collection)))
      setDeleteModal(null)
    } catch (err) { alert('Error: ' + err.message) }
  }

  const toggleVerify = async (user) => {
    try {
      await updateDoc(doc(db, user.collection, user.id), { isVerified: !user.isVerified })
      setUsers(prev => prev.map(u => u.id === user.id && u.collection === user.collection ? { ...u, isVerified: !u.isVerified } : u))
    } catch (err) { alert('Error: ' + err.message) }
  }

  const stats = COLLECTIONS.reduce((acc, col) => {
    acc[col] = users.filter(u => u.collection === col).length
    return acc
  }, {})

  return (
    <div style={{ background: s.navy, minHeight: '100vh', color: 'white', fontFamily: 'Arial' }}>

      {/* Navbar */}
      <nav style={{ background: s.turquoise, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: s.navy, fontSize: '1.2rem', fontWeight: 'bold' }}>MONTEMY ADMIN</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/admin/dashboard')} style={{ background: s.navy, color: s.turquoise, padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Dashboard</button>
          <button onClick={() => navigate('/admin/chat')} style={{ background: s.navy, color: s.turquoise, padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Support Chat</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <h2 style={{ color: s.turquoise, marginBottom: '1rem', fontSize: '1.5rem' }}>Manage Users</h2>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {COLLECTIONS.map(col => (
            <div key={col} style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${s.turquoise}`, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', color: s.turquoise, fontWeight: 'bold' }}>{stats[col]}</div>
              <div style={{ fontSize: '0.8rem', color: '#ccc', textTransform: 'capitalize' }}>{col}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or school..."
            style={{ width: '100%', padding: '0.8rem', border: `2px solid ${s.turquoise}`, borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', marginBottom: '1rem' }} />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '0.8rem', border: `2px solid ${s.turquoise}`, borderRadius: '8px', background: s.navy, color: 'white', fontSize: '1rem' }}>
            <option value="">All Roles</option>
            {COLLECTIONS.map(col => <option key={col} value={col}>{col.charAt(0).toUpperCase() + col.slice(1)}</option>)}
          </select>
        </div>

        {/* Users List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: s.turquoise }}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888', fontStyle: 'italic' }}>No users found.</div>
        ) : filtered.map(user => (
          <div key={`${user.id}-${user.collection}`} style={{ background: 'rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: '10px', borderLeft: `4px solid ${s.turquoise}`, marginBottom: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ color: s.turquoise, fontSize: '1.2rem', fontWeight: 'bold' }}>{user.name}</div>
                <span style={{ background: 'rgba(64,224,208,0.2)', color: s.turquoise, padding: '0.2rem 0.8rem', borderRadius: '15px', fontSize: '0.8rem', textTransform: 'capitalize' }}>{user.collection}</span>
                <span style={{ background: user.isVerified ? '#2ecc71' : '#e74c3c', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '15px', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>

              {/* Options Menu */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                  style={{ background: 'none', border: 'none', color: s.turquoise, fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem' }}>⋯</button>
                {openMenu === user.id && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, background: s.navy, border: `1px solid ${s.turquoise}`, borderRadius: '8px', padding: '0.5rem', minWidth: '180px', zIndex: 100 }}>
