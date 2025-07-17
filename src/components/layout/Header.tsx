'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { logout } from '@/store/features/authSlice';
import UserAvatar from '@/components/common/UserAvatar';
import NotificationDropdown from '@/components/common/NotificationDropdown';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-[#1631F8]">VideoPlanet</h1>
            </Link>
          </div>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/cms/projects" 
                className="text-gray-700 hover:text-[#1631F8] px-3 py-2 text-sm font-medium"
              >
                프로젝트
              </Link>
              <Link 
                href="/cms/calendar" 
                className="text-gray-700 hover:text-[#1631F8] px-3 py-2 text-sm font-medium"
              >
                캘린더
              </Link>
              <Link 
                href="/cms/video-planning" 
                className="text-gray-700 hover:text-[#1631F8] px-3 py-2 text-sm font-medium"
              >
                영상 기획
              </Link>
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <NotificationDropdown />

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 text-sm focus:outline-none"
                  >
                    <UserAvatar 
                      name={user?.name || ''} 
                      size="small"
                    />
                    <span className="hidden md:block text-gray-700">
                      {user?.name}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/mypage"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        마이페이지
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        설정
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-[#1631F8] px-3 py-2 text-sm font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#1631F8] to-[#0F23C9] text-white px-4 py-2 rounded-md text-sm font-medium hover:from-[#0F23C9] hover:to-[#1631F8]"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}