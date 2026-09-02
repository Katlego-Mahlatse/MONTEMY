import React from 'react'
import DashboardShell from '../../components/layout/DashboardShell'

const cards = [
  { icon: '💬', title: 'Messages', description: 'Communicate with teachers, parents and staff', path: '/principal/messages', requiresVerification: true },
  { icon: '📅', title: 'School Events', description: 'Manage and view upcoming school events', path: '/principal/events', requiresVerification: true },
  { icon: '📊', title: 'School Statistics', description: 'View school performance and analytics', path: '/principal/stats', requiresVerification: true },
  { icon: '👥', title: 'Staff Management', description: 'Oversee staff and faculty', path: '/principal/staff', requiresVerification: true },
  { icon: '⚙️', title: 'Contact Admin', description: 'Get help from Montemy support', path: '/principal/contact-admin', requiresVerification: false },
]

export default function PrincipalDashboard() {
  return <DashboardShell role="principal" collection="principals" cards={cards} />
}
