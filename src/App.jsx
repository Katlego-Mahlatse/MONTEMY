import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Landing from './pages/auth/Landing'
import Login from './pages/auth/Login'
import AccountTypeSelect from './pages/auth/AccountTypeSelect'
import Register from './pages/auth/Register'
import PendingVerification from './pages/auth/PendingVerification'

import StudentDashboard from './pages/student/StudentDashboard'
import StudentAcademics from './pages/student/StudentAcademics'
import StudentResources from './pages/student/StudentResources'
import StudentAiTutor from './pages/student/StudentAiTutor'

import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherClasses from './pages/teacher/TeacherClasses'
import TeacherAssignments from './pages/teacher/TeacherAssignments'
import TeacherProgress from './pages/teacher/TeacherProgress'

import ParentDashboard from './pages/parent/ParentDashboard'
import ParentMyChild from './pages/parent/ParentMyChild'

import PrincipalDashboard from './pages/principal/PrincipalDashboard'
import PrincipalEvents from './pages/principal/PrincipalEvents'
import PrincipalStats from './pages/principal/PrincipalStats'

import TutorDashboard from './pages/tutor/TutorDashboard'
import SchoolMemberDashboard from './pages/schoolmember/SchoolMemberDashboard'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminClasses from './pages/admin/AdminClasses'
import AdminChat from './pages/admin/AdminChat'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<AccountTypeSelect />} />
        <Route path="/register/:type" element={<Register />} />
        <Route path="/pending-verification" element={<PendingVerification />} />

        {/* Legacy routes redirect */}
        <Route path="/signup" element={<AccountTypeSelect />} />
        <Route path="/admin-login" element={<Login />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/academics" element={<StudentAcademics />} />
        <Route path="/student/resources" element={<StudentResources />} />
        <Route path="/student/ai-tutor" element={<StudentAiTutor />} />

        {/* Teacher */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/progress" element={<TeacherProgress />} />

        {/* Parent */}
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/mychild" element={<ParentMyChild />} />

        {/* Principal */}
        <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
        <Route path="/principal/events" element={<PrincipalEvents />} />
        <Route path="/principal/stats" element={<PrincipalStats />} />

        {/* Tutor */}
        <Route path="/tutor/dashboard" element={<TutorDashboard />} />

        {/* School Member */}
        <Route path="/schoolmember/dashboard" element={<SchoolMemberDashboard />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/chat" element={<AdminChat />} />
      </Routes>
    </BrowserRouter>
  )
}
