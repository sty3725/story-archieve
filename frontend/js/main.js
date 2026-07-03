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
    archive: "./pages/archive.html",
    editor: "./pages/editor.html",
    classroom: "./pages/classroom.html",
    statistics: "./pages/statistics.html"
};


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
    const targetPage = routes[pageName] ? pageName : "archive";

    try {
        const response = await fetch(routes[targetPage]);

        if (!response.ok) {
            throw new Error(`${targetPage} page not found`);
        }

        const html = await response.text();
        pageContent.innerHTML = html;
    } catch (error) {
        pageContent.innerHTML = renderFallbackPage(targetPage);
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
}


/* =========================================================
    9. 페이지 이동 이벤트
    - main 내부의 data-page 버튼 클릭 처리
    - 사이드바 메뉴 클릭 처리
    - 브라우저 해시 변경 처리
========================================================= */

pageContent.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");

    if (!pageButton) return;

    renderPage(pageButton.dataset.page);
});

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        renderPage(item.dataset.page);
    });
});

window.addEventListener("hashchange", () => {
    const pageName = window.location.hash.replace("#", "") || "archive";
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
    fontSize: "medium"
};


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

    document.body.style.setProperty(
        "--custom-page-bg",
        preferences.customBackground
    );

    syncPreferenceUI(preferences);
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

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            const resetPreferences = { ...defaultPreferences };

            preferences.theme = resetPreferences.theme;
            preferences.customBackground = resetPreferences.customBackground;
            preferences.fontSize = resetPreferences.fontSize;

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
}


/* =========================================================
    17. 최초 실행부
    - Preference를 먼저 적용한 뒤 초기 페이지를 렌더링한다.
========================================================= */

initPreferences();

const initialPage = window.location.hash.replace("#", "") || "archive";
renderPage(initialPage);