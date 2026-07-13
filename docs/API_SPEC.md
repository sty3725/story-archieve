# API 명세 초안

실제 라우터의 경로와 응답 형식을 우선한다.

## 공통 원칙

- 성공·오류 응답 구조를 일관되게 유지한다.
- 인증 실패는 일반적으로 401을 사용한다.
- 권한 부족은 403을 사용한다.
- 존재하지 않는 자원은 404를 사용한다.
- 검증 오류는 FastAPI 기본 형식 또는 프로젝트 공통 형식 중 하나로 통일한다.

## 인증

### 회원가입

```http
POST /auth/register
Content-Type: application/json
```

예상 요청:

```json
{
  "email": "user@example.com",
  "username": "writer",
  "password": "strong-password"
}
```

### 로그인

```http
POST /auth/login
Content-Type: application/json
```

예상 요청:

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

### 현재 사용자

```http
GET /auth/me
```

인증 필요.

### 로그아웃

```http
POST /auth/logout
```

## 대시보드

```http
GET /dashboard
```

예상 데이터:

- 사용자 정보
- 전체 원고 수
- 최근 수정 원고
- 즐겨찾기
- 작업 통계
- 강의실 알림 또는 최근 항목

## 원고

```http
GET    /manuscripts
POST   /manuscripts
GET    /manuscripts/{id}
PATCH  /manuscripts/{id}
DELETE /manuscripts/{id}
```

모든 원고 API는 인증이 필요하며, 현재 사용자가 소유한 원고만 처리한다.

## 원고 버전

```http
GET  /manuscripts/{id}/versions
POST /manuscripts/{id}/versions
GET  /manuscripts/{id}/versions/{version_id}
```

## 에디터

```http
GET  /editor/{manuscript_id}
PUT  /editor/{manuscript_id}
POST /editor/{manuscript_id}/autosave
```

실제 저장 구조에 따라 원고 수정 API와 통합할 수 있다.

## 강의실

초기에는 실제 모델과 화면을 확인한 뒤 최소 API만 확정한다.

```http
GET /classroom
GET /classroom/{id}
```
