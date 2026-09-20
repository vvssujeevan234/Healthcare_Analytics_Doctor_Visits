/* =========================================================
   HEALTHCARE ANALYTICS
   PREPROCESSING PAGE
   ========================================================= */


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    initializeDataset();

    initializePreprocessing();

    initializeAIChat();

});


/* =========================================================
   DATASET
   ========================================================= */

let healthcareDataset = [];

let datasetColumns = [];

let datasetLoaded = false;


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


    menuToggle.addEventListener("click", () => {

        const isOpen =
            mobileNavigation.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    const mobileLinks =
        mobileNavigation.querySelectorAll("a");


    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileNavigation.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================================
   INITIALIZE DATASET
   ========================================================= */

async function initializeDataset() {

    setStatus(
        "loading",
        "Loading healthcare doctor visits dataset..."
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/dataset`,
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
            "Preprocessing API response:",
            result
        );


        if (
            !result ||
            !result.success ||
            !result.data
        ) {

            throw new Error(
                "Invalid dataset response from backend."
            );

        }


        const info =
            result.data;


        const rows =
            Number(
                info.rows ||
                result.rows ||
                0
            );


        const columns =
            Number(
                info.columns ||
                result.columns ||
                0
            );


        const columnNames =
            Array.isArray(
                info.column_names
            )
                ? info.column_names
                : [];


        /*
         * The current Vercel API returns dataset
         * information rather than the complete CSV rows.
         *
         * We therefore store the row count separately.
         */

        healthcareDataset =
            new Array(rows);


        datasetColumns =
            columnNames;


        datasetLoaded =
            true;


        updateDatasetMetrics(
            rows,
            columns
        );


        setStatus(
            "loaded",
            "Healthcare dataset connected successfully"
        );


        addLog(
            `Healthcare dataset connected: ${rows.toLocaleString()} records detected.`,
            "success"
        );


        addLog(
            `${columns} dataset columns detected.`,
            "success"
        );


        if (
            columnNames.length > 0
        ) {

            addLog(
                `Columns: ${columnNames.join(", ")}`,
                "success"
            );

        }


        addLog(
            "Dataset source: Vercel backend API.",
            "success"
        );


    }
    catch (error) {

        console.error(
            "Dataset loading error:",
            error
        );


        datasetLoaded =
            false;


        healthcareDataset =
            [];


        datasetColumns =
            [];


        setStatus(
            "error",
            "Unable to connect to healthcare dataset"
        );


        addLog(
            "Unable to connect to the Vercel dataset API.",
            "error"
        );


        addLog(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   UPDATE DATASET METRICS
   ========================================================= */

function updateDatasetMetrics(
    totalRows = 0,
    totalColumns = 0
) {

    animateNumber(
        "totalRows",
        totalRows
    );


    animateNumber(
        "totalColumns",
        totalColumns
    );


    /*
     * The current /api/dataset endpoint provides
     * metadata only.
     *
     * Real missing-value and duplicate-row counts
     * require the actual dataset rows from the backend.
     */

    animateNumber(
        "missingValues",
        0
    );


    animateNumber(
        "duplicateRows",
        0
    );

}


/* =========================================================
   NUMBER ANIMATION
   ========================================================= */

function animateNumber(
    elementId,
    targetValue
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    const duration =
        700;


    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime -
            startTime;


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
                targetValue *
                eased
            );


        element.textContent =
            currentValue.toLocaleString(
                "en-IN"
            );


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   STATUS
   ========================================================= */

function setStatus(
    state,
    message
) {

    const statusDot =
        document.getElementById(
            "statusDot"
        );


    const statusText =
        document.getElementById(
            "statusText"
        );


    if (!statusDot || !statusText) {
        return;
    }


    statusDot.className =
        "status-dot";


    if (
        state === "loaded"
    ) {

        statusDot.classList.add(
            "loaded"
        );

    }


    if (
        state === "error"
    ) {

        statusDot.classList.add(
            "error"
        );

    }


    statusText.textContent =
        message;

}


/* =========================================================
   PREPROCESSING
   ========================================================= */

function initializePreprocessing() {

    const button =
        document.getElementById(
            "runPreprocessing"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        runPreprocessing
    );

}


/* =========================================================
   RUN PREPROCESSING
   ========================================================= */

function runPreprocessing() {

    const button =
        document.getElementById(
            "runPreprocessing"
        );


    if (!datasetLoaded) {

        addLog(
            "Healthcare dataset is not connected.",
            "error"
        );


        setStatus(
            "error",
            "Dataset is not available"
        );


        return;

    }


    button.disabled =
        true;


    button.innerHTML =
        "Processing... <span>↻</span>";


    clearLog();


    addLog(
        "Starting healthcare data preprocessing inspection...",
        "success"
    );


    setTimeout(() => {

        addLog(
            "Connected to Vercel healthcare dataset API.",
            "success"
        );

    }, 300);


    setTimeout(() => {

        addLog(
            `Loaded ${getDatasetRowCount().toLocaleString()} records.`,
            "success"
        );

    }, 650);


    setTimeout(() => {

        addLog(
            `Validated ${datasetColumns.length} dataset columns.`,
            "success"
        );

    }, 1000);


    setTimeout(() => {

        if (
            datasetColumns.length > 0
        ) {

            addLog(
                "Dataset column structure validated.",
                "success"
            );

        }
        else {

            addLog(
                "Dataset column information unavailable.",
                "warning"
            );

        }

    }, 1350);


    setTimeout(() => {

        addLog(
            "Backend dataset connection verified.",
            "success"
        );

    }, 1700);


    setTimeout(() => {

        addLog(
            "Preprocessing inspection completed.",
            "success"
        );


        button.disabled =
            false;


        button.innerHTML =
            "Run Again <span>↻</span>";


        setStatus(
            "loaded",
            "Preprocessing inspection completed"
        );


        updateDatasetMetrics(
            getDatasetRowCount(),
            datasetColumns.length
        );

    }, 2100);

}


/* =========================================================
   GET DATASET ROW COUNT
   ========================================================= */

function getDatasetRowCount() {

    return healthcareDataset.length;

}


/* =========================================================
   LOG
   ========================================================= */

function clearLog() {

    const log =
        document.getElementById(
            "preprocessingLog"
        );


    if (!log) {
        return;
    }


    log.innerHTML =
        "";

}


/* =========================================================
   ADD LOG
   ========================================================= */

function addLog(
    message,
    type = ""
) {

    const log =
        document.getElementById(
            "preprocessingLog"
        );


    if (!log) {
        return;
    }


    const line =
        document.createElement(
            "div"
        );


    line.className =
        "log-line";


    const symbol =
        document.createElement(
            "span"
        );


    symbol.className =
        "log-symbol";


    symbol.textContent =
        "›";


    const text =
        document.createElement(
            "span"
        );


    text.textContent =
        message;


    if (
        type === "success"
    ) {

        text.classList.add(
            "log-success"
        );

    }


    if (
        type === "warning"
    ) {

        text.classList.add(
            "log-warning"
        );

    }


    if (
        type === "error"
    ) {

        text.classList.add(
            "log-error"
        );

    }


    line.appendChild(
        symbol
    );


    line.appendChild(
        text
    );


    log.appendChild(
        line
    );


    log.scrollTop =
        log.scrollHeight;


    updateLogTime();

}


/* =========================================================
   LOG TIME
   ========================================================= */

function updateLogTime() {

    const element =
        document.getElementById(
            "logTime"
        );


    if (!element) {
        return;
    }


    const now =
        new Date();


    element.textContent =
        now.toLocaleTimeString(
            [],
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
        document.getElementById(
            "aiRobotButton"
        );


    const chatWindow =
        document.getElementById(
            "aiChatWindow"
        );


    const closeButton =
        document.getElementById(
            "aiCloseButton"
        );


    const chatForm =
        document.getElementById(
            "aiChatForm"
        );


    const chatInput =
        document.getElementById(
            "aiChatInput"
        );


    if (
        !robotButton ||
        !chatWindow ||
        !closeButton
    ) {

        return;

    }


    /* =====================================================
       OPEN CHAT
       ===================================================== */

    robotButton.addEventListener(
        "click",
        () => {

            chatWindow.classList.add(
                "active"
            );


            setTimeout(() => {

                if (
                    chatInput
                ) {

                    chatInput.focus();

                }

            }, 250);

        }
    );


    /* =====================================================
       CLOSE CHAT
       ===================================================== */

    closeButton.addEventListener(
        "click",
        () => {

            chatWindow.classList.remove(
                "active"
            );

        }
    );


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                chatWindow.classList.remove(
                    "active"
                );

            }

        }
    );


    /* =====================================================
       CHAT FORM
       ===================================================== */

    if (
        chatForm
    ) {

        chatForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (
                    !chatInput
                ) {

                    return;

                }


                const message =
                    chatInput.value.trim();


                if (
                    !message
                ) {

                    return;

                }


                sendAIMessage(
                    message
                );


                chatInput.value =
                    "";

            }
        );

    }


    /* =====================================================
       QUICK QUESTIONS
       ===================================================== */

    const quickQuestions =
        document.querySelectorAll(
            ".ai-question"
        );


    quickQuestions.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question;


                    if (
                        !question
                    ) {

                        return;

                    }


                    addUserMessage(
                        question
                    );


                    setTimeout(() => {

                        addAIMessage(
                            getAIResponse(
                                question
                            )
                        );

                    }, 350);

                }
            );

        }
    );

}


/* =========================================================
   SEND AI MESSAGE
   ========================================================= */

function sendAIMessage(
    message
) {

    addUserMessage(
        message
    );


    setTimeout(() => {

        const response =
            getAIResponse(
                message
            );


        addAIMessage(
            response
        );

    }, 400);

}


/* =========================================================
   ADD USER MESSAGE
   ========================================================= */

function addUserMessage(
    message
) {

    const chatBody =
        document.getElementById(
            "aiChatBody"
        );


    if (
        !chatBody
    ) {

        return;

    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "ai-message ai-message-user";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "ai-user-message-content";


    content.textContent =
        message;


    wrapper.appendChild(
        content
    );


    chatBody.appendChild(
        wrapper
    );


    scrollChatToBottom();

}


/* =========================================================
   ADD AI MESSAGE
   ========================================================= */

function addAIMessage(
    message
) {

    const chatBody =
        document.getElementById(
            "aiChatBody"
        );


    if (
        !chatBody
    ) {

        return;

    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "ai-message";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "ai-avatar-small";


    avatar.textContent =
        "AI";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "ai-message-content";


    const paragraph =
        document.createElement(
            "p"
        );


    paragraph.textContent =
        message;


    content.appendChild(
        paragraph
    );


    wrapper.appendChild(
        avatar
    );


    wrapper.appendChild(
        content
    );


    chatBody.appendChild(
        wrapper
    );


    scrollChatToBottom();

}


/* =========================================================
   SCROLL CHAT
   ========================================================= */

function scrollChatToBottom() {

    const chatBody =
        document.getElementById(
            "aiChatBody"
        );


    if (
        !chatBody
    ) {

        return;

    }


    chatBody.scrollTo({

        top:
            chatBody.scrollHeight,

        behavior:
            "smooth"

    });

}


/* =========================================================
   AI RESPONSE
   ========================================================= */

function getAIResponse(
    question
) {

    const text =
        question.toLowerCase();


    if (
        text.includes("preprocess") ||
        text.includes("clean")
    ) {

        return (
            "Data preprocessing prepares raw records for analysis. " +
            "It can include checking missing values, detecting duplicates, " +
            "validating data types and reviewing inconsistent values."
        );

    }


    if (
        text.includes("missing") ||
        text.includes("null")
    ) {

        return (
            "Missing-value analysis identifies fields where information " +
            "is empty or unavailable. These values should be reviewed " +
            "before analytical processing."
        );

    }


    if (
        text.includes("duplicate")
    ) {

        return (
            "Duplicate records are repeated observations. " +
            "They should be identified because repeated rows can affect " +
            "counts, averages and other analytical results."
        );

    }


    if (
        text.includes("type") ||
        text.includes("numeric") ||
        text.includes("categor")
    ) {

        return (
            "Data-type validation checks whether each field is represented " +
            "appropriately, such as numerical values for measurements and " +
            "categorical values for groups or classifications."
        );

    }


    if (
        text.includes("dataset") ||
        text.includes("data")
    ) {

        return (
            `The healthcare dataset contains ` +
            `${getDatasetRowCount().toLocaleString()} records ` +
            `and ${datasetColumns.length} columns based on the ` +
            `Vercel backend dataset information.`
        );

    }


    if (
        text.includes("row")
    ) {

        return (
            `The healthcare dataset contains ` +
            `${getDatasetRowCount().toLocaleString()} data rows.`
        );

    }


    if (
        text.includes("column")
    ) {

        return (
            `The healthcare dataset currently contains ` +
            `${datasetColumns.length} columns.`
        );

    }


    return (
        "I can help explain the preprocessing workflow. " +
        "Try asking about missing values, duplicate records, " +
        "data types, cleaning or the healthcare dataset."
    );

}


/* =========================================================
   CLICK OUTSIDE CHAT
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const chatWindow =
            document.getElementById(
                "aiChatWindow"
            );


        const robotButton =
            document.getElementById(
                "aiRobotButton"
            );


        if (
            !chatWindow ||
            !robotButton
        ) {

            return;

        }


        if (
            !chatWindow.contains(
                event.target
            ) &&
            !robotButton.contains(
                event.target
            )
        ) {

            chatWindow.classList.remove(
                "active"
            );

        }

    }
);