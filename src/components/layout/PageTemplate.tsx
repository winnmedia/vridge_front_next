'use client';

import React from 'react';
import Header from './Header';
import SideBar from './SideBar';

interface PageTemplateProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function PageTemplate({ 
  children, 
  showSidebar = true,
  fullWidth = false,
  className = ''
}: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {showSidebar && <SideBar />}
        
        <main className={`flex-1 overflow-y-auto ${fullWidth ? '' : 'p-6'} ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
}