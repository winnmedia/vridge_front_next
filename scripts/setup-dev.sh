#!/bin/bash

echo "🚀 VideoPlanet Next.js 개발 환경 설정 시작..."

# 환경변수 파일 생성
if [ ! -f .env.local ]; then
    echo "📝 환경변수 파일 생성 중..."
    cp .env.example .env.local
    echo "✅ .env.local 파일이 생성되었습니다. 필요한 값을 설정해주세요."
else
    echo "✅ .env.local 파일이 이미 존재합니다."
fi

# 의존성 설치
echo "📦 패키지 설치 중..."
npm install

# 빌드 테스트
echo "🔨 빌드 테스트 중..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 빌드 성공!"
else
    echo "❌ 빌드 실패. 오류를 확인해주세요."
    exit 1
fi

echo ""
echo "✨ 개발 환경 설정 완료!"
echo ""
echo "다음 명령어로 개발 서버를 시작하세요:"
echo "  npm run dev"
echo ""
echo "테스트 실행:"
echo "  npm test"
echo ""