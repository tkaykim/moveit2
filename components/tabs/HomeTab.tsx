'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Search, Moon, Sun, Bell, MapPin, Percent, Tag, Map, User, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

interface Academy {
  id: string
  name_kr: string | null
  name_en: string | null
  address: string | null
  tags: string | null
  images: any
}

export default function HomeTab() {
  const { theme, toggleTheme } = useTheme()
  const [featuredAcademies, setFeaturedAcademies] = useState<Academy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      // 내 주변 학원 (최대 6개)
      const { data: academies } = await supabase
        .from('academies')
        .select('id, name_kr, name_en, address, tags, images')
        .eq('is_active', true)
        .limit(6)

      setFeaturedAcademies(academies || [])
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
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
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            MOVE<span className="text-accent">.</span>IT
          </h1>
          <div className="flex items-center gap-3">
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
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <MapPin size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        {/* 검색바 */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="장르, 강사, 학원 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </header>

      <div className="pb-4">
        {/* 회원권/원데이 클래스 카드 */}
        <section className="px-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {/* 회원권 카드 */}
            <Link
              href="/memberships"
              className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center">
                <Percent size={24} className="text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">회원권</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">정기 수강</p>
              </div>
            </Link>

            {/* 원데이 클래스 카드 */}
            <Link
              href="/one-day-classes"
              className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center">
                <Tag size={24} className="text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">원데이 클래스</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">체험 수업</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 내 주변 댄스학원, 지도에서 찾기, 강사 찾기 */}
        <section className="px-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {/* 내 주변 댄스학원 */}
            <Link
              href="/academies/nearby"
              className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 active:scale-95 transition-transform"
            >
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">내 주변 댄스학원</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">주변 학원 둘러보기</p>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <MapPin size={32} className="text-gray-400 dark:text-gray-600" />
              </div>
            </Link>

            {/* 지도에서 찾기 */}
            <Link
              href="/academies/map"
              className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 active:scale-95 transition-transform"
            >
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">지도에서 찾기</h3>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Map size={32} className="text-gray-400 dark:text-gray-600" />
              </div>
            </Link>

            {/* 강사 찾기 */}
            <Link
              href="/instructors"
              className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 active:scale-95 transition-transform col-span-2"
            >
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">강사 찾기</h3>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <User size={32} className="text-gray-400 dark:text-gray-600" />
              </div>
            </Link>
          </div>
        </section>

        {/* 소득공제 배너 */}
        <section className="px-4 mt-4">
          <div className="bg-black dark:bg-gray-900 rounded-xl p-4">
            <h3 className="font-bold text-white dark:text-white text-base mb-1">
              소득공제 신청 가능
            </h3>
            <p className="text-sm text-gray-300 dark:text-gray-400">
              댄스 클래스 수강 시 소득공제 혜택을 받아보세요
            </p>
          </div>
        </section>

        {/* 내 주변 댄스학원 리스트 */}
        <section className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">내 주변 댄스학원</h2>
            <Link href="/academies" className="text-sm text-accent flex items-center">
              더보기 <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {featuredAcademies.map((academy) => {
              const imageUrl = academy.images && Array.isArray(academy.images) && academy.images.length > 0
                ? academy.images[0].url
                : null
              
              return (
                <Link
                  key={academy.id}
                  href={`/academies/${academy.id}`}
                  className="flex-shrink-0 w-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm active:scale-95 transition-transform"
                >
                  {imageUrl ? (
                    <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={imageUrl}
                        alt={academy.name_kr || ''}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <MapPin size={32} className="text-white opacity-80" />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                      {academy.name_kr || academy.name_en}
                    </h3>
                    {academy.address && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {academy.address}
                      </p>
                    )}
                    {academy.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {academy.tags.split(',').slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
