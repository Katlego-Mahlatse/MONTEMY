import React from 'react'
import DashboardShell from '../../components/layout/DashboardShell'

const cards = [
  { icon: '👨‍🎓', title: 'My Students', description: 'View and manage your assigned students', path: '/tutor/students', requiresVerification: true },
  { icon: '📅', title: 'Sessions', description: 'Schedule and manage tutoring sessions', path: '/tutor/sessions', requiresVerification: true },
  { icon: '📝', title: 'Learning Plans', description: 'Create personalised learning plans for students', path: '/tutor/plans', requiresVerification: true },
  { icon: '📊', title: 'Progress Reports', description: 'Track and report on student progress', path: '/tutor/progress', requiresVerification: true },
  { icon: '💬', title: 'Messages', description: 'Communicate with students and parents', path: '/tutor/messages', requiresVerification: true },
  { icon: '📖', title: 'Resources', description: 'Access and share learning materials', path: '/tutor/resources', requiresVerification: false },
  { icon: '⚙️', title: 'Contact Admin', description: 'Get help from Montemy support', path: '/tutor/contact-admin', requiresVerification: false },
]

export default function TutorDashboard() {
  return <DashboardShell role="tutor" collection="tutors" cards={cards} />
}
