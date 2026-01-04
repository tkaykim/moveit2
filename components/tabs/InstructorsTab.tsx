'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { User, Heart, Search, Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

interface Instructor {
  id: string
  name_kr: string | null
  name_en: string | null
  profile_image_url: string | null
  bio: string | null
  specialties: string | null
  like: number | null
}

export default function InstructorsTab() {
  const { theme, toggleTheme } = useTheme()
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      const { data, error } = await supabase
        .from('instructors')
        .select('id, name_kr, name_en, profile_image_url, bio, specialties, like')
        .order('like', { ascending: false })

      if (error) throw error
      setInstructors(data || [])
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInstructors = instructors.filter((instructor) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      instructor.name_kr?.toLowerCase().includes(query) ||
      instructor.name_en?.toLowerCase().includes(query) ||
      instructor.specialties?.toLowerCase().includes(query) ||
      instructor.bio?.toLowerCase().includes(query)
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
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">강사</h1>
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
        </div>
        {/* 검색바 */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="강사명, 전문분야로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </header>

      <div className="pb-4">
        {filteredInstructors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <User size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {searchQuery ? '검색 결과가 없습니다' : '등록된 강사가 없습니다'}
            </p>
          </div>
        ) : (
          <div className="px-4 mt-4 space-y-4">
            {filteredInstructors.map((instructor) => (
              <Link
                key={instructor.id}
                href={`/instructors/${instructor.id}`}
                className="flex bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm active:scale-[0.98] transition-transform p-4"
              >
                {instructor.profile_image_url ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <Image
                      src={instructor.profile_image_url}
                      alt={instructor.name_kr || ''}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <User size={32} className="text-white" />
                  </div>
                )}
                <div className="flex-1 ml-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">
                        {instructor.name_kr || instructor.name_en}
                      </h3>
                      {instructor.name_en && instructor.name_kr && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{instructor.name_en}</p>
                      )}
                    </div>
                    {instructor.like !== null && instructor.like > 0 && (
                      <div className="flex items-center gap-1 text-red-500 dark:text-red-400 flex-shrink-0 ml-2">
                        <Heart size={14} fill="currentColor" />
                        <span className="text-xs font-medium">{instructor.like}</span>
                      </div>
                    )}
                  </div>
                  {instructor.specialties && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                      {instructor.specialties}
                    </p>
                  )}
                  {instructor.bio && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {instructor.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
