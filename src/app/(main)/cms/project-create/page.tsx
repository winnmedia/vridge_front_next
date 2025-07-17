'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { createProject } from '@/store/features/projectSlice';
import { projectService } from '@/lib/projects/project.service';
import { ProjectCreateData } from '@/types/project.types';

export default function ProjectCreatePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.project);
  
  const [formData, setFormData] = useState<ProjectCreateData>({
    project_name: '',
    brand_name: '',
    overview: '',
    reference_link: '',
    deadline: '',
    budget: '',
    project_manager_name: '',
    project_manager_phone: '',
    additional_requests: '',
    shooting_location: '',
    shooting_date: '',
    actor_budget: '',
    location_budget: '',
    props_budget: '',
    costume_budget: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 전화번호 자동 포맷
    if (name === 'project_manager_phone') {
      const formatted = projectService.formatPhoneNumber(value);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 클라이언트 사이드 검증
    const validation = projectService.validateProjectData(formData);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setValidationErrors([]);
    
    try {
      await dispatch(createProject(formData)).unwrap();
      alert('프로젝트가 성공적으로 생성되었습니다.');
      router.push('/cms/projects');
    } catch (error: any) {
      if (error.response?.data?.project_name) {
        setValidationErrors(['이미 존재하는 프로젝트명입니다.']);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">새 프로젝트 생성</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          {(error || validationErrors.length > 0) && (
            <div className="rounded-md bg-red-50 p-4">
              {error && <p className="text-sm text-red-800">{error}</p>}
              {validationErrors.map((err, idx) => (
                <p key={idx} className="text-sm text-red-800">• {err}</p>
              ))}
            </div>
          )}
          
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                placeholder="프로젝트명을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                브랜드명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                placeholder="브랜드명을 입력하세요"
              />
            </div>
          </div>
          
          {/* 프로젝트 개요 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트 개요 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
            />
          </div>
          
          {/* 참고 링크 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참고 링크 <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="reference_link"
              value={formData.reference_link}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
          
          {/* 일정 및 예산 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                마감일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                총 예산 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                placeholder="10000000"
              />
            </div>
          </div>
          
          {/* 담당자 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                담당자명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="project_manager_name"
                value={formData.project_manager_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                placeholder="홍길동"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                담당자 연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="project_manager_phone"
                value={formData.project_manager_phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                placeholder="010-1234-5678"
              />
            </div>
          </div>
          
          {/* 추가 정보 (선택사항) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">추가 정보 (선택사항)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  촬영 장소
                </label>
                <input
                  type="text"
                  name="shooting_location"
                  value={formData.shooting_location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                  placeholder="서울시 강남구"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  촬영 날짜
                </label>
                <input
                  type="date"
                  name="shooting_date"
                  value={formData.shooting_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* 세부 예산 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배우 예산
                </label>
                <input
                  type="number"
                  name="actor_budget"
                  value={formData.actor_budget}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  장소 예산
                </label>
                <input
                  type="number"
                  name="location_budget"
                  value={formData.location_budget}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소품 예산
                </label>
                <input
                  type="number"
                  name="props_budget"
                  value={formData.props_budget}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  의상 예산
                </label>
                <input
                  type="number"
                  name="costume_budget"
                  value={formData.costume_budget}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* 추가 요청사항 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                추가 요청사항
              </label>
              <textarea
                name="additional_requests"
                value={formData.additional_requests}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                placeholder="기타 요청사항을 입력하세요"
              />
            </div>
          </div>
          
          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-[#1631F8] to-[#0F23C9] text-white rounded-md hover:from-[#0F23C9] hover:to-[#1631F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1631F8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '생성 중...' : '프로젝트 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}