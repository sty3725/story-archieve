# 개발 현황

## 확인된 내용

- 백엔드는 FastAPI를 사용한다.
- PostgreSQL을 사용한다.
- 회원가입 테스트에서 성공 응답이 확인됐다.
- 성공 응답 예시에는 사용자 ID, 이메일, 사용자 이름이 포함됐다.
- 다음 목표는 로그인 후 대시보드 이동이다.

## 아직 코드로 확인하지 못한 내용

아래 항목은 실제 저장소를 검사해야 한다.

- 회원가입 데이터가 실제 PostgreSQL에 커밋되는가
- 비밀번호가 해시로 저장되는가
- 이메일 중복 검사가 있는가
- 로그인 API가 이미 존재하는가
- JWT, 쿠키 또는 세션 중 무엇을 사용하는가
- 대시보드 API가 인증으로 보호되는가
- 프론트엔드 로그인 페이지가 존재하는가
- CORS와 정적 파일 제공 방식이 어떻게 설정됐는가
- 환경변수 파일과 설정 로딩 방식
- 마이그레이션 도구 사용 여부

## 우선 확인할 파일

```text
backend/main.py
backend/database.py
backend/config.py
backend/routers/auth.py
backend/models/user.py
backend/schemas/user.py
backend/utils/security.py
frontend/index.html
frontend/pages/
frontend/js/api.js
frontend/js/main.js
frontend/js/router.js
```

실제 저장소의 파일명이 다르면 해당 파일을 추적해 대응시킨다.

## 현재 작업 단계

### 단계 1 — 저장소 감사

- 서버 실행 방법 확인
- 디렉터리 구조 확인
- 인증 관련 코드 추적
- 데이터베이스 세션과 commit 확인
- 현재 오류 확인

### 단계 2 — 인증 완성

- 로그인
- 현재 사용자 조회
- 보호 API
- 로그아웃
- 프론트엔드 연결

### 단계 3 — 대시보드

- 인증 사용자 정보
- 최근 원고
- 통계
- 빈 상태 UI

## 위험 요소

- 문서 구조와 실제 저장소 구조가 다를 수 있다.
- 가입 성공 응답만으로 DB 영속 저장을 단정할 수 없다.
- 프론트엔드 리다이렉트만으로는 보안이 확보되지 않는다.
- 사용자 소유권 검사가 빠지면 데이터 노출 위험이 있다.
