/* =========================================================
   HEALTHCARE ANALYTICS
   DATA UNDERSTANDING PAGE
   NO API_BASE_URL DECLARATION
   ========================================================= */

let healthcareDatasetInfo = null;
let datasetLoaded = false;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeNavigation();

    initializeDataUnderstanding();

    initializeAIChat();

    initializeRobot();

});


/* =========================================================
   BACKEND URL
   IMPORTANT:
   This is NOT API_BASE_URL.
   ========================================================= */

const DATASET_API_URL = "http://127.0.0.1:5000/dataset";


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileNavigation =
        document.getElementById("mobileNavigation");

    if (!menuToggle || !mobileNavigation) {
        return;
    }

    menuToggle.addEventListener("click", function () {

        const opened =
            mobileNavigation.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(opened)
        );

    });

    const links =
        mobileNavigation.querySelectorAll("a");

    links.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileNavigation.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================================
   DATASET
   ========================================================= */

async function initializeDataUnderstanding() {

    setPageStatus(
        "loading",
        "Connecting to healthcare dataset..."
    );

    try {

        const response =
            await fetch(
                DATASET_API_URL,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                `Backend returned HTTP ${response.status}`
            );

        }

        const result =
            await response.json();

        console.log(
            "Healthcare dataset API response:",
            result
        );

        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                "Backend returned an invalid dataset response."
            );

        }

        const info =
            result.data || {};

        const rows =
            Number(
                info.rows ??
                result.rows ??
                0
            );

        const columns =
            Number(
                info.columns ??
                result.columns ??
                0
            );

        const columnNames =
            Array.isArray(info.column_names)
                ? info.column_names
                : Array.isArray(result.column_names)
                    ? result.column_names
                    : [];

        healthcareDatasetInfo = {

            rows: rows,

            columns: columns,

            columnNames: columnNames

        };

        datasetLoaded = true;

        updateDatasetInformation();

        setPageStatus(
            "loaded",
            "Healthcare dataset connected successfully"
        );

        addLog(
            `Healthcare dataset loaded: ${rows.toLocaleString("en-IN")} records.`,
            "success"
        );

        addLog(
            `${columns} columns detected.`,
            "success"
        );

        if (columnNames.length > 0) {

            addLog(
                "Dataset column structure loaded.",
                "success"
            );

        }

    }
    catch (error) {

        console.error(
            "Healthcare dataset connection error:",
            error
        );

        datasetLoaded = false;

        healthcareDatasetInfo = null;

        setPageStatus(
            "error",
            "Unable to connect to healthcare dataset"
        );

        addLog(
            "Healthcare dataset API connection failed.",
            "error"
        );

        addLog(
            error.message || "Unknown API error.",
            "error"
        );

    }

}


/* =========================================================
   UPDATE DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation() {

    if (!healthcareDatasetInfo) {
        return;
    }

    const rows =
        healthcareDatasetInfo.rows;

    const columns =
        healthcareDatasetInfo.columns;

    const columnNames =
        healthcareDatasetInfo.columnNames;

    setNumber("totalRows", rows);
    setNumber("totalColumns", columns);

    setNumber("datasetRows", rows);
    setNumber("datasetColumns", columns);

    setNumber("recordCount", rows);
    setNumber("columnCount", columns);

    setText(
        "datasetRecordCount",
        rows.toLocaleString("en-IN")
    );

    setText(
        "datasetColumnCount",
        columns.toLocaleString("en-IN")
    );

    displayColumnNames(columnNames);

}


/* =========================================================
   NUMBER
   ========================================================= */

function setNumber(elementId, value) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    animateNumber(
        element,
        Number(value) || 0
    );

}


/* =========================================================
   TEXT
   ========================================================= */

function setText(elementId, value) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = value;

}


/* =========================================================
   NUMBER ANIMATION
   ========================================================= */

function animateNumber(element, targetValue) {

    if (!element) {
        return;
    }

    const duration = 700;

    const startValue =
        Number(
            element.textContent.replace(/,/g, "")
        ) || 0;

    const startTime =
        performance.now();

    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const currentValue =
            Math.round(
                startValue +
                (
                    targetValue -
                    startValue
                ) *
                eased
            );

        element.textContent =
            currentValue.toLocaleString(
                "en-IN"
            );

        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }

    requestAnimationFrame(update);

}


/* =========================================================
   DISPLAY COLUMNS
   ========================================================= */

function displayColumnNames(columnNames) {

    const container =
        document.getElementById("columnList") ||
        document.getElementById("columnsList");

    if (
        !container ||
        !Array.isArray(columnNames)
    ) {
        return;
    }

    container.innerHTML = "";

    columnNames.forEach(
        function (column, index) {

            const item =
                document.createElement("div");

            item.className =
                "dataset-column-item";

            const number =
                document.createElement("span");

            number.className =
                "column-number";

            number.textContent =
                String(index + 1).padStart(2, "0");

            const name =
                document.createElement("span");

            name.className =
                "column-name";

            name.textContent =
                column;

            item.appendChild(number);

            item.appendChild(name);

            container.appendChild(item);

        }
    );

}


/* =========================================================
   PAGE STATUS
   ========================================================= */

function setPageStatus(state, message) {

    const statusDot =
        document.getElementById("statusDot");

    const statusText =
        document.getElementById("statusText");

    if (statusDot) {

        statusDot.className =
            "status-dot";

        statusDot.classList.add(state);

    }

    if (statusText) {

        statusText.textContent =
            message;

    }

}


/* =========================================================
   LOG
   ========================================================= */

function clearLog() {

    const log =
        document.getElementById(
            "dataUnderstandingLog"
        ) ||
        document.getElementById(
            "preprocessingLog"
        );

    if (!log) {
        return;
    }

    log.innerHTML = "";

}


/* =========================================================
   ADD LOG
   ========================================================= */

function addLog(message, type = "") {

    const log =
        document.getElementById(
            "dataUnderstandingLog"
        ) ||
        document.getElementById(
            "preprocessingLog"
        );

    if (!log) {
        return;
    }

    const line =
        document.createElement("div");

    line.className =
        "log-line";

    const symbol =
        document.createElement("span");

    symbol.className =
        "log-symbol";

    symbol.textContent = "â€º";

    const text =
        document.createElement("span");

    text.textContent = message;

    if (type === "success") {

        text.classList.add("log-success");

    }

    if (type === "warning") {

        text.classList.add("log-warning");

    }

    if (type === "error") {

        text.classList.add("log-error");

    }

    line.appendChild(symbol);

    line.appendChild(text);

    log.appendChild(line);

    log.scrollTop =
        log.scrollHeight;

    updateLogTime();

}


/* =========================================================
   LOG TIME
   ========================================================= */

function updateLogTime() {

    const element =
        document.getElementById("logTime");

    if (!element) {
        return;
    }

    element.textContent =
        new Date().toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}


/* =========================================================
   AI CHAT
   ========================================================= */

function initializeAIChat() {

    const robotButton =
        document.getElementById("aiRobotButton");

    const chatWindow =
        document.getElementById("aiChatWindow");

    const closeButton =
        document.getElementById("aiCloseButton");

    const chatForm =
        document.getElementById("aiChatForm");

    const chatInput =
        document.getElementById("aiChatInput");

    if (
        !robotButton ||
        !chatWindow ||
        !closeButton
    ) {
        return;
    }

    robotButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            chatWindow.classList.add("active");

            if (chatInput) {

                setTimeout(
                    function () {

                        chatInput.focus();

                    },
                    200
                );

            }

        }
    );

    closeButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            chatWindow.classList.remove("active");

        }
    );

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                chatWindow.classList.remove(
                    "active"
                );

            }

        }
    );

    if (chatForm && chatInput) {

        chatForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const message =
                    chatInput.value.trim();

                if (!message) {
                    return;
                }

                addUserMessage(message);

                chatInput.value = "";

                setTimeout(
                    function () {

                        addAIMessage(
                            getAIResponse(message)
                        );

                    },
                    350
                );

            }
        );

    }

    const quickQuestions =
        document.querySelectorAll(
            ".ai-question"
        );

    quickQuestions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    const question =
                        button.dataset.question ||
                        button.textContent.trim();

                    addUserMessage(question);

                    setTimeout(
                        function () {

                            addAIMessage(
                                getAIResponse(question)
                            );

                        },
                        350
                    );

                }
            );

        }
    );

}


/* =========================================================
   USER MESSAGE
   ========================================================= */

function addUserMessage(message) {

    const chatBody =
        document.getElementById("aiChatBody");

    if (!chatBody) {
        return;
    }

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "ai-message ai-message-user";

    const content =
        document.createElement("div");

    content.className =
        "ai-user-message-content";

    content.textContent =
        message;

    wrapper.appendChild(content);

    chatBody.appendChild(wrapper);

    scrollChatToBottom();

}


/* =========================================================
   AI MESSAGE
   ========================================================= */

function addAIMessage(message) {

    const chatBody =
        document.getElementById("aiChatBody");

    if (!chatBody) {
        return;
    }

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "ai-message";

    const avatar =
        document.createElement("div");

    avatar.className =
        "ai-avatar-small";

    avatar.textContent = "AI";

    const content =
        document.createElement("div");

    content.className =
        "ai-message-content";

    const paragraph =
        document.createElement("p");

    paragraph.textContent =
        message;

    content.appendChild(paragraph);

    wrapper.appendChild(avatar);

    wrapper.appendChild(content);

    chatBody.appendChild(wrapper);

    scrollChatToBottom();

}


/* =========================================================
   AI RESPONSE
   ========================================================= */

function getAIResponse(question) {

    const text =
        question.toLowerCase();

    if (
        text.includes("dataset") ||
        text.includes("data")
    ) {

        if (healthcareDatasetInfo) {

            return (
                `The healthcare dataset contains ` +
                `${healthcareDatasetInfo.rows.toLocaleString("en-IN")} records ` +
                `and ${healthcareDatasetInfo.columns} columns.`
            );

        }

        return "The healthcare dataset is not currently connected.";

    }

    if (
        text.includes("row") ||
        text.includes("record")
    ) {

        const rows =
            healthcareDatasetInfo
                ? healthcareDatasetInfo.rows
                : 0;

        return (
            `The healthcare dataset contains ` +
            `${rows.toLocaleString("en-IN")} records.`
        );

    }

    if (text.includes("column")) {

        const columns =
            healthcareDatasetInfo
                ? healthcareDatasetInfo.columns
                : 0;

        return (
            `The healthcare dataset contains ` +
            `${columns} columns.`
        );

    }

    if (
        text.includes("structure") ||
        text.includes("field") ||
        text.includes("feature")
    ) {

        if (
            healthcareDatasetInfo &&
            healthcareDatasetInfo.columnNames.length
        ) {

            return (
                "The dataset columns are: " +
                healthcareDatasetInfo.columnNames.join(", ")
            );

        }

        return "Dataset column information is unavailable.";

    }

    if (
        text.includes("preprocess") ||
        text.includes("clean")
    ) {

        return (
            "Preprocessing prepares healthcare records for analysis " +
            "by checking missing values, duplicates, data types and " +
            "inconsistent values."
        );

    }

    if (
        text.includes("missing") ||
        text.includes("null")
    ) {

        return (
            "Missing-value analysis identifies fields where information " +
            "is empty or unavailable."
        );

    }

    if (text.includes("duplicate")) {

        return (
            "Duplicate records are repeated observations that can " +
            "affect counts and analytical results."
        );

    }

    return (
        "I can explain the healthcare dataset, records, columns, " +
        "structure, preprocessing, missing values and duplicates."
    );

}


/* =========================================================
   CHAT SCROLL
   ========================================================= */

function scrollChatToBottom() {

    const chatBody =
        document.getElementById("aiChatBody");

    if (!chatBody) {
        return;
    }

    chatBody.scrollTo({

        top: chatBody.scrollHeight,

        behavior: "smooth"

    });

}


/* =========================================================
   ROBOT
   ========================================================= */

function initializeRobot() {

    if (
        document.getElementById(
            "healthcare-ai-widget"
        )
    ) {
        return;
    }

    const robotButton =
        document.getElementById("aiRobotButton");

    const chatWindow =
        document.getElementById("aiChatWindow");

    if (
        robotButton ||
        chatWindow
    ) {
        return;
    }

    const widget =
        document.createElement("div");

    widget.id =
        "healthcare-ai-widget";

    widget.innerHTML = `

        <button
            id="aiRobotButton"
            type="button"
            aria-label="Open healthcare AI assistant"
            style="
                position:fixed;
                right:24px;
                bottom:24px;
                width:72px;
                height:72px;
                border:none;
                padding:0;
                border-radius:50%;
                background:transparent;
                cursor:pointer;
                z-index:99999;
                overflow:hidden;
            "
        >

            <img
                src="../assets/images/ai-robot.png"
                alt="Healthcare AI Assistant"
                style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                    display:block;
                "
                onerror="
                    this.style.display='none';
                "
            >

        </button>

        <div
            id="aiChatWindow"
            style="
                position:fixed;
                right:24px;
                bottom:110px;
                width:360px;
                max-width:calc(100vw - 30px);
                max-height:520px;
                background:#08131f;
                border:1px solid rgba(255,255,255,.15);
                border-radius:18px;
                box-shadow:0 20px 60px rgba(0,0,0,.45);
                z-index:99998;
                display:none;
                overflow:hidden;
                color:white;
            "
        >

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    padding:16px;
                    background:rgba(255,255,255,.06);
                "
            >

                <strong>
                    Healthcare AI Assistant
                </strong>

                <button
                    id="aiCloseButton"
                    type="button"
                    style="
                        border:none;
                        background:transparent;
                        color:white;
                        font-size:22px;
                        cursor:pointer;
                    "
                >
                    Ã—
                </button>

            </div>

            <div
                id="aiChatBody"
                style="
                    padding:16px;
                    height:300px;
                    overflow-y:auto;
                    font-size:14px;
                "
            >

                <div class="ai-message">

                    <div
                        class="ai-message-content"
                        style="
                            background:rgba(255,255,255,.08);
                            padding:10px;
                            border-radius:10px;
                        "
                    >
                        Hello! I can explain the healthcare
                        dataset and this analysis page.
                    </div>

                </div>

            </div>

            <form
                id="aiChatForm"
                style="
                    display:flex;
                    gap:8px;
                    padding:12px;
                    border-top:1px solid rgba(255,255,255,.1);
                "
            >

                <input
                    id="aiChatInput"
                    type="text"
                    placeholder="Ask about the dataset..."
                    autocomplete="off"
                    style="
                        flex:1;
                        min-width:0;
                        padding:10px;
                        border-radius:8px;
                        border:1px solid rgba(255,255,255,.15);
                        background:#101f2d;
                        color:white;
                        outline:none;
                    "
                >

                <button
                    type="submit"
                    style="
                        padding:10px 14px;
                        border:none;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >
                    Send
                </button>

            </form>

        </div>

    `;

    document.body.appendChild(widget);

    const button =
        document.getElementById("aiRobotButton");

    const chat =
        document.getElementById("aiChatWindow");

    const close =
        document.getElementById("aiCloseButton");

    if (!button || !chat || !close) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            if (chat.style.display === "block") {

                chat.style.display = "none";

            }
            else {

                chat.style.display = "block";

                const input =
                    document.getElementById(
                        "aiChatInput"
                    );

                if (input) {
                    input.focus();
                }

            }

        }
    );

    close.addEventListener(
        "click",
        function () {

            chat.style.display = "none";

        }
    );

}


/* =========================================================
   END
   ========================================================= */
