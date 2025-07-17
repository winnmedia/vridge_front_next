import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            VideoPlanet
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            효율적인 영상 제작 프로젝트 관리 시스템
          </p>
          
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block px-6 py-3 text-white font-medium rounded-md bg-gradient-to-r from-[#1631F8] to-[#0F23C9] hover:from-[#0F23C9] hover:to-[#1631F8] transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="inline-block px-6 py-3 text-[#1631F8] font-medium rounded-md border-2 border-[#1631F8] hover:bg-[#1631F8] hover:text-white transition-all"
            >
              회원가입
            </Link>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-[#1631F8] mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">프로젝트 관리</h3>
            <p className="text-gray-600">
              영상 제작 프로젝트를 체계적으로 관리하고 진행 상황을 실시간으로 확인하세요.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-[#1631F8] mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">실시간 피드백</h3>
            <p className="text-gray-600">
              클라이언트와 제작팀 간의 원활한 소통을 위한 실시간 피드백 시스템을 제공합니다.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-[#1631F8] mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI 자동화</h3>
            <p className="text-gray-600">
              AI 기반 자동화로 기획안 작성부터 콘티 생성까지 작업 시간을 90% 단축하세요.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            1000% 성과를 경험하세요
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            기존 수작업 3-5시간 → AI 자동화 5분. 
            VideoPlanet은 단순한 도구가 아닌, 여러분의 창의성을 극대화하는 파트너입니다.
          </p>
        </div>
      </div>
    </main>
  )
}
