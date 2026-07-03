/* =========================================================
   Archive 더미 데이터 / 상태
   - DB 연결 전까지 화면 상호작용 테스트용
   - 렌더링 함수는 archiveStore만 바라본다.
========================================================= */

const ARCHIVE_STATE_KEY = "storyArchive.archiveState";
const ARCHIVE_TREE_KEY = "storyArchive.archiveTreeState";
const ARCHIVE_RECENT_KEY = "storyArchive.recentSelection";

const archiveDummyData = [
    {
        id: "work-1",
        title: "검은 도시의 기록",
        description: "근미래 도시를 배경으로 한 미스터리 장편.",
        folders: [
            {
                id: "folder-1",
                title: "1부",
                expanded: true,
                documents: [
                    {
                        id: "doc-1",
                        title: "1화 - 시작",
                        content: `비가 내리는 도시는 늘 같은 냄새를 품고 있었다.\n오래된 전선, 젖은 콘크리트, 그리고 아무도 말하지 않는 비밀의 냄새.\n\n유하는 새벽 세 시의 정류장에 서 있었다.\n마지막 버스는 이미 지나갔고, 전광판에는 존재하지 않는 노선 번호가 깜빡이고 있었다.\n\n그는 그 숫자를 본 순간 알 수 있었다.\n오늘 밤, 이 도시는 평소와 다르게 움직이고 있었다.`
                    },
                    {
                        id: "doc-2",
                        title: "2화 - 추적",
                        content: `발신자 없는 메시지는 짧았다.\n\n'뒤돌아보지 마.'\n\n하지만 사람은 하지 말라는 말을 들었을 때 가장 먼저 그것을 떠올린다.\n유하는 유리창에 비친 자신의 뒤편을 보았다.\n검은 우산을 쓴 남자가, 한 걸음도 움직이지 않은 채 서 있었다.`
                    },
                    {
                        id: "doc-3",
                        title: "3화 - 균열",
                        content: `도시는 완벽한 기계처럼 보였지만, 그 내부에는 아주 작은 균열들이 있었다.\n\n사라진 사람들.\n기록되지 않은 사건들.\n그리고 매번 같은 시간에 멈추는 시계탑.\n\n유하는 그 균열이 우연이 아니라는 사실을 깨닫기 시작했다.`
                    }
                ]
            },
            {
                id: "folder-2",
                title: "설정집",
                expanded: false,
                documents: [
                    {
                        id: "doc-4",
                        title: "도시 설정",
                        content: `검은 도시는 네 개의 구역으로 나뉜다.\n\n중심구는 행정과 감시의 심장부다.\n외곽구는 버려진 산업지대이며, 밤이 되면 지도에서 사라지는 구역이 생긴다.\n\n시민들은 도시가 자신들을 보호한다고 믿지만, 사실 도시는 시민들을 기록하고 분류하는 장치에 가깝다.`
                    },
                    {
                        id: "doc-5",
                        title: "인물 설정",
                        content: `유하:\n과거 기록 관리국에서 일했던 인물.\n현재는 도시 외곽에서 실종 사건을 추적한다.\n\n서린:\n도시 시스템의 결함을 추적하는 해커.\n유하에게 정보를 제공하지만 자신의 목적은 숨기고 있다.`
                    }
                ]
            }
        ]
    },
    {
        id: "work-2",
        title: "마녀의 계절",
        description: "계절이 멈춘 마을과 마녀의 계약을 다룬 판타지.",
        folders: [
            {
                id: "folder-3",
                title: "본편",
                expanded: true,
                documents: [
                    {
                        id: "doc-6",
                        title: "프롤로그",
                        content: `그 마을에는 봄이 오지 않았다.\n\n사람들은 처음엔 긴 겨울이라고 생각했다.\n그러나 세 번째 눈이 녹지 않았을 때, 모두가 알게 되었다.\n\n누군가 계절을 붙잡고 있었다.`
                    },
                    {
                        id: "doc-7",
                        title: "1장 - 계약",
                        content: `아이린은 숲 가장 깊은 곳에서 마녀를 만났다.\n\n마녀는 늙지도, 젊지도 않은 얼굴로 웃었다.\n그녀의 손끝에는 아직 오지 않은 봄의 냄새가 묻어 있었다.\n\n"계절을 돌려받고 싶니?"`
                    }
                ]
            }
        ]
    },
    {
        id: "work-3",
        title: "단편 모음",
        description: "짧은 아이디어와 실험적인 단편들을 모은 공간.",
        folders: [
            {
                id: "folder-4",
                title: "SF 단편",
                expanded: true,
                documents: [
                    {
                        id: "doc-8",
                        title: "유리 행성",
                        content: `그 행성의 표면은 전부 유리였다.\n\n낮에는 별빛을 반사했고, 밤에는 오래전에 사라진 문명의 기억을 비추었다.\n\n탐사대는 첫날, 자신들의 미래를 보았다.`
                    }
                ]
            },
            {
                id: "folder-5",
                title: "판타지 단편",
                expanded: false,
                documents: [
                    {
                        id: "doc-9",
                        title: "용의 우편함",
                        content: `산꼭대기에는 낡은 우편함이 하나 있었다.\n\n사람들은 그곳에 편지를 넣으면 용이 답장을 해준다고 믿었다.\n문제는 어느 날부터 용의 답장이 너무 현실적이 되었다는 점이다.`
                    }
                ]
            }
        ]
    }
];

let archiveStore = [];
let currentArchiveState = {
    workId: null,
    documentId: null
};
let archiveInitialized = false;


/* =========================================================
   초기화
========================================================= */

function initArchivePage() {
    const archivePage = document.querySelector("#archivePage");
    const editToggle = document.querySelector("#archiveEditToggle");
    const modeLabel = document.querySelector(".mode-label");

    if (!archivePage || !editToggle || !modeLabel) return;

    archiveInitialized = false;

    loadArchiveData();
    restoreArchiveState();
    restoreTreeState();
    ensureValidArchiveState();
    renderArchiveView();

    editToggle.addEventListener("click", () => {
        const isEditing = archivePage.classList.toggle("is-editing");

        modeLabel.textContent = isEditing ? "편집 모드" : "조회 모드";
        editToggle.textContent = isEditing ? "조회 모드로 돌아가기" : "편집 모드";

        if (!isEditing) {
            clearArchiveSelection();
            closeArchiveCreateMenu();
        }

        updateArchiveSelectedCount();
    });

    bindArchiveViewEvents();
    bindArchiveSelectionEvents();
    bindArchiveEditEvents();
    bindArchiveBackupEvents();
    updateArchiveSelectedCount();

    archiveInitialized = true;
}


/* =========================================================
   데이터 로딩 / 저장
========================================================= */

function loadArchiveData() {
    archiveStore = structuredCloneSafe(archiveDummyData);
}

function structuredCloneSafe(data) {
    if (typeof structuredClone === "function") {
        return structuredClone(data);
    }

    return JSON.parse(JSON.stringify(data));
}

function saveArchiveState() {
    localStorage.setItem(ARCHIVE_STATE_KEY, JSON.stringify(currentArchiveState));
    saveRecentSelection();
}

function restoreArchiveState() {
    const savedState = localStorage.getItem(ARCHIVE_STATE_KEY);

    if (!savedState) return;

    try {
        currentArchiveState = {
            ...currentArchiveState,
            ...JSON.parse(savedState)
        };
    } catch (error) {
        console.warn("Archive state parse failed:", error);
    }
}

function saveTreeState() {
    const expandedFolderIds = [];

    archiveStore.forEach((work) => {
        work.folders.forEach((folder) => {
            if (folder.expanded) {
                expandedFolderIds.push(folder.id);
            }
        });
    });

    localStorage.setItem(ARCHIVE_TREE_KEY, JSON.stringify(expandedFolderIds));
}

function restoreTreeState() {
    const savedTreeState = localStorage.getItem(ARCHIVE_TREE_KEY);

    if (!savedTreeState) return;

    try {
        const expandedFolderIds = JSON.parse(savedTreeState);

        archiveStore.forEach((work) => {
            work.folders.forEach((folder) => {
                folder.expanded = expandedFolderIds.includes(folder.id);
            });
        });
    } catch (error) {
        console.warn("Archive tree state parse failed:", error);
    }
}

function saveRecentSelection() {
    const currentWork = getCurrentWork();
    const currentDocument = getCurrentDocument();

    const recentSelection = {
        recentWork: currentWork
            ? { id: currentWork.id, title: currentWork.title }
            : null,
        recentDocument: currentDocument
            ? { id: currentDocument.id, title: currentDocument.title }
            : null
    };

    localStorage.setItem(ARCHIVE_RECENT_KEY, JSON.stringify(recentSelection));

    if (typeof window.renderSidebarShortcuts === "function") {
        window.renderSidebarShortcuts();
    }
}

function ensureValidArchiveState() {
    let currentWork = getCurrentWork();

    if (!currentWork) {
        currentWork = archiveStore[0] || null;
        currentArchiveState.workId = currentWork ? currentWork.id : null;
    }

    let currentDocument = getCurrentDocument();

    if (!currentDocument && currentWork) {
        currentDocument = findFirstDocumentInWork(currentWork);
        currentArchiveState.documentId = currentDocument ? currentDocument.id : null;
    }

    saveArchiveState();
}


/* =========================================================
   조회 모드 렌더링
========================================================= */

function renderArchiveView() {
    renderWorkList();
    renderStructureTree();
    renderPreviewDocument();

    if (archiveInitialized) {
        bindArchiveSelectionEvents();
    }
}

function renderWorkList() {
    const workList = document.querySelector("#workList");
    const workCountLabel = document.querySelector("#workCountLabel");

    if (!workList) return;

    workList.innerHTML = archiveStore.map((work) => {
        const isActive = work.id === currentArchiveState.workId;

        return `
            <button
                class="mock-list-item selectable-item ${isActive ? "active" : ""}"
                type="button"
                data-select-id="${work.id}"
                data-select-type="work"
                data-work-id="${work.id}"
            >
                <span class="item-title">${escapeHtml(work.title)}</span>
            </button>
        `;
    }).join("");

    if (workCountLabel) {
        workCountLabel.textContent = `${archiveStore.length} works`;
    }
}

function renderStructureTree() {
    const structureTree = document.querySelector("#structureTree");
    const structureLabel = document.querySelector("#structureLabel");
    const currentWork = getCurrentWork();

    if (!structureTree) return;

    if (!currentWork) {
        structureTree.innerHTML = `<p class="empty-message">선택된 작품이 없습니다.</p>`;

        if (structureLabel) {
            structureLabel.textContent = "Tree";
        }

        return;
    }

    structureTree.innerHTML = currentWork.folders.map((folder) => {
        const childrenHtml = folder.documents.map((documentItem) => {
            const isActive = documentItem.id === currentArchiveState.documentId;

            return `
                <button
                    class="tree-item tree-child selectable-item ${isActive ? "active" : ""}"
                    type="button"
                    data-select-id="${documentItem.id}"
                    data-select-type="document"
                    data-document-id="${documentItem.id}"
                >
                    <span class="tree-line"></span>
                    <span class="tree-title">${escapeHtml(documentItem.title)}</span>
                </button>
            `;
        }).join("");

        return `
            <div class="tree-group" data-tree-group-id="${folder.id}">
                <button
                    class="tree-item tree-parent selectable-item"
                    type="button"
                    data-select-id="${folder.id}"
                    data-select-type="folder"
                    data-folder-id="${folder.id}"
                >
                    <span class="tree-toggle">${folder.expanded ? "▾" : "▸"}</span>
                    <span class="tree-title">${escapeHtml(folder.title)}</span>
                </button>

                <div class="tree-children" ${folder.expanded ? "" : "hidden"}>
                    ${childrenHtml}
                </div>
            </div>
        `;
    }).join("");

    if (structureLabel) {
        structureLabel.textContent = currentWork.title;
    }
}

function renderPreviewDocument() {
    const previewDocument = document.querySelector("#previewDocument");
    const currentWork = getCurrentWork();
    const currentDocument = getCurrentDocument();

    if (!previewDocument) return;

    if (!currentWork || !currentDocument) {
        previewDocument.innerHTML = `
            <p class="empty-message">
                미리보기할 문서가 없습니다.
            </p>
        `;
        return;
    }

    const paragraphs = currentDocument.content
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join("");

    previewDocument.innerHTML = `
        <div class="preview-meta">
            <span>${escapeHtml(currentWork.title)}</span>
        </div>

        <h3>${escapeHtml(currentDocument.title)}</h3>

        <div class="preview-body">
            ${paragraphs}
        </div>
    `;
}


/* =========================================================
   조회 모드 이벤트
========================================================= */

function bindArchiveViewEvents() {
    const archivePage = document.querySelector("#archivePage");

    if (!archivePage || archivePage.dataset.viewBound === "true") return;

    archivePage.dataset.viewBound = "true";

    archivePage.addEventListener("click", (event) => {
        if (archivePage.classList.contains("is-editing")) return;

        const documentButton = event.target.closest("[data-document-id]");
        const folderButton = event.target.closest("[data-folder-id]");
        const workButton = event.target.closest("[data-work-id]");

        if (documentButton) {
            handleDocumentClick(documentButton.dataset.documentId);
            return;
        }

        if (folderButton) {
            handleFolderClick(folderButton.dataset.folderId);
            return;
        }

        if (workButton) {
            handleWorkClick(workButton.dataset.workId);
        }
    });
}

function handleWorkClick(workId) {
    const selectedWork = archiveStore.find((work) => work.id === workId);

    if (!selectedWork) return;

    currentArchiveState.workId = selectedWork.id;

    const firstDocument = findFirstDocumentInWork(selectedWork);
    currentArchiveState.documentId = firstDocument ? firstDocument.id : null;

    saveArchiveState();
    renderArchiveView();
}

function handleFolderClick(folderId) {
    const folder = findFolderById(folderId);

    if (!folder) return;

    folder.expanded = !folder.expanded;

    saveTreeState();
    renderStructureTree();
}

function handleDocumentClick(documentId) {
    currentArchiveState.documentId = documentId;

    saveArchiveState();
    renderStructureTree();
    renderPreviewDocument();
}


/* =========================================================
   편집 모드 선택 기능
========================================================= */

function bindArchiveSelectionEvents() {
    const archivePage = document.querySelector("#archivePage");
    const workspace = document.querySelector("#archiveWorkspace");
    const selectionBox = document.querySelector("#selectionBox");

    if (!archivePage || !workspace || !selectionBox) return;

    const selectableItems = Array.from(
        archivePage.querySelectorAll(".selectable-item")
    );

    selectableItems.forEach((item) => {
        if (item.dataset.selectionBound === "true") return;
        item.dataset.selectionBound = "true";

        item.addEventListener("click", (event) => {
            if (!archivePage.classList.contains("is-editing")) return;

            event.preventDefault();
            event.stopPropagation();

            if (event.ctrlKey || event.metaKey) {
                item.classList.toggle("is-selected");
                updateArchiveSelectedCount();
                return;
            }

            clearArchiveSelection();
            item.classList.add("is-selected");
            updateArchiveSelectedCount();
        });
    });

    if (workspace.dataset.dragBound !== "true") {
        workspace.dataset.dragBound = "true";
        bindDragSelection(archivePage, workspace, selectionBox);
    }
}

function getSelectedArchiveItems() {
    return Array.from(
        document.querySelectorAll(".selectable-item.is-selected")
    );
}

function clearArchiveSelection() {
    document.querySelectorAll(".selectable-item.is-selected").forEach((item) => {
        item.classList.remove("is-selected");
    });

    updateArchiveSelectedCount();
}

function updateArchiveSelectedCount() {
    const selectedCount = document.querySelector("#archiveSelectedCount");
    const selectedItems = getSelectedArchiveItems();

    if (!selectedCount) return;

    if (selectedItems.length === 0) {
        selectedCount.textContent = "선택 없음";
        return;
    }

    selectedCount.textContent = `${selectedItems.length}개 선택됨`;
}


/* =========================================================
   드래그 선택
========================================================= */

function bindDragSelection(archivePage, workspace, selectionBox) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    workspace.addEventListener("mousedown", (event) => {
        if (!archivePage.classList.contains("is-editing")) return;

        const clickedSelectable = event.target.closest(".selectable-item");
        const clickedAction = event.target.closest("button, input, textarea, a");

        if (clickedSelectable || clickedAction) return;

        isDragging = true;

        const workspaceRect = workspace.getBoundingClientRect();

        startX = event.clientX - workspaceRect.left;
        startY = event.clientY - workspaceRect.top;

        selectionBox.classList.add("is-active");
        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        selectionBox.style.width = "0px";
        selectionBox.style.height = "0px";

        if (!event.ctrlKey && !event.metaKey) {
            clearArchiveSelection();
        }
    });

    window.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        const workspaceRect = workspace.getBoundingClientRect();

        const currentX = event.clientX - workspaceRect.left;
        const currentY = event.clientY - workspaceRect.top;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        selectionBox.style.left = `${left}px`;
        selectionBox.style.top = `${top}px`;
        selectionBox.style.width = `${width}px`;
        selectionBox.style.height = `${height}px`;

        updateDragSelectedItems(selectionBox);
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging) return;

        isDragging = false;
        selectionBox.classList.remove("is-active");
    });
}

function updateDragSelectedItems(selectionBox) {
    const boxRect = selectionBox.getBoundingClientRect();
    const items = document.querySelectorAll(".selectable-item");

    items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();

        const isOverlapping =
            boxRect.left < itemRect.right &&
            boxRect.right > itemRect.left &&
            boxRect.top < itemRect.bottom &&
            boxRect.bottom > itemRect.top;

        if (isOverlapping) {
            item.classList.add("is-selected");
        }
    });

    updateArchiveSelectedCount();
}


/* =========================================================
   편집 액션
========================================================= */

function bindArchiveEditEvents() {
    const createButton = document.querySelector("#archiveCreateBtn");
    const createMenu = document.querySelector("#archiveCreateMenu");
    const renameButton = document.querySelector("#archiveRenameBtn");
    const deleteButton = document.querySelector("#archiveDeleteBtn");

    if (createButton && createMenu && createButton.dataset.bound !== "true") {
        createButton.dataset.bound = "true";

        createButton.addEventListener("click", () => {
            createMenu.hidden = !createMenu.hidden;
        });
    }

    if (createMenu && createMenu.dataset.bound !== "true") {
        createMenu.dataset.bound = "true";

        createMenu.querySelectorAll("[data-create-type]").forEach((button) => {
            button.addEventListener("click", () => {
                handleArchiveCreate(button.dataset.createType);
                closeArchiveCreateMenu();
            });
        });
    }

    if (renameButton && renameButton.dataset.bound !== "true") {
        renameButton.dataset.bound = "true";
        renameButton.addEventListener("click", handleArchiveRename);
    }

    if (deleteButton && deleteButton.dataset.bound !== "true") {
        deleteButton.dataset.bound = "true";
        deleteButton.addEventListener("click", handleArchiveDelete);
    }
}

function closeArchiveCreateMenu() {
    const createMenu = document.querySelector("#archiveCreateMenu");

    if (createMenu) {
        createMenu.hidden = true;
    }
}

function handleArchiveCreate(createType) {
    const typeLabels = {
        work: "작품",
        folder: "구성",
        document: "문서"
    };

    const label = typeLabels[createType] || "항목";
    const name = prompt(`새 ${label} 이름을 입력하세요.`);

    if (!name || !name.trim()) return;

    if (createType === "work") {
        createWork(name.trim());
    }

    if (createType === "folder") {
        createFolder(name.trim());
    }

    if (createType === "document") {
        createDocument(name.trim());
    }

    ensureValidArchiveState();
    renderArchiveView();
}

function handleArchiveRename() {
    const selectedItems = getSelectedArchiveItems();

    if (selectedItems.length === 0) {
        alert("이름을 바꿀 항목을 먼저 선택하세요.");
        return;
    }

    if (selectedItems.length > 1) {
        alert("이름 바꾸기는 한 번에 하나만 가능합니다.");
        return;
    }

    const selectedItem = selectedItems[0];
    const currentName = getArchiveItemTitle(selectedItem);
    const newName = prompt("새 이름을 입력하세요.", currentName);

    if (!newName || !newName.trim()) return;

    renameArchiveItem(
        selectedItem.dataset.selectId,
        selectedItem.dataset.selectType,
        newName.trim()
    );

    renderArchiveView();
}

function handleArchiveDelete() {
    const selectedItems = getSelectedArchiveItems();

    if (selectedItems.length === 0) {
        alert("삭제할 항목을 먼저 선택하세요.");
        return;
    }

    const itemNames = selectedItems.map(getArchiveItemTitle);
    const confirmMessage = selectedItems.length === 1
        ? `"${itemNames[0]}" 항목을 삭제할까요?`
        : `${selectedItems.length}개 항목을 삭제할까요?\n\n${itemNames.join("\n")}`;

    if (!confirm(confirmMessage)) return;

    selectedItems.forEach((item) => {
        deleteArchiveItem(item.dataset.selectId, item.dataset.selectType);
    });

    clearArchiveSelection();
    ensureValidArchiveState();
    renderArchiveView();
}


/* =========================================================
   데이터 변경 함수
   - 나중에 백엔드 API 호출로 교체하기 쉬운 구간
========================================================= */

function createWork(title) {
    const workId = createId("work");
    const folderId = createId("folder");
    const documentId = createId("doc");

    archiveStore.push({
        id: workId,
        title,
        description: "새 작품 설명을 입력하세요.",
        folders: [
            {
                id: folderId,
                title: "기본 구성",
                expanded: true,
                documents: [
                    {
                        id: documentId,
                        title: "첫 문서",
                        content: "새 문서 내용을 입력하세요."
                    }
                ]
            }
        ]
    });

    currentArchiveState.workId = workId;
    currentArchiveState.documentId = documentId;

    saveArchiveState();
    saveTreeState();
}

function createFolder(title) {
    const currentWork = getCurrentWork();

    if (!currentWork) return;

    const folderId = createId("folder");

    currentWork.folders.push({
        id: folderId,
        title,
        expanded: true,
        documents: []
    });

    saveTreeState();
}

function createDocument(title) {
    const currentWork = getCurrentWork();

    if (!currentWork) return;

    let targetFolder = currentWork.folders.find((folder) => folder.expanded);

    if (!targetFolder) {
        targetFolder = currentWork.folders[0];
    }

    if (!targetFolder) {
        targetFolder = {
            id: createId("folder"),
            title: "기본 구성",
            expanded: true,
            documents: []
        };
        currentWork.folders.push(targetFolder);
    }

    const documentId = createId("doc");

    targetFolder.documents.push({
        id: documentId,
        title,
        content: "새 문서 내용을 입력하세요."
    });

    targetFolder.expanded = true;
    currentArchiveState.documentId = documentId;

    saveArchiveState();
    saveTreeState();
}

function renameArchiveItem(id, type, newName) {
    if (type === "work") {
        const work = archiveStore.find((item) => item.id === id);
        if (work) work.title = newName;
    }

    if (type === "folder") {
        const folder = findFolderById(id);
        if (folder) folder.title = newName;
    }

    if (type === "document") {
        const documentItem = findDocumentById(id);
        if (documentItem) documentItem.title = newName;
    }

    saveArchiveState();
}

function deleteArchiveItem(id, type) {
    if (type === "work") {
        archiveStore = archiveStore.filter((work) => work.id !== id);

        if (currentArchiveState.workId === id) {
            currentArchiveState.workId = null;
            currentArchiveState.documentId = null;
        }
    }

    if (type === "folder") {
        archiveStore.forEach((work) => {
            work.folders = work.folders.filter((folder) => folder.id !== id);
        });
    }

    if (type === "document") {
        archiveStore.forEach((work) => {
            work.folders.forEach((folder) => {
                folder.documents = folder.documents.filter((documentItem) => {
                    return documentItem.id !== id;
                });
            });
        });

        if (currentArchiveState.documentId === id) {
            currentArchiveState.documentId = null;
        }
    }

    saveArchiveState();
    saveTreeState();
}


/* =========================================================
   백업 액션
========================================================= */

function bindArchiveBackupEvents() {
    const exportButton = document.querySelector("[data-archive-action='export']");
    const importButton = document.querySelector("[data-archive-action='import']");

    if (exportButton && exportButton.dataset.bound !== "true") {
        exportButton.dataset.bound = "true";
        exportButton.addEventListener("click", exportArchiveBackup);
    }

    if (importButton && importButton.dataset.bound !== "true") {
        importButton.dataset.bound = "true";
        importButton.addEventListener("click", importArchiveBackup);
    }
}

function exportArchiveBackup() {
    const backupData = {
        exportedAt: new Date().toISOString(),
        archiveStore,
        currentArchiveState
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "archive-backup.json";
    link.click();

    URL.revokeObjectURL(url);
}

function importArchiveBackup() {
    alert("백업 들여오기는 다음 단계에서 파일 선택 input으로 연결하면 됩니다.");
}


/* =========================================================
   조회 / 검색 유틸
========================================================= */

function getCurrentWork() {
    return archiveStore.find((work) => work.id === currentArchiveState.workId) || null;
}

function getCurrentDocument() {
    if (!currentArchiveState.documentId) return null;

    return findDocumentById(currentArchiveState.documentId);
}

function findFirstDocumentInWork(work) {
    for (const folder of work.folders) {
        if (folder.documents.length > 0) {
            return folder.documents[0];
        }
    }

    return null;
}

function findFolderById(folderId) {
    for (const work of archiveStore) {
        const folder = work.folders.find((item) => item.id === folderId);
        if (folder) return folder;
    }

    return null;
}

function findDocumentById(documentId) {
    for (const work of archiveStore) {
        for (const folder of work.folders) {
            const documentItem = folder.documents.find((item) => item.id === documentId);
            if (documentItem) return documentItem;
        }
    }

    return null;
}

function getArchiveItemTitle(item) {
    const titleElement =
        item.querySelector(".tree-title") ||
        item.querySelector(".item-title") ||
        item;

    return titleElement.textContent.trim();
}

function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   main.js에서 호출할 수 있게 전역 등록
========================================================= */

window.initArchivePage = initArchivePage;