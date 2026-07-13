# Story Archive Codex 인수인계 문서

이 폴더는 Story Archive 프로젝트를 Codex에서 이어서 개발하기 위한 인수인계 자료다.

## 사용 방법

1. 이 ZIP의 파일을 실제 GitHub 저장소 루트에 복사한다.
2. 기존 `README.md`는 덮어쓰지 않는다.
3. `AGENTS.md`, `docs/`, `prompts/`를 저장소에 추가한다.
4. Codex에서 저장소를 연다.
5. `prompts/CODEX_START_PROMPT.md`의 프롬프트를 첫 요청으로 사용한다.
6. Codex가 실제 코드와 문서를 비교한 뒤 첫 작업을 수행하도록 한다.

## 포함 파일

- `AGENTS.md`: Codex가 지켜야 할 최상위 작업 규칙
- `docs/PROJECT_OVERVIEW.md`: 프로젝트 목적과 주요 사용자 흐름
- `docs/ARCHITECTURE.md`: 예상 디렉터리와 구성 원칙
- `docs/AUTH_FLOW.md`: 회원가입·로그인·보호 페이지 설계
- `docs/DATABASE_DESIGN.md`: 예상 데이터 모델과 관계
- `docs/API_SPEC.md`: API 초안
- `docs/FRONTEND_GUIDE.md`: 화면, 메뉴, 프론트엔드 규칙
- `docs/DEVELOPMENT_STATUS.md`: 현재 상태와 확인 항목
- `docs/ROADMAP.md`: 구현 순서와 완료 조건
- `docs/DECISIONS.md`: 현재까지 확정된 설계 결정
- `prompts/CODEX_START_PROMPT.md`: 첫 작업용 프롬프트
- `prompts/CODEX_TASK_TEMPLATE.md`: 이후 작업 요청 템플릿

## 주의

이 문서는 대화에서 확정된 계획과 제공된 파일 구조를 기준으로 작성됐다. 실제 저장소의 코드가 다를 수 있으므로 Codex는 반드시 실제 코드를 먼저 검사해야 한다.
