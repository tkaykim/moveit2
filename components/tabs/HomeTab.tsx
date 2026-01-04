'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { School, User, Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface Academy {
  id: string
  name_kr: string | null
  name_en: string | null
  address: string | null
  tags: string | null
  images: any
}

interface Class {
  id: string
  title: string | null
  song: string | null
  academy_id: string
  start_time: string | null
  thumbnail_url: string | null
}

interface Instructor {
  id: string
  name_kr: string | null
  name_en: string | null
  profile_image_url: string | null
}

export default function HomeTab() {
  const [featuredAcademies, setFeaturedAcademies] = useState<Academy[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<Class[]>([])
  const [popularInstructors, setPopularInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      // 인기 학원 (최대 6개)
      const { data: academies } = await supabase
        .from('academies')
        .select('id, name_kr, name_en, address, tags, images')
        .eq('is_active', true)
        .limit(6)

      // 곧 시작하는 수업 (최대 5개)
      const { data: classes } = await supabase
        .from('classes')
        .select('id, title, song, academy_id, start_time, thumbnail_url')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5)

      // 인기 강사 (최대 6개)
      const { data: instructors } = await supabase
        .from('instructors')
        .select('id, name_kr, name_en, profile_image_url')
        .order('like', { ascending: false })
        .limit(6)

      setFeaturedAcademies(academies || [])
      setUpcomingClasses(classes || [])
      setPopularInstructors(instructors || [])
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-xl font-bold text-gray-900">MoveIt</h1>
      </header>

      <div className="pb-4">
        {/* 인기 학원 섹션 */}
        <section className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">인기 학원</h2>
            <Link href="/academies" className="text-sm text-primary flex items-center">
              더보기 <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredAcademies.map((academy) => {
              const imageUrl = academy.images && Array.isArray(academy.images) && academy.images.length > 0
                ? academy.images[0].url
                : null
              
              return (
                <Link
                  key={academy.id}
                  href={`/academies/${academy.id}`}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm active:scale-95 transition-transform"
                >
                  {imageUrl ? (
                    <div className="relative w-full h-32 bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={academy.name_kr || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <School size={32} className="text-white opacity-80" />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {academy.name_kr || academy.name_en}
                    </h3>
                    {academy.address && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {academy.address}
                      </p>
                    )}
                    {academy.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {academy.tags.split(',').slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
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

        {/* 곧 시작하는 수업 섹션 */}
        <section className="px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">곧 시작하는 수업</h2>
            <Link href="/schedule" className="text-sm text-primary flex items-center">
              더보기 <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <Link
                key={classItem.id}
                href={`/classes/${classItem.id}`}
                className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
              >
                {classItem.thumbnail_url ? (
                  <div className="relative w-24 h-24 bg-gray-100 flex-shrink-0">
                    <Image
                      src={classItem.thumbnail_url}
                      alt={classItem.title || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                    <Calendar size={24} className="text-white opacity-80" />
                  </div>
                )}
                <div className="flex-1 p-3">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                    {classItem.title || classItem.song}
                  </h3>
                  {classItem.song && classItem.title && (
                    <p className="text-xs text-gray-500 mt-1">{classItem.song}</p>
                  )}
                  {classItem.start_time && (
                    <p className="text-xs text-primary mt-2">
                      {new Date(classItem.start_time).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 인기 강사 섹션 */}
        <section className="px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">인기 강사</h2>
            <Link href="/instructors" className="text-sm text-primary flex items-center">
              더보기 <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {popularInstructors.map((instructor) => (
              <Link
                key={instructor.id}
                href={`/instructors/${instructor.id}`}
                className="flex flex-col items-center bg-white rounded-lg border border-gray-200 p-3 shadow-sm active:scale-95 transition-transform"
              >
                {instructor.profile_image_url ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-2">
                    <Image
                      src={instructor.profile_image_url}
                      alt={instructor.name_kr || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-2">
                    <User size={24} className="text-white" />
                  </div>
                )}
                <h3 className="text-xs font-semibold text-gray-900 text-center line-clamp-1">
                  {instructor.name_kr || instructor.name_en}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

