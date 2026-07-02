# Story Archive / Writer Platform 프로젝트 세팅 기록

이 문서는 이 프로젝트에서 진행한 개발 환경 세팅 절차를 다시 재현할 수 있도록 정리한 문서다.  
목적은 나중에 컴퓨터를 바꾸거나, 가상환경이 꼬이거나, 학원 컴퓨터에서 원격 개발을 다시 연결해야 할 때 빠르게 복구하는 것이다.

---

## 0. 현재 프로젝트 구조 기준

이 프로젝트는 크게 `backend`와 `frontend`를 분리하는 구조로 잡았다.

```text
story-archieve/
또는 writer-platform/
├─ backend/
│  ├─ main.py
│  ├─ database.py
│  ├─ config.py
│  ├─ routers/
│  ├─ models/
│  ├─ schemas/
│  ├─ services/
│  └─ utils/
│
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
│  │  ├─ dashboard/
│  │  ├─ manuscripts/
│  │  ├─ editor/
│  │  └─ classroom/
│  └─ media/
│     ├─ images/
│     └─ icons/
│
├─ .venv/
├─ requirements.txt
├─ .gitignore
└─ README.md
```

### 왜 이렇게 나눴는가

- `backend/`는 FastAPI 서버, API 라우터, DB 모델, 서비스 로직을 담당한다.
- `frontend/`는 HTML, CSS, JavaScript, 이미지 파일을 담당한다.
- 프론트 파일을 FastAPI에서 정적 파일로 제공하면, 서버를 실행한 상태에서 실제 서비스에 가까운 방식으로 화면을 확인할 수 있다.
- 나중에 프론트를 React/Vue 같은 구조로 바꾸더라도 백엔드와 프론트 책임이 분리되어 있어 확장하기 쉽다.

---

## 1. 새 프로젝트 폴더 준비

### 명령어

```powershell
mkdir story-archieve
cd story-archieve
```

또는 이미 GitHub에서 레포지토리를 만들었다면:

```powershell
git clone 레포지토리_URL
cd story-archieve
```

### 왜 하는가

프로젝트 루트 폴더를 명확히 잡아야 한다.  
가상환경, `backend`, `frontend`, `requirements.txt`, `.gitignore`가 모두 이 루트 기준으로 관리된다.

### 주의사항

- VS Code에서는 반드시 프로젝트 루트 폴더를 열어야 한다.
- `backend` 폴더만 열거나 `frontend` 폴더만 열면 경로가 꼬이기 쉽다.
- 이후 명령어는 대부분 프로젝트 루트에서 실행한다.

---

## 2. Python 가상환경 생성

### 명령어

```powershell
python -m venv .venv
```

생성 후 구조:

```text
story-archieve/
├─ .venv/
├─ backend/
├─ frontend/
└─ requirements.txt
```

### 왜 하는가

가상환경은 이 프로젝트에서 사용하는 Python 패키지를 다른 프로젝트나 시스템 Python과 분리하기 위해 사용한다.

예를 들어 이 프로젝트에는 FastAPI, Uvicorn, SQLAlchemy 등을 설치하고, 다른 프로젝트에는 다른 버전의 패키지를 쓸 수 있다.  
가상환경을 쓰면 패키지 충돌을 줄일 수 있다.

### 주의사항

- `.venv`는 프로젝트마다 새로 만드는 것이 안전하다.
- `.venv` 폴더는 GitHub에 올리지 않는다.
- SFTP로도 `.venv`를 업로드하지 않는다.

---

## 3. 가상환경 활성화

### PowerShell 기준

```powershell
.\.venv\Scripts\Activate.ps1
```

성공하면 터미널 앞에 `(.venv)`가 붙는다.

```text
(.venv) PS C:\Users\admin\Desktop\portfolio\story-archieve>
```

### CMD 기준

```cmd
.\.venv\Scripts\activate.bat
```

### 왜 하는가

가상환경을 활성화해야 `pip install`로 설치하는 패키지가 현재 프로젝트의 `.venv` 안에 들어간다.

### PowerShell 실행 정책 오류가 날 때

오류 예시:

```text
running scripts is disabled on this system
```

해결:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

그다음 다시:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 주의사항

- 패키지를 설치하기 전에 반드시 `(.venv)`가 붙어 있는지 확인한다.
- 가상환경이 활성화되지 않은 상태에서 설치하면 전역 Python에 패키지가 설치될 수 있다.

---

## 4. FastAPI 기본 패키지 설치

### 최소 설치

```powershell
pip install fastapi uvicorn
```

### 왜 하는가

- `fastapi`: 백엔드 API 서버 프레임워크
- `uvicorn`: FastAPI 앱을 실행하는 ASGI 서버

즉, FastAPI 코드를 작성해도 `uvicorn`이 없으면 브라우저에서 서버를 실행해 확인할 수 없다.

### 설치 확인

```powershell
pip list
```

또는:

```powershell
python -c "import fastapi; print('fastapi ok')"
python -c "import uvicorn; print('uvicorn ok')"
```

---

## 5. requirements.txt 생성

### 명령어

```powershell
pip freeze > requirements.txt
```

### 왜 하는가

현재 가상환경에 설치된 패키지 목록을 파일로 저장하기 위해서다.

나중에 다른 컴퓨터에서 같은 환경을 만들 때:

```powershell
pip install -r requirements.txt
```

이 한 줄로 필요한 패키지를 다시 설치할 수 있다.

### 주의사항

- 패키지를 새로 설치한 뒤에는 `pip freeze > requirements.txt`를 다시 실행하는 습관을 들인다.
- `.venv`를 GitHub에 올리는 대신 `requirements.txt`만 올린다.

---

## 6. FastAPI에서 프론트 파일 제공하기

`backend/main.py`에 최소 실행 코드를 작성한다.

```python
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")
app.mount("/media", StaticFiles(directory=FRONTEND_DIR / "media"), name="media")
app.mount("/pages", StaticFiles(directory=FRONTEND_DIR / "pages"), name="pages")


@app.get("/")
def read_index():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "FastAPI backend is running"
    }
```

### 왜 하는가

브라우저에서 `http://127.0.0.1:8000`으로 접속했을 때 `frontend/index.html`이 표시되도록 하기 위해서다.

또한 `/css`, `/js`, `/media`, `/pages` 경로를 연결해두면 HTML에서 다음처럼 바로 파일을 불러올 수 있다.

```html
<link rel="stylesheet" href="/css/common.css">
<script src="/js/main.js"></script>
```

### 주의사항

- `FRONTEND_DIR` 경로가 틀리면 `index.html`을 찾지 못한다.
- `app.mount("/css", ...)`를 해두지 않으면 CSS 파일이 로드되지 않는다.
- `FileResponse`는 요청할 때마다 파일을 읽어 보여주므로, HTML 파일을 수정한 뒤 서버 재시작 없이 새로고침만 해도 반영된다.

---

## 7. 서버 실행

### 기본 실행

```powershell
uvicorn backend.main:app --reload
```

### 외부 기기에서도 접속 가능하게 실행

```powershell
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 왜 하는가

FastAPI 앱을 실제 서버로 실행해서 브라우저에서 확인하기 위해서다.

- `backend.main`: `backend/main.py` 파일을 의미한다.
- `app`: `main.py` 안의 `app = FastAPI()` 객체를 의미한다.
- `--reload`: Python 파일 수정 시 서버를 자동 재시작한다.
- `--host 0.0.0.0`: 다른 기기에서도 접속 가능하게 한다.
- `--port 8000`: 8000번 포트로 서버를 연다.

### 접속 주소

집 컴퓨터에서 확인:

```text
http://127.0.0.1:8000
```

같은 네트워크의 다른 기기에서 확인:

```text
http://집컴퓨터_내부IP:8000
```

Tailscale 사용 시:

```text
http://집컴퓨터_Tailscale_IP:8000
```

### 주의사항

- 프론트 HTML/CSS/JS 수정은 보통 서버 재시작 없이 브라우저 새로고침으로 반영된다.
- Python 파일 수정은 `--reload` 옵션이 있어야 자동 반영된다.
- CSS/JS가 안 바뀐 것처럼 보이면 브라우저 캐시 문제일 수 있으므로 `Ctrl + F5`로 강력 새로고침한다.

---

## 8. GitHub 세팅

### Git 사용자 정보 설정

처음 커밋할 때 다음 오류가 날 수 있다.

```text
Author identity unknown
Please tell me who you are.
```

이때 전역 설정:

```powershell
git config --global user.email "깃허브_이메일"
git config --global user.name "깃허브_이름"
```

프로젝트에서만 설정하려면 `--global`을 빼고 실행한다.

```powershell
git config user.email "깃허브_이메일"
git config user.name "깃허브_이름"
```

### 왜 하는가

Git 커밋에는 작성자 이름과 이메일이 필요하다.  
이 설정이 없으면 Git이 누가 커밋했는지 알 수 없어서 커밋을 막는다.

---

## 9. .gitignore 설정

루트에 `.gitignore` 파일을 만든다.

```gitignore
# Python virtual environment
.venv/
venv/

# Python cache
__pycache__/
*.pyc
*.pyo
*.pyd

# Environment variables
.env

# VS Code local settings
.vscode/sftp.json

# Logs
*.log

# OS files
.DS_Store
Thumbs.db
```

### 왜 하는가

GitHub에 올리면 안 되는 파일을 제외하기 위해서다.

특히 중요:

- `.venv/`: 용량이 크고 다른 컴퓨터에서 재사용하기 어렵다.
- `.env`: DB 비밀번호, API 키 같은 민감 정보가 들어갈 수 있다.
- `.vscode/sftp.json`: SFTP 접속 정보와 비밀번호가 들어갈 수 있다.

### 주의사항

이미 Git에 올라간 파일은 `.gitignore`에 추가해도 자동으로 제거되지 않는다.  
그 경우에는 다음처럼 캐시에서 제거해야 한다.

```powershell
git rm --cached 파일명
```

예:

```powershell
git rm --cached .vscode/sftp.json
```

---

## 10. 집 컴퓨터 SFTP 접속용 계정 만들기

Windows 계정에 비밀번호를 걸지 않은 경우, SFTP 접속용 계정을 따로 만든다.

### 관리자 PowerShell에서 실행

```powershell
net user sftpdev 원하는비밀번호 /add
```

예:

```powershell
net user sftpdev MyDevPassword123! /add
```

### 왜 하는가

Windows 계정에 비밀번호가 없으면 SSH/SFTP 비밀번호 로그인이 정상 동작하지 않을 수 있다.  
메인 계정에 비밀번호를 걸기 싫다면 SFTP 전용 계정을 따로 만드는 것이 깔끔하다.

### 주의사항

- 비밀번호는 너무 단순하게 만들지 않는다.
- 공용 PC에 비밀번호를 저장하지 않는다.

---

## 11. OpenSSH Server 설치 및 실행

SFTP는 SSH 기반으로 동작한다.  
따라서 Windows에서 SFTP를 받으려면 OpenSSH Server가 필요하다.

### 설치 여부 확인

관리자 PowerShell:

```powershell
Get-Service sshd
```

### 이미 설치되어 있다면 실행

```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
```

### 설치되어 있지 않다면 설치

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
```

### 왜 하는가

- `sshd`는 SSH 접속을 받아주는 Windows 서비스다.
- 이 서비스가 켜져 있어야 학원 컴퓨터에서 집 컴퓨터로 SFTP 접속할 수 있다.
- `StartupType Automatic`으로 설정하면 컴퓨터를 재부팅해도 SSH 서버가 자동으로 켜진다.

---

## 12. Windows 방화벽 22번 포트 허용

### 명령어

관리자 PowerShell:

```powershell
New-NetFirewallRule -Name sshd -DisplayName "OpenSSH Server" -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

### 왜 하는가

SSH/SFTP는 기본적으로 22번 포트를 사용한다.  
방화벽이 22번 포트를 막고 있으면 계정과 SSH 서버가 정상이어도 외부에서 접속할 수 없다.

### 주의사항

이미 규칙이 있으면 중복 오류가 날 수 있다.  
이 경우에는 이미 등록되어 있을 가능성이 있으므로 큰 문제는 아니다.

---

## 13. SFTP 계정에 프로젝트 폴더 권한 부여

프로젝트 위치 예시:

```text
C:\Users\admin\Desktop\portfolio\story-archieve
```

### 명령어

관리자 PowerShell:

```powershell
icacls "C:\Users\admin\Desktop\portfolio\story-archieve" /grant "sftpdev:(OI)(CI)F" /T
```

또는 PowerShell에서 괄호 해석 문제가 생기면:

```powershell
cmd /c icacls "C:\Users\admin\Desktop\portfolio\story-archieve" /grant "sftpdev:(OI)(CI)F" /T
```

### 왜 하는가

`sftpdev` 계정이 프로젝트 폴더에 파일을 업로드하고 수정할 수 있게 하기 위해서다.

옵션 의미:

```text
(OI) = Object Inherit, 하위 파일에 권한 상속
(CI) = Container Inherit, 하위 폴더에 권한 상속
F    = Full Control, 전체 권한
/T   = 하위 항목까지 적용
```

### 주의사항

PowerShell에서는 다음처럼 따옴표 없이 쓰면 오류가 난다.

```powershell
icacls "C:\...\story-archieve" /grant sftpdev:(OI)(CI)F /T
```

오류 예시:

```text
OI : 'OI' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다.
```

반드시 다음처럼 권한 문자열을 따옴표로 감싼다.

```powershell
/grant "sftpdev:(OI)(CI)F"
```

---

## 14. SSH 접속 테스트

### 집 컴퓨터 내부 테스트

```powershell
ssh sftpdev@localhost
```

처음 접속하면 다음과 같은 문구가 나온다.

```text
The authenticity of host 'localhost (::1)' can't be established.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

여기서는:

```text
yes
```

입력한다.

### 왜 하는가

처음 보는 SSH 서버를 신뢰할 것인지 확인하는 절차다.  
`localhost`는 자기 컴퓨터이므로 테스트 상황에서는 `yes`를 입력해도 된다.

### 접속 성공 후 나오기

```bash
exit
```

### 주의사항

- 비밀번호 입력 시 화면에 아무것도 표시되지 않는 것이 정상이다.
- `localhost` 접속 성공은 “집 컴퓨터 내부에서 SSH 서버와 계정이 정상”이라는 뜻이다.
- 학원 컴퓨터에서 접속 가능하다는 뜻은 아직 아니다.

---

## 15. 외부 접속 테스트

학원 컴퓨터에서 집 컴퓨터에 접속하려면 단순히 `localhost` 테스트만으로는 부족하다.

### 필요한 흐름

```text
학원 컴퓨터
  ↓
인터넷 또는 VPN
  ↓
집 컴퓨터 SSH 22번 포트
```

### 추천 방식: Tailscale

포트포워딩보다 Tailscale 같은 개인 VPN 방식이 개발용으로 더 안전하고 간단하다.

1. 집 컴퓨터에 Tailscale 설치
2. 학원 컴퓨터에도 Tailscale 설치
3. 같은 계정으로 로그인
4. 집 컴퓨터의 Tailscale IP 확인
5. 학원 컴퓨터에서 접속 테스트

```powershell
ssh sftpdev@집컴퓨터_Tailscale_IP
```

예:

```powershell
ssh sftpdev@100.80.12.34
```

### 왜 하는가

집 내부 IP인 `192.168.x.x`는 보통 학원 컴퓨터에서 직접 접근할 수 없다.  
Tailscale IP인 `100.x.x.x`를 사용하면 같은 사설 VPN 안에서 안전하게 접속할 수 있다.

---

## 16. VS Code SFTP 확장 설정

학원 컴퓨터의 VS Code에서 SFTP 확장을 설치한 뒤, 프로젝트 루트에 `.vscode/sftp.json` 파일을 만든다.

### 설정 예시

```json
{
  "name": "story-archieve-home",
  "host": "집컴퓨터_Tailscale_IP",
  "protocol": "sftp",
  "port": 22,
  "username": "sftpdev",
  "remotePath": "C:/Users/admin/Desktop/portfolio/story-archieve",
  "uploadOnSave": true,
  "downloadOnOpen": false,
  "useTempFile": false,
  "openSsh": false,
  "ignore": [
    ".vscode",
    ".git",
    ".venv",
    "__pycache__",
    "*.pyc",
    ".env",
    "requirements.txt"
  ]
}
```

### 비밀번호를 저장하고 싶다면

```json
"password": "sftpdev_비밀번호"
```

을 추가할 수 있다.

하지만 학원 컴퓨터가 공용이면 비밀번호를 파일에 저장하지 않는 편이 안전하다.

### 왜 하는가

VS Code에서 파일을 저장하면 집 컴퓨터의 프로젝트 폴더로 자동 업로드되도록 하기 위해서다.

### 주의사항

- `remotePath`는 반드시 프로젝트 루트로 잡는다.
- `frontend` 폴더만 remotePath로 잡지 않는다.
- `.venv`, `.git`, `.env`는 업로드하지 않는다.
- `.vscode/sftp.json`에는 접속 정보가 들어갈 수 있으므로 GitHub에 올리지 않는다.

---

## 17. VS Code SFTP 연결 테스트

학원 컴퓨터 VS Code에서:

```text
Ctrl + Shift + P
```

명령 실행:

```text
SFTP: List Remote
```

원격 폴더 목록이 보이면 연결 성공이다.

필요하면:

```text
SFTP: Download Project
```

로 원격 프로젝트 파일을 내려받을 수 있다.

### 왜 하는가

실제 업로드 전에 VS Code가 집 컴퓨터의 프로젝트 경로를 제대로 보고 있는지 확인하기 위해서다.

---

## 18. 원격 개발 시 실행 구조

집 컴퓨터에서 FastAPI 서버 실행:

```powershell
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

학원 컴퓨터에서 VS Code로 파일 수정 후 저장:

```text
frontend/index.html 저장
↓
SFTP 자동 업로드
↓
집 컴퓨터 프로젝트 파일 변경
↓
브라우저 새로고침
↓
FastAPI가 변경된 파일 제공
```

학원 컴퓨터에서 브라우저 확인:

```text
http://집컴퓨터_Tailscale_IP:8000
```

### 왜 하는가

집 컴퓨터를 개발 서버처럼 켜두고, 학원 컴퓨터에서는 VS Code로 파일만 수정해서 바로 반영 확인하기 위해서다.

### 주의사항

- 집 컴퓨터가 절전모드로 들어가면 접속이 끊긴다.
- FastAPI 서버가 꺼져 있으면 브라우저 확인은 안 된다.
- SSH 서버가 꺼져 있으면 SFTP 업로드가 안 된다.
- Python 파일 수정은 `--reload`가 있어야 자동 반영된다.
- HTML/CSS/JS 파일 수정은 보통 새로고침만으로 반영된다.

---

## 19. 프론트 파일 수정 반영 기준

### 서버 재시작 없이 반영되는 파일

```text
frontend/index.html
frontend/css/*.css
frontend/js/*.js
frontend/pages/*.html
frontend/media/*
```

브라우저 새로고침으로 확인한다.

### 서버 자동 재시작이 필요한 파일

```text
backend/*.py
backend/routers/*.py
backend/services/*.py
```

`uvicorn`을 `--reload`로 실행했으면 자동 반영된다.

### 주의사항

CSS/JS가 안 바뀐 것처럼 보이면 캐시 문제일 수 있다.

해결:

```text
Ctrl + F5
```

또는 HTML에서 임시로 버전 쿼리를 붙인다.

```html
<link rel="stylesheet" href="/css/common.css?v=2">
<script src="/js/main.js?v=2"></script>
```

---

## 20. 초기 개발 시작 순서

환경 세팅이 끝난 뒤 실제 개발은 다음 순서로 진행한다.

```text
1. FastAPI 실행 확인
2. index.html 표시 확인
3. common.css 연결 확인
4. main.js 연결 확인
5. /api/health fetch 테스트
6. 공통 레이아웃 작성
7. 사이드바 / 헤더 작성
8. dashboard.html 작성
9. manuscripts.html 작성
10. editor.html 작성
11. 더미 데이터 렌더링
12. FastAPI 라우터 분리
13. DB 연결
14. 실제 CRUD API 구현
```

### 왜 이 순서인가

처음부터 DB와 API를 만들면 화면 구조가 바뀔 때 백엔드도 같이 흔들릴 수 있다.  
먼저 FastAPI 위에서 프론트가 정상 표시되는지 확인하고, 그 위에 레이아웃을 쌓은 다음, 더미 데이터를 붙이고, 마지막에 실제 DB/API로 교체하는 것이 안전하다.

---

## 21. 자주 생기는 문제와 해결

### 1. `uvicorn` 명령어를 못 찾음

원인:

- 가상환경이 활성화되지 않았거나
- `uvicorn`이 설치되지 않았음

해결:

```powershell
.\.venv\Scripts\Activate.ps1
pip install uvicorn
```

---

### 2. FastAPI는 실행되는데 CSS가 안 먹음

원인:

- `app.mount("/css", ...)` 누락
- HTML의 CSS 경로 오류

확인:

```python
app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
```

HTML:

```html
<link rel="stylesheet" href="/css/common.css">
```

---

### 3. `OI` 오류 발생

오류:

```text
OI : 'OI' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다.
```

해결:

```powershell
icacls "C:\Users\admin\Desktop\portfolio\story-archieve" /grant "sftpdev:(OI)(CI)F" /T
```

핵심은 `"sftpdev:(OI)(CI)F"`처럼 따옴표로 감싸는 것이다.

---

### 4. SSH 첫 접속 때 fingerprint 질문이 나옴

질문:

```text
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

자기 컴퓨터 `localhost` 테스트라면:

```text
yes
```

입력한다.

---

### 5. Git 커밋이 안 되고 Author identity unknown이 나옴

해결:

```powershell
git config --global user.email "깃허브_이메일"
git config --global user.name "깃허브_이름"
```

---

## 22. 최종 점검 체크리스트

개발 시작 전 아래가 모두 되면 세팅 완료다.

```text
[ ] 프로젝트 루트 폴더가 준비되어 있다.
[ ] .venv 가상환경이 생성되어 있다.
[ ] 가상환경 활성화 시 터미널에 (.venv)가 표시된다.
[ ] fastapi, uvicorn이 설치되어 있다.
[ ] requirements.txt가 생성되어 있다.
[ ] backend/main.py에서 index.html을 제공한다.
[ ] uvicorn backend.main:app --reload 실행이 된다.
[ ] http://127.0.0.1:8000 접속 시 index.html이 보인다.
[ ] /api/health 응답이 정상이다.
[ ] .gitignore에 .venv, .env, .vscode/sftp.json이 포함되어 있다.
[ ] GitHub에 프로젝트 구조가 올라가 있다.
[ ] sftpdev 계정이 생성되어 있다.
[ ] sshd 서비스가 실행 중이다.
[ ] ssh sftpdev@localhost 접속이 성공한다.
[ ] SFTP 계정이 프로젝트 폴더에 쓰기 권한을 가진다.
[ ] 학원 컴퓨터에서 Tailscale IP로 SSH/SFTP 접속 가능하다.
[ ] VS Code SFTP에서 List Remote가 성공한다.
[ ] 저장 시 uploadOnSave로 집 컴퓨터 프로젝트에 반영된다.
[ ] 집 컴퓨터 FastAPI 서버에서 수정 내용이 브라우저에 반영된다.
```

---

## 23. 앞으로 추가될 예정인 세팅

아직 본격적으로 들어가지 않았지만, 이후 DB 기능을 붙일 때 다음 패키지와 설정이 추가될 가능성이 높다.

```powershell
pip install sqlalchemy psycopg2-binary python-dotenv
pip freeze > requirements.txt
```

예상 역할:

- `sqlalchemy`: Python ORM / DB 연결 관리
- `psycopg2-binary`: PostgreSQL 드라이버
- `python-dotenv`: `.env` 파일에서 DB 접속 정보 불러오기

이 단계는 PostgreSQL 연결을 시작할 때 다시 정리한다.
