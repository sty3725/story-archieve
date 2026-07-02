const appLayout = document.querySelector(".app-layout");
const sidebarBookmark = document.querySelector("#sidebarBookmark");
const pageContent = document.querySelector("#pageContent");
const menuItems = document.querySelectorAll(".menu-item");

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

const pages = {
    archive: `
        <section class="page-section archive-page" id="archivePage">
            <div class="page-header archive-page-header">
                <div class="archive-title-row">
                    <h1>Archive</h1>
                    <span class="mode-label">조회 모드</span>
                </div>

                <button class="mode-toggle-btn" id="archiveEditToggle" type="button">
                    편집 모드
                </button>
            </div>

            <div class="archive-workspace">
                <section class="panel archive-work-list">
                    <div class="panel-header">
                        <h2>작품 목록</h2>
                        <span>3 works</span>
                    </div>

                    <div class="mock-list">
                        <button class="mock-list-item active">검은 도시의 기록</button>
                        <button class="mock-list-item">마녀의 계절</button>
                        <button class="mock-list-item">단편 모음</button>
                    </div>

                    <div class="section-actions edit-only">
                        <button class="sub-btn" type="button">새 작품</button>
                        <button class="sub-btn" type="button">이름 변경</button>
                    </div>
                </section>

                <section class="panel archive-structure-panel">
                    <div class="panel-header">
                        <h2>작품 구조</h2>
                        <span>Tree</span>
                    </div>

                    <div class="tree-box">
                        <div class="tree-group">
                            <button class="tree-item tree-parent" type="button">
                                <span class="tree-toggle">▾</span>
                                <span class="tree-title">1부</span>
                            </button>

                            <div class="tree-children">
                                <button class="tree-item tree-child active" type="button">
                                    <span class="tree-line"></span>
                                    <span class="tree-title">1화 - 시작</span>
                                </button>

                                <button class="tree-item tree-child" type="button">
                                    <span class="tree-line"></span>
                                    <span class="tree-title">2화 - 추적</span>
                                </button>

                                <button class="tree-item tree-child" type="button">
                                    <span class="tree-line"></span>
                                    <span class="tree-title">3화 - 균열</span>
                                </button>
                            </div>
                        </div>

                        <div class="tree-group">
                            <button class="tree-item tree-parent" type="button">
                                <span class="tree-toggle">▸</span>
                                <span class="tree-title">설정집</span>
                            </button>
                        </div>

                        <div class="tree-group">
                            <button class="tree-item tree-parent" type="button">
                                <span class="tree-toggle">▸</span>
                                <span class="tree-title">외전</span>
                            </button>
                        </div>
                    </div>

                    <div class="section-actions edit-only">
                        <button class="sub-btn" type="button">새 폴더</button>
                        <button class="sub-btn" type="button">새 문서</button>
                        <button class="sub-btn" type="button">이름 변경</button>
                    </div>
                </section>

                <section class="panel archive-preview-panel">
                    <div class="panel-header">
                        <h2>미리보기</h2>
                        <button class="sub-btn" data-page="editor" type="button">
                            에디터에서 열기
                        </button>
                    </div>

                    <article class="preview-document">
                        <h3>1화 - 시작</h3>
                        <p>
                            선택한 문서의 내용을 간단히 보여주는 공간입니다.
                            나중에 실제 원고 데이터와 연결됩니다.
                        </p>
                        <p>
                            이 영역은 실제 문서 내용을 어느 정도 읽을 수 있어야 하므로,
                            짧은 카드가 아니라 화면 아래까지 이어지는 긴 패널로 둡니다.
                        </p>
                        <p>
                            편집 모드에서는 이 문서에 대한 이름 변경, 이동, 삭제 같은 기능이
                            별도의 액션으로 노출될 수 있습니다.
                        </p>
                    </article>

                    <div class="section-actions edit-only">
                        <button class="sub-btn" type="button">문서 이름 변경</button>
                        <button class="danger-btn" type="button">문서 삭제</button>
                    </div>
                </section>
            </div>
        </section>
    `,

    editor: `
        <section class="page-section editor-page">
            <div class="page-header">
                <div>
                    <p class="page-kicker">Writing Editor</p>
                    <h1>Editor</h1>
                    <p class="page-description">
                        선택한 문서를 작성하고 저장하는 공간입니다.
                    </p>
                </div>
                <button class="primary-btn">저장</button>
            </div>

            <div class="editor-layout">
                <section class="panel editor-doc-list">
                    <h2>문서</h2>
                    <div class="mock-list">
                        <button class="mock-list-item active">1화 - 시작</button>
                        <button class="mock-list-item">2화 - 추적</button>
                        <button class="mock-list-item">인물 설정</button>
                    </div>
                </section>

                <section class="panel editor-main">
                    <input class="editor-title" value="1화 - 시작" />
                    <textarea class="editor-textarea" placeholder="여기에 원고를 작성합니다."></textarea>
                </section>

                <section class="panel editor-side">
                    <h2>메모 / 버전</h2>
                    <p>최근 저장: 아직 없음</p>
                    <p>버전: v0.1 mock</p>
                </section>
            </div>
        </section>
    `,

    classroom: `
        <section class="page-section classroom-page">
            <div class="page-header">
                <div>
                    <p class="page-kicker">Class Room</p>
                    <h1>Class room</h1>
                    <p class="page-description">
                        피드백, 과제, 강의 자료를 확인하는 공간입니다.
                    </p>
                </div>
            </div>

            <div class="card-grid">
                <article class="panel">
                    <h2>최근 피드백</h2>
                    <p>아직 등록된 피드백이 없습니다.</p>
                </article>

                <article class="panel">
                    <h2>과제</h2>
                    <p>이번 주 제출할 원고가 표시될 영역입니다.</p>
                </article>

                <article class="panel">
                    <h2>강의 자료</h2>
                    <p>강의 노트와 참고 자료가 표시될 영역입니다.</p>
                </article>
            </div>
        </section>
    `,

    statistics: `
        <section class="page-section statistics-page">
            <div class="page-header">
                <div>
                    <p class="page-kicker">Writing Statistics</p>
                    <h1>Statistics</h1>
                    <p class="page-description">
                        작성량, 수정 횟수, 작업 패턴을 확인하는 공간입니다.
                    </p>
                </div>
            </div>

            <div class="card-grid">
                <article class="panel stat-card">
                    <h2>총 작품 수</h2>
                    <strong>3</strong>
                </article>

                <article class="panel stat-card">
                    <h2>총 문서 수</h2>
                    <strong>12</strong>
                </article>

                <article class="panel stat-card">
                    <h2>이번 주 작성량</h2>
                    <strong>0자</strong>
                </article>
            </div>
        </section>
    `
};

function renderPage(pageName) {
    const targetPage = pages[pageName] ? pageName : "archive";

    pageContent.innerHTML = pages[targetPage];

    menuItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.page === targetPage);
    });

    window.location.hash = targetPage;
}

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        renderPage(item.dataset.page);
    });
});

pageContent.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");

    if (!pageButton) return;

    renderPage(pageButton.dataset.page);
});

window.addEventListener("hashchange", () => {
    const pageName = window.location.hash.replace("#", "") || "archive";
    renderPage(pageName);
});

const initialPage = window.location.hash.replace("#", "") || "archive";
renderPage(initialPage);