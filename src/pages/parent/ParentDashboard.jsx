import React from 'react'
import DashboardShell from '../../components/layout/DashboardShell'

const cards = [
  { icon: '👶', title: 'My Child', description: "View your child's academic progress and activities", path: '/parent/mychild', requiresVerification: true },
  { icon: '💬', title: 'Messages', description: 'Communicate with teachers and school staff', path: '/parent/messages', requiresVerification: true },
  { icon: '📅', title: 'Events', description: 'View upcoming school events and activities', path: '/parent/events', requiresVerification: false },
  { icon: '⚙️', title: 'Contact Admin', description: 'Get help from Montemy support', path: '/parent/contact-admin', requiresVerification: false },
]

export default function ParentDashboard() {
  return <DashboardShell role="parent" collection="parents" cards={cards} />
}
