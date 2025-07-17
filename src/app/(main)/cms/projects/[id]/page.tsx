'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PageTemplate from '@/components/layout/PageTemplate';
import { RootState } from '@/store/store';
import { projectService } from '@/lib/projects/project.service';
import LoadingAnimation from '@/components/common/LoadingAnimation';
import { alert } from '@/components/common/CustomAlert';

interface ProjectDetail {
  id: number;
  project_name: string;
  brand_name: string;
  project_type: string;
  production_scale: string;
  filming_location: string;
  budget: number;
  deadline: string;
  status: string;
  project_manager_name: string;
  project_manager_phone: string;
  project_manager_email: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const fetchProjectDetail = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${params.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('프로젝트 정보를 불러올 수 없습니다.');
      }

      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjectDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, isAuthenticated]);

  const handleDelete = async () => {
    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${params.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('프로젝트 삭제에 실패했습니다.');
      }

      await alert('프로젝트가 성공적으로 삭제되었습니다.', '삭제 완료', 'success');
      router.push('/cms/projects');
    } catch (err) {
      await alert(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
        '삭제 실패',
        'error'
      );
    }
  };

  if (isLoading) {
    return (
      <PageTemplate>
        <LoadingAnimation text="프로젝트 정보를 불러오는 중..." />
      </PageTemplate>
    );
  }

  if (error || !project) {
    return (
      <PageTemplate>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 rounded-lg p-8 text-center">
            <p className="text-red-600 mb-4">{error || '프로젝트를 찾을 수 없습니다.'}</p>
            <Link
              href="/cms/projects"
              className="text-[#1631F8] hover:underline"
            >
              프로젝트 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.project_name}</h1>
            <p className="text-lg text-gray-600 mt-2">{project.brand_name}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/cms/feedback/${project.id}`}
              className="px-4 py-2 bg-gradient-to-r from-[#1631F8] to-[#0F23C9] text-white rounded-md hover:from-[#0F23C9] hover:to-[#1631F8] transition-all"
            >
              피드백 관리
            </Link>
            <button
              onClick={() => router.push(`/cms/projects/${project.id}/edit`)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        </div>

        {/* 상태 배지 */}
        <div className="mb-6">
          {project.status === 'active' && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              진행중
            </span>
          )}
          {project.status === 'completed' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              완료
            </span>
          )}
          {project.status === 'cancelled' && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              취소됨
            </span>
          )}
        </div>

        {/* 프로젝트 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">프로젝트 정보</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">프로젝트 유형</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.project_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">제작 규모</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.production_scale}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">촬영 장소</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.filming_location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">예산</dt>
                <dd className="mt-1 text-sm text-gray-900">{projectService.formatCurrency(project.budget)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">마감일</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(project.deadline).toLocaleDateString('ko-KR')}
                </dd>
              </div>
            </dl>
          </div>

          {/* 담당자 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">담당자 정보</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">담당자명</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.project_manager_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">연락처</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.project_manager_phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">이메일</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.project_manager_email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">생성일</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(project.created_at).toLocaleDateString('ko-KR')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">수정일</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(project.updated_at).toLocaleDateString('ko-KR')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 프로젝트 설명 */}
        {project.description && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">프로젝트 설명</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </div>
        )}

        {/* 빠른 액션 */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">빠른 액션</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/cms/video-planning?project=${project.id}`}
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2 text-[#1631F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              영상 기획
            </Link>
            <Link
              href={`/cms/calendar?project=${project.id}`}
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2 text-[#1631F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              일정 확인
            </Link>
            <button
              onClick={() => alert('보고서 생성 기능은 준비 중입니다.', '알림', 'info')}
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2 text-[#1631F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              보고서 생성
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}