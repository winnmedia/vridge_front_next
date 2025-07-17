export interface Project {
  id: number;
  user_id: number;
  project_name: string;
  brand_name: string;
  overview: string;
  reference_link: string;
  deadline: string;
  budget: string;
  project_manager_name: string;
  project_manager_phone: string;
  additional_requests?: string;
  shooting_location?: string;
  shooting_date?: string;
  actor_budget?: string;
  location_budget?: string;
  props_budget?: string;
  costume_budget?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ProjectCreateData {
  project_name: string;
  brand_name: string;
  overview: string;
  reference_link: string;
  deadline: string;
  budget: string;
  project_manager_name: string;
  project_manager_phone: string;
  additional_requests?: string;
  shooting_location?: string;
  shooting_date?: string;
  actor_budget?: string;
  location_budget?: string;
  props_budget?: string;
  costume_budget?: string;
}

export interface ProjectUpdateData extends Partial<ProjectCreateData> {
  status?: 'active' | 'completed' | 'cancelled';
}

export interface ProjectListParams {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
  ordering?: string;
}

export interface ProjectListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
}