'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react'
import { format, isToday, parseISO, startOfWeek, addWeeks, subWeeks, eachDayOfInterval, startOfDay } from 'date-fns'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

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
  const { theme, toggleTheme } = useTheme()
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

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

      if (selectedDate) {
        const start = new Date(selectedDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setDate(end.getDate() + 1)
        query = query.gte('start_time', start.toISOString()).lt('start_time', end.toISOString()) as any
      } else {
        query = query.gte('start_time', new Date().toISOString()) as any
      }

      const { data, error } = await query

      if (error) throw error
      
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        academies: Array.isArray(item.academies) ? item.academies[0] || null : item.academies,
        instructors: Array.isArray(item.instructors) ? item.instructors[0] || null : item.instructors,
      }))
      
      setClasses(formattedData as ClassSchedule[])
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return ''
    return format(parseISO(dateString), 'HH:mm')
  }

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
  })

  const getClassesForDate = (date: Date) => {
    if (!selectedDate) return []
    const dateStr = format(date, 'yyyy-MM-dd')
    return classes.filter(c => {
      if (!c.start_time) return false
      return format(parseISO(c.start_time), 'yyyy-MM-dd') === dateStr
    })
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
  }

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const weekRange = `${format(weekStart, 'M/d')} - ${format(weekDays[6], 'M/d')}`

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
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">클래스 일정</h1>
        
        {/* 날짜 네비게이션 */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={goToPreviousWeek} className="p-2">
            <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{weekRange}</span>
            <button
              onClick={goToToday}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              오늘
            </button>
          </div>
          <button onClick={goToNextWeek} className="p-2">
            <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* 주간 캘린더 */}
        <div className="flex gap-2">
          {weekDays.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd')
            const isSelected = selectedDate === dayStr
            const dayClasses = getClassesForDate(day)
            const classCount = dayClasses.length

            return (
              <button
                key={dayStr}
                onClick={() => setSelectedDate(dayStr)}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                }`}
              >
                <div className="text-xs mb-1">
                  {['일', '월', '화', '수', '목', '금', '토'][day.getDay()]}
                </div>
                <div className="text-sm font-medium">{format(day, 'd')}</div>
                {classCount > 0 && (
                  <div className={`text-xs mt-1 ${isSelected ? 'text-white' : 'text-accent'}`}>
                    {classCount}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </header>

      <div className="pb-4">
        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {selectedDate ? '선택한 날짜에 예정된 수업이 없습니다' : '예정된 수업이 없습니다'}
            </p>
          </div>
        ) : (
          <div className="px-4 mt-4 space-y-3">
            {classes.map((classItem) => {
              const isAvailable = true // 실제로는 예약 가능 여부를 확인해야 함
              
              return (
                <Link
                  key={classItem.id}
                  href={`/classes/${classItem.id}`}
                  className="block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatTime(classItem.start_time)}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                          {classItem.instructors?.name_kr || classItem.instructors?.name_en || '강사'} {classItem.title || classItem.song || '클래스'}
                        </h3>
                        {classItem.academies && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {classItem.academies.name_kr || classItem.academies.name_en}
                            {classItem.academies.address && ` • ${classItem.academies.address}`}
                          </p>
                        )}
                        {classItem.instructors && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {classItem.instructors.name_kr || classItem.instructors.name_en} • A HALL
                          </p>
                        )}
                      </div>
                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          isAvailable
                            ? 'bg-accent text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {isAvailable ? '예약 가능' : '마감'}
                      </button>
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
