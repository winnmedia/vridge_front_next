# VideoPlanet Frontend 배포 가이드

## 🚀 자동 배포 설정

### 1. GitHub 리포지토리 생성
```bash
# 1. GitHub에서 새 리포지토리 생성: vridge_front_next
# 2. 로컬에서 리모트 추가 및 푸시
git remote add origin https://github.com/YOUR_USERNAME/vridge_front_next.git
git branch -M main
git push -u origin main
git push origin v0.8.0
```

### 2. Vercel 배포 설정

1. [Vercel](https://vercel.com) 접속 및 로그인
2. "Import Project" 클릭
3. GitHub 계정 연결 및 `vridge_front_next` 리포지토리 선택
4. 프로젝트 설정:
   - Framework Preset: `Next.js`
   - Root Directory: `.` (기본값)
   - Build Command: `npm run build` (자동 감지됨)
   - Output Directory: `.next` (자동 감지됨)

5. 환경 변수 설정:
   ```
   NEXT_PUBLIC_API_URL = https://videoplanet.up.railway.app
   ```

6. "Deploy" 클릭

### 3. 도메인 연결 (vlanet.net)

Vercel 대시보드에서:
1. Settings → Domains
2. "Add Domain" 클릭
3. `vlanet.net` 입력
4. DNS 설정:
   - A Record: `76.76.21.21`
   - CNAME Record: `cname.vercel-dns.com`

### 4. Railway (백엔드) 연결 확인

백엔드는 이미 Railway에 배포되어 있음:
- URL: `https://videoplanet.up.railway.app`
- 헬스체크: `https://videoplanet.up.railway.app/api/health/`

### 5. CORS 설정 확인

백엔드 `settings_base.py`에 프론트엔드 도메인 추가 확인:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://vlanet.net",
    "https://www.vlanet.net",
    "https://vridge-front-next.vercel.app",
]
```

## 📋 배포 체크리스트

- [x] GitHub 리포지토리 생성
- [x] 코드 푸시 (v0.8.0)
- [ ] Vercel 프로젝트 import
- [ ] 환경 변수 설정
- [ ] 도메인 연결
- [ ] SSL 인증서 확인
- [ ] 프로덕션 테스트

## 🔍 배포 후 확인사항

1. **기능 테스트**
   - 로그인/회원가입
   - 프로젝트 생성
   - 피드백 시스템
   - 파일 업로드

2. **성능 확인**
   - 페이지 로딩 속도
   - API 응답 시간
   - 이미지 최적화

3. **보안 확인**
   - HTTPS 적용
   - 환경 변수 노출 방지
   - CORS 정책

## 🆘 문제 해결

### Vercel 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 에러 확인
npm run lint
```

### API 연결 실패
1. 환경 변수 확인: `NEXT_PUBLIC_API_URL`
2. Railway 백엔드 상태 확인
3. CORS 설정 확인

### 도메인 연결 실패
1. DNS 전파 시간 대기 (최대 48시간)
2. Vercel 도메인 설정 재확인
3. 네임서버 설정 확인

## 📊 모니터링

- Vercel Analytics: 실시간 성능 모니터링
- Railway Metrics: 백엔드 리소스 사용량
- Google Analytics: 사용자 행동 분석 (선택사항)