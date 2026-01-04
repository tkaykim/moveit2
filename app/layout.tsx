import type { Metadata } from 'next'
import './globals.css'
import TabNavigation from '@/components/TabNavigation'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
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
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-white dark:bg-black transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen pb-20 bg-white dark:bg-black">
              <UserMenu />
              {children}
            </div>
            <TabNavigation />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

