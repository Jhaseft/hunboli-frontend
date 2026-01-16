'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import App from '@/components/dashboard/App'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  ); 
}
