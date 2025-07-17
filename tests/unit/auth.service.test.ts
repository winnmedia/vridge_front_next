import { AuthService } from '@/lib/auth/auth.service';
import { LoginCredentials, RegisterData } from '@/types/auth.types';
import { setCookie, destroyCookie } from 'nookies';

jest.mock('nookies');
jest.mock('@/lib/api/client');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('성공적으로 로그인하고 토큰을 저장해야 함', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'client',
        },
      };

      const apiClient = require('@/lib/api/client').default;
      apiClient.post = jest.fn().mockResolvedValue({ data: mockResponse });

      const result = await authService.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login/', credentials);
      expect(setCookie).toHaveBeenCalledWith(null, 'authToken', mockResponse.access, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      expect(setCookie).toHaveBeenCalledWith(null, 'refreshToken', mockResponse.refresh, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      expect(result).toEqual(mockResponse);
    });

    it('잘못된 자격증명으로 로그인 실패해야 함', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const apiClient = require('@/lib/api/client').default;
      apiClient.post = jest.fn().mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('토큰을 삭제하고 로그아웃해야 함', async () => {
      await authService.logout();

      expect(destroyCookie).toHaveBeenCalledWith(null, 'authToken');
      expect(destroyCookie).toHaveBeenCalledWith(null, 'refreshToken');
    });
  });

  describe('register', () => {
    it('성공적으로 회원가입해야 함', async () => {
      const registerData: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role: 'client',
      };

      const mockResponse = {
        user: {
          id: 2,
          email: 'newuser@example.com',
          name: 'New User',
          role: 'client',
        },
      };

      const apiClient = require('@/lib/api/client').default;
      apiClient.post = jest.fn().mockResolvedValue({ data: mockResponse });

      const result = await authService.register(registerData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register/', registerData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('현재 사용자 정보를 가져와야 함', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
      };

      const apiClient = require('@/lib/api/client').default;
      apiClient.get = jest.fn().mockResolvedValue({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/api/auth/me/');
      expect(result).toEqual(mockUser);
    });
  });
});