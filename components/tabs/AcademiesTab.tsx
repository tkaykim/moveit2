'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Search, Moon, Sun, MapPin, Tag, School } from 'lucide-react'
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

export default function AcademiesTab() {
  const { theme, toggleTheme } = useTheme()
  const [academies, setAcademies] = useState<Academy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('default')

  useEffect(() => {
    fetchAcademies()
  }, [])

  const fetchAcademies = async () => {
    try {
      const { data, error } = await supabase
        .from('academies')
        .select('id, name_kr, name_en, address, tags, images')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAcademies(data || [])
    } catch (error) {
      console.error('Error fetching academies:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAcademies = academies.filter((academy) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      academy.name_kr?.toLowerCase().includes(query) ||
      academy.name_en?.toLowerCase().includes(query) ||
      academy.address?.toLowerCase().includes(query) ||
      academy.tags?.toLowerCase().includes(query)
    )
  })

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
        {/* 검색바 */}
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="학원명, 태그, 주소로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* 타이틀 및 필터 */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">댄스학원</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon size={18} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
              기본순
            </button>
            <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
              필터
            </button>
          </div>
        </div>
      </header>

      <div className="pb-4">
        {filteredAcademies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <School size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {searchQuery ? '검색 결과가 없습니다' : '등록된 학원이 없습니다'}
            </p>
          </div>
        ) : (
          <div className="px-4 mt-4 space-y-4">
            {filteredAcademies.map((academy) => {
              const tags = academy.tags ? academy.tags.split(',').map(t => t.trim()) : []
              const firstTag = tags[0] || null
              
              return (
                <Link
                  key={academy.id}
                  href={`/academies/${academy.id}`}
                  className="block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="p-4">
                    {firstTag && (
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-full">
                          {firstTag}
                        </span>
                      </div>
                    )}
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                      {academy.name_kr || academy.name_en}
                    </h3>
                    {academy.address && (
                      <div className="flex items-start gap-1 mt-2">
                        <MapPin size={14} className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
                          {academy.address}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
