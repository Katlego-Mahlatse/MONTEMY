import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, serverTimestamp, query, where } from 'firebase/firestore'

const ADMIN_EMAIL = 'Montemyadmin@gmail.com'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ schools: 0, students: 0, teachers: 0, parents: 0 })
  const [allSchools, setAllSchools] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [schoolSearch, setSchoolSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState([])
  const [showUserResults, setShowUserResults] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [deleteSchoolModal, setDeleteSchoolModal] = useState(null)
  const [deleteUserModal, setDeleteUserModal] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  const isAdmin = (user) => user && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        loadData()
      } else {
        navigate('/')
      }
    })
    return () => unsub()
  }, [])

  const getAllUsers = async (col) => {
    const snap = await getDocs(collection(db, col))
    return snap.docs.map(d => ({
      id: d.id, collection: col, role: col,
      name: d.data().name || d.data().fullName ||
        (d.data().parentFirstName ? `${d.data().parentFirstName} ${d.data().parentLastName}` : 'No Name'),
      email: d.data().email || 'No Email',
      schoolName: d.data().schoolName || d.data().schoolId || 'Unknown School',
      schoolId: d.data().schoolId || d.data().schoolName || 'No School',
      isVerified: d.data().isVerified !== undefined ? d.data().isVerified : true,
      grade: d.data().grade || '',
      class: d.data().class || '',
      subjects: d.data().subjects || [],
      children: d.data().children || [],
      parents: d.data().parents || [],
      ...d.data()
    }))
  }

  const loadData = async () => {
    try {
      const schoolsSnap = await getDocs(collection(db, 'schools'))
      const schoolsData = schoolsSnap.docs.map(d => ({
        id: d.id, name: d.data().name || d.id,
        schoolID: d.data().schoolID || d.id, isActive: d.data().isActive !== false
      }))

      const [students, teachers, parents, principals] = await Promise.all([
        getAllUsers('students'), getAllUsers('teachers'),
        getAllUsers('parents'), getAllUsers('principals')
      ])

      const combined = [...students, ...teachers, ...parents, ...principals]
      setAllUsers(combined)
      setStats({ schools: schoolsData.length, students: students.length, teachers: teachers.length, parents: parents.length })

      const schoolsWithUsers = schoolsData.map(school => ({
        ...school,
        students: students.filter(u => u.schoolId === school.id),
        teachers: teachers.filter(u => u.schoolId === school.id),
        parents: parents.filter(u => u.schoolId === school.id),
        principals: principals.filter(u => u.schoolId === school.id),
      }))
      setAllSchools(schoolsWithUsers)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSearch = (val) => {
    setUserSearch(val)
    if (!val) { setShowUserResults(false); return }
    const term = val.toLowerCase()
    const filtered = allUsers.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.schoolName.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    )
    setUserResults(filtered)
    setShowUserResults(true)
  }

  const filteredSchools = allSchools.filter(s =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.schoolID.toLowerCase().includes(schoolSearch.toLowerCase())
  )

  const createSchool = async () => {
    if (!isAdmin(currentUser)) return alert('❌ Access Denied')
    const name = prompt('Enter the name for the new school:')
    if (!name) return
    try {
      await setDoc(doc(db, 'schools', name), {
        name, schoolID: name, isActive: true, createdAt: serverTimestamp()
      })
      alert(`✅ School "${name}" created!`)
      loadData()
    } catch (err) { alert('❌ Error: ' + err.message) }
  }

  const deleteSchool = async () => {
    if (!isAdmin(currentUser)) return alert('❌ Access Denied')
    try {
      const cols = ['students', 'teachers', 'parents', 'principals']
      for (const col of cols) {
        const q = query(collection(db, col), where('schoolId', '==', deleteSchoolModal.id))
        const snap = await getDocs(q)
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, col, d.id))))
      }
      await deleteDoc(doc(db, 'schools', deleteSchoolModal.id))
      alert('✅ School deleted!')
      setDeleteSchoolModal(null)
      loadData()
    } catch (err) { alert('❌ Error: ' + err.message) }
  }

  const deleteUser = async () => {
    try {
      await deleteDoc(doc(db, deleteUserModal.collection, deleteUserModal.id))
      alert('✅ User deleted!')
      setDeleteUserModal(null)
      loadData()
    } catch (err) { alert('❌ Error: ' + err.message) }
  }

  const toggleVerification = async (userId, col, val) => {
    try {
      await updateDoc(doc(db, col, userId), { isVerified: val })
      setAllUsers(prev => prev.map(u => u.id === userId && u.collection === col ? { ...u, isVerified: val } : u))
      setUserResults(prev => prev.map(u => u.id === userId && u.collection === col ? { ...u, isVerified: val } : u))
    } catch (err) { alert('❌ Error: ' + err.message) }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut(auth)
      navigate('/')
    }
  }

  const s = { navy: '#001F3F', turquoise: '#40E0D0' }

  return (
    <div style={{ background: s.navy, minHeight: '100vh', color: 'white', fontFamily: 'Arial' }}>

      {/* Navbar */}
      <nav style={{ background: s.turquoise, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: s.navy, fontSize: '1.5rem', fontWeight: 'bold' }}>MONTEMY ADMIN</div>
        <button onClick={handleLogout} style={{ background: s.navy, color: s.turquoise, padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>

        {/* Status Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ background: '#2ecc71', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>System Admin</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[['Total Schools', stats.schools], ['Total Students', stats.students], ['Total Teachers', stats.teachers], ['Total Parents', stats.parents]].map(([label, val]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', borderLeft: `4px solid ${s.turquoise}` }}>
              <div style={{ fontSize: '2rem', color: s.turquoise, fontWeight: 'bold' }}>{val}</div>
              <div style={{ color: '#ccc', fontSize: '0.9rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <input value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} placeholder="Search for schools..."
            style={{ padding: '1rem', border: `2px solid ${s.turquoise}`, borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem' }} />
          <input value={userSearch} onChange={e => handleUserSearch(e.target.value)} placeholder="Search for users (name, email, school)..."
            style={{ padding: '1rem', border: `2px solid ${s.turquoise}`, borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem' }} />
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['🏫 Create New School', createSchool], ['👥 Manage Admin Users', () => navigate('/admin/users')], ['🆘 Support', () => navigate('/admin/chat')]].map(([label, fn]) => (
            <button key={label} onClick={fn}
              style={{ background: s.turquoise, color: s.navy, padding: '1rem 2rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: `0 0 15px ${s.turquoise}` }}>
              {label}
            </button>
          ))}
        </div>

        {/* User Search Results */}
        {showUserResults && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: s.turquoise, marginBottom: '1rem' }}>User Search Results</h3>
            {userResults.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>No users found.</p>
            ) : userResults.map(user => (
              <div key={user.id} style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '10px', marginBottom: '1rem', borderLeft: `4px solid ${s.turquoise}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ color: s.turquoise, fontSize: '1.2rem', fontWeight: 'bold' }}>{user.name}</div>
                    <span style={{ background: 'rgba(64,224,208,0.2)', color: s.turquoise, padding: '0.3rem 1rem', borderRadius: '15px', fontSize: '0.8rem' }}>{user.role}</span>
                    <span style={{ background: user.isVerified ? '#2ecc71' : '#e74c3c', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '15px', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                      {user.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <button onClick={() => setDeleteUserModal(user)}
                    style={{ background: '#e74c3c', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    Delete
                  </button>
                </div>
                <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>School:</strong> {user.schoolName}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.9rem' }}>Verification:</span>
                  <input type="checkbox" checked={user.isVerified} onChange={e => toggleVerification(user.id, user.collection, e.target.checked)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schools List */}
        <h3 style={{ color: s.turquoise, marginBottom: '1rem' }}>All Schools</h3>
        {loading ? (
          <div style={{ color: s.turquoise, textAlign: 'center', padding: '2rem' }}>Loading all school data...</div>
        ) : filteredSchools.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>No schools found.</p>
        ) : filteredSchools.map(school => (
          <div key={school.id} style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '15px', borderLeft: `4px solid ${s.turquoise}`, marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: `1px solid ${s.turquoise}` }}>
              <div>
                <div style={{ color: s.turquoise, fontSize: '1.3rem', fontWeight: 'bold' }}>{school.name}</div>
                <div style={{ color: '#ccc', fontSize: '0.8rem' }}>School ID: {school.schoolID}</div>
                <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Total Users: {school.students.length + school.teachers.length + school.parents.length + school.principals.length}</div>
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setOpenMenu(openMenu === school.id ? null : school.id)}
                  style={{ background: 'none', border: 'none', color: s.turquoise, fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem' }}>⋯</button>
                {openMenu === school.id && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, background: s.navy, border: `1px solid ${s.turquoise}`, borderRadius: '8px', padding: '0.5rem', minWidth: '180px', zIndex: 100 }}>
                    {[
                      ['Delete School', () => { setDeleteSchoolModal(school); setOpenMenu(null) }, '#e74c3c'],
                      ['Free Trial Mode', () => alert(`School set to free trial`), 'white'],
                      ['Enrolled Mode', () => alert(`School set to enrolled`), 'white'],
                    ].map(([label, fn, color]) => (
                      <div key={label} onClick={fn} style={{ padding: '0.8rem 1rem', color, cursor: 'pointer', borderRadius: '5px', fontSize: '0.9rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(64,224,208,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
              {[['Students', school.students.length, 'students'], ['Teachers', school.teachers.length, 'teachers'], ['Principals', school.principals.length, 'principals'], ['Parents', school.parents.length, 'parents']].map(([label, count, type]) => (
                <div key={label} onClick={() => navigate(`/admin/users?school=${school.id}&type=${type}`)}
                  style={{ textAlign: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  <div style={{ fontSize: '1.3rem', color: s.turquoise, fontWeight: 'bold' }}>{count}</div>
                  <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Delete School Modal */}
        {deleteSchoolModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: s.navy, padding: '2rem', borderRadius: '15px', border: `2px solid ${s.turquoise}`, maxWidth: '400px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ color: s.turquoise, marginBottom: '1rem' }}>Delete School</h3>
              <p style={{ color: '#ccc', marginBottom: '2rem' }}>Are you sure you want to delete "{deleteSchoolModal.name}"? This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={deleteSchool} style={{ background: '#e74c3c', color: 'white', padding: '0.7rem 1.5rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                <button onClick={() => setDeleteSchoolModal(null)} style={{ background: '#666', color: 'white', padding: '0.7rem 1.5rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {deleteUserModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: s.navy, padding: '2rem', borderRadius: '15px', border: `2px solid ${s.turquoise}`, maxWidth: '400px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ color: s.turquoise, marginBottom: '1rem' }}>Delete User</h3>
              <p style={{ color: '#ccc', marginBottom: '2rem' }}>Are you sure you want to delete "{deleteUserModal.name}"? This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={deleteUser} style={{ background: '#e74c3c', color: 'white', padding: '0.7rem 1.5rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                <button onClick={() => setDeleteUserModal(null)} style={{ background: '#666', color: 'white', padding: '0.7rem 1.5rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
