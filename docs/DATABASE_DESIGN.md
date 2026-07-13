# 데이터베이스 설계 초안

이 문서는 목표 모델이다. 실제 모델과 마이그레이션을 먼저 확인한다.

## User

| 필드 | 설명 |
|---|---|
| id | 기본키 |
| email | 로그인 이메일, 유일값 |
| username | 사용자 표시 이름 |
| password_hash | 해시된 비밀번호 |
| is_active | 활성 상태 |
| created_at | 생성 시각 |
| updated_at | 수정 시각 |

## Manuscript

| 필드 | 설명 |
|---|---|
| id | 기본키 |
| user_id | 소유 사용자 외래키 |
| title | 원고 제목 |
| summary | 요약 |
| content | 현재 본문 또는 현재 버전 참조 |
| status | 초안, 진행 중, 완료 등 |
| is_favorite | 즐겨찾기 |
| deleted_at | 소프트 삭제 시각 |
| created_at | 생성 시각 |
| updated_at | 수정 시각 |

관계:

```text
User 1 ─ N Manuscript
```

## ManuscriptVersion

| 필드 | 설명 |
|---|---|
| id | 기본키 |
| manuscript_id | 원고 외래키 |
| version_number | 버전 번호 |
| content | 해당 버전 본문 |
| change_note | 변경 메모 |
| created_at | 생성 시각 |

관계:

```text
Manuscript 1 ─ N ManuscriptVersion
```

## EditorNote

| 필드 | 설명 |
|---|---|
| id | 기본키 |
| manuscript_id | 원고 외래키 |
| user_id | 작성 사용자 외래키 |
| content | 메모 내용 |
| created_at | 생성 시각 |
| updated_at | 수정 시각 |

## Classroom

강의실 구조는 실제 요구사항이 더 정해진 뒤 확정한다.

최소 후보:

- classroom
- course 또는 lesson
- enrollment
- assignment
- submission

## 무결성 원칙

- 이메일에 unique 제약조건을 둔다.
- 모든 사용자 소유 데이터는 `user_id`로 연결한다.
- 원고 버전은 원고 삭제 정책을 따른다.
- 외래키 삭제 정책을 명시한다.
- 시간 필드는 프로젝트 전체에서 동일한 시간대 정책을 사용한다.
- 사용자 ID를 클라이언트 입력값으로 신뢰하지 않는다.

## 인덱스 후보

- users.email
- manuscripts.user_id
- manuscripts.updated_at
- manuscript_versions.manuscript_id
- editor_notes.manuscript_id
