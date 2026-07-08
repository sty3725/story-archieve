/* =========================================================
    1. DOM 선택
    - 앱 전체에서 공통으로 사용하는 요소를 가져온다.
========================================================= */

const appLayout = document.querySelector(".app-layout");
const sidebarBookmark = document.querySelector("#sidebarBookmark");
const pageContent = document.querySelector("#pageContent");
const menuItems = document.querySelectorAll(".menu-item");


/* =========================================================
    2. 라우트 설정
    - 해시 값과 실제 불러올 HTML 파일을 매핑한다.
    - 예: #archive → ./pages/archive.html
========================================================= */

const routes = {
    home: "./pages/home.html",
    archive: "./pages/archive.html",
    editor: "./pages/editor.html",
    classroom: "./pages/classroom.html",
    statistics: "./pages/statistics.html",
    login: "./pages/login.html",
    register: "./pages/register.html",
    mypage: "./pages/mypage.html"
};

const defaultPage = "home";
const pageName = location.hash.replace("#", "") || "home";

const protectedPages = ["archive", "editor", "classroom", "statistics", "mypage"];

/* =========================================================
    3. 사이드바 토글
    - 북마크 버튼을 누르면 사이드바를 열고 닫는다.
========================================================= */

if (sidebarBookmark && appLayout) {
    sidebarBookmark.addEventListener("click", () => {
        const isClosed = appLayout.classList.contains("sidebar-closed");

        if (isClosed) {
            appLayout.classList.remove("sidebar-closed");
            appLayout.classList.add("sidebar-open");
        } else {
            appLayout.classList.remove("sidebar-open");
            appLayout.classList.add("sidebar-closed");

            const preferencePanel = document.querySelector("#preferencePanel");
            if (preferencePanel) {
                preferencePanel.hidden = true;
                }
        }
    });
}


/* =========================================================
    4. 페이지 렌더링
    - routes에 등록된 HTML 파일을 fetch로 불러온다.
    - 불러온 HTML을 main#pageContent 안에 삽입한다.
========================================================= */

async function renderPage(pageName) {
    const guardedPage = guardPage(pageName);
    const targetPage = routes[guardedPage] ? guardedPage : "home";

    try {
        const response = await fetch(routes[targetPage]);

        if (!response.ok) {
            throw new Error(`${targetPage} page not found`);
        }

        const html = await response.text();
        pageContent.innerHTML = html;
        document.body.dataset.page = targetPage;
    } catch (error) {
        pageContent.innerHTML = renderFallbackPage(targetPage);
        document.body.dataset.page = targetPage;
        console.warn(error);
    }

    setActiveMenu(targetPage);
    updateHash(targetPage);
    initPage(targetPage);
}


/* =========================================================
    5. 임시 페이지 렌더링
    - 아직 editor/classroom/statistics.html이 없을 때
        안내 화면을 보여준다.
========================================================= */

function renderFallbackPage(pageName) {
    const pageTitles = {
        archive: "Archive",
        editor: "Editor",
        classroom: "Class room",
        statistics: "Statistics"
    };

    return `
        <section class="page-section placeholder-page">
            <div class="page-header">
                <div>
                    <h1>${pageTitles[pageName] || "Page"}</h1>
                    <p class="page-description">
                        아직 ${pageTitles[pageName] || pageName} 페이지 파일이 준비되지 않았습니다.
                    </p>
                </div>
            </div>
        </section>
    `;
}


/* =========================================================
    6. 메뉴 활성화 표시
    - 현재 페이지와 같은 data-page를 가진 메뉴에 active를 준다.
========================================================= */

function setActiveMenu(pageName) {
    menuItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.page === pageName);
    });
}


/* =========================================================
    7. 해시 주소 업데이트
    - 메뉴 이동 시 URL을 #archive, #editor 같은 형태로 바꾼다.
========================================================= */

function updateHash(pageName) {
    if (window.location.hash.replace("#", "") !== pageName) {
        window.location.hash = pageName;
    }
}


/* =========================================================
    8. 페이지별 초기화
    - 페이지 HTML이 삽입된 뒤, 해당 페이지 전용 JS를 실행한다.
    - Archive 기능은 archive.js의 window.initArchivePage()가 담당한다.
========================================================= */

function initPage(pageName) {
    if (pageName === "archive" && typeof window.initArchivePage === "function") {
        window.initArchivePage();
    }

    if (
        (pageName === "login" || pageName === "register") &&
        typeof window.initAuthPage === "function"
    ) {
        window.initAuthPage(pageName);
    }

    if (pageName === "mypage" && typeof window.initMyPage === "function") {
        window.initMyPage();
    }

    if (pageName === "editor" && window.initEditorPage) {
        window.initEditorPage();
    }
}

/* =========================================================
    9. 페이지 이동 이벤트
    - main 내부의 data-page 버튼 클릭 처리
    - 사이드바 메뉴 클릭 처리
    - 브라우저 해시 변경 처리
========================================================= */

document.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");

    if (!pageButton) return;

    event.preventDefault();
    location.hash = pageButton.dataset.page;
});

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        location.hash = item.dataset.page;
    });
});

window.addEventListener("hashchange", () => {
    const pageName = window.location.hash.replace("#", "") || "home";
    renderPage(pageName);
});


/* =========================================================
    10. Preference 저장 키 / 기본값
    - 전체 앱 환경설정을 localStorage에 저장한다.
========================================================= */

const PREFERENCE_STORAGE_KEY = "storyArchive.preferences";

const defaultPreferences = {
    theme: "light",
    customBackground: "#f5f5f5",
    fontSize: "medium",

    sidebarMode: "default",
    sidebarPreset: "midnight",
    customSidebarBackground: "#050913"
};

const sidebarPresetColors = {
    midnight: "#050913",
    violet: "#34135f",
    deepBlue: "#073b72",
    emerald: "#064e3b",
    wine: "#5f1238",
    slate: "#1f2937"
};

const sidebarRandomColors = [
    "#050913", // midnight
    "#0f172a", // navy slate
    "#111827", // charcoal navy
    "#1e1b4b", // indigo
    "#312e81", // royal indigo
    "#34135f", // violet
    "#4c1d95", // purple
    "#581c87", // deep purple
    "#073b72", // deep blue
    "#0c4a6e", // ocean
    "#155e75", // cyan teal
    "#064e3b", // emerald
    "#065f46", // green teal
    "#14532d", // forest
    "#3f2a17", // coffee
    "#4a1d1f", // oxblood
    "#5f1238", // wine
    "#7f1d1d", // dark red
    "#1f2937", // slate
    "#243b53"  // steel blue
];

/* =========================================================
    11. Preference 초기화
    - 저장된 설정을 불러와 적용하고, 설정 패널 이벤트를 연결한다.
========================================================= */

function initPreferences() {
    const preferences = loadPreferences();

    applyPreferences(preferences);
    bindPreferenceEvents(preferences);
}


/* =========================================================
    12. Preference 불러오기
    - localStorage에 저장된 값을 읽는다.
    - 저장값이 없거나 깨졌으면 기본값을 사용한다.
========================================================= */

function loadPreferences() {
    const savedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);

    if (!savedPreferences) {
        return { ...defaultPreferences };
    }

    try {
        return {
            ...defaultPreferences,
            ...JSON.parse(savedPreferences)
        };
    } catch (error) {
        console.warn("Preference parse failed:", error);
        return { ...defaultPreferences };
    }
}


/* =========================================================
    13. Preference 저장
========================================================= */

function savePreferences(preferences) {
    localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(preferences));
}


/* =========================================================
    14. Preference 적용
    - body의 data 속성과 CSS 변수를 갱신한다.
========================================================= */
function applyPreferences(preferences) {
    document.body.dataset.theme = preferences.theme;
    document.body.dataset.fontSize = preferences.fontSize;
    document.body.dataset.sidebarMode = preferences.sidebarMode;

    document.body.style.setProperty(
        "--custom-page-bg",
        preferences.customBackground
    );

    applySidebarPreference(preferences);
    syncPreferenceUI(preferences);
}

function applySidebarPreference(preferences) {
    if (preferences.sidebarMode === "default") {
        document.body.style.removeProperty("--sidebar-bg");
        return;
    }

    document.body.style.setProperty(
        "--sidebar-bg",
        preferences.customSidebarBackground
    );
}

/* =========================================================
    15. Preference 이벤트 연결
    - Preference 열기/닫기
    - 테마 변경
    - 글자 크기 변경
    - Custom 배경색 변경
    - 설정 초기화
========================================================= */

function bindPreferenceEvents(preferences) {
    const preferenceToggle = document.querySelector("#preferenceToggle");
    const preferencePanel = document.querySelector("#preferencePanel");
    const preferenceCloseBtn = document.querySelector("#preferenceCloseBtn");

    const themeButtons = document.querySelectorAll("[data-theme-option]");
    const fontSizeButtons = document.querySelectorAll("[data-font-size-option]");
    const customBackgroundInput = document.querySelector("#customBackgroundInput");
    const resetButton = document.querySelector("#resetPreferenceBtn");

    const sidebarPresetButtons = document.querySelectorAll("[data-sidebar-preset]");
    const sidebarDefaultBtn = document.querySelector("#sidebarDefaultBtn");
    const sidebarRandomBtn = document.querySelector("#sidebarRandomBtn");

    if (preferenceToggle && preferencePanel) {
        preferenceToggle.addEventListener("click", () => {
            preferencePanel.hidden = !preferencePanel.hidden;
        });
    }

    if (preferenceCloseBtn && preferencePanel) {
        preferenceCloseBtn.addEventListener("click", () => {
            preferencePanel.hidden = true;
        });
    }

    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            preferences.theme = button.dataset.themeOption;
            savePreferences(preferences);
            applyPreferences(preferences);
        });
    });

    fontSizeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            preferences.fontSize = button.dataset.fontSizeOption;
            savePreferences(preferences);
            applyPreferences(preferences);
        });
    });

    if (customBackgroundInput) {
        customBackgroundInput.addEventListener("input", () => {
            preferences.theme = "custom";
            preferences.customBackground = customBackgroundInput.value;
            savePreferences(preferences);
            applyPreferences(preferences);
        });
    }

    sidebarPresetButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const presetName = button.dataset.sidebarPreset;
            const presetColor = sidebarPresetColors[presetName];

            if (!presetColor) return;

            preferences.sidebarMode = "preset";
            preferences.sidebarPreset = presetName;
            preferences.customSidebarBackground = presetColor;

            savePreferences(preferences);
            applyPreferences(preferences);
        });
    });

    if (sidebarDefaultBtn) {
        sidebarDefaultBtn.addEventListener("click", () => {
            preferences.sidebarMode = "default";
            preferences.sidebarPreset = "midnight";
            preferences.customSidebarBackground = defaultPreferences.customSidebarBackground;

            savePreferences(preferences);
            applyPreferences(preferences);
        });
    }

    if (sidebarRandomBtn) {
        sidebarRandomBtn.addEventListener("click", () => {
            const randomIndex = Math.floor(Math.random() * sidebarRandomColors.length);
            const randomColor = sidebarRandomColors[randomIndex];

            preferences.sidebarMode = "random";
            preferences.sidebarPreset = "";
            preferences.customSidebarBackground = randomColor;

            savePreferences(preferences);
            applyPreferences(preferences);
        });
    }

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            preferences.theme = defaultPreferences.theme;
            preferences.customBackground = defaultPreferences.customBackground;
            preferences.fontSize = defaultPreferences.fontSize;

            preferences.sidebarMode = defaultPreferences.sidebarMode;
            preferences.sidebarPreset = defaultPreferences.sidebarPreset;
            preferences.customSidebarBackground = defaultPreferences.customSidebarBackground;

            savePreferences(preferences);
            applyPreferences(preferences);
        });
    }
}

/* =========================================================
    16. Preference UI 동기화
    - 현재 설정에 맞춰 버튼 active 상태와 color input 값을 맞춘다.
========================================================= */

function syncPreferenceUI(preferences) {
    const themeButtons = document.querySelectorAll("[data-theme-option]");
    const fontSizeButtons = document.querySelectorAll("[data-font-size-option]");
    const customBackgroundInput = document.querySelector("#customBackgroundInput");

    const sidebarPresetButtons = document.querySelectorAll("[data-sidebar-preset]");
    const sidebarDefaultBtn = document.querySelector("#sidebarDefaultBtn");
    const sidebarRandomBtn = document.querySelector("#sidebarRandomBtn");

    themeButtons.forEach((button) => {
        button.classList.toggle(
            "is-active",
            button.dataset.themeOption === preferences.theme
        );
    });

    fontSizeButtons.forEach((button) => {
        button.classList.toggle(
            "is-active",
            button.dataset.fontSizeOption === preferences.fontSize
        );
    });

    if (customBackgroundInput) {
        customBackgroundInput.value = preferences.customBackground;
    }

    sidebarPresetButtons.forEach((button) => {
        button.classList.toggle(
            "is-active",
            preferences.sidebarMode === "preset" &&
            button.dataset.sidebarPreset === preferences.sidebarPreset
        );
    });

    if (sidebarDefaultBtn) {
        sidebarDefaultBtn.classList.toggle(
            "is-active",
            preferences.sidebarMode === "default"
        );
    }

    if (sidebarRandomBtn) {
        sidebarRandomBtn.classList.toggle(
            "is-active",
            preferences.sidebarMode === "random"
        );
    }
}
/*==========================================================
    보호 페이지 처리
==========================================================*/

function isLoggedIn() {
    return Boolean(localStorage.getItem("storyArchive.accessToken"));
}

function guardPage(pageName) {
    if (protectedPages.includes(pageName) && !isLoggedIn()) {
        return "login";
    }

    return pageName;
}


/* =========================================================
    최초 실행부
    - Preference를 먼저 적용한 뒤 초기 페이지를 렌더링한다.
========================================================= */

initPreferences();

const initialPage = window.location.hash.replace("#", "") || "home";
renderPage(initialPage);