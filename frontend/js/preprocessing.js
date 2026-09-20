/* =========================================================
   HEALTHCARE ANALYTICS
   PREPROCESSING PAGE JAVASCRIPT
   CSV-BASED VERSION
   ========================================================= */

let healthcareData = [];
let originalData = [];
let datasetLoaded = false;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    initializeDataset();

    initializeAIChat();

});


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

    setPageStatus(
        "loading",
        "Loading healthcare dataset..."
    );

    clearLog();

    addLog(
        "Initializing healthcare dataset connection...",
        "warning"
    );

    try {

        const csvText =
            await loadHealthcareCSV();


        if (
            !csvText ||
            csvText.trim().length === 0
        ) {

            throw new Error(
                "Healthcare CSV is empty."
            );

        }


        healthcareData =
            parseCSV(csvText);


        if (
            !healthcareData ||
            healthcareData.length === 0
        ) {

            throw new Error(
                "Healthcare CSV contains no records."
            );

        }


        originalData =
            JSON.parse(
                JSON.stringify(
                    healthcareData
                )
            );


        datasetLoaded = true;


        console.log(
            "Healthcare preprocessing dataset loaded:",
            healthcareData
        );


        updateDatasetInformation();


        setPageStatus(
            "loaded",
            `Healthcare dataset connected • ${healthcareData.length.toLocaleString("en-IN")} records`
        );


        addLog(
            `Healthcare dataset loaded successfully: ${healthcareData.length.toLocaleString("en-IN")} records.`,
            "success"
        );


        const columns =
            Object.keys(
                healthcareData[0]
            );


        addLog(
            `${columns.length} columns detected.`,
            "success"
        );


        addLog(
            "CSV-based preprocessing is ready.",
            "success"
        );


        analyzeMissingValues();

        analyzeDuplicates();

        analyzeDataTypes();

        analyzeBasicQuality();


    }
    catch (error) {

        console.error(
            "Dataset loading error:",
            error
        );


        datasetLoaded = false;

        healthcareData = [];

        originalData = [];


        setPageStatus(
            "error",
            "Unable to load healthcare dataset"
        );


        addLog(
            "Healthcare dataset could not be loaded.",
            "error"
        );


        addLog(
            error.message ||
            "Unknown dataset error.",
            "error"
        );


        showDatasetError();

    }

}


/* =========================================================
   LOAD CSV
   ========================================================= */

async function loadHealthcareCSV() {

    /*
       IMPORTANT

       The preprocessing page is located at:

       frontend/pages/preprocessing.html

       The CSV is located at:

       frontend/data/healthcare_doctor_visits.csv

       Therefore:

       ../data/healthcare_doctor_visits.csv

       is the correct Vercel path.
    */


    const possiblePaths = [

        "../data/healthcare_doctor_visits.csv",

        "/data/healthcare_doctor_visits.csv",

        "./data/healthcare_doctor_visits.csv"

    ];


    for (
        const path of possiblePaths
    ) {

        try {

            console.log(
                "Trying healthcare CSV:",
                path
            );


            const response =
                await fetch(
                    `${path}?v=${Date.now()}`,
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                console.warn(
                    `CSV path returned ${response.status}:`,
                    path
                );

                continue;

            }


            const text =
                await response.text();


            if (
                !text ||
                text.trim().length === 0
            ) {

                continue;

            }


            console.log(
                "Healthcare CSV loaded from:",
                path
            );


            return text;

        }
        catch (error) {

            console.warn(
                "CSV path failed:",
                path,
                error
            );

        }

    }


    throw new Error(
        "Healthcare CSV could not be found. Expected: frontend/data/healthcare_doctor_visits.csv"
    );

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(text) {

    const rows = [];

    let currentRow = [];

    let currentValue = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        const character =
            text[i];

        const nextCharacter =
            text[i + 1];


        /*
           Handle escaped quotes
        */

        if (
            character === '"' &&
            insideQuotes &&
            nextCharacter === '"'
        ) {

            currentValue += '"';

            i++;

            continue;

        }


        /*
           Toggle quoted state
        */

        if (
            character === '"'
        ) {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        /*
           Comma
        */

        if (
            character === "," &&
            !insideQuotes
        ) {

            currentRow.push(
                currentValue.trim()
            );

            currentValue = "";

            continue;

        }


        /*
           New line
        */

        if (
            (
                character === "\n" ||
                character === "\r"
            ) &&
            !insideQuotes
        ) {

            if (
                character === "\r" &&
                nextCharacter === "\n"
            ) {

                i++;

            }


            currentRow.push(
                currentValue.trim()
            );

            currentValue = "";


            if (
                currentRow.some(
                    value =>
                        value !== ""
                )
            ) {

                rows.push(
                    currentRow
                );

            }


            currentRow = [];

            continue;

        }


        currentValue +=
            character;

    }


    /*
       Last row
    */

    if (
        currentValue !== "" ||
        currentRow.length > 0
    ) {

        currentRow.push(
            currentValue.trim()
        );


        if (
            currentRow.some(
                value =>
                    value !== ""
            )
        ) {

            rows.push(
                currentRow
            );

        }

    }


    if (
        rows.length < 2
    ) {

        return [];

    }


    /*
       Header row
    */

    const headers =
        rows[0].map(
            header =>
                header
                    .trim()
                    .replace(
                        /^"|"$/g,
                        ""
                    )
        );


    /*
       Convert rows to objects
    */

    return rows
        .slice(1)
        .map(rowData => {

            const object = {};


            headers.forEach(
                (
                    header,
                    index
                ) => {

                    object[header] =
                        rowData[index] !== undefined
                            ? rowData[index].trim()
                            : "";

                }
            );


            return object;

        });

}


/* =========================================================
   UPDATE DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation() {

    if (
        !datasetLoaded ||
        !healthcareData.length
    ) {

        return;

    }


    const rowCount =
        healthcareData.length;


    const columnCount =
        Object.keys(
            healthcareData[0]
        ).length;


    /*
       Common IDs used by the HTML
    */

    setNumber(
        "totalRows",
        rowCount
    );

    setNumber(
        "datasetRows",
        rowCount
    );

    setNumber(
        "recordCount",
        rowCount
    );


    setNumber(
        "totalColumns",
        columnCount
    );

    setNumber(
        "datasetColumns",
        columnCount
    );

    setNumber(
        "columnCount",
        columnCount
    );


    setText(
        "datasetRecordCount",
        rowCount.toLocaleString(
            "en-IN"
        )
    );


    setText(
        "datasetColumnCount",
        columnCount.toLocaleString(
            "en-IN"
        )
    );


}


/* =========================================================
   SET NUMBER
   ========================================================= */

function setNumber(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    animateNumber(
        element,
        Number(value) || 0
    );

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.textContent =
        value;

}


/* =========================================================
   NUMBER ANIMATION
   ========================================================= */

function animateNumber(
    element,
    targetValue
) {

    const duration = 700;


    const currentText =
        element.textContent
            .replace(
                /,/g,
                ""
            );


    const startValue =
        Number(currentText) || 0;


    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

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
   MISSING VALUE ANALYSIS
   ========================================================= */

function analyzeMissingValues() {

    if (
        !healthcareData.length
    ) {

        return;

    }


    const columns =
        Object.keys(
            healthcareData[0]
        );


    let totalMissing = 0;


    columns.forEach(
        column => {

            healthcareData.forEach(
                row => {

                    const value =
                        row[column];


                    if (
                        value === null ||
                        value === undefined ||
                        String(value).trim() === ""
                    ) {

                        totalMissing++;

                    }

                }
            );

        }
    );


    addLog(
        `Missing-value check completed: ${totalMissing.toLocaleString("en-IN")} empty values detected.`,
        totalMissing === 0
            ? "success"
            : "warning"
    );


    setNumber(
        "missingValues",
        totalMissing
    );


    setText(
        "missingCount",
        totalMissing.toLocaleString(
            "en-IN"
        )
    );

}


/* =========================================================
   DUPLICATE ANALYSIS
   ========================================================= */

function analyzeDuplicates() {

    if (
        !healthcareData.length
    ) {

        return;

    }


    const seen =
        new Set();


    let duplicates = 0;


    healthcareData.forEach(
        row => {

            const key =
                JSON.stringify(
                    row
                );


            if (
                seen.has(key)
            ) {

                duplicates++;

            }
            else {

                seen.add(key);

            }

        }
    );


    addLog(
        `Duplicate check completed: ${duplicates.toLocaleString("en-IN")} duplicate records detected.`,
        duplicates === 0
            ? "success"
            : "warning"
    );


    setNumber(
        "duplicateValues",
        duplicates
    );


    setText(
        "duplicateCount",
        duplicates.toLocaleString(
            "en-IN"
        )
    );

}


/* =========================================================
   DATA TYPE ANALYSIS
   ========================================================= */

function analyzeDataTypes() {

    if (
        !healthcareData.length
    ) {

        return;

    }


    const columns =
        Object.keys(
            healthcareData[0]
        );


    let numericColumns = 0;

    let textColumns = 0;


    columns.forEach(
        column => {

            const values =
                healthcareData
                    .map(
                        row =>
                            row[column]
                    )
                    .filter(
                        value =>
                            value !== ""
                    )
                    .slice(
                        0,
                        100
                    );


            let numericCount = 0;


            values.forEach(
                value => {

                    if (
                        isNumeric(value)
                    ) {

                        numericCount++;

                    }

                }
            );


            if (
                values.length &&
                numericCount /
                    values.length >=
                    0.8
            ) {

                numericColumns++;

            }
            else {

                textColumns++;

            }

        }
    );


    addLog(
        `Data type analysis completed: ${numericColumns} numeric and ${textColumns} categorical/text columns detected.`,
        "success"
    );


    setNumber(
        "numericColumns",
        numericColumns
    );


    setNumber(
        "textColumns",
        textColumns
    );

}


/* =========================================================
   NUMERIC CHECK
   ========================================================= */

function isNumeric(value) {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {

        return false;

    }


    const cleaned =
        String(value)
            .replace(
                /,/g,
                ""
            )
            .trim();


    return Number.isFinite(
        Number(cleaned)
    );

}


/* =========================================================
   BASIC QUALITY
   ========================================================= */

function analyzeBasicQuality() {

    if (
        !healthcareData.length
    ) {

        return;

    }


    const columns =
        Object.keys(
            healthcareData[0]
        );


    const validRows =
        healthcareData.filter(
            row => {

                return columns.some(
                    column =>
                        String(
                            row[column] || ""
                        ).trim() !== ""
                );

            }
        ).length;


    const emptyRows =
        healthcareData.length -
        validRows;


    addLog(
        `Basic quality check completed: ${validRows.toLocaleString("en-IN")} populated records available.`,
        "success"
    );


    if (
        emptyRows > 0
    ) {

        addLog(
            `${emptyRows.toLocaleString("en-IN")} completely empty records detected.`,
            "warning"
        );

    }

}


/* =========================================================
   PAGE STATUS
   ========================================================= */

function setPageStatus(
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


    if (statusDot) {

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
            state === "loading"
        ) {

            statusDot.classList.add(
                "loading"
            );

        }


        if (
            state === "error"
        ) {

            statusDot.classList.add(
                "error"
            );

        }

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

function addLog(
    message,
    type = ""
) {

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


    element.textContent =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}


/* =========================================================
   DATASET ERROR
   ========================================================= */

function showDatasetError() {

    const containers = [

        "datasetStatus",
        "preprocessingStatus",
        "datasetPreview",
        "preprocessingResults"

    ];


    containers.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (
                element
            ) {

                element.innerHTML = `
                    <div style="
                        padding:20px;
                        text-align:center;
                        color:#ff6b6b;
                    ">
                        Healthcare dataset could not be loaded.
                        <br>
                        Please check frontend/data/healthcare_doctor_visits.csv
                    </div>
                `;

            }

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

        console.warn(
            "AI robot elements not found."
        );

        return;

    }


    robotButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            chatWindow.classList.add(
                "active"
            );


            if (
                chatInput
            ) {

                setTimeout(
                    () =>
                        chatInput.focus(),
                    200
                );

            }

        }
    );


    closeButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            chatWindow.classList.remove(
                "active"
            );

        }
    );


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


    if (
        chatForm &&
        chatInput
    ) {

        chatForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const message =
                    chatInput.value.trim();


                if (!message) {

                    return;

                }


                addUserMessage(
                    message
                );


                chatInput.value = "";


                setTimeout(
                    () => {

                        addAIMessage(
                            getAIResponse(
                                message
                            )
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
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const question =
                        button.dataset.question ||
                        button.textContent.trim();


                    if (!question) {

                        return;

                    }


                    addUserMessage(
                        question
                    );


                    setTimeout(
                        () => {

                            addAIMessage(
                                getAIResponse(
                                    question
                                )
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

function addUserMessage(
    message
) {

    const chatBody =
        document.getElementById(
            "aiChatBody"
        );


    if (!chatBody) {

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
   AI MESSAGE
   ========================================================= */

function addAIMessage(
    message
) {

    const chatBody =
        document.getElementById(
            "aiChatBody"
        );


    if (!chatBody) {

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
   AI RESPONSE
   ========================================================= */

function getAIResponse(
    question
) {

    const text =
        question.toLowerCase();


    if (
        text.includes("dataset") ||
        text.includes("data") ||
        text.includes("record") ||
        text.includes("row")
    ) {

        if (
            healthcareData.length
        ) {

            const columns =
                Object.keys(
                    healthcareData[0]
                );


            return (
                `The healthcare dataset contains ` +
                `${healthcareData.length.toLocaleString("en-IN")} ` +
                `records and ` +
                `${columns.length} columns.`
            );

        }


        return (
            "The healthcare dataset is currently unavailable."
        );

    }


    if (
        text.includes("column")
    ) {

        if (
            healthcareData.length
        ) {

            const columns =
                Object.keys(
                    healthcareData[0]
                );


            return (
                `The dataset contains ${columns.length} columns.`
            );

        }


        return (
            "Column information is unavailable."
        );

    }


    if (
        text.includes("missing") ||
        text.includes("null")
    ) {

        if (
            healthcareData.length
        ) {

            const columns =
                Object.keys(
                    healthcareData[0]
                );


            let missing = 0;


            healthcareData.forEach(
                row => {

                    columns.forEach(
                        column => {

                            if (
                                String(
                                    row[column] || ""
                                ).trim() === ""
                            ) {

                                missing++;

                            }

                        }
                    );

                }
            );


            return (
                `The dataset currently contains ` +
                `${missing.toLocaleString("en-IN")} missing or empty values.`
            );

        }


        return (
            "Missing-value information is unavailable."
        );

    }


    if (
        text.includes("duplicate")
    ) {

        if (
            healthcareData.length
        ) {

            const seen =
                new Set();


            let duplicates = 0;


            healthcareData.forEach(
                row => {

                    const key =
                        JSON.stringify(
                            row
                        );


                    if (
                        seen.has(key)
                    ) {

                        duplicates++;

                    }
                    else {

                        seen.add(key);

                    }

                }
            );


            return (
                `The preprocessing check detected ` +
                `${duplicates.toLocaleString("en-IN")} duplicate records.`
            );

        }


        return (
            "Duplicate information is unavailable."
        );

    }


    if (
        text.includes("preprocess") ||
        text.includes("clean")
    ) {

        return (
            "The preprocessing page checks the healthcare CSV for missing values, duplicate records, data types and basic data quality before analysis."
        );

    }


    return (
        "I can explain the healthcare dataset, records, columns, missing values, duplicate records and preprocessing results."
    );

}


/* =========================================================
   SCROLL CHAT
   ========================================================= */

function scrollChatToBottom() {

    const chatBody =
        document.getElementById(
            "aiChatBody"
        );


    if (!chatBody) {

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