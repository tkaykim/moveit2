import type { Metadata } from 'next'
import './globals.css'
import TabNavigation from '@/components/TabNavigation'

export const metadata: Metadata = {
  title: 'MoveIt - 댄스학원 & 수업',
  description: '댄스학원과 수업을 찾아보세요',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        <div className="min-h-screen pb-20">
          {children}
        </div>
        <TabNavigation />
      </body>
    </html>
  )
}

