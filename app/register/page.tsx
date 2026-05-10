'use client'

import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-primary text-2xl font-bold">G</span>
          </div>
          <div className="text-white">
            <div className="font-semibold text-xl">Grok HMS</div>
            <div className="text-[10px] text-white/60">Healthcare Platform</div>
          </div>
        </Link>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold mb-2">Get Started</h1>
          <p className="text-gray-600 mb-6">Join thousands of healthcare professionals using Grok HMS</p>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Feature Highlights</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ Complete audit trails</li>
                <li>✓ Granular permission control</li>
                <li>✓ Real-time monitoring</li>
                <li>✓ Zero-trust security</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">🚀 Try Now</h3>
              <p className="text-xs text-green-800">
                30-day free pilot with full feature access. No credit card required.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Demo Credentials</h3>
              <p className="text-xs text-purple-800 font-mono">
                Email: admin@grok-hms.dev<br />
                Password: SecureAdmin123!
              </p>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Ready to begin? Use the demo credentials or{' '}
              <a href="mailto:sales@grok-hms.dev" className="text-primary font-semibold hover:underline">
                contact sales
              </a>
            </p>
            <Link href="/login" className="btn-primary w-full py-3 block">
              Sign In Now
            </Link>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have access?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/50 mt-8">
          © 2026 Grok HMS • HIPAA-Ready • SOC 2 Aligned
        </p>
      </div>
    </div>
  )
}
