import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { BACKGROUND_VIDEO } from '../../config/media'

const userTypes = ['student', 'teacher', 'parent', 'staff', 'principal', 'admin']

export default function Login() {
  const navigate = useNavigate()
  const [activeType, setActiveType] = useState('student')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', password: '',
    title: '', role: '', school: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const showMsg = (text, type) => setMessage({ text, type })

  const loginUser = async (collectionName, matchFn, redirect) => {
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      const found = snapshot.docs.find(doc => matchFn(doc.data()))
      if (!found) return showMsg(`${collectionName} not found`, 'error')
      await signInWithEmailAndPassword(auth, found.data().email, form.password)
      showMsg('Login successful! Redirecting...', 'success')
      setTimeout(() => navigate(redirect), 1500)
    } catch (err) {
      showMsg('Login failed: ' + err.message, 'error')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const f = (v) => v.trim().toLowerCase()

    if (activeType === 'student') {
      loginUser('students', (d) =>
        f(d.firstName) === f(form.firstName) && f(d.lastName) === f(form.lastName),
        '/student/dashboard')

    } else if (activeType === 'teacher') {
      loginUser('teachers', (d) =>
        f(d.title) === f(form.title) && f(d.lastName || d.LastName) === f(form.lastName),
        '/teacher/dashboard')

    } else if (activeType === 'parent') {
      loginUser('parents', (d) =>
        f(d.parentFirstName) === f(form.firstName) && f(d.parentLastName) === f(form.lastName),
        '/parent/dashboard')

    } else if (activeType === 'staff') {
      loginUser('staff', (d) =>
        f(d.firstName) === f(form.firstName) && f(d.lastName) === f(form.lastName),
        '/staff/dashboard')

    } else if (activeType === 'principal') {
      loginUser('principals', (d) =>
        f(d.role) === f(form.role) && f(d.lastName) === f(form.lastName) &&
        f(d.school || d.schoolName) === f(form.school),
        '/principal/dashboard')
    }
  }

  const switchType = (type) => {
    if (type === 'admin') return navigate('/admin-login')
    setActiveType(type)
    setMessage({ text: '', type: '' })
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', fontFamily: 'Arial' }}>

      {/* Background Video */}
      {BACKGROUND_VIDEO && (
        <video autoPlay loop muted playsInline
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}>
          <source src={BACKGROUND_VIDEO} type="video/mp4" />
        </video>
      )}
      {!BACKGROUND_VIDEO && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#001F3F', zIndex: -1 }} />
      )}

      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '10px', borderLeft: '4px solid #40E0D0', maxWidth: '400px', width: '100%', color: 'white' }}>
        <div style={{ color: '#40E0D0', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>MONTEMY</div>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h2>

        {/* User Type Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          {userTypes.map(type => (
            <button key={type} onClick={() => switchType(type)}
              style={{
                background: activeType === type ? '#40E0D0' : 'rgba(255,255,255,0.1)',
                color: activeType === type ? '#001F3F' : 'white',
                padding: '0.7rem', border: '1px solid #40E0D0',
                borderRadius: '5px', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.9rem'
              }}>
              {type === 'admin' ? 'Admin' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            padding: '1rem', marginBottom: '1rem', borderRadius: '5px',
            background: message.type === 'error' ? '#ff6b6b' : '#90EE90',
            color: message.type === 'error' ? 'white' : 'darkgreen'
          }}>{message.text}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Teacher: Title */}
          {activeType === 'teacher' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#40E0D0', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
              <select name="title" value={form.title} onChange={handleChange} required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: 'none', color: '#001F3F' }}>
                <option value="">Select Title</option>
                {['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          )}

          {/* Principal: Role */}
          {activeType === 'principal' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#40E0D0', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Role</label>
              <select name="role" value={form.role} onChange={handleChange} required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: 'none', color: '#001F3F' }}>
                <option value="">Select Role</option>
                <option value="principal">Principal</option>
                <option value="vice principal">Vice Principal</option>
              </select>
            </div>
          )}

          {/* First Name */}
          {['student', 'parent', 'staff'].includes(activeType) && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#40E0D0', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Enter your first name"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: 'none', color: '#001F3F' }} />
            </div>
          )}

          {/* Last Name */}
          {['student', 'teacher', 'parent', 'staff', 'principal'].includes(activeType) && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#40E0D0', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Enter your last name"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: 'none', color: '#001F3F' }} />
            </div>
          )}

          {/* Principal: School */}
          {activeType === 'principal' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#40E0D0', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>School Name</label>
              <input name="school" value={form.school} onChange={handleChange} required placeholder="Enter your school name"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: 'none', color: '#001F3F' }} />
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#40E0D0', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: 'none', color: '#001F3F' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit"
            style={{ background: '#40E0D0', color: '#001F3F', padding: '1rem', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '1rem', boxShadow: '0 0 15px #40E0D0' }}>
            Login as {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
          </button>
        </form>

        {/* Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button onClick={() => alert('Forgot details feature coming soon!')}
            style={{ color: '#40E0D0', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Forgot Details?
          </button>
          <button onClick={() => navigate('/signup')}
            style={{ color: '#40E0D0', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Create Account
          </button>
          <button onClick={() => navigate('/admin-login')}
            style={{ color: '#40E0D0', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  )
}
