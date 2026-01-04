'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Calendar, Clock, MapPin, User } from 'lucide-react'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import Image from 'next/image'

interface ClassSchedule {
  id: string
  title: string | null
  song: string | null
  start_time: string | null
  end_time: string | null
  thumbnail_url: string | null
  difficulty_level: string | null
  genre: string | null
  academy_id: string
  instructor_id: string | null
  academies: {
    name_kr: string | null
    name_en: string | null
    address: string | null
  } | null
  instructors: {
    name_kr: string | null
    name_en: string | null
  } | null
}

export default function ScheduleTab() {
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>('all') // 'all', 'today', 'upcoming'

  useEffect(() => {
    fetchSchedule()
  }, [selectedDate])

  const fetchSchedule = async () => {
    try {
      let query = supabase
        .from('classes')
        .select(`
          id,
          title,
          song,
          start_time,
          end_time,
          thumbnail_url,
          difficulty_level,
          genre,
          academy_id,
          instructor_id,
          academies:academy_id (name_kr, name_en, address),
          instructors:instructor_id (name_kr, name_en)
        `)
        .order('start_time', { ascending: true })

      // 날짜 필터링
      if (selectedDate === 'today') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        query = query.gte('start_time', today.toISOString()).lt('start_time', tomorrow.toISOString())
      } else if (selectedDate === 'upcoming') {
        query = query.gte('start_time', new Date().toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      setClasses((data as ClassSchedule[]) || [])
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = parseISO(dateString)
    if (isToday(date)) return '오늘'
    if (isTomorrow(date)) return '내일'
    return format(date, 'M월 d일 (EEE)', { locale: undefined })
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return ''
    return format(parseISO(dateString), 'HH:mm')
  }

  const groupedByDate = classes.reduce((acc, classItem) => {
    if (!classItem.start_time) return acc
    const dateKey = format(parseISO(classItem.start_time), 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(classItem)
    return acc
  }, {} as Record<string, ClassSchedule[]>)

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
        <h1 className="text-xl font-bold text-gray-900 mb-3">스케줄</h1>
        {/* 필터 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDate('all')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDate === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedDate('today')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDate === 'today'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            오늘
          </button>
          <button
            onClick={() => setSelectedDate('upcoming')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDate === 'upcoming'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            예정
          </button>
        </div>
      </header>

      <div className="pb-4">
        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              {selectedDate === 'today' 
                ? '오늘 예정된 수업이 없습니다'
                : selectedDate === 'upcoming'
                ? '예정된 수업이 없습니다'
                : '등록된 수업이 없습니다'}
            </p>
          </div>
        ) : (
          <div className="px-4 mt-4">
            {Object.entries(groupedByDate).map(([dateKey, dayClasses]) => (
              <div key={dateKey} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={18} className="text-primary" />
                  <h2 className="font-bold text-base text-gray-900">
                    {formatDate(dayClasses[0]?.start_time || null)}
                  </h2>
                  <span className="text-xs text-gray-500">
                    ({dayClasses.length}개 수업)
                  </span>
                </div>
                <div className="space-y-3">
                  {dayClasses.map((classItem) => (
                    <Link
                      key={classItem.id}
                      href={`/classes/${classItem.id}`}
                      className="block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
                    >
                      <div className="flex">
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
                          <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
                            {classItem.title || classItem.song}
                          </h3>
                          {classItem.song && classItem.title && (
                            <p className="text-xs text-gray-500 mb-2">{classItem.song}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                            {classItem.start_time && (
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>
                                  {formatTime(classItem.start_time)}
                                  {classItem.end_time && ` - ${formatTime(classItem.end_time)}`}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {classItem.academies && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin size={12} />
                                <span className="line-clamp-1">
                                  {classItem.academies.name_kr || classItem.academies.name_en}
                                </span>
                              </div>
                            )}
                            {classItem.instructors && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <User size={12} />
                                <span>
                                  {classItem.instructors.name_kr || classItem.instructors.name_en}
                                </span>
                              </div>
                            )}
                          </div>
                          {(classItem.genre || classItem.difficulty_level) && (
                            <div className="flex gap-1.5 mt-2">
                              {classItem.genre && (
                                <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">
                                  {classItem.genre}
                                </span>
                              )}
                              {classItem.difficulty_level && (
                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                  {classItem.difficulty_level}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

