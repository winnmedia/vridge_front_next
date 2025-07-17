import { FeedbackService } from '@/lib/feedback/feedback.service';
import { FeedbackCreateData } from '@/types/feedback.types';
import apiClient from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;

  beforeEach(() => {
    feedbackService = new FeedbackService();
    jest.clearAllMocks();
  });

  describe('createFeedback', () => {
    it('텍스트 피드백을 생성해야 함', async () => {
      const feedbackData: FeedbackCreateData = {
        project_id: 1,
        content: '테스트 피드백입니다.',
        timestamp: '00:01:30',
      };

      const mockResponse = {
        id: 1,
        ...feedbackData,
        user_id: 1,
        user_name: '홍길동',
        user_role: 'client',
        created_at: '2024-01-01T00:00:00Z',
        is_read: false,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await feedbackService.createFeedback(feedbackData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/feedbacks/', feedbackData);
      expect(result).toEqual(mockResponse);
    });

    it('파일이 포함된 피드백을 생성해야 함', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const feedbackData: FeedbackCreateData = {
        project_id: 1,
        content: '이미지가 포함된 피드백',
        files: [file],
      };

      const mockResponse = {
        id: 2,
        project_id: 1,
        content: '이미지가 포함된 피드백',
        files: [
          {
            id: 1,
            file_name: 'test.png',
            file_url: 'https://example.com/test.png',
            file_type: 'image/png',
            file_size: 1024,
          },
        ],
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await feedbackService.createFeedback(feedbackData);

      expect(apiClient.post).toHaveBeenCalled();
      const callArgs = (apiClient.post as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe('/api/feedbacks/');
      expect(callArgs[1]).toBeInstanceOf(FormData);
    });
  });

  describe('getFeedbacks', () => {
    it('프로젝트의 피드백 목록을 가져와야 함', async () => {
      const mockFeedbacks = [
        {
          id: 1,
          project_id: 1,
          content: '첫 번째 피드백',
          user_name: '홍길동',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          project_id: 1,
          content: '두 번째 피드백',
          user_name: '김철수',
          created_at: '2024-01-01T01:00:00Z',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockFeedbacks });

      const result = await feedbackService.getFeedbacks({ project_id: 1 });

      expect(apiClient.get).toHaveBeenCalledWith('/api/feedbacks/', {
        params: { project_id: 1 },
      });
      expect(result).toEqual(mockFeedbacks);
    });
  });

  describe('markAsRead', () => {
    it('피드백을 읽음으로 표시해야 함', async () => {
      const mockResponse = { id: 1, is_read: true };

      (apiClient.patch as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await feedbackService.markAsRead(1);

      expect(apiClient.patch).toHaveBeenCalledWith('/api/feedbacks/1/', {
        is_read: true,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('validateFeedback', () => {
    it('유효한 피드백 데이터를 검증해야 함', () => {
      const validData: FeedbackCreateData = {
        project_id: 1,
        content: '유효한 피드백 내용입니다.',
      };

      const result = feedbackService.validateFeedback(validData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('빈 내용에 대해 에러를 반환해야 함', () => {
      const invalidData: FeedbackCreateData = {
        project_id: 1,
        content: '',
      };

      const result = feedbackService.validateFeedback(invalidData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('피드백 내용을 입력해주세요.');
    });

    it('잘못된 타임스탬프 형식에 대해 에러를 반환해야 함', () => {
      const invalidData: FeedbackCreateData = {
        project_id: 1,
        content: '피드백',
        timestamp: 'invalid',
      };

      const result = feedbackService.validateFeedback(invalidData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('올바른 타임스탬프 형식이 아닙니다. (예: 00:01:30)');
    });
  });

  describe('formatTimestamp', () => {
    it('초를 타임스탬프 형식으로 변환해야 함', () => {
      expect(feedbackService.formatTimestamp(90)).toBe('00:01:30');
      expect(feedbackService.formatTimestamp(3661)).toBe('01:01:01');
      expect(feedbackService.formatTimestamp(0)).toBe('00:00:00');
    });
  });

  describe('parseTimestamp', () => {
    it('타임스탬프를 초로 변환해야 함', () => {
      expect(feedbackService.parseTimestamp('00:01:30')).toBe(90);
      expect(feedbackService.parseTimestamp('01:01:01')).toBe(3661);
      expect(feedbackService.parseTimestamp('00:00:00')).toBe(0);
    });
  });
});