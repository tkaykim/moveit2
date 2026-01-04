'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, School, User, Calendar, UserCircle } from 'lucide-react'

const tabs = [
  { href: '/', label: '홈', icon: Home },
  { href: '/academies', label: '학원', icon: School },
  { href: '/instructors', label: '강사', icon: User },
  { href: '/schedule', label: '일정', icon: Calendar },
  { href: '/my', label: '마이', icon: UserCircle },
]

export default function TabNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href || 
            (tab.href !== '/' && pathname?.startsWith(tab.href))
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-accent dark:text-accent' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
