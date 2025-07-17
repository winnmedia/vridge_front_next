import { ProjectService } from '@/lib/projects/project.service';
import { ProjectCreateData, ProjectUpdateData } from '@/types/project.types';
import apiClient from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('ProjectService', () => {
  let projectService: ProjectService;

  beforeEach(() => {
    projectService = new ProjectService();
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('성공적으로 프로젝트를 생성해야 함', async () => {
      const projectData: ProjectCreateData = {
        project_name: '테스트 프로젝트',
        brand_name: '테스트 브랜드',
        overview: '프로젝트 개요',
        reference_link: 'https://example.com',
        deadline: '2024-12-31',
        budget: '10000000',
        project_manager_name: '홍길동',
        project_manager_phone: '010-1234-5678',
      };

      const mockResponse = {
        id: 1,
        ...projectData,
        user_id: 1,
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await projectService.createProject(projectData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/projects/', projectData);
      expect(result).toEqual(mockResponse);
    });

    it('중복된 프로젝트명으로 생성 실패해야 함', async () => {
      const projectData: ProjectCreateData = {
        project_name: '중복된 프로젝트',
        brand_name: '테스트 브랜드',
        overview: '프로젝트 개요',
        reference_link: 'https://example.com',
        deadline: '2024-12-31',
        budget: '10000000',
        project_manager_name: '홍길동',
        project_manager_phone: '010-1234-5678',
      };

      const errorResponse = {
        response: {
          data: {
            project_name: ['이미 존재하는 프로젝트명입니다.'],
          },
        },
      };

      (apiClient.post as jest.Mock).mockRejectedValue(errorResponse);

      await expect(projectService.createProject(projectData)).rejects.toThrow();
    });
  });

  describe('getProjects', () => {
    it('프로젝트 목록을 가져와야 함', async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            project_name: '프로젝트 1',
            brand_name: '브랜드 1',
            status: 'active',
          },
          {
            id: 2,
            project_name: '프로젝트 2',
            brand_name: '브랜드 2',
            status: 'completed',
          },
        ],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await projectService.getProjects({ page: 1, page_size: 10 });

      expect(apiClient.get).toHaveBeenCalledWith('/api/projects/', {
        params: { page: 1, page_size: 10 },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getProjectById', () => {
    it('특정 프로젝트를 가져와야 함', async () => {
      const mockProject = {
        id: 1,
        project_name: '테스트 프로젝트',
        brand_name: '테스트 브랜드',
        status: 'active',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProject });

      const result = await projectService.getProjectById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/api/projects/1/');
      expect(result).toEqual(mockProject);
    });
  });

  describe('updateProject', () => {
    it('프로젝트를 업데이트해야 함', async () => {
      const updateData: ProjectUpdateData = {
        project_name: '업데이트된 프로젝트',
        status: 'completed',
      };

      const mockResponse = {
        id: 1,
        ...updateData,
      };

      (apiClient.patch as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await projectService.updateProject(1, updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/api/projects/1/', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteProject', () => {
    it('프로젝트를 삭제해야 함', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: {} });

      await projectService.deleteProject(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/projects/1/');
    });
  });

  describe('validateProjectData', () => {
    it('유효한 프로젝트 데이터를 검증해야 함', () => {
      const validData: ProjectCreateData = {
        project_name: '유효한 프로젝트',
        brand_name: '유효한 브랜드',
        overview: '프로젝트 개요',
        reference_link: 'https://example.com',
        deadline: '2024-12-31',
        budget: '10000000',
        project_manager_name: '홍길동',
        project_manager_phone: '010-1234-5678',
      };

      const result = projectService.validateProjectData(validData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('잘못된 프로젝트 데이터에 대해 에러를 반환해야 함', () => {
      const invalidData: ProjectCreateData = {
        project_name: '', // 빈 프로젝트명
        brand_name: '',
        overview: '',
        reference_link: 'invalid-url', // 잘못된 URL
        deadline: '2020-01-01', // 과거 날짜
        budget: 'invalid', // 잘못된 예산
        project_manager_name: '',
        project_manager_phone: '123', // 잘못된 전화번호
      };

      const result = projectService.validateProjectData(invalidData);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});