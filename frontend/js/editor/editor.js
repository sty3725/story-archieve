const labelColorPalette = [
    "#ff4d6d",
    "#ff7a00",
    "#ffcc00",
    "#22c55e",
    "#00bcd4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
    "#14b8a6",
    "#a3e635",
    "#e11d48"
];

let selectedEditorLabel = null;

function initEditorPage() {
    const editorPage = document.querySelector("#editorPage");
    const editorCanvas = document.querySelector("#editorCanvas");

    if (!editorPage || !editorCanvas) return;

    editorCanvas.setAttribute("contenteditable", "true");
    editorCanvas.setAttribute("spellcheck", "false");

    bindEditorEvents();
    bindEditorShortcuts();
    updateEditorStatus();
}

function bindEditorEvents() {
    const editorCanvas = document.querySelector("#editorCanvas");
    const saveBtn = document.querySelector("#editorSaveBtn");
    const titleInput = document.querySelector("#editorTitleInput");
    const switcherBtn = document.querySelector("#documentSwitcherBtn");
    const switcherMenu = document.querySelector("#documentSwitcherMenu");

    if (editorCanvas) {
        editorCanvas.addEventListener("input", () => {
            setEditorDirty();
            updateEditorStatus();
        });

        editorCanvas.addEventListener("click", (event) => {
            const label = event.target.closest(".editor-label");

            if (label) {
                event.preventDefault();
                focusEditorLabel(label);
                return;
            }

            clearEditorLabelFocus();
        });

        editorCanvas.addEventListener("mouseover", (event) => {
            const label = event.target.closest(".editor-label");

            if (label) {
                showLabelFloatingBubble(label);
            }
        });

        editorCanvas.addEventListener("mouseout", (event) => {
            const label = event.target.closest(".editor-label");

            if (!label) return;

            const nextElement = event.relatedTarget;

            if (nextElement && label.contains(nextElement)) {
                return;
            }

            if (!label.classList.contains("is-focused")) {
                hideLabelFloatingBubble();
            }
        });
    }

    if (titleInput) {
        titleInput.addEventListener("input", () => {
            setEditorDirty();
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            saveEditorDocument();
        });
    }

    if (switcherBtn && switcherMenu) {
        switcherBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            switcherMenu.hidden = !switcherMenu.hidden;
        });

        document.addEventListener("click", () => {
            switcherMenu.hidden = true;
        });
    }

    document.querySelectorAll(".switcher-item").forEach((button) => {
        button.addEventListener("click", () => {
            changeDummyDocument(button);
        });
    });
}

function bindEditorShortcuts() {
    document.addEventListener("keydown", (event) => {
        const editorPage = document.querySelector("#editorPage");
        if (!editorPage) return;

        const key = event.key.toLowerCase();

        if (event.ctrlKey && key === "l") {
            event.preventDefault();
            createLabelAtCursor();
            return;
        }

        if (event.ctrlKey && key === "m") {
            event.preventDefault();
            editSelectedLabelMemo();
            return;
        }

        if (event.ctrlKey && key === "s") {
            event.preventDefault();
            saveEditorDocument();
            return;
        }

        if (key === "escape") {
            clearEditorLabelFocus();

            const switcherMenu = document.querySelector("#documentSwitcherMenu");
            if (switcherMenu) {
                switcherMenu.hidden = true;
            }
        }
    });
}

function createLabelAtCursor() {
    const editorCanvas = document.querySelector("#editorCanvas");
    if (!editorCanvas) return;

    editorCanvas.focus();

    const title = prompt("라벨 이름을 입력하세요.", "새 라벨");
    if (!title) return;

    const memo = prompt("라벨 메모를 입력하세요. 비워도 됩니다.", "") || "";
    const color = getRandomLabelColor();
    const labelId = createEditorId("label");

    const labelElement = createLabelElement({
        id: labelId,
        title,
        color,
        memo
    });

    insertNodeAtCursor(labelElement);
    insertNodeAtCursor(document.createTextNode(" "));

    focusEditorLabel(labelElement);
    setEditorDirty();
    updateEditorStatus();
}

function createLabelElement(labelData) {
    const labelElement = document.createElement("span");

    labelElement.className = labelData.memo.trim()
        ? "editor-label has-memo"
        : "editor-label";

    labelElement.tabIndex = 0;
    labelElement.dataset.labelId = labelData.id;
    labelElement.dataset.labelTitle = labelData.title;
    labelElement.dataset.labelColor = labelData.color;
    labelElement.dataset.labelMemo = labelData.memo;
    labelElement.style.setProperty("--label-color", labelData.color);

    labelElement.innerHTML = createLabelInnerHtml(labelData.title, labelData.memo);

    return labelElement;
}

function createLabelInnerHtml(title, memo) {
    const bubbleText = memo.trim()
        ? escapeHtml(memo)
        : "메모 없음";

    return `
        <span class="label-flag-icon" aria-hidden="true">⚑</span>
        <span class="label-memo-bubble">
            <strong>${escapeHtml(title)}</strong>
            <span>${bubbleText}</span>
        </span>
    `;
}

function focusEditorLabel(labelElement) {
    clearEditorLabelFocus();

    selectedEditorLabel = labelElement;
    selectedEditorLabel.classList.add("is-focused");

    showLabelFloatingBubble(labelElement);
}

function clearEditorLabelFocus() {
    document.querySelectorAll(".editor-label.is-focused").forEach((label) => {
        label.classList.remove("is-focused");
    });

    selectedEditorLabel = null;
    hideLabelFloatingBubble();
}

function editSelectedLabelMemo() {
    if (!selectedEditorLabel) {
        alert("메모를 수정할 라벨을 먼저 선택하세요.");
        return;
    }

    const currentMemo = selectedEditorLabel.dataset.labelMemo || "";
    const nextMemo = prompt("라벨 메모를 입력하세요.", currentMemo);

    if (nextMemo === null) return;

    selectedEditorLabel.dataset.labelMemo = nextMemo;

    const title = selectedEditorLabel.dataset.labelTitle || getLabelTitle(selectedEditorLabel);
    selectedEditorLabel.innerHTML = createLabelInnerHtml(title, nextMemo);

    if (nextMemo.trim()) {
        selectedEditorLabel.classList.add("has-memo");
    } else {
        selectedEditorLabel.classList.remove("has-memo");
    }

    focusEditorLabel(selectedEditorLabel);
    setEditorDirty();
    updateEditorStatus();
}

function insertNodeAtCursor(node) {
    const editorCanvas = document.querySelector("#editorCanvas");
    const selection = window.getSelection();

    if (!editorCanvas) return;

    if (!selection || selection.rangeCount === 0) {
        editorCanvas.appendChild(node);
        return;
    }

    const range = selection.getRangeAt(0);

    if (!editorCanvas.contains(range.commonAncestorContainer)) {
        editorCanvas.appendChild(node);
        return;
    }

    range.deleteContents();
    range.insertNode(node);

    range.setStartAfter(node);
    range.setEndAfter(node);

    selection.removeAllRanges();
    selection.addRange(range);
}

function serializeEditorToMarkup() {
    const editorCanvas = document.querySelector("#editorCanvas");
    if (!editorCanvas) return "";

    let result = "";

    editorCanvas.childNodes.forEach((node) => {
        result += serializeNodeToMarkup(node);
    });

    return normalizeMarkup(result);
}

function serializeNodeToMarkup(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return "";
    }

    if (node.classList.contains("editor-label")) {
        return serializeLabelToMarkup(node);
    }

    if (node.tagName === "P") {
        return `${node.innerText.trim()}\n\n`;
    }

    if (node.tagName === "DIV") {
        return `${node.innerText.trim()}\n\n`;
    }

    if (node.tagName === "BR") {
        return "\n";
    }

    let childText = "";

    node.childNodes.forEach((childNode) => {
        childText += serializeNodeToMarkup(childNode);
    });

    return childText;
}

function serializeLabelToMarkup(labelElement) {
    const id = labelElement.dataset.labelId || createEditorId("label");
    const title = labelElement.dataset.labelTitle || getLabelTitle(labelElement);
    const color = labelElement.dataset.labelColor || getComputedStyle(labelElement).getPropertyValue("--label-color").trim();
    const memo = labelElement.dataset.labelMemo || "";

    let markup = "";

    markup += `[[label id="${escapeMarkupAttribute(id)}" title="${escapeMarkupAttribute(title)}" color="${escapeMarkupAttribute(color)}"]]\n`;

    if (memo.trim()) {
        markup += `[[memo]]\n`;
        markup += `${memo.trim()}\n`;
        markup += `[[/memo]]\n`;
    }

    markup += `[[/label]]\n\n`;

    return markup;
}

function normalizeMarkup(markup) {
    return markup
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function renderMarkupToEditor(markupText) {
    const editorCanvas = document.querySelector("#editorCanvas");
    if (!editorCanvas) return;

    editorCanvas.innerHTML = "";

    const nodes = parseMarkupToNodes(markupText);

    nodes.forEach((node) => {
        editorCanvas.appendChild(node);
    });

    updateEditorStatus();
}

function parseMarkupToNodes(markupText) {
    const nodes = [];
    const labelRegex = /\[\[label\s+([^\]]+)\]\]([\s\S]*?)\[\[\/label\]\]/g;

    let lastIndex = 0;
    let match;

    while ((match = labelRegex.exec(markupText)) !== null) {
        const beforeText = markupText.slice(lastIndex, match.index);
        appendTextAsParagraphs(nodes, beforeText);

        const attributeText = match[1];
        const labelInnerText = match[2];

        const attrs = parseMarkupAttributes(attributeText);
        const memo = extractMemoFromLabelInnerText(labelInnerText);

        const labelElement = createLabelElement({
            id: attrs.id || createEditorId("label"),
            title: attrs.title || "라벨",
            color: attrs.color || getRandomLabelColor(),
            memo
        });

        nodes.push(labelElement);
        nodes.push(document.createTextNode(" "));

        lastIndex = labelRegex.lastIndex;
    }

    const afterText = markupText.slice(lastIndex);
    appendTextAsParagraphs(nodes, afterText);

    return nodes;
}

function appendTextAsParagraphs(nodes, text) {
    const cleanedText = text.replace(/\r\n/g, "\n").trim();

    if (!cleanedText) return;

    const paragraphs = cleanedText.split(/\n{2,}/);

    paragraphs.forEach((paragraphText) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = paragraphText.trim();
        nodes.push(paragraph);
    });
}

function extractMemoFromLabelInnerText(labelInnerText) {
    const memoMatch = labelInnerText.match(/\[\[memo\]\]([\s\S]*?)\[\[\/memo\]\]/);

    if (!memoMatch) {
        return "";
    }

    return memoMatch[1].trim();
}

function parseMarkupAttributes(attributeText) {
    const attrs = {};
    const attrRegex = /(\w+)="([^"]*)"/g;

    let match;

    while ((match = attrRegex.exec(attributeText)) !== null) {
        attrs[match[1]] = unescapeMarkupAttribute(match[2]);
    }

    return attrs;
}


function saveEditorDocument() {
    const saveState = document.querySelector("#editorSaveState");
    const lastSaved = document.querySelector("#editorLastSaved");
    const markupText = serializeEditorToMarkup();

    if (saveState) {
        saveState.textContent = "저장됨";
    }

    if (lastSaved) {
        const now = new Date();
        lastSaved.textContent = `마지막 저장: ${now.toLocaleTimeString()}`;
    }

    console.log("저장될 자체 마크업:");
    console.log(markupText);
}

function updateEditorStatus() {
    const editorCanvas = document.querySelector("#editorCanvas");
    const charCount = document.querySelector("#editorCharCount");
    const labelCount = document.querySelector("#editorLabelCount");

    if (!editorCanvas) return;

    const labels = editorCanvas.querySelectorAll(".editor-label");
    const text = getEditorPlainText(editorCanvas);

    if (charCount) {
        const withoutSpaces = text.replace(/\s/g, "").length;
        charCount.textContent = `공백 제외 ${withoutSpaces}자`;
    }

    if (labelCount) {
        labelCount.textContent = `라벨 ${labels.length}개`;
    }
}

function getEditorPlainText(editorCanvas) {
    const clone = editorCanvas.cloneNode(true);

    clone.querySelectorAll(".label-memo-bubble").forEach((bubble) => {
        bubble.remove();
    });

    clone.querySelectorAll(".editor-label").forEach((label) => {
        const title = label.dataset.labelTitle || getLabelTitle(label);
        label.textContent = `[${title}]`;
    });

    return clone.innerText || "";
}

function setEditorDirty() {
    const saveState = document.querySelector("#editorSaveState");

    if (saveState) {
        saveState.textContent = "저장 필요";
    }
}

function changeDummyDocument(button) {
    document.querySelectorAll(".switcher-item").forEach((item) => {
        item.classList.remove("active");
    });

    button.classList.add("active");

    const currentDocumentLabel = document.querySelector("#currentDocumentLabel");
    const titleInput = document.querySelector("#editorTitleInput");
    const switcherMenu = document.querySelector("#documentSwitcherMenu");

    const documentTitle = button.textContent.trim();

    if (currentDocumentLabel) {
        currentDocumentLabel.textContent = documentTitle;
    }

    if (titleInput) {
        titleInput.value = documentTitle;
    }

    if (switcherMenu) {
        switcherMenu.hidden = true;
    }

    setEditorDirty();
}

function getRandomLabelColor() {
    const index = Math.floor(Math.random() * labelColorPalette.length);
    return labelColorPalette[index];
}

function createEditorId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function getLabelTitle(labelElement) {
    return labelElement.dataset.labelTitle || "라벨";
}


function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeMarkupAttribute(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function unescapeMarkupAttribute(value) {
    return String(value)
        .replaceAll("&quot;", '"')
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&");
}

function showLabelFloatingBubble(labelElement) {
    const bubble = document.querySelector("#labelFloatingBubble");
    const bubbleTitle = document.querySelector("#labelFloatingTitle");
    const bubbleMemo = document.querySelector("#labelFloatingMemo");

    if (!bubble || !bubbleTitle || !bubbleMemo || !labelElement) return;

    const title = labelElement.dataset.labelTitle || "라벨";
    const memo = labelElement.dataset.labelMemo || "메모 없음";
    const color = labelElement.dataset.labelColor || "#ff4d6d";

    bubbleTitle.textContent = title;
    bubbleMemo.textContent = memo.trim() ? memo : "메모 없음";
    bubble.style.setProperty("--label-color", color);

    bubble.hidden = false;

    const labelRect = labelElement.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();

    const gap = 12;
    let left = labelRect.left + labelRect.width / 2 - bubbleRect.width / 2;
    let top = labelRect.top - bubbleRect.height - gap;

    const viewportPadding = 12;

    if (left < viewportPadding) {
        left = viewportPadding;
    }

    if (left + bubbleRect.width > window.innerWidth - viewportPadding) {
        left = window.innerWidth - bubbleRect.width - viewportPadding;
    }

    if (top < viewportPadding) {
        top = labelRect.bottom + gap;
    }

    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
}

function hideLabelFloatingBubble() {
    const bubble = document.querySelector("#labelFloatingBubble");

    if (bubble) {
        bubble.hidden = true;
    }
}


window.initEditorPage = initEditorPage;