import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Auth
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import AdminLogin from './pages/auth/AdminLogin'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminClasses from './pages/admin/AdminClasses'
import AdminChat from './pages/admin/AdminChat'

// Principal
import PrincipalDashboard from './pages/principal/PrincipalDashboard'
import PrincipalEvents from './pages/principal/PrincipalEvents'
import PrincipalStats from './pages/principal/PrincipalStats'

// Teacher
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherClasses from './pages/teacher/TeacherClasses'
import TeacherAssignments from './pages/teacher/TeacherAssignments'
import TeacherProgress from './pages/teacher/TeacherProgress'

// Student
import StudentDashboard from './pages/student/StudentDashboard'
import StudentAcademics from './pages/student/StudentAcademics'
import StudentResources from './pages/student/StudentResources'
import StudentAiTutor from './pages/student/StudentAiTutor'

// Parent
import ParentDashboard from './pages/parent/ParentDashboard'
import ParentMyChild from './pages/parent/ParentMyChild'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/chat" element={<AdminChat />} />

        {/* Principal */}
        <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
        <Route path="/principal/events" element={<PrincipalEvents />} />
        <Route path="/principal/stats" element={<PrincipalStats />} />

        {/* Teacher */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/progress" element={<TeacherProgress />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/academics" element={<StudentAcademics />} />
        <Route path="/student/resources" element={<StudentResources />} />
        <Route path="/student/ai-tutor" element={<StudentAiTutor />} />

        {/* Parent */}
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/mychild" element={<ParentMyChild />} />
      </Routes>
    </Router>
  )
}

export default App
