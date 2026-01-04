'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, ChevronDown, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function UserMenu() {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
      >
        {profile.profile_image ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profile.profile_image}
              alt={profile.name || profile.nickname || 'User'}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {profile.nickname || profile.name || profile.email}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              {profile.profile_image ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={profile.profile_image}
                    alt={profile.name || profile.nickname || 'User'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {profile.name || profile.nickname || '사용자'}
                </p>
                {profile.nickname && profile.name && (
                  <p className="text-xs text-gray-500 truncate">{profile.nickname}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>ID:</span>
                <span className="font-mono text-gray-700">{profile.id.slice(0, 8)}...</span>
              </div>
              {profile.name && (
                <div className="flex justify-between">
                  <span>이름:</span>
                  <span className="text-gray-700">{profile.name}</span>
                </div>
              )}
              {profile.name_en && (
                <div className="flex justify-between">
                  <span>영어이름:</span>
                  <span className="text-gray-700">{profile.name_en}</span>
                </div>
              )}
              {profile.nickname && (
                <div className="flex justify-between">
                  <span>닉네임:</span>
                  <span className="text-gray-700">{profile.nickname}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>역할:</span>
                <span className="text-gray-700">
                  {profile.role === 'SUPER_ADMIN' && '슈퍼 관리자'}
                  {profile.role === 'ACADEMY_OWNER' && '학원 소유자'}
                  {profile.role === 'ACADEMY_MANAGER' && '학원 관리자'}
                  {profile.role === 'INSTRUCTOR' && '강사'}
                  {profile.role === 'USER' && '사용자'}
                </span>
              </div>
              {profile.email && (
                <div className="flex justify-between">
                  <span>이메일:</span>
                  <span className="text-gray-700 truncate">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex justify-between">
                  <span>전화번호:</span>
                  <span className="text-gray-700">{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 p-2">
            <button
              onClick={() => {
                router.push('/my')
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              마이페이지
            </button>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

