import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken');
  const { pathname } = request.nextUrl;
  
  // 인증이 필요하지 않은 경로
  const publicPaths = ['/', '/login', '/register', '/forgot-password'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // API 경로는 제외
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // 인증이 필요한 경로에서 토큰이 없으면 로그인으로 리다이렉트
  if (!isPublicPath && !authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // 이미 로그인한 상태에서 로그인/회원가입 페이지 접근 시 대시보드로 리다이렉트
  if (isPublicPath && authToken && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/cms/projects';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};