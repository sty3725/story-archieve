function initArchivePage() {
    const archivePage = document.querySelector("#archivePage");
    const editToggle = document.querySelector("#archiveEditToggle");
    const modeLabel = document.querySelector(".mode-label");

    if (!archivePage || !editToggle || !modeLabel) return;

    editToggle.addEventListener("click", () => {
        const isEditing = archivePage.classList.toggle("is-editing");

        modeLabel.textContent = isEditing ? "편집 모드" : "조회 모드";
        editToggle.textContent = isEditing ? "조회 모드로 돌아가기" : "편집 모드";

        if (!isEditing) {
            clearArchiveSelection();
        }
    });

    initArchiveSelection();
    initArchiveBackupActions();
}

function initArchiveSelection() {
    const archivePage = document.querySelector("#archivePage");
    const workspace = document.querySelector("#archiveWorkspace");
    const selectionBox = document.querySelector("#selectionBox");

    if (!archivePage || !workspace || !selectionBox) return;

    const selectableItems = Array.from(
        archivePage.querySelectorAll(".selectable-item")
    );

    selectableItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            if (!archivePage.classList.contains("is-editing")) return;

            event.preventDefault();
            event.stopPropagation();

            if (event.ctrlKey || event.metaKey) {
                item.classList.toggle("is-selected");
                return;
            }

            clearArchiveSelection();
            item.classList.add("is-selected");
        });
    });

    initDragSelection(archivePage, workspace, selectionBox);
}

function clearArchiveSelection() {
    document.querySelectorAll(".selectable-item.is-selected").forEach((item) => {
        item.classList.remove("is-selected");
    });
}

function initDragSelection(archivePage, workspace, selectionBox) {
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

        updateDragSelectedItems(archivePage, selectionBox);
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging) return;

        isDragging = false;
        selectionBox.classList.remove("is-active");
    });
}

function updateDragSelectedItems(archivePage, selectionBox) {
    const boxRect = selectionBox.getBoundingClientRect();
    const items = archivePage.querySelectorAll(".selectable-item");

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
}

function initArchiveBackupActions() {
    const exportButton = document.querySelector("[data-archive-action='export']");
    const importButton = document.querySelector("[data-archive-action='import']");

    if (exportButton) {
        exportButton.addEventListener("click", () => {
            console.log("백업 내보내기");
            alert("백업 내보내기는 나중에 실제 파일 다운로드 기능으로 연결됩니다.");
        });
    }

    if (importButton) {
        importButton.addEventListener("click", () => {
            console.log("백업 들여오기");
            alert("백업 들여오기는 나중에 파일 선택 기능으로 연결됩니다.");
        });
    }
}

window.initArchivePage = initArchivePage;