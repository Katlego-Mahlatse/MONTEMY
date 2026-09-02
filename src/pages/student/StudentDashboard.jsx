import React from 'react'
import DashboardShell from '../../components/layout/DashboardShell'

const cards = [
  { icon: '📚', title: 'My Subjects', description: 'View your subjects and learning materials', path: '/student/academics', requiresVerification: true },
  { icon: '📅', title: 'Schedule', description: 'View your class timetable and schedule', path: '/student/academics', requiresVerification: true },
  { icon: '📝', title: 'Homework', description: 'View and submit your homework assignments', path: '/student/academics', requiresVerification: true },
  { icon: '📊', title: 'My Progress', description: 'Track your academic performance and grades', path: '/student/academics', requiresVerification: true },
  { icon: '📖', title: 'Resources', description: 'Access past papers, textbooks and study materials', path: '/student/resources', requiresVerification: false },
  { icon: '🤖', title: 'AI Tutor', description: 'Get 24/7 help from your personal AI tutor', path: '/student/ai-tutor', requiresVerification: false },
  { icon: '💬', title: 'Messages', description: 'Communicate with teachers and classmates', path: '/student/messages', requiresVerification: true },
  { icon: '⚙️', title: 'Contact Admin', description: 'Get help from Montemy support', path: '/student/contact-admin', requiresVerification: false },
]

export default function StudentDashboard() {
  return <DashboardShell role="student" collection="students" cards={cards} />
}
