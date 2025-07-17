'use client';

import { useEffect, useState } from 'react';

export default function VersionInfo() {
  const [deployTime, setDeployTime] = useState<string>('');
  
  useEffect(() => {
    setDeployTime(new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // 프로덕션에서는 숨김 (필요시 표시 가능)
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-75">
      <div>Version: {process.env.NEXT_PUBLIC_VERSION || '0.8.1'}</div>
      <div>Deploy: {deployTime}</div>
      <div>Env: {process.env.NODE_ENV}</div>
    </div>
  );
}