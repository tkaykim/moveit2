'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogIn, UserPlus, MessageCircle, Settings, LogOut, Moon, Sun, Bell, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function MyTab() {
  const { theme, toggleTheme } = useTheme()
  const { user, profile, signIn, signUp, signOut, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupNameEn, setSignupNameEn] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupNickname, setSignupNickname] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoadingAction(true)

    try {
      const { error } = await signIn(loginEmail, loginPassword)
      if (error) {
        setError(error.message || '로그인에 실패했습니다.')
      } else {
        setShowLogin(false)
        setLoginEmail('')
        setLoginPassword('')
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setLoadingAction(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoadingAction(true)

    try {
      const { error } = await signUp(
        signupEmail,
        signupPassword,
        signupName,
        signupNameEn || undefined,
        signupPhone || undefined,
        signupNickname || undefined
      )

      if (error) {
        setError(error.message || '회원가입에 실패했습니다.')
      } else {
        setShowSignup(false)
        setSignupEmail('')
        setSignupPassword('')
        setSignupName('')
        setSignupNameEn('')
        setSignupPhone('')
        setSignupNickname('')
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.')
    } finally {
      setLoadingAction(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-gray-500 dark:text-gray-400">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-black min-h-screen">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">마이 무브</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon size={20} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <div className="pb-4">
        {/* 로그인 섹션 */}
        {!user ? (
          <section className="px-4 mt-4">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setShowLogin(true)
                setShowSignup(false)
                setError(null)
              }}
              className="block bg-white dark:bg-gray-900 rounded-xl border-2 border-accent p-4 active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 border-r-2 border-accent border-t-2 rounded-tr-sm"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                    로그인하세요
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    로그인하여 모든 기능을 이용하세요
                  </p>
                </div>
                <ArrowRight size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
            </Link>

            <button
              onClick={() => {
                setShowSignup(true)
                setShowLogin(false)
                setError(null)
              }}
              className="w-full mt-3 bg-accent text-white rounded-xl py-3 font-bold text-base active:scale-95 transition-transform"
            >
              회원가입
            </button>
          </section>
        ) : (
          <section className="px-4 mt-4">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-bold text-lg">
                    {profile?.nickname || profile?.name || profile?.email}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {profile?.email}
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    {profile?.role === 'SUPER_ADMIN' && '슈퍼 관리자'}
                    {profile?.role === 'ACADEMY_OWNER' && '학원 소유자'}
                    {profile?.role === 'ACADEMY_MANAGER' && '학원 관리자'}
                    {profile?.role === 'INSTRUCTOR' && '강사'}
                    {profile?.role === 'USER' && '사용자'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 로그인 모달 */}
        {showLogin && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">로그인</h3>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  placeholder="이메일"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogin(false)
                      setError(null)
                      setLoginEmail('')
                      setLoginPassword('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="flex-1 px-4 py-2 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {loadingAction ? '로그인 중...' : '로그인'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 회원가입 모달 */}
        {showSignup && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">회원가입</h3>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={handleSignup} className="space-y-3">
                <input
                  type="text"
                  placeholder="이름 *"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="영어이름 (선택)"
                  value={signupNameEn}
                  onChange={(e) => setSignupNameEn(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="닉네임 (선택)"
                  value={signupNickname}
                  onChange={(e) => setSignupNickname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="이메일 *"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  type="password"
                  placeholder="비밀번호 *"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                  type="tel"
                  placeholder="전화번호 (선택)"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignup(false)
                      setError(null)
                      setSignupEmail('')
                      setSignupPassword('')
                      setSignupName('')
                      setSignupNameEn('')
                      setSignupPhone('')
                      setSignupNickname('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="flex-1 px-4 py-2 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {loadingAction ? '가입 중...' : '가입하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 메뉴 리스트 */}
        <section className="px-4 mt-6 space-y-1">
          {user && profile ? (
            <>
              <MenuItem
                icon={MessageCircle}
                label="FAQ"
                href="/my/faq"
              />
              <MenuItem
                icon={MessageCircle}
                label="공지/이벤트"
                href="/my/notices"
              />
              <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800"
              >
                <LogOut size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <MenuItem
                icon={MessageCircle}
                label="FAQ"
                href="/my/faq"
              />
              <MenuItem
                icon={MessageCircle}
                label="공지/이벤트"
                href="/my/notices"
              />
            </>
          )}
        </section>

        {/* 앱 정보 */}
        <section className="px-4 mt-8 pb-8">
          <div className="text-center text-xs text-gray-400 dark:text-gray-500">
            <p>MoveIt v1.0.0</p>
            <p className="mt-1">© 2024 MoveIt. All rights reserved.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ComponentType<any>
  label: string
  href: string
}

function MenuItem({ icon: Icon, label, href }: MenuItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
    >
      <Icon size={20} className="text-gray-600 dark:text-gray-400" />
      <span className="text-gray-900 dark:text-white font-medium flex-1">{label}</span>
      <ArrowRight size={16} className="text-gray-400 dark:text-gray-500" />
    </Link>
  )
}
