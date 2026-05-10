import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster' // Will add shadcn later

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grok HMS | World-Class Hospital Management',
  description: 'Secure, auditable, permission-first healthcare operations platform built to Blueprint v2.0',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}