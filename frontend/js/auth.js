function initAuthPage(pageName) {
    if (pageName === "login") {
        bindLoginForm();
    }

    if (pageName === "register") {
        bindRegisterForm();
    }
}

function bindLoginForm() {
    const loginForm = document.querySelector("#loginForm");
    const authMessage = document.querySelector("#authMessage");

    if (!loginForm || loginForm.dataset.bound === "true") return;

    loginForm.dataset.bound = "true";

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.querySelector("#loginEmail").value.trim();
        const password = document.querySelector("#loginPassword").value;

        if (!email || !password) {
            showAuthMessage("이메일과 비밀번호를 입력하세요.", "error");
            return;
        }

        showAuthMessage("로그인 API 연결 대기 중입니다.", "success");

        // 나중에 여기를 실제 API로 교체
        // await login(email, password);
    });
}

function bindRegisterForm() {
    const registerForm = document.querySelector("#registerForm");

    if (!registerForm || registerForm.dataset.bound === "true") return;

    registerForm.dataset.bound = "true";

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.querySelector("#registerEmail").value.trim();
        const username = document.querySelector("#registerUsername").value.trim();
        const password = document.querySelector("#registerPassword").value;
        const passwordCheck = document.querySelector("#registerPasswordCheck").value;

        if (!email || !username || !password || !passwordCheck) {
            showAuthMessage("모든 항목을 입력하세요.", "error");
            return;
        }

        if (password !== passwordCheck) {
            showAuthMessage("비밀번호가 서로 다릅니다.", "error");
            return;
        }

        showAuthMessage("회원가입 API 연결 대기 중입니다.", "success");

        // 나중에 여기를 실제 API로 교체
        // await register(email, username, password);
    });
}

function showAuthMessage(message, type = "") {
    const authMessage = document.querySelector("#authMessage");

    if (!authMessage) return;

    authMessage.textContent = message;
    authMessage.classList.remove("is-error", "is-success");

    if (type === "error") {
        authMessage.classList.add("is-error");
    }

    if (type === "success") {
        authMessage.classList.add("is-success");
    }
}

function initMyPage() {
    const logoutButton = document.querySelector("#mypageLogoutBtn");

    if (!logoutButton || logoutButton.dataset.bound === "true") return;

    logoutButton.dataset.bound = "true";

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("storyArchive.accessToken");
        localStorage.removeItem("storyArchive.user");

        location.hash = "home";
    });
}

window.initAuthPage = initAuthPage;
window.initMyPage = initMyPage;