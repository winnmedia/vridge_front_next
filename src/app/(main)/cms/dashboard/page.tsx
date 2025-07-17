'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import PageTemplate from '@/components/layout/PageTemplate';
import { AppDispatch, RootState } from '@/store/store';
import { fetchProjects } from '@/store/features/projectSlice';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects, totalCount, isLoading } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    dispatch(fetchProjects({ page: 1, page_size: 5 }));
  }, [dispatch]);

  const stats = [
    {
      label: '전체 프로젝트',
      value: totalCount || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      label: '진행중',
      value: projects.filter(p => p.status === 'active').length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      label: '완료됨',
      value: projects.filter(p => p.status === 'completed').length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      label: '이번달 마감',
      value: projects.filter(p => {
        const deadline = new Date(p.deadline);
        const now = new Date();
        return deadline.getMonth() === now.getMonth() && deadline.getFullYear() === now.getFullYear();
      }).length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-orange-500',
    },
  ];

  return (
    <PageTemplate>
      <div className="max-w-7xl mx-auto">
        {/* 환영 메시지 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            안녕하세요, {user?.name || '사용자'}님
          </h1>
          <p className="text-gray-600 mt-2">
            오늘도 멋진 영상을 만들어보세요!
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">빠른 시작</h2>
            <div className="space-y-3">
              <Link
                href="/cms/project-create"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-[#1631F8] text-white p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">새 프로젝트 생성</h3>
                    <p className="text-sm text-gray-500">영상 제작을 시작하세요</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/cms/video-planning"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-purple-500 text-white p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">영상 기획</h3>
                    <p className="text-sm text-gray-500">스토리보드와 대본 작성</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/cms/calendar"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">일정 관리</h3>
                    <p className="text-sm text-gray-500">프로젝트 일정 확인</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 최근 프로젝트 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">최근 프로젝트</h2>
              <Link href="/cms/projects" className="text-sm text-[#1631F8] hover:underline">
                모두 보기
              </Link>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1631F8]"></div>
              </div>
            ) : projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                아직 프로젝트가 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/cms/feedback/${project.id}`)}
                  >
                    <div>
                      <h4 className="font-medium">{project.project_name}</h4>
                      <p className="text-sm text-gray-500">{project.brand_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {project.status === 'active' ? '진행중' : project.status === 'completed' ? '완료' : '취소됨'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(project.deadline).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 오늘의 할 일 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">오늘의 할 일</h2>
          <div className="space-y-3">
            <div className="flex items-center p-3 border rounded-lg">
              <input type="checkbox" className="mr-3" />
              <div className="flex-1">
                <p className="font-medium">프로젝트 A 스토리보드 검토</p>
                <p className="text-sm text-gray-500">오후 2시까지</p>
              </div>
            </div>
            <div className="flex items-center p-3 border rounded-lg">
              <input type="checkbox" className="mr-3" />
              <div className="flex-1">
                <p className="font-medium">클라이언트 미팅 준비</p>
                <p className="text-sm text-gray-500">오후 4시</p>
              </div>
            </div>
            <div className="flex items-center p-3 border rounded-lg">
              <input type="checkbox" className="mr-3" />
              <div className="flex-1">
                <p className="font-medium">편집 영상 피드백 확인</p>
                <p className="text-sm text-gray-500">오늘 중</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}