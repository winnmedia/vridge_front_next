# 🚀 VideoPlanet Frontend 빠른 배포 가이드

## 1️⃣ GitHub 리포지토리 생성 및 코드 푸시

```bash
# GitHub에서 새 리포지토리 생성: vridge_front_next (public)

# 로컬에서 실행
git remote add origin https://github.com/YOUR_USERNAME/vridge_front_next.git
git branch -M main
git push -u origin main
git push origin v0.8.0
```

## 2️⃣ Vercel 자동 배포

1. **[Vercel](https://vercel.com) 로그인**

2. **"Import Project" 클릭**

3. **GitHub 연결 및 리포지토리 선택**
   - "Import Git Repository" 선택
   - `vridge_front_next` 리포지토리 선택

4. **환경 변수 설정** (필수!)
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://videoplanet.up.railway.app
   ```

5. **"Deploy" 클릭**
   - 빌드 시간: 약 2-3분
   - 자동 도메인: `vridge-front-next.vercel.app`

## 3️⃣ 도메인 연결 (vlanet.net)

1. **Vercel Dashboard → Settings → Domains**

2. **"Add Domain" 클릭 → `vlanet.net` 입력**

3. **DNS 설정 (도메인 업체에서 설정)**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## ✅ 배포 확인

1. **Vercel 대시보드에서 상태 확인**
   - Build: ✅ Success
   - Domain: ✅ Active

2. **기능 테스트**
   - https://vridge-front-next.vercel.app 접속
   - 로그인/회원가입 테스트
   - 프로젝트 생성 테스트
   - 피드백 시스템 테스트

## 🆘 문제 해결

### 빌드 실패 시
```bash
# 로컬에서 빌드 테스트
npm run build
```

### API 연결 실패 시
- Vercel 환경 변수 확인
- Railway 백엔드 상태 확인: https://videoplanet.up.railway.app/api/health/

### 도메인 연결 실패 시
- DNS 전파 대기 (최대 48시간)
- Vercel 도메인 설정 재확인

## 📞 지원

문제 발생 시:
1. Vercel 빌드 로그 확인
2. Railway 백엔드 로그 확인
3. 브라우저 개발자 도구 콘솔 확인

---
**현재 상태**: 코드 준비 완료 ✅ | GitHub 푸시 대기 중 ⏳