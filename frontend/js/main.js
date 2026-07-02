const appLayout = document.querySelector(".app-layout");
const sidebarBookmark = document.querySelector("#sidebarBookmark");
const pageContent = document.querySelector("#pageContent");
const menuItems = document.querySelectorAll(".menu-item");

const routes = {
    archive: "./pages/archive.html",
    editor: "./pages/editor.html",
    classroom: "./pages/classroom.html",
    statistics: "./pages/statistics.html"
};

if (sidebarBookmark && appLayout) {
    sidebarBookmark.addEventListener("click", () => {
        const isClosed = appLayout.classList.contains("sidebar-closed");

        if (isClosed) {
            appLayout.classList.remove("sidebar-closed");
            appLayout.classList.add("sidebar-open");
        } else {
            appLayout.classList.remove("sidebar-open");
            appLayout.classList.add("sidebar-closed");
        }
    });
}

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

function setActiveMenu(pageName) {
    menuItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.page === pageName);
    });
}

function updateHash(pageName) {
    if (window.location.hash.replace("#", "") !== pageName) {
        window.location.hash = pageName;
    }
}

function initPage(pageName) {
    if (pageName === "archive" && typeof window.initArchivePage === "function") {
        window.initArchivePage();
    }
}

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

const initialPage = window.location.hash.replace("#", "") || "archive";
renderPage(initialPage);