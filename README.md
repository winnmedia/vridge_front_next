# VideoPlanet Frontend (Next.js)

영상 제작 프로젝트 관리 시스템의 프론트엔드입니다.

## 🚀 주요 기능

- **프로젝트 관리**: 영상 제작 프로젝트 생성 및 관리
- **실시간 피드백**: WebSocket 기반 실시간 피드백 시스템
- **파일 업로드**: 영상 파일 업로드 및 관리
- **영상 기획**: 스토리보드, 대본, 일정 관리
- **캘린더**: 프로젝트 일정 시각화

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Authentication**: JWT
- **API**: RESTful API + WebSocket

## 📦 설치 및 실행

### 1. 환경 설정
```bash
cp .env.example .env.local
# .env.local 파일에서 환경 변수 설정
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 🚀 배포

### GitHub를 통한 자동 배포

1. **GitHub 리포지토리 생성**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vridge_front_next.git
   git push -u origin main
   ```

2. **Vercel 배포**
   - [Vercel](https://vercel.com) 접속
   - GitHub 리포지토리 연결
   - 환경 변수 설정
   - 자동 배포 시작

3. **도메인 연결**
   - Vercel 대시보드에서 도메인 설정
   - DNS 레코드 업데이트

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

## 📂 프로젝트 구조

```
src/
├── app/                # Next.js App Router 페이지
│   ├── (auth)/        # 인증 관련 페이지
│   └── (main)/        # 메인 앱 페이지
├── components/        # 재사용 가능한 컴포넌트
│   ├── common/       # 공통 컴포넌트
│   └── layout/       # 레이아웃 컴포넌트
├── lib/              # 비즈니스 로직
│   ├── auth/         # 인증 서비스
│   ├── projects/     # 프로젝트 서비스
│   └── feedback/     # 피드백 서비스
├── store/            # Redux 상태 관리
└── tests/            # 테스트 파일

```

## 🧪 테스트

```bash
# 단위 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 비공개 소프트웨어입니다. 무단 복사 및 배포를 금지합니다.

## 🔗 관련 링크

- **프로덕션**: https://vlanet.net
- **백엔드 API**: https://videoplanet.up.railway.app
- **문서**: [DEPLOYMENT.md](./DEPLOYMENT.md)