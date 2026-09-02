import React from 'react'
import DashboardShell from '../../components/layout/DashboardShell'

const cards = [
  { icon: '🏫', title: 'My Classes', description: 'Manage your classes and student rosters', path: '/teacher/classes', requiresVerification: true },
  { icon: '📝', title: 'Assignments', description: 'Create and manage homework assignments', path: '/teacher/assignments', requiresVerification: true },
  { icon: '📊', title: 'Student Progress', description: 'Track and review student performance', path: '/teacher/progress', requiresVerification: true },
  { icon: '💬', title: 'Messages', description: 'Communicate with students and parents', path: '/teacher/messages', requiresVerification: true },
  { icon: '📅', title: 'Schedule', description: 'View and manage your teaching schedule', path: '/teacher/schedule', requiresVerification: false },
  { icon: '⚙️', title: 'Contact Admin', description: 'Get help from Montemy support', path: '/teacher/contact-admin', requiresVerification: false },
]

export default function TeacherDashboard() {
  return <DashboardShell role="teacher" collection="teachers" cards={cards} />
}
