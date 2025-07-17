'use client';

import { useState } from 'react';
import PageTemplate from '@/components/layout/PageTemplate';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function CalendarPage() {
  const { projects } = useSelector((state: RootState) => state.project);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // 샘플 이벤트 데이터
  const events = [
    { date: '2025-01-15', title: '프로젝트 A 촬영', type: 'shooting' },
    { date: '2025-01-18', title: '프로젝트 B 미팅', type: 'meeting' },
    { date: '2025-01-22', title: '편집 마감', type: 'deadline' },
  ];

  const getEventForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const eventTypeColors = {
    shooting: 'bg-blue-500',
    meeting: 'bg-green-500',
    deadline: 'bg-red-500',
  };

  return (
    <PageTemplate>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">프로젝트 캘린더</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 캘린더 헤더 */}
          <div className="bg-gradient-to-r from-[#1631F8] to-[#0F23C9] text-white p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold">
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div
                key={day}
                className={`p-3 text-center text-sm font-medium ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7">
            {/* 빈 날짜 (이전 달) */}
            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24 p-2 border-r border-b bg-gray-50"></div>
            ))}
            
            {/* 실제 날짜 */}
            {Array.from({ length: getDaysInMonth(currentDate) }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventForDate(day);
              const isToday = 
                day === new Date().getDate() && 
                currentDate.getMonth() === new Date().getMonth() && 
                currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div
                  key={day}
                  className={`h-24 p-2 border-r border-b cursor-pointer hover:bg-gray-50 ${
                    isToday ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[#1631F8]' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`text-xs p-1 rounded text-white truncate ${
                          eventTypeColors[event.type as keyof typeof eventTypeColors]
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} 더보기
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 일정 범례 */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-3">일정 유형</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm">촬영</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">미팅</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">마감일</span>
            </div>
          </div>
        </div>

        {/* 오늘의 일정 */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-3">오늘의 일정</h3>
          {projects.slice(0, 3).map((project, index) => (
            <div key={project.id} className="flex items-center justify-between p-3 border-b last:border-0">
              <div>
                <h4 className="font-medium">{project.project_name}</h4>
                <p className="text-sm text-gray-500">
                  {index === 0 ? '촬영 예정' : index === 1 ? '편집 진행중' : '최종 검수'}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(project.deadline).toLocaleDateString('ko-KR')}
              </span>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-gray-500 text-center py-4">오늘은 예정된 일정이 없습니다.</p>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}