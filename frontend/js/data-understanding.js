/* =========================================================
   HEALTHCARE ANALYTICS
   DATA UNDERSTANDING JAVASCRIPT
   ========================================================= */


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let dataset = [];

let columns = [];

let numericColumns = [];

let categoricalColumns = [];

let datasetLoaded = false;


/* =========================================================
   CSV FILE PATH
   ========================================================= */

/* =========================================================
   BACKEND API
   ========================================================= */

const API_BASE_URL =
    "https://healthcare-analytics-doctor-visits.vercel.app/api";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeNavigation();

        initializeDataset();

        initializeChatbot();

        initializeExploreButton();

    }
);


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileNavigation =
        document.getElementById("mobileNavigation");


    if (!menuToggle || !mobileNavigation) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileNavigation.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    const mobileLinks =
        mobileNavigation.querySelectorAll("a");


    mobileLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    mobileNavigation.classList.remove(
                        "open"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================================
   EXPLORE BUTTON
   ========================================================= */

function initializeExploreButton() {

    const button =
        document.getElementById(
            "exploreDatasetButton"
        );

    const target =
        document.getElementById(
            "datasetOverview"
        );


    if (!button || !target) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}
/* =========================================================
   DATASET INITIALIZATION FROM BACKEND API
   ========================================================= */

async function initializeDataset() {

    updateStatus(
        "loading",
        "Loading healthcare dataset from backend..."
    );

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/dataset`
            );

        if (!response.ok) {

            throw new Error(
                `Backend API returned ${response.status}`
            );

        }

        const result =
            await response.json();

        /*
         * Expected backend response:
         *
         * {
         *   "data": [
         *      {...},
         *      {...}
         *   ]
         * }
         */

        if (
            !result ||
            !Array.isArray(result.data) ||
            result.data.length === 0
        ) {

            throw new Error(
                "Backend returned an empty dataset."
            );

        }

        dataset =
            result.data;

        columns =
            Object.keys(dataset[0]);

        datasetLoaded =
            true;


        /* ===============================
           ANALYZE DATASET
           =============================== */

        classifyColumns();

        renderDatasetMetrics();

        renderFeatureLists();

        renderPreviewTable();

        populateFeatureSelector();

        renderQualityMetrics();


        /* ===============================
           SUCCESS STATUS
           =============================== */

        updateStatus(
            "loaded",
            "Healthcare dataset loaded successfully from backend"
        );

        console.log(
            "Healthcare dataset loaded:",
            dataset
        );

    }

    catch (error) {

        console.error(
            "Backend dataset loading error:",
            error
        );

        datasetLoaded =
            false;

        updateStatus(
            "error",
            "Unable to load healthcare dataset from backend"
        );

        showDatasetError(error);

    }

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


        if (
            character === '"' &&
            insideQuotes &&
            nextCharacter === '"'
        ) {

            currentValue += '"';

            i++;

            continue;
        }


        if (character === '"') {

            insideQuotes =
                !insideQuotes;

            continue;
        }


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
                    value => value !== ""
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


    if (
        currentValue !== "" ||
        currentRow.length > 0
    ) {

        currentRow.push(
            currentValue.trim()
        );

        if (
            currentRow.some(
                value => value !== ""
            )
        ) {

            rows.push(
                currentRow
            );

        }

    }


    if (!rows.length) {

        return {
            headers: [],
            rows: []
        };

    }


    const headers =
        rows[0].map(
            header =>
                header
                    .trim()
                    .replace(/^"|"$/g, "")
        );


    const dataRows =
        rows
            .slice(1)
            .map(
                row => {

                    const object = {};

                    headers.forEach(
                        (header, index) => {

                            object[header] =
                                row[index] !== undefined
                                    ? row[index]
                                    : "";

                        }
                    );

                    return object;

                }
            );


    return {
        headers,
        rows: dataRows
    };

}


/* =========================================================
   CLASSIFY COLUMNS
   ========================================================= */

function classifyColumns() {

    numericColumns = [];

    categoricalColumns = [];


    columns.forEach(
        column => {

            const values =
                dataset
                    .map(
                        row =>
                            String(
                                row[column] ?? ""
                            ).trim()
                    )
                    .filter(
                        value =>
                            value !== ""
                    );


            if (!values.length) {

                categoricalColumns.push(
                    column
                );

                return;

            }


            const numericCount =
                values.filter(
                    value =>
                        isNumeric(value)
                ).length;


            const numericRatio =
                numericCount /
                values.length;


            /*
             * A column is treated as numerical when
             * almost all non-empty values are numbers.
             */

            if (numericRatio >= 0.90) {

                numericColumns.push(
                    column
                );

            }
            else {

                categoricalColumns.push(
                    column
                );

            }

        }
    );

}


/* =========================================================
   NUMERIC TEST
   ========================================================= */

function isNumeric(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return false;

    }


    const normalized =
        String(value)
            .replace(/,/g, "")
            .trim();


    return (
        normalized !== "" &&
        !isNaN(normalized) &&
        isFinite(Number(normalized))
    );

}


/* =========================================================
   DATASET METRICS
   ========================================================= */

function renderDatasetMetrics() {

    setText(
        "totalRows",
        formatNumber(dataset.length)
    );


    setText(
        "totalColumns",
        formatNumber(columns.length)
    );


    setText(
        "numericColumns",
        formatNumber(numericColumns.length)
    );


    setText(
        "categoricalColumns",
        formatNumber(categoricalColumns.length)
    );


    setText(
        "numericCountBadge",
        numericColumns.length
    );


    setText(
        "categoricalCountBadge",
        categoricalColumns.length
    );

}


/* =========================================================
   FEATURE LISTS
   ========================================================= */

function renderFeatureLists() {

    renderFeatureGroup(
        "numericFeatureList",
        numericColumns,
        "NUMERIC"
    );


    renderFeatureGroup(
        "categoricalFeatureList",
        categoricalColumns,
        "CATEGORICAL"
    );

}


/* =========================================================
   FEATURE GROUP RENDER
   ========================================================= */

function renderFeatureGroup(
    elementId,
    featureArray,
    type
) {

    const container =
        document.getElementById(
            elementId
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!featureArray.length) {

        container.innerHTML = `
            <div class="loading-item">
                No features detected.
            </div>
        `;

        return;

    }


    featureArray.forEach(
        column => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "feature-item";


            item.innerHTML = `

                <span
                    class="feature-name"
                    title="${escapeHTML(column)}"
                >
                    ${escapeHTML(column)}
                </span>

                <span class="feature-type">
                    ${type}
                </span>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   PREVIEW TABLE
   ========================================================= */

function renderPreviewTable() {

    const head =
        document.getElementById(
            "previewHead"
        );

    const body =
        document.getElementById(
            "previewBody"
        );

    const info =
        document.getElementById(
            "previewInfo"
        );


    if (!head || !body) {
        return;
    }


    head.innerHTML = "";

    body.innerHTML = "";


    /*
     * Display up to 10 columns so that the
     * preview remains manageable.
     */

    const previewColumns =
        columns.slice(0, 10);


    const headerRow =
        document.createElement("tr");


    previewColumns.forEach(
        column => {

            const th =
                document.createElement("th");

            th.textContent =
                column;

            headerRow.appendChild(
                th
            );

        }
    );


    head.appendChild(
        headerRow
    );


    const previewRows =
        dataset.slice(0, 8);


    previewRows.forEach(
        row => {

            const tr =
                document.createElement("tr");


            previewColumns.forEach(
                column => {

                    const td =
                        document.createElement("td");

                    const value =
                        row[column] ?? "";


                    td.textContent =
                        value === ""
                            ? "—"
                            : value;


                    tr.appendChild(
                        td
                    );

                }
            );


            body.appendChild(
                tr
            );

        }
    );


    if (info) {

        info.textContent =
            `Showing ${previewRows.length} of ${formatNumber(dataset.length)} records • ${previewColumns.length} of ${columns.length} columns`;

    }

}


/* =========================================================
   FEATURE SELECTOR
   ========================================================= */

function populateFeatureSelector() {

    const select =
        document.getElementById(
            "featureSelect"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select a dataset feature
        </option>
    `;


    columns.forEach(
        column => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                column;

            option.textContent =
                column;

            select.appendChild(
                option
            );

        }
    );


    select.addEventListener(
        "change",
        event => {

            const selected =
                event.target.value;


            if (!selected) {

                showFeaturePlaceholder();

                return;

            }


            renderFeatureDetails(
                selected
            );

        }
    );

}


/* =========================================================
   FEATURE DETAILS
   ========================================================= */

function renderFeatureDetails(
    column
) {

    const container =
        document.getElementById(
            "featureDetail"
        );


    if (!container) {
        return;
    }


    const values =
        dataset
            .map(
                row =>
                    String(
                        row[column] ?? ""
                    ).trim()
            )
            .filter(
                value =>
                    value !== ""
            );


    const uniqueValues =
        [...new Set(values)];


    const missing =
        dataset.length -
        values.length;


    const type =
        numericColumns.includes(column)
            ? "Numerical"
            : "Categorical";


    const sampleValues =
        uniqueValues.slice(0, 10);


    container.innerHTML = `

        <div class="feature-detail-placeholder">

            <span>
                FEATURE DETAILS
            </span>

            <h3>
                ${escapeHTML(column)}
            </h3>

            <p>
                Basic information about the selected
                dataset variable.
            </p>

        </div>


        <div class="detail-grid">

            <div class="detail-box">

                <span>
                    DATA TYPE
                </span>

                <strong>
                    ${type}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    UNIQUE VALUES
                </span>

                <strong>
                    ${formatNumber(uniqueValues.length)}
                </strong>

            </div>


            <div class="detail-box">

                <span>
                    MISSING VALUES
                </span>

                <strong>
                    ${formatNumber(missing)}
                </strong>

            </div>

        </div>


        <div class="sample-values">

            ${sampleValues
                .map(
                    value => `
                        <span
                            class="sample-value"
                            title="${escapeHTML(value)}"
                        >
                            ${escapeHTML(value)}
                        </span>
                    `
                )
                .join("")
            }

        </div>

    `;

}


/* =========================================================
   FEATURE PLACEHOLDER
   ========================================================= */

function showFeaturePlaceholder() {

    const container =
        document.getElementById(
            "featureDetail"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="feature-detail-placeholder">

            <span>
                SELECT
            </span>

            <h3>
                Explore a Dataset Feature
            </h3>

            <p>
                Choose a variable from the dropdown to
                view its type, unique values and sample data.
            </p>

        </div>

    `;

}


/* =========================================================
   DATA QUALITY
   ========================================================= */

function renderQualityMetrics() {

    const missing =
        countMissingValues();


    const duplicates =
        countDuplicateRows();


    const uniqueCategorical =
        countCategoricalUniqueValues();


    setText(
        "missingValues",
        formatNumber(missing)
    );


    setText(
        "duplicateRows",
        formatNumber(duplicates)
    );


    setText(
        "uniqueValues",
        formatNumber(uniqueCategorical)
    );


    const qualityStatus =
        document.getElementById(
            "qualityStatus"
        );


    const qualityDescription =
        document.getElementById(
            "qualityDescription"
        );


    if (
        qualityStatus &&
        qualityDescription
    ) {

        if (
            missing === 0 &&
            duplicates === 0
        ) {

            qualityStatus.textContent =
                "READY";

            qualityDescription.textContent =
                "No missing cells or duplicate rows detected.";

        }
        else {

            qualityStatus.textContent =
                "REVIEW";

            qualityDescription.textContent =
                "Potential data quality issues require preprocessing.";

        }

    }

}


/* =========================================================
   MISSING VALUES
   ========================================================= */

function countMissingValues() {

    let count = 0;


    dataset.forEach(
        row => {

            columns.forEach(
                column => {

                    const value =
                        row[column];


                    if (
                        value === null ||
                        value === undefined ||
                        String(value).trim() === ""
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
   DUPLICATE ROWS
   ========================================================= */

function countDuplicateRows() {

    const seen =
        new Set();

    let duplicates = 0;


    dataset.forEach(
        row => {

            const signature =
                columns
                    .map(
                        column =>
                            String(
                                row[column] ?? ""
                            )
                    )
                    .join("|");


            if (
                seen.has(signature)
            ) {

                duplicates++;

            }
            else {

                seen.add(signature);

            }

        }
    );


    return duplicates;

}


/* =========================================================
   CATEGORICAL UNIQUE VALUES
   ========================================================= */

function countCategoricalUniqueValues() {

    let total = 0;


    categoricalColumns.forEach(
        column => {

            const values =
                new Set(
                    dataset
                        .map(
                            row =>
                                String(
                                    row[column] ?? ""
                                ).trim()
                        )
                        .filter(
                            value =>
                                value !== ""
                        )
                );


            total += values.size;

        }
    );


    return total;

}


/* =========================================================
   STATUS
   ========================================================= */

function updateStatus(
    state,
    message
) {

    const dot =
        document.getElementById(
            "statusDot"
        );

    const text =
        document.getElementById(
            "dataStatusText"
        );


    if (dot) {

        dot.classList.remove(
            "loaded",
            "error"
        );


        if (state === "loaded") {

            dot.classList.add(
                "loaded"
            );

        }


        if (state === "error") {

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
   DATA ERROR
   ========================================================= */

function showDatasetError(
    error
) {

    const numericList =
        document.getElementById(
            "numericFeatureList"
        );

    const categoricalList =
        document.getElementById(
            "categoricalFeatureList"
        );


    const errorMessage = `
        <div class="loading-item">
            Dataset could not be loaded.
            <br><br>
            Make sure the project is opened through
            Live Server and the CSV exists in:
            <br><br>
            <strong>
                /data/healthcare_doctor_visits.csv
            </strong>
        </div>
    `;


    if (numericList) {

        numericList.innerHTML =
            errorMessage;

    }


    if (categoricalList) {

        categoricalList.innerHTML =
            errorMessage;

    }


    console.error(
        error
    );

}


/* =========================================================
   CHATBOT
   ========================================================= */

function initializeChatbot() {

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

    const sendButton =
        document.getElementById(
            "aiSendButton"
        );

    const input =
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


    robotButton.addEventListener(
        "click",
        () => {

            chatWindow.classList.toggle(
                "active"
            );

        }
    );


    closeButton.addEventListener(
        "click",
        () => {

            chatWindow.classList.remove(
                "active"
            );

        }
    );


    if (sendButton && input) {

        sendButton.addEventListener(
            "click",
            () => {

                sendChatMessage();

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    sendChatMessage();

                }

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
                () => {

                    const question =
                        button.dataset.question;

                    addUserMessage(
                        question
                    );


                    setTimeout(
                        () => {

                            const answer =
                                generateAIResponse(
                                    question
                                );

                            addAIMessage(
                                answer
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
   SEND CHAT MESSAGE
   ========================================================= */

function sendChatMessage() {

    const input =
        document.getElementById(
            "aiChatInput"
        );


    if (!input) {
        return;
    }


    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    addUserMessage(
        message
    );


    input.value = "";


    setTimeout(
        () => {

            const response =
                generateAIResponse(
                    message
                );


            addAIMessage(
                response
            );

        },
        350
    );

}


/* =========================================================
   USER MESSAGE
   ========================================================= */

function addUserMessage(
    message
) {

    const body =
        document.getElementById(
            "aiChatBody"
        );


    if (!body) {
        return;
    }


    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        "ai-message ai-message-user";


    messageElement.innerHTML = `

        <div class="ai-user-message-content">
            ${escapeHTML(message)}
        </div>

    `;


    body.appendChild(
        messageElement
    );


    scrollChatToBottom();

}


/* =========================================================
   AI MESSAGE
   ========================================================= */

function addAIMessage(
    message
) {

    const body =
        document.getElementById(
            "aiChatBody"
        );


    if (!body) {
        return;
    }


    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        "ai-message";


    messageElement.innerHTML = `

        <div class="ai-avatar-small">
            AI
        </div>

        <div class="ai-message-content">
            <p>
                ${message}
            </p>
        </div>

    `;


    body.appendChild(
        messageElement
    );


    scrollChatToBottom();

}


/* =========================================================
   AI RESPONSE
   ========================================================= */

function generateAIResponse(
    question
) {

    const lowerQuestion =
        question.toLowerCase();


    if (
        lowerQuestion.includes(
            "how many"
        ) &&
        (
            lowerQuestion.includes(
                "record"
            ) ||
            lowerQuestion.includes(
                "row"
            )
        )
    ) {

        return datasetLoaded
            ? `The dataset contains <strong>${formatNumber(dataset.length)}</strong> records.`
            : "The dataset is not currently loaded.";

    }


    if (
        lowerQuestion.includes(
            "numerical"
        )
    ) {

        if (!datasetLoaded) {

            return "The dataset is not currently loaded.";

        }


        return `
            The dataset contains
            <strong>${numericColumns.length}</strong>
            numerical features:
            <br><br>
            ${numericColumns
                .slice(0, 8)
                .map(
                    column =>
                        `• ${escapeHTML(column)}`
                )
                .join("<br>")
            }
            ${
                numericColumns.length > 8
                    ? "<br>• And more..."
                    : ""
            }
        `;

    }


    if (
        lowerQuestion.includes(
            "categorical"
        )
    ) {

        if (!datasetLoaded) {

            return "The dataset is not currently loaded.";

        }


        return `
            The dataset contains
            <strong>${categoricalColumns.length}</strong>
            categorical features.
            <br><br>
            ${categoricalColumns
                .slice(0, 8)
                .map(
                    column =>
                        `• ${escapeHTML(column)}`
                )
                .join("<br>")
            }
            ${
                categoricalColumns.length > 8
                    ? "<br>• And more..."
                    : ""
            }
        `;

    }


    if (
        lowerQuestion.includes(
            "missing"
        )
    ) {

        if (!datasetLoaded) {

            return "The dataset is not currently loaded.";

        }


        const missing =
            countMissingValues();


        if (missing === 0) {

            return `
                No missing cells were detected
                in the currently loaded dataset.
            `;

        }


        return `
            The dataset contains
            <strong>${formatNumber(missing)}</strong>
            missing cells.
            These should be reviewed during preprocessing.
        `;

    }


    if (
        lowerQuestion.includes(
            "after"
        ) ||
        lowerQuestion.includes(
            "next"
        ) ||
        lowerQuestion.includes(
            "preprocess"
        )
    ) {

        return `
            After data understanding, the next stage is
            <strong>Preprocessing</strong>. This stage can
            include checking missing values, duplicates,
            data types, inconsistent values and preparing
            variables for analysis.
        `;

    }


    if (
        lowerQuestion.includes(
            "column"
        ) ||
        lowerQuestion.includes(
            "feature"
        ) ||
        lowerQuestion.includes(
            "variable"
        )
    ) {

        return `
            The dataset contains
            <strong>${formatNumber(columns.length)}</strong>
            features. You can use the Feature Exploration
            section on this page to inspect individual
            variables.
        `;

    }


    if (
        lowerQuestion.includes(
            "duplicate"
        )
    ) {

        const duplicates =
            datasetLoaded
                ? countDuplicateRows()
                : 0;


        return `
            The initial dataset check found
            <strong>${formatNumber(duplicates)}</strong>
            duplicate rows.
        `;

    }


    return `
        I can help you explore the healthcare dataset.
        Try asking about the number of records, numerical
        features, categorical features, missing values,
        duplicate rows or preprocessing.
    `;

}


/* =========================================================
   CHAT SCROLL
   ========================================================= */

function scrollChatToBottom() {

    const body =
        document.getElementById(
            "aiChatBody"
        );


    if (!body) {
        return;
    }


    body.scrollTo({
        top: body.scrollHeight,
        behavior: "smooth"
    });

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


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   NUMBER FORMAT
   ========================================================= */

function formatNumber(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}