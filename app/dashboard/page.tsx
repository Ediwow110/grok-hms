'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated by calling a verify endpoint
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">G</span>
            </div>
            <div>
              <div className="font-semibold text-xl tracking-tight">Grok HMS</div>
              <div className="text-[10px] text-gray-500 -mt-1">Dashboard</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Welcome Card */}
          <div className="md:col-span-2 card">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {user.firstName}! 👋
            </h2>
            <p className="text-gray-600 mb-6">
              You're successfully logged into Grok HMS. This is your healthcare management dashboard.
            </p>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm">
                <span className="text-lg">✓</span>
                <span className="text-gray-700">
                  Role: <strong>{user.role}</strong>
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <span className="text-lg">✓</span>
                <span className="text-gray-700">
                  Tenant: <strong>Acme Health Group</strong>
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <span className="text-lg">✓</span>
                <span className="text-gray-700">
                  Email: <strong>{user.email}</strong>
                </span>
              </p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Dashboard Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-gray-600">Patients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">0</div>
                <div className="text-sm text-gray-600">Lab Orders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">0</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-semibold text-lg mb-2">Patient Management</h3>
            <p className="text-sm text-gray-600">
              Register and manage patient information securely
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-3">🧪</div>
            <h3 className="font-semibold text-lg mb-2">Lab Results</h3>
            <p className="text-sm text-gray-600">
              Track and manage laboratory test results
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-3">💳</div>
            <h3 className="font-semibold text-lg mb-2">Billing</h3>
            <p className="text-sm text-gray-600">
              Process payments and manage invoices
            </p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">🚀 Coming Soon</h3>
          <p className="text-sm text-blue-800">
            More features like patient registration, lab result management, billing, and comprehensive reporting are being built out as part of Phase 1.
          </p>
        </div>
      </main>
    </div>
  )
}
