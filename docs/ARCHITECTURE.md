# 아키텍처

## 예상 프로젝트 구조

```text
writer-platform/
├─ AGENTS.md
├─ README.md
├─ docs/
├─ backend/
│  ├─ main.py
│  ├─ database.py
│  ├─ config.py
│  ├─ routers/
│  │  ├─ auth.py
│  │  ├─ manuscripts.py
│  │  ├─ editor.py
│  │  ├─ classroom.py
│  │  └─ dashboard.py
│  ├─ models/
│  │  ├─ user.py
│  │  ├─ manuscript.py
│  │  ├─ manuscript_version.py
│  │  ├─ editor_note.py
│  │  ├─ classroom.py
│  │  └─ dashboard.py
│  ├─ schemas/
│  │  ├─ user.py
│  │  ├─ manuscript.py
│  │  ├─ editor.py
│  │  ├─ classroom.py
│  │  └─ dashboard.py
│  ├─ services/
│  │  ├─ manuscript_service.py
│  │  ├─ editor_service.py
│  │  ├─ classroom_service.py
│  │  └─ dashboard_service.py
│  └─ utils/
│     ├─ security.py
│     └─ response.py
├─ frontend/
│  ├─ index.html
│  ├─ pages/
│  │  ├─ dashboard.html
│  │  ├─ manuscripts.html
│  │  ├─ editor.html
│  │  └─ classroom.html
│  ├─ css/
│  │  ├─ common.css
│  │  ├─ dashboard.css
│  │  ├─ manuscripts.css
│  │  ├─ editor.css
│  │  └─ classroom.css
│  ├─ js/
│  │  ├─ main.js
│  │  ├─ api.js
│  │  ├─ router.js
│  │  ├─ dashboard/dashboard.js
│  │  ├─ manuscripts/manuscripts.js
│  │  ├─ manuscripts/manuscript-detail.js
│  │  ├─ editor/editor.js
│  │  └─ classroom/classroom.js
│  └─ media/
│     ├─ images/
│     └─ icons/
└─ README.md
```

이 구조는 계획안이다. 실제 저장소를 먼저 확인하고 일치하지 않는 부분을 기록한다.

## 백엔드 책임 분리

### routers

HTTP 요청과 응답을 처리한다.

- URL
- HTTP 메서드
- 요청 검증
- 인증 의존성
- 서비스 호출
- 상태 코드

### models

데이터베이스 테이블과 관계를 정의한다.

### schemas

요청 및 응답 데이터 구조를 정의한다.

### services

비즈니스 로직과 데이터 접근 흐름을 담당한다.

### utils

인증, 해싱, 공통 응답 등 범용 기능을 둔다.

## 프론트엔드 책임 분리

### `api.js`

- API 기본 URL
- 공통 fetch 래퍼
- 인증 헤더 추가
- 401 공통 처리
- JSON 파싱과 오류 표준화

### `router.js`

- 페이지 이동
- 로그인 필요 페이지 확인
- 비로그인 사용자 리다이렉트

### 페이지별 JS

각 화면의 DOM 조작과 해당 API 호출만 담당한다.

## 기본 데이터 흐름

```text
브라우저
  → 페이지별 JavaScript
  → api.js
  → FastAPI router
  → service
  → model / PostgreSQL
  → schema 기반 응답
  → 브라우저 렌더링
```

## 아키텍처 원칙

- 인증 처리는 여러 라우터에서 중복 구현하지 않는다.
- 사용자 식별은 요청 본문이 아니라 인증 정보에서 얻는다.
- 원고와 버전은 반드시 소유 사용자와 연결한다.
- 대시보드는 다른 도메인의 데이터를 직접 수정하지 않고 조회·집계한다.
- 프론트엔드는 데이터베이스 구조를 알 필요가 없다.
