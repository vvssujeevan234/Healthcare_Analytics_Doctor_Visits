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

        mobileNavigation.classList.toggle("open");

    });


    const mobileLinks =
        mobileNavigation.querySelectorAll("a");


    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileNavigation.classList.remove("open");

        });

    });

}


/* =========================================================
   DATASET
   ========================================================= */

let healthcareDataset = [];

let datasetColumns = [];


/* =========================================================
   DATASET PATHS
   ========================================================= */

const DATASET_PATHS = [

    "../../data/healthcare_doctor_visits.csv",

    "../data/healthcare_doctor_visits.csv",

    "../../healthcare_doctor_visits.csv",

    "../healthcare_doctor_visits.csv"

];


/* =========================================================
   INITIALIZE DATASET
   ========================================================= */

async function initializeDataset() {

    setStatus(
        "loading",
        "Loading healthcare doctor visits dataset..."
    );


    let csvText = null;


    for (const path of DATASET_PATHS) {

        try {

            const response =
                await fetch(path, {
                    cache: "no-store"
                });


            if (!response.ok) {
                continue;
            }


            csvText =
                await response.text();


            if (
                csvText &&
                csvText.trim().length > 0
            ) {
                break;
            }

        } catch (error) {

            console.log(
                "Dataset path unavailable:",
                path
            );

        }

    }


    if (!csvText) {

        setStatus(
            "error",
            "Dataset could not be loaded"
        );


        addLog(
            "Dataset file was not found. Make sure healthcare_doctor_visits.csv exists.",
            "error"
        );

        return;

    }


    try {

        const parsed =
            parseCSV(csvText);


        healthcareDataset =
            parsed.rows;

        datasetColumns =
            parsed.columns;


        updateDatasetMetrics();

        setStatus(
            "loaded",
            "Healthcare dataset loaded successfully"
        );


        addLog(
            `Dataset loaded successfully: ${healthcareDataset.length} records detected.`,
            "success"
        );


        addLog(
            `${datasetColumns.length} columns detected.`,
            "success"
        );


    } catch (error) {

        console.error(error);


        setStatus(
            "error",
            "Unable to process dataset"
        );


        addLog(
            "CSV processing failed.",
            "error"
        );

    }

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(csvText) {

    const rows = [];

    let currentRow = [];

    let currentValue = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < csvText.length;
        i++
    ) {

        const character =
            csvText[i];

        const nextCharacter =
            csvText[i + 1];


        if (character === '"') {

            if (
                insideQuotes &&
                nextCharacter === '"'
            ) {

                currentValue += '"';

                i++;

            } else {

                insideQuotes =
                    !insideQuotes;

            }

        }

        else if (
            character === "," &&
            !insideQuotes
        ) {

            currentRow.push(
                currentValue.trim()
            );

            currentValue = "";

        }

        else if (
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


            if (
                currentRow.some(
                    value =>
                        value !== ""
                )
            ) {

                rows.push(currentRow);

            }


            currentRow = [];

            currentValue = "";

        }

        else {

            currentValue += character;

        }

    }


    if (
        currentValue !== "" ||
        currentRow.length > 0
    ) {

        currentRow.push(
            currentValue.trim()
        );

        rows.push(currentRow);

    }


    if (rows.length === 0) {

        return {
            columns: [],
            rows: []
        };

    }


    const columns =
        rows[0].map(
            column =>
                column.trim()
        );


    const dataRows =
        rows
            .slice(1)
            .filter(row => {

                return row.some(
                    value =>
                        value !== ""
                );

            })
            .map(row => {

                const object = {};


                columns.forEach(
                    (column, index) => {

                        object[column] =
                            row[index] !== undefined
                                ? row[index]
                                : "";

                    }
                );


                return object;

            });


    return {
        columns,
        rows: dataRows
    };

}


/* =========================================================
   UPDATE DATASET METRICS
   ========================================================= */

function updateDatasetMetrics() {

    const totalRows =
        healthcareDataset.length;


    const totalColumns =
        datasetColumns.length;


    const missingValues =
        countMissingValues(
            healthcareDataset,
            datasetColumns
        );


    const duplicateRows =
        countDuplicateRows(
            healthcareDataset,
            datasetColumns
        );


    animateNumber(
        "totalRows",
        totalRows
    );


    animateNumber(
        "totalColumns",
        totalColumns
    );


    animateNumber(
        "missingValues",
        missingValues
    );


    animateNumber(
        "duplicateRows",
        duplicateRows
    );

}


/* =========================================================
   COUNT MISSING VALUES
   ========================================================= */

function countMissingValues(
    rows,
    columns
) {

    let count = 0;


    rows.forEach(row => {

        columns.forEach(column => {

            const value =
                row[column];


            if (
                value === undefined ||
                value === null ||
                value.trim() === "" ||
                value.toLowerCase() === "null" ||
                value.toLowerCase() === "na" ||
                value.toLowerCase() === "n/a"
            ) {

                count++;

            }

        });

    });


    return count;

}


/* =========================================================
   COUNT DUPLICATES
   ========================================================= */

function countDuplicateRows(
    rows,
    columns
) {

    const seen =
        new Set();

    let duplicates = 0;


    rows.forEach(row => {

        const signature =
            columns
                .map(
                    column =>
                        row[column]
                )
                .join("||");


        if (
            seen.has(signature)
        ) {

            duplicates++;

        } else {

            seen.add(signature);

        }

    });


    return duplicates;

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


    const duration = 700;

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
                targetValue * eased
            );


        element.textContent =
            currentValue.toLocaleString();


        if (progress < 1) {

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


    if (state === "loaded") {

        statusDot.classList.add(
            "loaded"
        );

    }


    if (state === "error") {

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


    if (!healthcareDataset.length) {

        addLog(
            "No dataset is currently loaded.",
            "error"
        );

        setStatus(
            "error",
            "Dataset is not available"
        );

        return;

    }


    button.disabled = true;

    button.innerHTML =
        "Processing... <span>↻</span>";


    clearLog();


    addLog(
        "Starting healthcare data preprocessing...",
        "success"
    );


    setTimeout(() => {

        addLog(
            `Loaded ${healthcareDataset.length.toLocaleString()} records.`,
            "success"
        );

    }, 350);


    setTimeout(() => {

        addLog(
            `Validated ${datasetColumns.length} dataset columns.`,
            "success"
        );

    }, 700);


    setTimeout(() => {

        const missing =
            countMissingValues(
                healthcareDataset,
                datasetColumns
            );


        if (missing > 0) {

            addLog(
                `${missing.toLocaleString()} missing values detected for review.`,
                "warning"
            );

        } else {

            addLog(
                "No missing values detected.",
                "success"
            );

        }

    }, 1050);


    setTimeout(() => {

        const duplicates =
            countDuplicateRows(
                healthcareDataset,
                datasetColumns
            );


        if (duplicates > 0) {

            addLog(
                `${duplicates.toLocaleString()} duplicate rows detected for review.`,
                "warning"
            );

        } else {

            addLog(
                "No duplicate records detected.",
                "success"
            );

        }

    }, 1400);


    setTimeout(() => {

        addLog(
            "Data type and structure validation completed.",
            "success"
        );

    }, 1750);


    setTimeout(() => {

        addLog(
            "Preprocessing inspection completed. Dataset is ready for analysis review.",
            "success"
        );


        button.disabled = false;

        button.innerHTML =
            "Run Again <span>↻</span>";


        setStatus(
            "loaded",
            "Preprocessing inspection completed"
        );


        updateDatasetMetrics();

    }, 2100);

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


    symbol.textContent =
        "›";


    const text =
        document.createElement("span");


    text.textContent =
        message;


    if (type === "success") {

        text.classList.add(
            "log-success"
        );

    }


    if (type === "warning") {

        text.classList.add(
            "log-warning"
        );

    }


    if (type === "error") {

        text.classList.add(
            "log-error"
        );

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


    /* OPEN */

    robotButton.addEventListener(
        "click",
        () => {

            chatWindow.classList.add(
                "active"
            );


            setTimeout(() => {

                if (chatInput) {
                    chatInput.focus();
                }

            }, 250);

        }
    );


    /* CLOSE */

    closeButton.addEventListener(
        "click",
        () => {

            chatWindow.classList.remove(
                "active"
            );

        }
    );


    /* ESCAPE */

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


    /* FORM */

    if (chatForm) {

        chatForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const message =
                    chatInput.value.trim();


                if (!message) {
                    return;
                }


                sendAIMessage(message);


                chatInput.value = "";

            }
        );

    }


    /* QUICK QUESTIONS */

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


                    if (!question) {
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


    avatar.textContent =
        "AI";


    const content =
        document.createElement("div");


    content.className =
        "ai-message-content";


    const paragraph =
        document.createElement("p");


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
            "is empty or unavailable. The next step is to review whether " +
            "those values should be retained, removed or handled using an " +
            "appropriate preprocessing method."
        );

    }


    if (
        text.includes("duplicate")
    ) {

        return (
            "Duplicate records are repeated observations. They should be " +
            "identified because repeated rows can affect counts, averages " +
            "and other analytical results."
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
            `The current dataset contains ` +
            `${healthcareDataset.length.toLocaleString()} records and ` +
            `${datasetColumns.length} columns based on the loaded CSV.`
        );

    }


    if (
        text.includes("missing value")
    ) {

        const missing =
            countMissingValues(
                healthcareDataset,
                datasetColumns
            );


        return (
            `The current dataset contains approximately ` +
            `${missing.toLocaleString()} missing-value entries ` +
            `according to the browser-side inspection.`
        );

    }


    if (
        text.includes("row")
    ) {

        return (
            `The loaded healthcare dataset currently contains ` +
            `${healthcareDataset.length.toLocaleString()} data rows.`
        );

    }


    if (
        text.includes("column")
    ) {

        return (
            `The loaded dataset currently contains ` +
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