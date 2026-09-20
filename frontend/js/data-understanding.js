/* =========================================================
   HEALTHCARE ANALYTICS
   DATA UNDERSTANDING PAGE
   DIRECT CSV VERSION
   VERCEL SAFE
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL DATA
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

    menuToggle.addEventListener("click", function () {

        const isOpen =
            mobileNavigation.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    const mobileLinks =
        mobileNavigation.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

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
   DATA UNDERSTANDING
   ========================================================= */

async function initializeDataUnderstanding() {

    setPageStatus(
        "loading",
        "Loading healthcare dataset..."
    );

    clearLog();

    addLog(
        "Initializing healthcare dataset connection..."
    );

    try {

        const csvText =
            await loadHealthcareCSV();

        addLog(
            "Healthcare CSV file downloaded successfully.",
            "success"
        );


        const rows =
            parseCSV(csvText);


        if (!rows.length) {

            throw new Error(
                "Healthcare CSV contains no records."
            );

        }


        const columnNames =
            Object.keys(rows[0]);


        healthcareDatasetInfo = {

            rows: rows.length,

            columns: columnNames.length,

            columnNames: columnNames,

            data: rows

        };


        datasetLoaded = true;


        updateDatasetInformation();


        setPageStatus(
            "loaded",
            "Healthcare dataset connected successfully"
        );


        addLog(
            `Healthcare dataset loaded: ${rows.length.toLocaleString("en-IN")} records.`,
            "success"
        );


        addLog(
            `${columnNames.length} columns detected.`,
            "success"
        );


        addLog(
            "Dataset column structure loaded successfully.",
            "success"
        );


        console.log(
            "Healthcare Dataset:",
            healthcareDatasetInfo
        );


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

    }

}


/* =========================================================
   LOAD CSV
   IMPORTANT
   =========================================================

   Data Understanding page is:

   /frontend/pages/data-understanding.html

   CSV is:

   /frontend/data/healthcare_doctor_visits.csv

   Therefore the correct relative path is:

   ../data/healthcare_doctor_visits.csv

   ========================================================= */

async function loadHealthcareCSV() {

    const possiblePaths = [

        "../data/healthcare_doctor_visits.csv",

        "/data/healthcare_doctor_visits.csv",

        "./data/healthcare_doctor_visits.csv"

    ];


    for (const path of possiblePaths) {

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
                    `CSV request failed: ${response.status} ${response.statusText}`,
                    path
                );

                continue;

            }


            const text =
                await response.text();


            if (
                !text ||
                !text.trim()
            ) {

                console.warn(
                    "CSV file is empty:",
                    path
                );

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
        "Healthcare CSV was not found. Expected file: frontend/data/healthcare_doctor_visits.csv"
    );

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(text) {

    const rows = [];

    let row = [];

    let value = "";

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


        if (
            character === '"' &&
            insideQuotes &&
            nextCharacter === '"'
        ) {

            value += '"';

            i++;

            continue;

        }


        if (
            character === '"'
        ) {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        if (
            character === "," &&
            !insideQuotes
        ) {

            row.push(
                value.trim()
            );

            value = "";

            continue;

        }


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


            row.push(
                value.trim()
            );

            value = "";


            if (
                row.some(
                    function (item) {
                        return item !== "";
                    }
                )
            ) {

                rows.push(row);

            }


            row = [];

            continue;

        }


        value += character;

    }


    if (
        value !== "" ||
        row.length > 0
    ) {

        row.push(
            value.trim()
        );


        if (
            row.some(
                function (item) {
                    return item !== "";
                }
            )
        ) {

            rows.push(row);

        }

    }


    if (
        rows.length < 2
    ) {

        return [];

    }


    const headers =
        rows[0].map(
            function (header) {

                return header
                    .trim()
                    .replace(/^"|"$/g, "");

            }
        );


    return rows
        .slice(1)
        .map(
            function (rowData) {

                const object = {};


                headers.forEach(
                    function (
                        header,
                        index
                    ) {

                        object[header] =
                            rowData[index] !== undefined
                                ? rowData[index].trim()
                                : "";

                    }
                );


                return object;

            }
        );

}


/* =========================================================
   UPDATE DATASET INFORMATION
   ========================================================= */

function updateDatasetInformation() {

    if (
        !healthcareDatasetInfo
    ) {

        return;

    }


    const rows =
        healthcareDatasetInfo.rows;

    const columns =
        healthcareDatasetInfo.columns;

    const columnNames =
        healthcareDatasetInfo.columnNames;


    setNumber(
        "totalRows",
        rows
    );


    setNumber(
        "totalColumns",
        columns
    );


    setNumber(
        "datasetRows",
        rows
    );


    setNumber(
        "datasetColumns",
        columns
    );


    setNumber(
        "recordCount",
        rows
    );


    setNumber(
        "columnCount",
        columns
    );


    setText(
        "datasetRecordCount",
        rows.toLocaleString("en-IN")
    );


    setText(
        "datasetColumnCount",
        columns.toLocaleString("en-IN")
    );


    displayColumnNames(
        columnNames
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
            .replace(/,/g, "")
            .trim();


    const startValue =
        Number(currentText) || 0;


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
   DISPLAY COLUMN NAMES
   ========================================================= */

function displayColumnNames(
    columnNames
) {

    const containers = [

        document.getElementById(
            "columnList"
        ),

        document.getElementById(
            "columnsList"
        )

    ];


    const container =
        containers.find(
            function (element) {
                return element;
            }
        );


    if (
        !container ||
        !Array.isArray(columnNames)
    ) {

        return;

    }


    container.innerHTML = "";


    columnNames.forEach(
        function (
            column,
            index
        ) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "dataset-column-item";


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "column-number";


            number.textContent =
                String(
                    index + 1
                ).padStart(
                    2,
                    "0"
                );


            const name =
                document.createElement(
                    "span"
                );


            name.className =
                "column-name";


            name.textContent =
                column;


            item.appendChild(
                number
            );


            item.appendChild(
                name
            );


            container.appendChild(
                item
            );

        }
    );

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
            "AI robot elements were not found on Data Understanding page."
        );

        return;

    }


    robotButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            chatWindow.classList.add(
                "active"
            );


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

            chatWindow.classList.remove(
                "active"
            );

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

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
            function (event) {

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
                    function () {

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
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

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
                        function () {

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
            healthcareDatasetInfo
        ) {

            return (
                `The healthcare dataset contains ` +
                `${healthcareDatasetInfo.rows.toLocaleString("en-IN")} ` +
                `records and ` +
                `${healthcareDatasetInfo.columns} columns.`
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
            healthcareDatasetInfo
        ) {

            return (
                `The dataset contains ` +
                `${healthcareDatasetInfo.columns} columns.`
            );

        }


        return (
            "Column information is unavailable."
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
                healthcareDatasetInfo.columnNames.join(
                    ", "
                )
            );

        }


        return (
            "Dataset column information is unavailable."
        );

    }


    if (
        text.includes("understand")
    ) {

        return (
            "Data Understanding examines the healthcare dataset structure, records, columns and fields before deeper analysis."
        );

    }


    if (
        text.includes("preprocess") ||
        text.includes("clean")
    ) {

        return (
            "Preprocessing checks missing values, duplicates, data types and inconsistent values before analysis."
        );

    }


    if (
        text.includes("missing") ||
        text.includes("null")
    ) {

        return (
            "Missing-value analysis identifies fields where information is empty or unavailable."
        );

    }


    if (
        text.includes("duplicate")
    ) {

        return (
            "Duplicate records are repeated observations that can affect counts and analytical calculations."
        );

    }


    return (
        "I can explain the healthcare dataset, records, columns, structure, preprocessing, missing values and duplicate records."
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
    function (event) {

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