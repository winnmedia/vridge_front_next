'use client';

export default function Footer() {
  const version = process.env.NEXT_PUBLIC_VERSION || '0.8.1';
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split('T')[0];
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            © 2025 VideoPlanet. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>v{version}</span>
            <span className="text-xs text-gray-400">Build: {buildDate}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}