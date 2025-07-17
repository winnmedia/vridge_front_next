import apiClient from '@/lib/api/client';
import {
  Project,
  ProjectCreateData,
  ProjectUpdateData,
  ProjectListParams,
  ProjectListResponse,
} from '@/types/project.types';

export class ProjectService {
  async createProject(data: ProjectCreateData): Promise<Project> {
    const response = await apiClient.post('/api/projects/', data);
    return response.data;
  }

  async getProjects(params: ProjectListParams = {}): Promise<ProjectListResponse> {
    const response = await apiClient.get('/api/projects/', { params });
    return response.data;
  }

  async getProjectById(id: number): Promise<Project> {
    const response = await apiClient.get(`/api/projects/${id}/`);
    return response.data;
  }

  async updateProject(id: number, data: ProjectUpdateData): Promise<Project> {
    const response = await apiClient.patch(`/api/projects/${id}/`, data);
    return response.data;
  }

  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/api/projects/${id}/`);
  }

  async checkProjectNameDuplicate(projectName: string, userId?: number): Promise<boolean> {
    try {
      const params: any = { project_name: projectName };
      if (userId) {
        params.user_id = userId;
      }
      
      const response = await apiClient.get('/api/projects/check-duplicate/', { params });
      return response.data.is_duplicate;
    } catch (error) {
      return false;
    }
  }

  validateProjectData(data: ProjectCreateData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 프로젝트명 검증
    if (!data.project_name || data.project_name.trim().length < 2) {
      errors.push('프로젝트명은 2자 이상이어야 합니다.');
    }

    // 브랜드명 검증
    if (!data.brand_name || data.brand_name.trim().length < 2) {
      errors.push('브랜드명은 2자 이상이어야 합니다.');
    }

    // 개요 검증
    if (!data.overview || data.overview.trim().length < 10) {
      errors.push('프로젝트 개요는 10자 이상이어야 합니다.');
    }

    // URL 검증
    try {
      if (data.reference_link) {
        new URL(data.reference_link);
      }
    } catch {
      errors.push('올바른 URL 형식이 아닙니다.');
    }

    // 날짜 검증
    const deadline = new Date(data.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadline < today) {
      errors.push('마감일은 오늘 이후여야 합니다.');
    }

    // 예산 검증
    const budget = parseInt(data.budget);
    if (isNaN(budget) || budget <= 0) {
      errors.push('예산은 0보다 큰 숫자여야 합니다.');
    }

    // 담당자 정보 검증
    if (!data.project_manager_name || data.project_manager_name.trim().length < 2) {
      errors.push('담당자명은 2자 이상이어야 합니다.');
    }

    // 전화번호 검증
    const phoneRegex = /^(\d{2,3}-\d{3,4}-\d{4})|(\d{10,11})$/;
    if (!phoneRegex.test(data.project_manager_phone.replace(/\s/g, ''))) {
      errors.push('올바른 전화번호 형식이 아닙니다.');
    }

    // 선택적 예산 필드 검증
    const optionalBudgets = [
      'actor_budget',
      'location_budget',
      'props_budget',
      'costume_budget',
    ] as const;

    optionalBudgets.forEach((field) => {
      if (data[field]) {
        const value = parseInt(data[field]!);
        if (isNaN(value) || value < 0) {
          errors.push(`${field.replace('_', ' ')}은 0 이상의 숫자여야 합니다.`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    
    return phone;
  }

  formatCurrency(amount: string | number): string {
    const num = typeof amount === 'string' ? parseInt(amount) : amount;
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(num);
  }
}

// 싱글톤 인스턴스
export const projectService = new ProjectService();