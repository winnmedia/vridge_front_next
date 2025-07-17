import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { feedbackService } from '@/lib/feedback/feedback.service';
import {
  Feedback,
  FeedbackCreateData,
  FeedbackUpdateData,
  FeedbackListParams,
  FeedbackState,
} from '@/types/feedback.types';

const initialState: FeedbackState = {
  feedbacks: [],
  currentFeedback: null,
  isLoading: false,
  error: null,
  isConnected: false,
  unreadCount: 0,
};

// 비동기 액션
export const createFeedback = createAsyncThunk(
  'feedback/create',
  async (data: FeedbackCreateData) => {
    const feedback = await feedbackService.createFeedback(data);
    return feedback;
  }
);

export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchAll',
  async (params: FeedbackListParams) => {
    const feedbacks = await feedbackService.getFeedbacks(params);
    return feedbacks;
  }
);

export const fetchFeedbackById = createAsyncThunk(
  'feedback/fetchById',
  async (id: number) => {
    const feedback = await feedbackService.getFeedbackById(id);
    return feedback;
  }
);

export const updateFeedback = createAsyncThunk(
  'feedback/update',
  async ({ id, data }: { id: number; data: FeedbackUpdateData }) => {
    const feedback = await feedbackService.updateFeedback(id, data);
    return feedback;
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/delete',
  async (id: number) => {
    await feedbackService.deleteFeedback(id);
    return id;
  }
);

export const markAsRead = createAsyncThunk(
  'feedback/markAsRead',
  async (id: number) => {
    const feedback = await feedbackService.markAsRead(id);
    return feedback;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'feedback/fetchUnreadCount',
  async (projectId: number) => {
    const count = await feedbackService.getUnreadCount(projectId);
    return count;
  }
);

// 슬라이스
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentFeedback: (state, action: PayloadAction<Feedback | null>) => {
      state.currentFeedback = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    addFeedbackFromWebSocket: (state, action: PayloadAction<Feedback>) => {
      // 중복 체크
      const exists = state.feedbacks.some((f) => f.id === action.payload.id);
      if (!exists) {
        state.feedbacks.push(action.payload);
        // 다른 사용자의 피드백인 경우 unread count 증가
        if (action.payload.user_id !== state.currentFeedback?.user_id) {
          state.unreadCount += 1;
        }
      }
    },
    updateFeedbackFromWebSocket: (state, action: PayloadAction<Feedback>) => {
      const index = state.feedbacks.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.feedbacks[index] = action.payload;
      }
    },
    deleteFeedbackFromWebSocket: (state, action: PayloadAction<number>) => {
      state.feedbacks = state.feedbacks.filter((f) => f.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // 피드백 생성
    builder
      .addCase(createFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks.push(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '피드백 생성에 실패했습니다.';
      });

    // 피드백 목록 조회
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '피드백 목록 조회에 실패했습니다.';
      });

    // 피드백 상세 조회
    builder
      .addCase(fetchFeedbackById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFeedback = action.payload;
      })
      .addCase(fetchFeedbackById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '피드백 조회에 실패했습니다.';
      });

    // 피드백 업데이트
    builder
      .addCase(updateFeedback.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
        if (state.currentFeedback?.id === action.payload.id) {
          state.currentFeedback = action.payload;
        }
      });

    // 피드백 삭제
    builder
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter((f) => f.id !== action.payload);
        if (state.currentFeedback?.id === action.payload) {
          state.currentFeedback = null;
        }
      });

    // 읽음 표시
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      });

    // 읽지 않은 개수 조회
    builder
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentFeedback,
  setConnectionStatus,
  addFeedbackFromWebSocket,
  updateFeedbackFromWebSocket,
  deleteFeedbackFromWebSocket,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;