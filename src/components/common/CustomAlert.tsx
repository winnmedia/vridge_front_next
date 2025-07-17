'use client';

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

export default function CustomAlert({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = '확인',
  cancelText = '취소'
}: CustomAlertProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  const icons = {
    info: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    confirm: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">{icons[type]}</div>
              <div className="ml-3 flex-1">
                {title && (
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                )}
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              {type === 'confirm' ? (
                <>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                      onConfirm?.();
                      onClose();
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1631F8] to-[#0F23C9] rounded-md hover:from-[#0F23C9] hover:to-[#1631F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1631F8]"
                  >
                    {confirmText}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1631F8] to-[#0F23C9] rounded-md hover:from-[#0F23C9] hover:to-[#1631F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1631F8]"
                >
                  {confirmText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// 전역 함수로 사용할 수 있도록 하는 헬퍼
let activeAlerts: Array<{ root: ReturnType<typeof createRoot>; container: HTMLDivElement }> = [];

export const alert = (message: string, title?: string, type?: 'info' | 'success' | 'warning' | 'error') => {
  return new Promise<void>((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    
    const close = () => {
      root.unmount();
      document.body.removeChild(container);
      activeAlerts = activeAlerts.filter(a => a.container !== container);
      resolve();
    };
    
    activeAlerts.push({ root, container });
    
    root.render(
      <CustomAlert
        isOpen={true}
        onClose={close}
        message={message}
        title={title}
        type={type}
      />
    );
  });
};

export const confirm = (message: string, title?: string) => {
  return new Promise<boolean>((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    
    const close = (result: boolean) => {
      root.unmount();
      document.body.removeChild(container);
      activeAlerts = activeAlerts.filter(a => a.container !== container);
      resolve(result);
    };
    
    activeAlerts.push({ root, container });
    
    root.render(
      <CustomAlert
        isOpen={true}
        onClose={() => close(false)}
        onConfirm={() => close(true)}
        message={message}
        title={title}
        type="confirm"
      />
    );
  });
};

// 클린업 함수 - 필요한 경우 모든 알림 정리
export const clearAllAlerts = () => {
  activeAlerts.forEach(({ root, container }) => {
    root.unmount();
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });
  activeAlerts = [];
};