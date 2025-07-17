import apiClient from '@/lib/api/client';
import { LoginCredentials, RegisterData, User, AuthTokens } from '@/types/auth.types';
import { setCookie, destroyCookie } from 'nookies';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<{ access: string; refresh: string; user: User }> {
    const response = await apiClient.post('/api/auth/login/', credentials);
    const { access, refresh, user } = response.data;

    // 토큰을 쿠키에 저장
    setCookie(null, 'authToken', access, {
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: '/',
    });

    setCookie(null, 'refreshToken', refresh, {
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: '/',
    });

    return { access, refresh, user };
  }

  async logout(): Promise<void> {
    // 서버에 로그아웃 요청 (선택사항)
    try {
      await apiClient.post('/api/auth/logout/');
    } catch (error) {
      // 로그아웃 API 호출 실패해도 로컬 토큰은 삭제
    }

    // 쿠키에서 토큰 삭제
    destroyCookie(null, 'authToken');
    destroyCookie(null, 'refreshToken');
  }

  async register(data: RegisterData): Promise<{ user: User }> {
    const response = await apiClient.post('/api/auth/register/', data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/api/auth/me/');
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post('/api/auth/refresh/', {
      refresh: refreshToken,
    });
    
    const { access } = response.data;
    
    // 새 액세스 토큰을 쿠키에 저장
    setCookie(null, 'authToken', access, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    
    return response.data;
  }

  async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async validatePassword(password: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('비밀번호는 8자 이상이어야 합니다.');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('비밀번호에 대문자가 포함되어야 합니다.');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('비밀번호에 소문자가 포함되어야 합니다.');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('비밀번호에 숫자가 포함되어야 합니다.');
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('비밀번호에 특수문자(!@#$%^&*)가 포함되어야 합니다.');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// 싱글톤 인스턴스
export const authService = new AuthService();