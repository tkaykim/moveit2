'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { School, MapPin, Tag } from 'lucide-react'
import Image from 'next/image'

interface Academy {
  id: string
  name_kr: string | null
  name_en: string | null
  address: string | null
  tags: string | null
  images: any
}

export default function AcademiesTab() {
  const [academies, setAcademies] = useState<Academy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 mb-3">학원</h1>
        {/* 검색바 */}
        <div className="relative">
          <input
            type="text"
            placeholder="학원명, 주소, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <School size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </header>

      <div className="pb-4">
        {filteredAcademies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <School size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              {searchQuery ? '검색 결과가 없습니다' : '등록된 학원이 없습니다'}
            </p>
          </div>
        ) : (
          <div className="px-4 mt-4 space-y-4">
            {filteredAcademies.map((academy) => {
              const imageUrl = academy.images && Array.isArray(academy.images) && academy.images.length > 0
                ? academy.images[0].url
                : null
              
              return (
                <Link
                  key={academy.id}
                  href={`/academies/${academy.id}`}
                  className="block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="flex">
                    {imageUrl ? (
                      <div className="relative w-32 h-32 bg-gray-100 flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={academy.name_kr || ''}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <School size={32} className="text-white opacity-80" />
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <h3 className="font-bold text-base text-gray-900 mb-1">
                        {academy.name_kr || academy.name_en}
                      </h3>
                      {academy.name_en && academy.name_kr && (
                        <p className="text-xs text-gray-500 mb-2">{academy.name_en}</p>
                      )}
                      {academy.address && (
                        <div className="flex items-start gap-1 mb-2">
                          <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600 line-clamp-2 flex-1">
                            {academy.address}
                          </p>
                        </div>
                      )}
                      {academy.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {academy.tags.split(',').slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-1"
                            >
                              <Tag size={10} />
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
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

