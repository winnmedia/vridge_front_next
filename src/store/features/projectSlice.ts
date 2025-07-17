import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { projectService } from '@/lib/projects/project.service';
import {
  Project,
  ProjectCreateData,
  ProjectUpdateData,
  ProjectListParams,
  ProjectState,
} from '@/types/project.types';

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  totalCount: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
};

// 비동기 액션
export const createProject = createAsyncThunk(
  'project/create',
  async (data: ProjectCreateData) => {
    const project = await projectService.createProject(data);
    return project;
  }
);

export const fetchProjects = createAsyncThunk(
  'project/fetchAll',
  async (params: ProjectListParams = {}) => {
    const response = await projectService.getProjects(params);
    return response;
  }
);

export const fetchProjectById = createAsyncThunk(
  'project/fetchById',
  async (id: number) => {
    const project = await projectService.getProjectById(id);
    return project;
  }
);

export const updateProject = createAsyncThunk(
  'project/update',
  async ({ id, data }: { id: number; data: ProjectUpdateData }) => {
    const project = await projectService.updateProject(id, data);
    return project;
  }
);

export const deleteProject = createAsyncThunk(
  'project/delete',
  async (id: number) => {
    await projectService.deleteProject(id);
    return id;
  }
);

export const checkProjectNameDuplicate = createAsyncThunk(
  'project/checkDuplicate',
  async ({ projectName, userId }: { projectName: string; userId?: number }) => {
    const isDuplicate = await projectService.checkProjectNameDuplicate(projectName, userId);
    return isDuplicate;
  }
);

// 슬라이스
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 프로젝트 생성
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '프로젝트 생성에 실패했습니다.';
      });

    // 프로젝트 목록 조회
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '프로젝트 목록 조회에 실패했습니다.';
      });

    // 프로젝트 상세 조회
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '프로젝트 조회에 실패했습니다.';
      });

    // 프로젝트 업데이트
    builder
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '프로젝트 업데이트에 실패했습니다.';
      });

    // 프로젝트 삭제
    builder
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
        state.totalCount -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '프로젝트 삭제에 실패했습니다.';
      });
  },
});

export const { clearError, setCurrentProject, setCurrentPage, setPageSize } = projectSlice.actions;
export default projectSlice.reducer;