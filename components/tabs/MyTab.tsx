'use client'

import { useState } from 'react'
import { User, LogIn, UserPlus, MessageCircle, Calendar, Heart, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function MyTab() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">마이</h1>
      </header>

      <div className="pb-4">
        {/* 사용자 정보 섹션 */}
        <section className="px-4 py-6 bg-gradient-to-br from-primary to-secondary">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg">사용자님</h2>
                <p className="text-white/80 text-sm">환영합니다!</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white mb-4">로그인하여 더 많은 기능을 이용하세요</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLogin(true)
                    setShowSignup(false)
                  }}
                  className="flex-1 bg-white text-primary px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  로그인
                </button>
                <button
                  onClick={() => {
                    setShowSignup(true)
                    setShowLogin(false)
                  }}
                  className="flex-1 bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 border border-white/30"
                >
                  <UserPlus size={18} />
                  회원가입
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 로그인 모달 */}
        {showLogin && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold mb-4">로그인</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="이메일"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowLogin(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      setIsLoggedIn(true)
                      setShowLogin(false)
                    }}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium"
                  >
                    로그인
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 회원가입 모달 */}
        {showSignup && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">회원가입</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="이름"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="이메일"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="tel"
                  placeholder="전화번호 (선택)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowSignup(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      setIsLoggedIn(true)
                      setShowSignup(false)
                    }}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium"
                  >
                    가입하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 메뉴 리스트 */}
        <section className="px-4 mt-6 space-y-1">
          {isLoggedIn ? (
            <>
              <MenuItem
                icon={Calendar}
                label="내가 신청한 클래스"
                href="/my/bookings"
              />
              <MenuItem
                icon={Heart}
                label="내가 찜한 클래스"
                href="/my/favorite-classes"
              />
              <MenuItem
                icon={Heart}
                label="내가 찜한 강사"
                href="/my/favorite-instructors"
              />
              <MenuItem
                icon={Heart}
                label="내가 찜한 학원"
                href="/my/favorite-academies"
              />
              <div className="border-t border-gray-200 my-2" />
              <MenuItem
                icon={MessageCircle}
                label="문의사항"
                href="/my/inquiries"
              />
              <MenuItem
                icon={Settings}
                label="설정"
                href="/my/settings"
              />
              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 active:bg-gray-50"
              >
                <LogOut size={20} className="text-gray-600" />
                <span className="text-gray-900 font-medium">로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <MenuItem
                icon={MessageCircle}
                label="문의사항"
                href="/my/inquiries"
              />
              <MenuItem
                icon={Settings}
                label="설정"
                href="/my/settings"
              />
            </>
          )}
        </section>

        {/* 앱 정보 */}
        <section className="px-4 mt-8 pb-8">
          <div className="text-center text-xs text-gray-400">
            <p>MoveIt v1.0.0</p>
            <p className="mt-1">© 2024 MoveIt. All rights reserved.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  href: string
}

function MenuItem({ icon: Icon, label, href }: MenuItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 active:bg-gray-50 transition-colors"
    >
      <Icon size={20} className="text-gray-600" />
      <span className="text-gray-900 font-medium flex-1">{label}</span>
      <span className="text-gray-400">›</span>
    </Link>
  )
}

