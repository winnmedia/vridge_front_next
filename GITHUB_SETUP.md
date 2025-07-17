# 🚨 중요: 올바른 프로젝트 배포 가이드

현재 상황: Vercel이 잘못된 프로젝트(구형 React)를 배포하려고 합니다.
올바른 프로젝트: `vridge_front_next` (새로운 Next.js 프로젝트)

## 1️⃣ 새로운 GitHub 리포지토리 생성

1. **GitHub.com 접속**
2. **새 리포지토리 생성**
   - 이름: `vridge_front_next` (중요: 다른 이름 사용!)
   - 설명: VideoPlanet Frontend (Next.js)
   - Public 선택
   - "Create repository" 클릭

## 2️⃣ 로컬에서 GitHub 연결

```bash
# 현재 디렉토리: /home/winnmedia/VideoPlanet/vridge_front_next
cd /home/winnmedia/VideoPlanet/vridge_front_next

# Git 리모트 추가
git remote add origin https://github.com/YOUR_USERNAME/vridge_front_next.git

# 푸시
git push -u origin main
git push origin v0.8.0
```

## 3️⃣ Vercel에서 올바른 프로젝트 배포

1. **기존 프로젝트 삭제 (선택사항)**
   - Vercel 대시보드에서 잘못 배포된 프로젝트 삭제

2. **새 프로젝트 Import**
   - "Import Project" 클릭
   - GitHub에서 `vridge_front_next` 선택 (구형 프로젝트 아님!)
   - 환경 변수 설정:
     ```
     NEXT_PUBLIC_API_URL = https://videoplanet.up.railway.app
     ```

3. **배포 확인**
   - 빌드 로그에서 확인:
     - ✅ "vridge_front_next@0.8.0"
     - ❌ "vridge@0.7.9" (구형 프로젝트)

## 4️⃣ 체크리스트

- [ ] 새로운 GitHub 리포지토리 생성 (`vridge_front_next`)
- [ ] 로컬에서 GitHub에 푸시
- [ ] Vercel에서 올바른 리포지토리 선택
- [ ] 환경 변수 설정
- [ ] 빌드 성공 확인

## ⚠️ 주의사항

- 절대 구형 프로젝트(`Vlanet-v1.0`)를 선택하지 마세요
- 새 프로젝트는 `vridge_front_next` 입니다
- package.json 버전이 `0.8.0`인지 확인하세요