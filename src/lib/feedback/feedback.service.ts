import apiClient from '@/lib/api/client';
import {
  Feedback,
  FeedbackCreateData,
  FeedbackUpdateData,
  FeedbackListParams,
} from '@/types/feedback.types';

export class FeedbackService {
  async createFeedback(data: FeedbackCreateData): Promise<Feedback> {
    const formData = new FormData();
    
    formData.append('project_id', data.project_id.toString());
    formData.append('content', data.content);
    
    if (data.timestamp) {
      formData.append('timestamp', data.timestamp);
    }
    
    if (data.parent_id) {
      formData.append('parent_id', data.parent_id.toString());
    }
    
    // 파일 처리
    if (data.files && data.files.length > 0) {
      data.files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    }
    
    const response = await apiClient.post('/api/feedbacks/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  async getFeedbacks(params: FeedbackListParams): Promise<Feedback[]> {
    const response = await apiClient.get('/api/feedbacks/', { params });
    return response.data;
  }

  async getFeedbackById(id: number): Promise<Feedback> {
    const response = await apiClient.get(`/api/feedbacks/${id}/`);
    return response.data;
  }

  async updateFeedback(id: number, data: FeedbackUpdateData): Promise<Feedback> {
    const response = await apiClient.patch(`/api/feedbacks/${id}/`, data);
    return response.data;
  }

  async deleteFeedback(id: number): Promise<void> {
    await apiClient.delete(`/api/feedbacks/${id}/`);
  }

  async markAsRead(id: number): Promise<Feedback> {
    return this.updateFeedback(id, { is_read: true });
  }

  async getUnreadCount(projectId: number): Promise<number> {
    const response = await apiClient.get(`/api/feedbacks/unread-count/`, {
      params: { project_id: projectId },
    });
    return response.data.count;
  }

  validateFeedback(data: FeedbackCreateData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.content || data.content.trim().length === 0) {
      errors.push('피드백 내용을 입력해주세요.');
    }
    
    if (data.content && data.content.length > 1000) {
      errors.push('피드백 내용은 1000자 이내로 입력해주세요.');
    }
    
    if (data.timestamp) {
      const timestampRegex = /^\d{2}:\d{2}:\d{2}$/;
      if (!timestampRegex.test(data.timestamp)) {
        errors.push('올바른 타임스탬프 형식이 아닙니다. (예: 00:01:30)');
      }
    }
    
    if (data.files) {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];
      
      data.files.forEach((file) => {
        if (file.size > maxFileSize) {
          errors.push(`${file.name}: 파일 크기는 10MB 이하여야 합니다.`);
        }
        
        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name}: 지원하지 않는 파일 형식입니다.`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map((v) => v.toString().padStart(2, '0'))
      .join(':');
  }

  parseTimestamp(timestamp: string): number {
    const parts = timestamp.split(':');
    if (parts.length !== 3) return 0;
    
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parseInt(parts[2], 10) || 0;
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  groupFeedbacksByTimestamp(feedbacks: Feedback[]): Map<string, Feedback[]> {
    const grouped = new Map<string, Feedback[]>();
    
    feedbacks.forEach((feedback) => {
      const timestamp = feedback.timestamp || '00:00:00';
      if (!grouped.has(timestamp)) {
        grouped.set(timestamp, []);
      }
      grouped.get(timestamp)!.push(feedback);
    });
    
    return grouped;
  }

  // WebSocket 연결을 위한 URL 생성
  getWebSocketUrl(projectId: number): string {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.NEXT_PUBLIC_SOCKET_URI || 'ws://localhost:8000';
    return `${wsHost}/ws/feedback/${projectId}/`;
  }
}

// 싱글톤 인스턴스
export const feedbackService = new FeedbackService();