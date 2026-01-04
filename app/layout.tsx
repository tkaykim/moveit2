import type { Metadata } from 'next'
import './globals.css'
import TabNavigation from '@/components/TabNavigation'
import { AuthProvider } from '@/contexts/AuthContext'
import UserMenu from '@/components/UserMenu'

export const metadata: Metadata = {
  title: 'MoveIt - 댄스학원 & 수업',
  description: '댄스학원과 수업을 찾아보세요',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        <AuthProvider>
          <div className="min-h-screen pb-20">
            <UserMenu />
            {children}
          </div>
          <TabNavigation />
        </AuthProvider>
      </body>
    </html>
  )
}

