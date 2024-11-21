class CodeEditor extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `
        <style>
            :host {
                --editor-font-family: "Courier New", Courier, monospace;
                --editor-font-size: large;
                --editor-line-height: 1.25em;
            }

            .editor-container {
                display: flex;
                flex-direction: row;
                margin: 0;
                padding: 0;
            }

            .line-number-container {
                font-family: var(--editor-font-family);
                font-size: var(--editor-font-size);
				color: gray;
                display: flex;
                flex-direction: column;
                text-align: right;
                line-height: var(--editor-line-height);
                margin: 0;
				margin-right: 0.5em;
                padding: 0;
            }

            .code-area-container {
                font-family: var(--editor-font-family);
                line-height: var(--editor-line-height);
                font-size: var(--editor-font-size);
                display: flex;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                outline: none;
                border: none;
                position: relative;
            }

            .code-area {
                caret-color: black;
                font-family: var(--editor-font-family);
                width: 100%;
                height: 100%;
                line-height: var(--editor-line-height);
                margin: 0;
                padding: 0;
                font-size: var(--editor-font-size);
                outline: none;
                border: none;
                z-index: 1;
            }
        </style>
        <div class="editor-container">
            <div id="lineNumberContainer" class="line-number-container">
            </div>
            <pre id="codeAreaContainer" class="code-area-container"><code id="codeArea" class="code-area" contenteditable="true" spellcheck="false"></code></pre>
        </div>
        `;

        this.codeArea = this.shadow.getElementById("codeArea");
        this.lineNumberContainer = this.shadow.getElementById("lineNumberContainer");

        this.codeArea.addEventListener("paste", (event) => {
			// we need to sanitize this since we use insertHTML because insertText is broken on chrome
			var sanitizedText = event.clipboardData.getData("text/plain").replace(/&amp;/g, "&amp;amp;").replace(/&lt;/g, "&amp;lt;").replace(/&gt;/g, "&amp;gt;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            event.preventDefault();
            document.execCommand("insertHTML", false, sanitizedText);
        });
		
		this.codeArea.addEventListener("input", (event) => {
			this.updateLineNumbers();
		});

        this.updateLineNumbers();
    }

    updateLineNumbers() {
        var text = this.codeArea.innerText;
        var lines = text.split("\n").length;
        if (lines < 1) {
            lines = 1;
        }
        if (text.endsWith("\n")) {
            lines -= 1;
        }

        this.lineNumberContainer.innerHTML = "";
        for (let i = 1; i <= lines; i++) {
            this.lineNumberContainer.innerHTML += `<div>${i}</div>`;
        }
    }
}

window.customElements.define("code-editor", CodeEditor);
