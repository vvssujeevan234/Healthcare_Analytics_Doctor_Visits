/* =========================================================
   HEALTHCARE ANALYTICS
   PREPROCESSING PAGE
   DIRECT CSV VERSION
   VERCEL SAFE
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let preprocessingData = [];
let preprocessingColumns = [];
let preprocessingLoaded = false;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeNavigation();

    initializeDataset();

    initializePreprocessingAI();

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
   INITIALIZE DATASET
   ========================================================= */

async function initializeDataset() {

    setStatus(
        "loading",
        "Loading healthcare dataset..."
    );

    addLog(
        "Initializing healthcare dataset..."
    );

    try {

        const csvText =
            await loadHealthcareCSV();

        preprocessingData =
            parseCSV(csvText);


        if (
            !preprocessingData.length
        ) {

            throw new Error(
                "Healthcare CSV contains no records."
            );

        }


        preprocessingColumns =
            Object.keys(
                preprocessingData[0]
            );


        preprocessingLoaded = true;


        updateDatasetSummary();

        updatePreprocessingAnalysis();


        setStatus(
            "loaded",
            "Healthcare dataset connected successfully"
        );


        addLog(
            `Dataset loaded successfully: ${preprocessingData.length.toLocaleString("en-IN")} records.`,
            "success"
        );


        addLog(
            `${preprocessingColumns.length} columns detected.`,
            "success"
        );


        addLog(
            "Preprocessing analysis completed.",
            "success"
        );


        console.log(
            "Preprocessing dataset:",
            preprocessingData
        );


    }
    catch (error) {

        console.error(
            "Dataset loading error:",
            error
        );


        preprocessingLoaded = false;

        preprocessingData = [];

        preprocessingColumns = [];


        setStatus(
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
   ========================================================= */

async function loadHealthcareCSV() {

    /*
       preprocessing.html is inside:

       frontend/pages/preprocessing.html

       CSV is inside:

       frontend/data/healthcare_doctor_visits.csv

       Therefore:

       ../data/healthcare_doctor_visits.csv
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
                    `CSV request failed: ${response.status}`,
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
        "Healthcare CSV was not found in frontend/data/healthcare_doctor_visits.csv"
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
   DATASET SUMMARY
   ========================================================= */

function updateDatasetSummary() {

    const rowCount =
        preprocessingData.length;

    const columnCount =
        preprocessingColumns.length;


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
        rowCount.toLocaleString("en-IN")
    );

    setText(
        "datasetColumnCount",
        columnCount.toLocaleString("en-IN")
    );


    displayColumns(
        preprocessingColumns
    );

}


/* =========================================================
   PREPROCESSING ANALYSIS
   ========================================================= */

function updatePreprocessingAnalysis() {

    if (
        !preprocessingLoaded
    ) {

        return;

    }


    const missingValues =
        calculateMissingValues();


    const duplicateRows =
        calculateDuplicateRows();


    const numericColumns =
        getNumericColumns();


    const categoricalColumns =
        getCategoricalColumns();


    setNumber(
        "missingValues",
        missingValues
    );


    setNumber(
        "duplicateRows",
        duplicateRows
    );


    setNumber(
        "numericColumns",
        numericColumns.length
    );


    setNumber(
        "categoricalColumns",
        categoricalColumns.length
    );


    updateAnalysisText(
        missingValues,
        duplicateRows,
        numericColumns,
        categoricalColumns
    );

}


/* =========================================================
   MISSING VALUES
   ========================================================= */

function calculateMissingValues() {

    let count = 0;


    preprocessingData.forEach(
        function (row) {

            preprocessingColumns.forEach(
                function (column) {

                    const value =
                        row[column];


                    if (
                        value === null ||
                        value === undefined ||
                        String(value).trim() === "" ||
                        String(value).trim().toLowerCase() === "null" ||
                        String(value).trim().toLowerCase() === "na" ||
                        String(value).trim().toLowerCase() === "n/a"
                    ) {

                        count++;

                    }

                }
            );

        }
    );


    return count;

}


/* =========================================================
   DUPLICATES
   ========================================================= */

function calculateDuplicateRows() {

    const seen =
        new Set();

    let duplicates = 0;


    preprocessingData.forEach(
        function (row) {

            const key =
                preprocessingColumns
                    .map(
                        function (column) {
                            return String(
                                row[column] ?? ""
                            ).trim();
                        }
                    )
                    .join("|");


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


    return duplicates;

}


/* =========================================================
   NUMERIC COLUMNS
   ========================================================= */

function getNumericColumns() {

    return preprocessingColumns.filter(
        function (column) {

            let numericCount = 0;

            let totalCount = 0;


            preprocessingData.forEach(
                function (row) {

                    const value =
                        String(
                            row[column] ?? ""
                        ).trim();


                    if (!value) {
                        return;
                    }


                    totalCount++;


                    const number =
                        Number(
                            value.replace(/,/g, "")
                        );


                    if (
                        Number.isFinite(number)
                    ) {

                        numericCount++;

                    }

                }
            );


            return (
                totalCount > 0 &&
                numericCount / totalCount >= 0.8
            );

        }
    );

}


/* =========================================================
   CATEGORICAL COLUMNS
   ========================================================= */

function getCategoricalColumns() {

    const numericColumns =
        getNumericColumns();


    return preprocessingColumns.filter(
        function (column) {

            return !numericColumns.includes(
                column
            );

        }
    );

}


/* =========================================================
   ANALYSIS TEXT
   ========================================================= */

function updateAnalysisText(
    missingValues,
    duplicateRows,
    numericColumns,
    categoricalColumns
) {

    const containers = [

        "preprocessingSummary",

        "analysisSummary",

        "preprocessingResult",

        "datasetSummary"

    ];


    containers.forEach(
        function (id) {

            const element =
                document.getElementById(id);


            if (!element) {
                return;
            }


            element.textContent =
                `The healthcare dataset contains ` +
                `${preprocessingData.length.toLocaleString("en-IN")} records and ` +
                `${preprocessingColumns.length} columns. ` +
                `${missingValues.toLocaleString("en-IN")} missing values and ` +
                `${duplicateRows.toLocaleString("en-IN")} duplicate rows were detected. ` +
                `${numericColumns.length} numeric columns and ` +
                `${categoricalColumns.length} categorical columns were identified.`;

        }
    );

}


/* =========================================================
   DISPLAY COLUMNS
   ========================================================= */

function displayColumns(
    columns
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
        !container
    ) {

        return;

    }


    container.innerHTML = "";


    columns.forEach(
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
   SET NUMBER
   ========================================================= */

function setNumber(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.textContent =
        Number(
            value || 0
        ).toLocaleString(
            "en-IN"
        );

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.textContent =
        value;

}


/* =========================================================
   STATUS
   ========================================================= */

function setStatus(
    state,
    message
) {

    const dot =
        document.getElementById(
            "statusDot"
        );


    const text =
        document.getElementById(
            "statusText"
        );


    if (dot) {

        dot.className =
            "status-dot";


        if (
            state === "loading"
        ) {

            dot.classList.add(
                "loading"
            );

        }


        if (
            state === "loaded"
        ) {

            dot.classList.add(
                "loaded"
            );

        }


        if (
            state === "error"
        ) {

            dot.classList.add(
                "error"
            );

        }

    }


    if (text) {

        text.textContent =
            message;

    }

}


/* =========================================================
   LOG
   ========================================================= */

function clearLog() {

    const log =
        document.getElementById(
            "preprocessingLog"
        ) ||
        document.getElementById(
            "dataUnderstandingLog"
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
            "preprocessingLog"
        ) ||
        document.getElementById(
            "dataUnderstandingLog"
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
   AI ROBOT / CHAT
   ========================================================= */

function initializePreprocessingAI() {

    const robot =
        document.getElementById(
            "aiRobotButton"
        );


    const chat =
        document.getElementById(
            "aiChatWindow"
        );


    const close =
        document.getElementById(
            "aiCloseButton"
        );


    const form =
        document.getElementById(
            "aiChatForm"
        );


    const input =
        document.getElementById(
            "aiChatInput"
        );


    if (
        !robot ||
        !chat ||
        !close
    ) {

        console.warn(
            "AI robot elements were not found."
        );

        return;

    }


    robot.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            chat.classList.add(
                "active"
            );


            if (input) {

                setTimeout(
                    function () {
                        input.focus();
                    },
                    150
                );

            }

        }
    );


    close.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            chat.classList.remove(
                "active"
            );

        }
    );


    if (
        form &&
        input
    ) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const question =
                    input.value.trim();


                if (!question) {
                    return;
                }


                addUserChatMessage(
                    question
                );


                input.value = "";


                setTimeout(
                    function () {

                        addAIChatMessage(
                            getPreprocessingAIResponse(
                                question
                            )
                        );

                    },
                    300
                );

            }
        );

    }


    const questions =
        document.querySelectorAll(
            ".ai-question"
        );


    questions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const question =
                        button.dataset.question ||
                        button.textContent.trim();


                    if (!question) {
                        return;
                    }


                    addUserChatMessage(
                        question
                    );


                    setTimeout(
                        function () {

                            addAIChatMessage(
                                getPreprocessingAIResponse(
                                    question
                                )
                            );

                        },
                        300
                    );

                }
            );

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                chat.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   USER CHAT MESSAGE
   ========================================================= */

function addUserChatMessage(
    message
) {

    const body =
        document.getElementById(
            "aiChatBody"
        );


    if (!body) {
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


    body.appendChild(
        wrapper
    );


    scrollChat();

}


/* =========================================================
   AI CHAT MESSAGE
   ========================================================= */

function addAIChatMessage(
    message
) {

    const body =
        document.getElementById(
            "aiChatBody"
        );


    if (!body) {
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


    body.appendChild(
        wrapper
    );


    scrollChat();

}


/* =========================================================
   AI RESPONSE
   ========================================================= */

function getPreprocessingAIResponse(
    question
) {

    const q =
        question.toLowerCase();


    if (
        q.includes("dataset") ||
        q.includes("records") ||
        q.includes("rows")
    ) {

        if (
            preprocessingLoaded
        ) {

            return (
                `The healthcare dataset contains ` +
                `${preprocessingData.length.toLocaleString("en-IN")} records and ` +
                `${preprocessingColumns.length} columns.`
            );

        }


        return (
            "The healthcare dataset is not currently loaded."
        );

    }


    if (
        q.includes("missing")
    ) {

        if (
            preprocessingLoaded
        ) {

            const missing =
                calculateMissingValues();


            return (
                `The preprocessing check detected ` +
                `${missing.toLocaleString("en-IN")} missing values.`
            );

        }


        return (
            "The dataset is not currently loaded."
        );

    }


    if (
        q.includes("duplicate")
    ) {

        if (
            preprocessingLoaded
        ) {

            const duplicates =
                calculateDuplicateRows();


            return (
                `The preprocessing check detected ` +
                `${duplicates.toLocaleString("en-IN")} duplicate rows.`
            );

        }


        return (
            "The dataset is not currently loaded."
        );

    }


    if (
        q.includes("column")
    ) {

        return (
            `The healthcare dataset contains ` +
            `${preprocessingColumns.length} columns.`
        );

    }


    if (
        q.includes("preprocess") ||
        q.includes("clean")
    ) {

        return (
            "Preprocessing checks the healthcare dataset for missing values, duplicate rows, numeric fields, categorical fields and data-quality issues before analysis."
        );

    }


    return (
        "I can explain the healthcare dataset, missing values, duplicate records, columns and preprocessing results."
    );

}


/* =========================================================
   CHAT SCROLL
   ========================================================= */

function scrollChat() {

    const body =
        document.getElementById(
            "aiChatBody"
        );


    if (!body) {
        return;
    }


    body.scrollTo({

        top:
            body.scrollHeight,

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

        const chat =
            document.getElementById(
                "aiChatWindow"
            );


        const robot =
            document.getElementById(
                "aiRobotButton"
            );


        if (
            !chat ||
            !robot
        ) {

            return;

        }


        if (
            !chat.contains(
                event.target
            ) &&
            !robot.contains(
                event.target
            )
        ) {

            chat.classList.remove(
                "active"
            );

        }

    }
);