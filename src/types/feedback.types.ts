export interface Feedback {
  id: number;
  project_id: number;
  user_id: number;
  user_name: string;
  user_role: string;
  content: string;
  timestamp: string;
  created_at: string;
  is_read: boolean;
  parent_id?: number;
  replies?: Feedback[];
}

export interface FeedbackFile {
  id: number;
  feedback_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface FeedbackCreateData {
  project_id: number;
  content: string;
  timestamp?: string;
  parent_id?: number;
  files?: File[];
}

export interface FeedbackUpdateData {
  content?: string;
  is_read?: boolean;
}

export interface FeedbackListParams {
  project_id: number;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface FeedbackState {
  feedbacks: Feedback[];
  currentFeedback: Feedback | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  unreadCount: number;
}