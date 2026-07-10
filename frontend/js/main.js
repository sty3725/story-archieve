/* =========================================================
   Story Archive - Main JS
   ---------------------------------------------------------
   담당 기능:
   1. 페이지 partial 로딩
   2. 사이드바 메뉴 이동
   3. 테마 변경
   4. 글자 크기 변경
   5. 설정 패널 열기/닫기
   6. 메인 사이드바 접기/펼치기
   ========================================================= */


/* =========================================================
   기본 설정
   ========================================================= */

const PAGE_CONTAINER_SELECTOR = "#page-content";
const DEFAULT_PAGE = "archive";

const PAGE_PATH_MAP = {
  dashboard: "./pages/dashboard.html",
  archive: "./pages/archive.html",
  classroom: "./pages/classroom.html",
  editor: "./pages/editor.html",
};

const THEME_STORAGE_KEY = "storyArchiveTheme";
const FONT_SCALE_STORAGE_KEY = "storyArchiveFontScale";
const SIDEBAR_COLLAPSED_STORAGE_KEY = "storyArchiveSidebarCollapsed";

const AVAILABLE_THEMES = [
  "mono-dark",
  "ivory-light",
  "forest",
  "sunset",
  "ocean",
  "lavender",
];

const AVAILABLE_FONT_SCALES = [
  "small",
  "normal",
  "large",
  "xlarge",
];


/* =========================================================
   테마 적용
   ========================================================= */

function applyTheme(themeName) {
  const safeTheme = AVAILABLE_THEMES.includes(themeName)
    ? themeName
    : "mono-dark";

  document.body.classList.remove(
    ...AVAILABLE_THEMES.map((theme) => `theme-${theme}`)
  );

  document.body.classList.add(`theme-${safeTheme}`);
  localStorage.setItem(THEME_STORAGE_KEY, safeTheme);

  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.theme === safeTheme);
  });
}


/* =========================================================
   글자 크기 적용
   ========================================================= */

function applyFontScale(fontScale) {
  const safeFontScale = AVAILABLE_FONT_SCALES.includes(fontScale)
    ? fontScale
    : "normal";

  document.body.classList.remove(
    ...AVAILABLE_FONT_SCALES.map((scale) => `font-scale-${scale}`)
  );

  document.body.classList.add(`font-scale-${safeFontScale}`);
  localStorage.setItem(FONT_SCALE_STORAGE_KEY, safeFontScale);

  document.querySelectorAll("[data-font-scale]").forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.fontScale === safeFontScale
    );
  });
}


/* =========================================================
   설정 패널
   ========================================================= */

function getPreferenceElements() {
  const preferenceToggle =
    document.querySelector("#preferenceToggle") ||
    document.querySelector(".settings-button");

  const preferencePanel =
    document.querySelector("#preferencePanel") ||
    document.querySelector(".preference-panel") ||
    document.querySelector(".theme-popover");

  return {
    preferenceToggle,
    preferencePanel,
  };
}

function closePreferencePanel() {
    const { preferenceToggle, preferencePanel } = getPreferenceElements();

    if (!preferencePanel) return;

    preferencePanel.classList.remove("is-open");

    if (preferenceToggle) {
        preferenceToggle.setAttribute("aria-expanded", "false");
    }
}

function openPreferencePanel() {
    const { preferenceToggle, preferencePanel } = getPreferenceElements();

    if (!preferencePanel) return;

    preferencePanel.classList.add("is-open");

    if (preferenceToggle) {
        preferenceToggle.setAttribute("aria-expanded", "true");
    }
}

function togglePreferencePanel() {
    const { preferencePanel } = getPreferenceElements();

    if (!preferencePanel) return;

    const isOpen = preferencePanel.classList.contains("is-open");

    if (isOpen) {
        closePreferencePanel();
    } else {
        openPreferencePanel();
    }
}

function initPreferencePanel() {
    const { preferenceToggle, preferencePanel } = getPreferenceElements();

    if (!preferenceToggle || !preferencePanel) {
        console.warn("[Story Archive] 설정 버튼 또는 설정 패널을 찾을 수 없습니다.");
        return;
    }

    preferenceToggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        togglePreferencePanel();
    });

    preferencePanel.addEventListener("click", (event) => {
        event.stopPropagation();

        const closeButton = event.target.closest(
        "#preferenceClose, .preference-close, [data-preference-close]"
        );

        if (closeButton) {
        event.preventDefault();
        closePreferencePanel();
        return;
        }

        const themeButton = event.target.closest("[data-theme]");

        if (themeButton) {
        event.preventDefault();
        applyTheme(themeButton.dataset.theme);
        return;
        }

        const fontScaleButton = event.target.closest("[data-font-scale]");

        if (fontScaleButton) {
        event.preventDefault();
        applyFontScale(fontScaleButton.dataset.fontScale);
        }
    });

    document.addEventListener("click", () => {
        closePreferencePanel();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
        closePreferencePanel();
        }
    });
}

function initPreferencePanel() {
  const {
    preferenceToggle,
    preferencePanel,
    preferenceClose,
  } = getPreferenceElements();

  if (!preferenceToggle || !preferencePanel) {
    console.warn("[Story Archive] 설정 버튼 또는 설정 패널을 찾을 수 없습니다.");
    return;
  }

  preferenceToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePreferencePanel();
  });

  if (preferenceClose) {
    preferenceClose.addEventListener("click", (event) => {
      event.stopPropagation();
      closePreferencePanel();
    });
  }

  preferencePanel.addEventListener("click", (event) => {
    event.stopPropagation();

    const themeButton = event.target.closest("[data-theme]");
    if (themeButton) {
      applyTheme(themeButton.dataset.theme);
      return;
    }

    const fontScaleButton = event.target.closest("[data-font-scale]");
    if (fontScaleButton) {
      applyFontScale(fontScaleButton.dataset.fontScale);
    }
  });

  document.addEventListener("click", () => {
    closePreferencePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePreferencePanel();
    }
  });
}

/* =========================================================
   메인 사이드바 접기 / 펼치기
   ========================================================= */

function applySidebarCollapsed(isCollapsed) {
  document.body.classList.toggle("sidebar-collapsed", isCollapsed);

  localStorage.setItem(
    SIDEBAR_COLLAPSED_STORAGE_KEY,
    isCollapsed ? "true" : "false"
  );

  const toggleButton = document.querySelector("#sidebarCollapseToggle");

  if (toggleButton) {
    toggleButton.setAttribute("aria-expanded", String(!isCollapsed));
    toggleButton.setAttribute(
      "aria-label",
      isCollapsed ? "사이드바 펼치기" : "사이드바 접기"
    );

    toggleButton.textContent = isCollapsed ? "❯" : "❮";
  }

  if (isCollapsed) {
    closePreferencePanel();
  }
}

function initSidebarCollapse() {
  const toggleButton = document.querySelector("#sidebarCollapseToggle");

  if (!toggleButton) {
    console.warn("[Story Archive] 사이드바 접기 버튼을 찾을 수 없습니다.");
    return;
  }

  const savedValue = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
  const isCollapsed = savedValue === "true";

  applySidebarCollapsed(isCollapsed);

  toggleButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const nextCollapsed =
      !document.body.classList.contains("sidebar-collapsed");

    applySidebarCollapsed(nextCollapsed);
  });
}

/* =========================================================
   페이지 로딩
   ========================================================= */

async function loadPage(pageName) {
  const pageContainer = document.querySelector(PAGE_CONTAINER_SELECTOR);

  if (!pageContainer) {
    console.warn("[Story Archive] page-view 컨테이너를 찾을 수 없습니다.");
    return;
  }

  const safePageName = PAGE_PATH_MAP[pageName] ? pageName : DEFAULT_PAGE;
  const pagePath = PAGE_PATH_MAP[safePageName];

  try {
    pageContainer.setAttribute("aria-busy", "true");

    const response = await fetch(pagePath);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    pageContainer.innerHTML = html;
    pageContainer.focus();

    setActiveNavigation(safePageName);
    runPageInit(safePageName);
  } catch (error) {
    console.error("[Story Archive] 페이지 로딩 실패:", error);

    pageContainer.innerHTML = `
      <section class="empty-page-state">
        <h1>페이지를 불러오지 못했습니다.</h1>
        <p>${pagePath} 파일 경로나 내용을 확인해주세요.</p>
      </section>
    `;
  } finally {
    pageContainer.setAttribute("aria-busy", "false");
  }
}


/* =========================================================
   사이드바 메뉴 active 처리
   ========================================================= */

function setActiveNavigation(pageName) {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.page === pageName);
  });
}

function initSidebarNavigation() {
  document.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");

    if (!pageButton) return;

    event.preventDefault();

    const pageName = pageButton.dataset.page;

    if (!pageName) return;

    loadPage(pageName);
  });
}


/* =========================================================
   페이지별 초기화
   ---------------------------------------------------------
   각 partial 페이지에서 window.initArchivePage 같은 함수를
   만들어두면 페이지 로딩 후 자동 실행된다.
   ========================================================= */

function runPageInit(pageName) {
  console.log(`[Story Archive] ${pageName} 페이지 초기화`);

  if (pageName === "archive" && typeof window.initArchivePage === "function") {
    window.initArchivePage();
  }

  if (pageName === "editor" && typeof window.initEditorPage === "function") {
    window.initEditorPage();
  }

  if (
    pageName === "dashboard" &&
    typeof window.initDashboardPage === "function"
  ) {
    window.initDashboardPage();
  }

  if (
    pageName === "classroom" &&
    typeof window.initClassroomPage === "function"
  ) {
    window.initClassroomPage();
  }
}


/* =========================================================
   초기 실행
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "mono-dark";
  const savedFontScale =
    localStorage.getItem(FONT_SCALE_STORAGE_KEY) || "normal";

  applyTheme(savedTheme);
  applyFontScale(savedFontScale);

  initPreferencePanel();
  initSidebarCollapse();
  initSidebarNavigation();

  const pageContainer = document.querySelector(PAGE_CONTAINER_SELECTOR);

  if (pageContainer) {
    loadPage(DEFAULT_PAGE);
  } else {
    console.warn("[Story Archive] page-view 컨테이너를 찾을 수 없습니다.");
  }
});


/* =========================================================
   디버그용 전역 함수
   ---------------------------------------------------------
   콘솔에서 resetPreferences() 입력하면
   테마 / 글자 크기 / 사이드바 접힘 상태 초기화
   ========================================================= */

window.resetPreferences = function resetPreferences() {
  localStorage.removeItem(THEME_STORAGE_KEY);
  localStorage.removeItem(FONT_SCALE_STORAGE_KEY);
  localStorage.removeItem(SIDEBAR_COLLAPSED_STORAGE_KEY);

  applyTheme("mono-dark");
  applyFontScale("normal");
  applySidebarCollapsed(false);

  console.log("[Story Archive] 사용자 설정을 초기화했습니다.");
};