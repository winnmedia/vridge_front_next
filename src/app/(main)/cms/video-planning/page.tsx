'use client';

import { useState } from 'react';
import PageTemplate from '@/components/layout/PageTemplate';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function VideoPlanningPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { projects } = useSelector((state: RootState) => state.project);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const tabs = [
    { id: 'overview', label: '개요', icon: '📋' },
    { id: 'storyboard', label: '스토리보드', icon: '🎬' },
    { id: 'script', label: '대본', icon: '📝' },
    { id: 'schedule', label: '일정', icon: '📅' },
    { id: 'resources', label: '리소스', icon: '📦' },
  ];

  return (
    <PageTemplate>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">영상 기획</h1>
          
          {/* 프로젝트 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트 선택
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1631F8] focus:border-[#1631F8]"
            >
              <option value="">프로젝트를 선택하세요</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.project_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#1631F8] text-[#1631F8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {!selectedProject ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                프로젝트를 선택하세요
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                영상 기획을 시작하려면 프로젝트를 선택해주세요.
              </p>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">프로젝트 개요</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">영상 목적</h3>
                      <p className="text-gray-600">브랜드 홍보 및 제품 소개</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">타겟 오디언스</h3>
                      <p className="text-gray-600">20-30대 젊은 직장인</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">핵심 메시지</h3>
                      <p className="text-gray-600">혁신적인 기술로 더 나은 일상을 만듭니다</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'storyboard' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">스토리보드</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((scene) => (
                      <div key={scene} className="border rounded-lg p-4">
                        <div className="w-full h-32 bg-gray-200 rounded mb-2"></div>
                        <p className="text-sm font-medium">씬 {scene}</p>
                        <p className="text-xs text-gray-500">설명 텍스트</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'script' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">대본</h2>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">오프닝</h3>
                      <p className="text-gray-600">
                        현대 사회에서 기술은 우리의 일상을 빠르게 변화시키고 있습니다...
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">메인 내용</h3>
                      <p className="text-gray-600">
                        우리 제품은 이러한 변화의 중심에서...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">제작 일정</h2>
                  <div className="space-y-3">
                    {[
                      { phase: '사전 제작', duration: '1주', status: 'completed' },
                      { phase: '촬영', duration: '3일', status: 'in-progress' },
                      { phase: '편집', duration: '1주', status: 'pending' },
                      { phase: '최종 검수', duration: '2일', status: 'pending' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'in-progress' ? 'bg-blue-500' :
                            'bg-gray-300'
                          }`}></div>
                          <span className="font-medium">{item.phase}</span>
                        </div>
                        <span className="text-sm text-gray-500">{item.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">필요 리소스</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">인력</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 감독 1명</li>
                        <li>• 촬영 감독 1명</li>
                        <li>• 조명 스태프 2명</li>
                        <li>• 편집자 1명</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">장비</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 카메라 (RED/ARRI)</li>
                        <li>• 조명 장비 세트</li>
                        <li>• 오디오 장비</li>
                        <li>• 드론 (항공 촬영용)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}