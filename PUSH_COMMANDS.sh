#!/bin/bash
# GitHub 리포지토리 생성 후 실행할 명령어

# 1. 리모트 제거 (이미 추가된 경우)
git remote remove origin 2>/dev/null

# 2. 올바른 리모트 추가
git remote add origin https://github.com/winnmedia/vridge_front_next.git

# 3. 메인 브랜치로 이름 변경
git branch -M main

# 4. 코드 푸시
git push -u origin main

# 5. 태그 푸시
git push origin v0.8.0

echo "✅ 푸시 완료!"
echo "🚀 이제 Vercel에서 이 리포지토리를 import하세요."