'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFeedbacks, createFeedback, markAsRead } from '@/store/features/feedbackSlice';
import { fetchProjectById } from '@/store/features/projectSlice';
import { feedbackService } from '@/lib/feedback/feedback.service';

export default function FeedbackPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const dispatch = useDispatch<AppDispatch>();
  
  const { feedbacks, isLoading: feedbackLoading, error: feedbackError } = useSelector(
    (state: RootState) => state.feedback
  );
  const { currentProject, isLoading: projectLoading } = useSelector(
    (state: RootState) => state.project
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [newFeedback, setNewFeedback] = useState('');
  const [selectedTimestamp, setSelectedTimestamp] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchFeedbacks({ project_id: projectId }));
    }
  }, [dispatch, projectId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const feedbackData = {
      project_id: projectId,
      content: newFeedback,
      timestamp: selectedTimestamp,
      files: selectedFiles,
    };
    
    const validation = feedbackService.validateFeedback(feedbackData);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setValidationErrors([]);
    
    try {
      await dispatch(createFeedback(feedbackData)).unwrap();
      setNewFeedback('');
      setSelectedTimestamp('');
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to create feedback:', error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };
  
  const handleMarkAsRead = async (feedbackId: number) => {
    await dispatch(markAsRead(feedbackId));
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const isLoading = feedbackLoading || projectLoading;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 프로젝트 헤더 */}
        {currentProject && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentProject.project_name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">브랜드:</span> {currentProject.brand_name}
              </div>
              <div>
                <span className="font-medium">담당자:</span> {currentProject.project_manager_name}
              </div>
              <div>
                <span className="font-medium">마감일:</span>{' '}
                {new Date(currentProject.deadline).toLocaleDateString('ko-KR')}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 비디오 플레이어 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <p className="text-white">비디오 플레이어 영역</p>
            </div>
            
            {/* 타임라인 */}
            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
              <h3 className="font-semibold mb-2">타임라인</h3>
              <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">타임라인 컴포넌트</p>
              </div>
            </div>
          </div>
          
          {/* 피드백 영역 */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">피드백</h2>
                <p className="text-sm text-gray-600">
                  총 {feedbacks.length}개의 피드백
                </p>
              </div>
              
              {/* 피드백 목록 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1631F8]"></div>
                  </div>
                ) : feedbacks.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    아직 피드백이 없습니다.
                  </p>
                ) : (
                  feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className={`p-4 rounded-lg ${
                        feedback.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      } border`}
                      onClick={() => !feedback.is_read && handleMarkAsRead(feedback.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm">{feedback.user_name}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(feedback.created_at)}
                          </p>
                        </div>
                        {feedback.timestamp && (
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {feedback.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800">{feedback.content}</p>
                      {!feedback.is_read && (
                        <span className="inline-block mt-2 text-xs text-blue-600">
                          새 피드백
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {/* 피드백 입력 폼 */}
              <form onSubmit={handleSubmit} className="p-4 border-t">
                {validationErrors.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 rounded-md">
                    {validationErrors.map((error, idx) => (
                      <p key={idx} className="text-sm text-red-600">• {error}</p>
                    ))}
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="타임스탬프 (예: 00:01:30)"
                      value={selectedTimestamp}
                      onChange={(e) => setSelectedTimestamp(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      파일 첨부
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,video/*,application/pdf"
                    />
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="text-xs text-gray-600">
                      {selectedFiles.length}개 파일 선택됨
                    </div>
                  )}
                  
                  <textarea
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    placeholder="피드백을 입력하세요..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1631F8] focus:border-transparent resize-none"
                  />
                  
                  <button
                    type="submit"
                    disabled={!newFeedback.trim()}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#1631F8] to-[#0F23C9] text-white rounded-md text-sm font-medium hover:from-[#0F23C9] hover:to-[#1631F8] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    피드백 전송
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}