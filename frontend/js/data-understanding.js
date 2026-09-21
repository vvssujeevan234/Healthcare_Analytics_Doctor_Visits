/* ============================================================
   HEALTHCARE ANALYTICS
   DATA UNDERSTANDING PAGE
   ============================================================ */

"use strict";

/* ============================================================
   GLOBAL DATA
   ============================================================ */

let healthcareData = [];
let columns = [];

let numericFeatures = [];
let categoricalFeatures = [];

let datasetLoaded = false;


/* ============================================================
   CSV FILE LOCATIONS
   ============================================================ */

const CSV_PATHS = [
    "../data/healthcare_doctor_visits.csv",
    "../../data/healthcare_doctor_visits.csv",
    "/data/healthcare_doctor_visits.csv",
    "./data/healthcare_doctor_visits.csv"
];


/* ============================================================
   DOM READY
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initializePage();

});


/* ============================================================
   INITIALIZE PAGE
   ============================================================ */

async function initializePage() {

    setupExploreButton();

    setupQuestionCards();

    setupFeatureSelector();

    setupChatbotSupport();

    await loadHealthcareDataset();

}


/* ============================================================
   LOAD DATASET
   ============================================================ */

async function loadHealthcareDataset() {

    setStatus("Loading healthcare dataset...", false);

    let csvText = null;

    for (const path of CSV_PATHS) {

        try {

            const response = await fetch(path, {
                cache: "no-store"
            });

            if (response.ok) {

                csvText = await response.text();

                console.log("Healthcare CSV loaded from:", path);

                break;

            }

        } catch (error) {

            console.log("Unable to load:", path);

        }

    }


    if (!csvText) {

        console.error("Healthcare CSV could not be loaded.");

        setStatus(
            "Unable to load healthcare dataset. Check the CSV path.",
            true
        );

        showDatasetError();

        return;

    }


    try {

        healthcareData = parseCSV(csvText);

        if (!healthcareData.length) {

            throw new Error("CSV contains no records.");

        }


        columns = Object.keys(healthcareData[0]);


        console.log("Columns:", columns);

        console.log("Rows:", healthcareData.length);


        classifyFeatures();

        updateDatasetSnapshot();

        updateStructureSection();

        updateQualitySection();

        updatePreviewTable();

        populateFeatureSelector();

        updateQuestionAnswers();

        datasetLoaded = true;

        setStatus(
            `Dataset loaded successfully — ${formatNumber(healthcareData.length)} records available.`,
            false
        );


    } catch (error) {

        console.error("Dataset processing error:", error);

        setStatus(
            "Dataset was found but could not be processed.",
            true
        );

    }

}


/* ============================================================
   CSV PARSER
   Handles quoted commas and quoted values
   ============================================================ */

function parseCSV(text) {

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes = false;


    for (let i = 0; i < text.length; i++) {

        const character = text[i];

        const nextCharacter = text[i + 1];


        if (character === '"' && insideQuotes && nextCharacter === '"') {

            value += '"';

            i++;

            continue;

        }


        if (character === '"') {

            insideQuotes = !insideQuotes;

            continue;

        }


        if (character === "," && !insideQuotes) {

            row.push(value);

            value = "";

            continue;

        }


        if (
            (character === "\n" || character === "\r") &&
            !insideQuotes
        ) {

            if (character === "\r" && nextCharacter === "\n") {

                i++;

            }


            row.push(value);

            value = "";


            if (row.some(cell => cell.trim() !== "")) {

                rows.push(row);

            }


            row = [];

            continue;

        }


        value += character;

    }


    if (value !== "" || row.length > 0) {

        row.push(value);

        if (row.some(cell => cell.trim() !== "")) {

            rows.push(row);

        }

    }


    if (rows.length === 0) {

        return [];

    }


    const headers = rows[0].map(header =>
        header
            .replace(/^\uFEFF/, "")
            .trim()
    );


    const data = [];


    for (let i = 1; i < rows.length; i++) {

        const currentRow = rows[i];

        const record = {};


        headers.forEach((header, index) => {

            record[header] =
                currentRow[index] !== undefined
                    ? currentRow[index].trim()
                    : "";

        });


        data.push(record);

    }


    return data;

}


/* ============================================================
   CLASSIFY NUMERICAL / CATEGORICAL FEATURES
   ============================================================ */

function classifyFeatures() {

    numericFeatures = [];

    categoricalFeatures = [];


    columns.forEach(column => {

        const values = healthcareData
            .map(row => row[column])
            .filter(value =>
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            );


        if (values.length === 0) {

            categoricalFeatures.push(column);

            return;

        }


        const numericCount = values.filter(value => {

            const cleaned = String(value)
                .replace(/,/g, "")
                .trim();

            return (
                cleaned !== "" &&
                !isNaN(Number(cleaned))
            );

        }).length;


        const numericRatio =
            numericCount / values.length;


        /*
         * If at least 90% of non-empty values are numeric,
         * classify as numerical.
         */

        if (numericRatio >= 0.90) {

            numericFeatures.push(column);

        } else {

            categoricalFeatures.push(column);

        }

    });


    console.log("Numerical features:", numericFeatures);

    console.log("Categorical features:", categoricalFeatures);

}


/* ============================================================
   UPDATE DATASET SNAPSHOT
   ============================================================ */

function updateDatasetSnapshot() {

    setText(
        "totalRows",
        formatNumber(healthcareData.length)
    );


    setText(
        "totalColumns",
        columns.length
    );


    setText(
        "numericColumns",
        numericFeatures.length
    );


    setText(
        "categoricalColumns",
        categoricalFeatures.length
    );

}


/* ============================================================
   UPDATE DATA STRUCTURE
   ============================================================ */

function updateStructureSection() {

    const numericList =
        document.getElementById("numericFeatureList");

    const categoricalList =
        document.getElementById("categoricalFeatureList");


    const numericBadge =
        document.getElementById("numericCountBadge");

    const categoricalBadge =
        document.getElementById("categoricalCountBadge");


    if (numericBadge) {

        numericBadge.textContent =
            numericFeatures.length;

    }


    if (categoricalBadge) {

        categoricalBadge.textContent =
            categoricalFeatures.length;

    }


    if (numericList) {

        numericList.innerHTML = "";


        if (numericFeatures.length === 0) {

            numericList.innerHTML = `
                <div class="loading-item">
                    No numerical features detected.
                </div>
            `;

        } else {

            numericFeatures.forEach((feature, index) => {

                numericList.appendChild(
                    createFeatureItem(
                        feature,
                        "Numerical",
                        index + 1
                    )
                );

            });

        }

    }


    if (categoricalList) {

        categoricalList.innerHTML = "";


        if (categoricalFeatures.length === 0) {

            categoricalList.innerHTML = `
                <div class="loading-item">
                    No categorical features detected.
                </div>
            `;

        } else {

            categoricalFeatures.forEach((feature, index) => {

                categoricalList.appendChild(
                    createFeatureItem(
                        feature,
                        "Categorical",
                        index + 1
                    )
                );

            });

        }

    }

}


/* ============================================================
   CREATE FEATURE ITEM
   ============================================================ */

function createFeatureItem(
    feature,
    type,
    number
) {

    const item = document.createElement("div");

    item.className = "feature-item";


    const values = healthcareData
        .map(row => row[feature])
        .filter(value =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        );


    const uniqueCount =
        new Set(values.map(value => String(value))).size;


    item.innerHTML = `

        <div class="feature-item-number">
            ${number}
        </div>

        <div class="feature-item-content">

            <strong>
                ${escapeHTML(feature)}
            </strong>

            <small>
                ${type} • ${formatNumber(uniqueCount)} unique values
            </small>

        </div>

        <div class="feature-item-arrow">
            →
        </div>

    `;


    item.addEventListener("click", () => {

        selectFeature(feature);

    });


    return item;

}


/* ============================================================
   FEATURE SELECTOR
   ============================================================ */

function setupFeatureSelector() {

    const select =
        document.getElementById("featureSelect");


    if (!select) {

        return;

    }


    select.addEventListener("change", function () {

        const selectedFeature = this.value;


        if (!selectedFeature) {

            showFeaturePlaceholder();

            return;

        }


        selectFeature(selectedFeature);

    });

}


/* ============================================================
   POPULATE FEATURE SELECTOR
   ============================================================ */

function populateFeatureSelector() {

    const select =
        document.getElementById("featureSelect");


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select a dataset feature
        </option>

    `;


    columns.forEach(column => {

        const option =
            document.createElement("option");


        option.value = column;

        option.textContent = column;


        select.appendChild(option);

    });

}


/* ============================================================
   SELECT FEATURE
   ============================================================ */

function selectFeature(feature) {

    const select =
        document.getElementById("featureSelect");


    if (select) {

        select.value = feature;

    }


    const detail =
        document.getElementById("featureDetail");


    if (!detail) {

        return;

    }


    const values = healthcareData
        .map(row => row[feature])
        .filter(value =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        );


    const uniqueValues =
        [...new Set(
            values.map(value => String(value))
        )];


    const isNumeric =
        numericFeatures.includes(feature);


    const sampleValues =
        uniqueValues.slice(0, 10);


    detail.innerHTML = `

        <div class="feature-detail-content">

            <div class="feature-detail-header">

                <div>

                    <span class="section-kicker">
                        SELECTED FEATURE
                    </span>

                    <h3>
                        ${escapeHTML(feature)}
                    </h3>

                </div>

                <div class="feature-type-badge">
                    ${isNumeric ? "NUMERICAL" : "CATEGORICAL"}
                </div>

            </div>


            <div class="feature-stat-grid">

                <div class="feature-stat">

                    <span>TYPE</span>

                    <strong>
                        ${isNumeric ? "Numerical" : "Categorical"}
                    </strong>

                </div>


                <div class="feature-stat">

                    <span>NON-EMPTY VALUES</span>

                    <strong>
                        ${formatNumber(values.length)}
                    </strong>

                </div>


                <div class="feature-stat">

                    <span>UNIQUE VALUES</span>

                    <strong>
                        ${formatNumber(uniqueValues.length)}
                    </strong>

                </div>


                <div class="feature-stat">

                    <span>MISSING VALUES</span>

                    <strong>
                        ${formatNumber(
                            healthcareData.length - values.length
                        )}
                    </strong>

                </div>

            </div>


            <div class="feature-samples">

                <span>
                    SAMPLE VALUES
                </span>

                <div class="sample-value-list">

                    ${sampleValues.map(value => `

                        <span class="sample-value">
                            ${escapeHTML(value)}
                        </span>

                    `).join("")}

                </div>

            </div>

        </div>

    `;


    detail.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* ============================================================
   FEATURE PLACEHOLDER
   ============================================================ */

function showFeaturePlaceholder() {

    const detail =
        document.getElementById("featureDetail");


    if (!detail) {

        return;

    }


    detail.innerHTML = `

        <div class="feature-detail-placeholder">

            <span>
                SELECT
            </span>

            <h3>
                Explore a Dataset Feature
            </h3>

            <p>
                Choose a variable from the dropdown to view
                its type, unique values and sample data.
            </p>

        </div>

    `;

}


/* ============================================================
   DATA QUALITY
   ============================================================ */

function updateQualitySection() {

    let missingValues = 0;


    healthcareData.forEach(row => {

        columns.forEach(column => {

            const value = row[column];

            if (
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            ) {

                missingValues++;

            }

        });

    });


    const duplicateRows =
        countDuplicateRows();


    const uniqueCategoricalValues =
        categoricalFeatures.reduce(
            (total, feature) => {

                const values = healthcareData
                    .map(row => row[feature])
                    .filter(value =>
                        value !== undefined &&
                        value !== null &&
                        String(value).trim() !== ""
                    );


                return total +
                    new Set(
                        values.map(value => String(value))
                    ).size;

            },
            0
        );


    setText(
        "missingValues",
        formatNumber(missingValues)
    );


    setText(
        "duplicateRows",
        formatNumber(duplicateRows)
    );


    setText(
        "uniqueValues",
        formatNumber(uniqueCategoricalValues)
    );


    const qualityStatus =
        document.getElementById("qualityStatus");


    const qualityDescription =
        document.getElementById("qualityDescription");


    if (qualityStatus) {

        if (missingValues === 0 && duplicateRows === 0) {

            qualityStatus.textContent = "GOOD";

        } else {

            qualityStatus.textContent = "REVIEW";

        }

    }


    if (qualityDescription) {

        if (missingValues === 0 && duplicateRows === 0) {

            qualityDescription.textContent =
                "No missing cells or duplicate rows detected.";

        } else {

            qualityDescription.textContent =
                "Some data quality checks require attention.";

        }

    }

}


/* ============================================================
   COUNT DUPLICATE ROWS
   ============================================================ */

function countDuplicateRows() {

    const seen = new Set();

    let duplicates = 0;


    healthcareData.forEach(row => {

        const key =
            columns
                .map(column => String(row[column] ?? ""))
                .join("|||");


        if (seen.has(key)) {

            duplicates++;

        } else {

            seen.add(key);

        }

    });


    return duplicates;

}


/* ============================================================
   DATA PREVIEW
   ============================================================ */

function updatePreviewTable() {

    const head =
        document.getElementById("previewHead");


    const body =
        document.getElementById("previewBody");


    const info =
        document.getElementById("previewInfo");


    if (!head || !body) {

        return;

    }


    head.innerHTML = "";

    body.innerHTML = "";


    const headerRow =
        document.createElement("tr");


    columns.forEach(column => {

        const th =
            document.createElement("th");


        th.textContent = column;

        headerRow.appendChild(th);

    });


    head.appendChild(headerRow);


    const previewRows =
        healthcareData.slice(0, 8);


    previewRows.forEach(row => {

        const tr =
            document.createElement("tr");


        columns.forEach(column => {

            const td =
                document.createElement("td");


            const value =
                row[column];


            td.textContent =
                value !== undefined &&
                value !== null &&
                value !== ""
                    ? value
                    : "—";


            tr.appendChild(td);

        });


        body.appendChild(tr);

    });


    if (info) {

        info.textContent =
            `Showing ${previewRows.length} of ${formatNumber(healthcareData.length)} records`;

    }

}


/* ============================================================
   QUESTIONS
   ============================================================ */

function setupQuestionCards() {

    const questionItems =
        document.querySelectorAll(".question-item");


    questionItems.forEach((item, index) => {

        item.setAttribute("role", "button");

        item.setAttribute("tabindex", "0");


        item.addEventListener("click", () => {

            showQuestionAnswer(item, index);

        });


        item.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                showQuestionAnswer(item, index);

            }

        });

    });

}


/* ============================================================
   GENERATE QUESTION ANSWERS
   ============================================================ */

function updateQuestionAnswers() {

    if (!datasetLoaded && healthcareData.length === 0) {

        return;

    }


    const answers = buildQuestionAnswers();


    const questionItems =
        document.querySelectorAll(".question-item");


    questionItems.forEach((item, index) => {

        item.dataset.answer =
            answers[index] || "No answer available.";

    });

}


/* ============================================================
   BUILD DATA-BASED ANSWERS
   ============================================================ */

function buildQuestionAnswers() {

    const missing =
        countMissingValues();


    const duplicates =
        countDuplicateRows();


    let highestVarietyFeature = "None";

    let highestVarietyCount = 0;


    categoricalFeatures.forEach(feature => {

        const count =
            new Set(
                healthcareData
                    .map(row => row[feature])
                    .filter(value =>
                        value !== undefined &&
                        value !== null &&
                        String(value).trim() !== ""
                    )
                    .map(value => String(value))
            ).size;


        if (count > highestVarietyCount) {

            highestVarietyCount = count;

            highestVarietyFeature = feature;

        }

    });


    return [

        /*
         * QUESTION 01
         */

        `The dataset contains ${formatNumber(healthcareData.length)} healthcare records.`,



        /*
         * QUESTION 02
         */

        `The dataset contains ${columns.length} variables describing patient, demographic, healthcare and doctor-visit characteristics. The available variables are: ${columns.join(", ")}.`,


        /*
         * QUESTION 03
         */

        `There are ${numericFeatures.length} numerical features and ${categoricalFeatures.length} categorical features. Numerical features: ${numericFeatures.join(", ")}. Categorical features: ${categoricalFeatures.join(", ")}.`,


        /*
         * QUESTION 04
         */

        missing === 0 && duplicates === 0

            ? "No missing values or duplicate rows were detected in the loaded dataset."

            : `The dataset contains ${formatNumber(missing)} missing cells and ${formatNumber(duplicates)} duplicate rows. These should be reviewed during preprocessing.`,


        /*
         * QUESTION 05
         */

        categoricalFeatures.length > 0

            ? `The categorical feature with the greatest number of unique values is "${highestVarietyFeature}", with ${formatNumber(highestVarietyCount)} unique values.`

            : "No categorical features were detected.",


        /*
         * QUESTION 06
         */

        `During preprocessing, investigate missing values, duplicate rows, data types, unique categories and possible inconsistent values. The dataset currently contains ${numericFeatures.length} numerical and ${categoricalFeatures.length} categorical features.`

    ];

}


/* ============================================================
   SHOW QUESTION ANSWER
   ============================================================ */

function showQuestionAnswer(item, index) {

    /*
     * If dataset has not loaded yet,
     * show loading message.
     */

    if (!datasetLoaded) {

        toggleAnswer(
            item,
            "Please wait. The healthcare dataset is still loading..."
        );

        return;

    }


    const answers =
        buildQuestionAnswers();


    const answer =
        answers[index] ||
        "No answer available for this question.";


    toggleAnswer(item, answer);

}


/* ============================================================
   TOGGLE QUESTION ANSWER
   ============================================================ */

function toggleAnswer(item, answer) {

    const existingAnswer =
        item.querySelector(".question-answer");


    /*
     * If answer already exists,
     * clicking again closes it.
     */

    if (existingAnswer) {

        existingAnswer.remove();

        item.classList.remove("question-open");

        return;

    }


    /*
     * Close other open answers.
     */

    document
        .querySelectorAll(".question-answer")
        .forEach(element => element.remove());


    document
        .querySelectorAll(".question-item")
        .forEach(element =>
            element.classList.remove("question-open")
        );


    /*
     * Create answer box.
     */

    const answerBox =
        document.createElement("div");


    answerBox.className =
        "question-answer";


    answerBox.innerHTML = `

        <div class="question-answer-label">
            ANSWER
        </div>

        <p>
            ${escapeHTML(answer)}
        </p>

    `;


    item.appendChild(answerBox);


    item.classList.add("question-open");


    /*
     * Smoothly reveal answer.
     */

    setTimeout(() => {

        answerBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }, 50);

}


/* ============================================================
   MISSING VALUES
   ============================================================ */

function countMissingValues() {

    let count = 0;


    healthcareData.forEach(row => {

        columns.forEach(column => {

            const value = row[column];


            if (
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            ) {

                count++;

            }

        });

    });


    return count;

}


/* ============================================================
   EXPLORE DATASET BUTTON
   ============================================================ */

function setupExploreButton() {

    const button =
        document.getElementById("exploreDatasetButton");


    const overview =
        document.getElementById("datasetOverview");


    if (!button || !overview) {

        return;

    }


    button.addEventListener("click", () => {

        overview.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


/* ============================================================
   STATUS
   ============================================================ */

function setStatus(message, error = false) {

    const statusText =
        document.getElementById("dataStatusText");


    const statusDot =
        document.getElementById("statusDot");


    if (statusText) {

        statusText.textContent = message;

    }


    if (statusDot) {

        statusDot.classList.toggle(
            "error",
            error
        );

    }

}


/* ============================================================
   DATASET ERROR
   ============================================================ */

function showDatasetError() {

    const numericList =
        document.getElementById("numericFeatureList");


    const categoricalList =
        document.getElementById("categoricalFeatureList");


    if (numericList) {

        numericList.innerHTML = `

            <div class="loading-item">
                Dataset could not be loaded.
            </div>

        `;

    }


    if (categoricalList) {

        categoricalList.innerHTML = `

            <div class="loading-item">
                Check the CSV file path.
            </div>

        `;

    }


    setText("totalRows", "—");

    setText("totalColumns", "—");

    setText("numericColumns", "—");

    setText("categoricalColumns", "—");

}


/* ============================================================
   CHATBOT SUPPORT
   ============================================================ */

function setupChatbotSupport() {

    const input =
        document.getElementById("aiChatInput");


    const sendButton =
        document.getElementById("aiSendButton");


    if (!input || !sendButton) {

        return;

    }


    sendButton.addEventListener(
        "click",
        handleChatMessage
    );


    input.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            handleChatMessage();

        }

    });


    /*
     * Quick question buttons
     */

    document
        .querySelectorAll(".ai-question")
        .forEach(button => {

            button.addEventListener("click", () => {

                const question =
                    button.dataset.question || "";


                input.value = question;

                handleChatMessage();

            });

        });

}


/* ============================================================
   CHATBOT MESSAGE
   ============================================================ */

function handleChatMessage() {

    const input =
        document.getElementById("aiChatInput");


    const body =
        document.getElementById("aiChatBody");


    if (!input || !body) {

        return;

    }


    const question =
        input.value.trim();


    if (!question) {

        return;

    }


    addChatMessage(
        question,
        "user"
    );


    input.value = "";


    const answer =
        generateChatbotAnswer(question);


    setTimeout(() => {

        addChatMessage(
            answer,
            "ai"
        );

    }, 250);

}


/* ============================================================
   CHATBOT ANSWER ENGINE
   ============================================================ */

function generateChatbotAnswer(question) {

    const q =
        question.toLowerCase();


    if (!datasetLoaded) {

        return "The healthcare dataset is still loading. Please try again in a moment.";

    }


    if (
        q.includes("how many") &&
        (
            q.includes("record") ||
            q.includes("row") ||
            q.includes("patient")
        )
    ) {

        return `The dataset contains ${formatNumber(healthcareData.length)} records.`;

    }


    if (
        q.includes("numerical") ||
        q.includes("numeric")
    ) {

        return `The numerical features are: ${numericFeatures.join(", ")}.`;

    }


    if (
        q.includes("categorical") ||
        q.includes("category")
    ) {

        return `The categorical features are: ${categoricalFeatures.join(", ")}.`;

    }


    if (
        q.includes("missing")
    ) {

        const missing =
            countMissingValues();


        return missing === 0

            ? "There are no missing values in the loaded dataset."

            : `The dataset contains ${formatNumber(missing)} missing cells.`;

    }


    if (
        q.includes("duplicate")
    ) {

        const duplicates =
            countDuplicateRows();


        return duplicates === 0

            ? "There are no duplicate rows."

            : `The dataset contains ${formatNumber(duplicates)} duplicate rows.`;

    }


    if (
        q.includes("column") ||
        q.includes("feature")
    ) {

        return `The dataset contains ${columns.length} features: ${columns.join(", ")}.`;

    }


    if (
        q.includes("after") &&
        (
            q.includes("data understanding") ||
            q.includes("understanding")
        )
    ) {

        return "After data understanding, the next stage is preprocessing. This includes checking data types, missing values, duplicates and possible transformations.";

    }


    if (
        q.includes("preprocess")
    ) {

        return "The preprocessing stage should examine missing values, duplicate rows, data types, inconsistent values and transformation requirements.";

    }


    return "I can help with dataset records, numerical features, categorical features, missing values, duplicate rows, columns and preprocessing.";

}


/* ============================================================
   ADD CHAT MESSAGE
   ============================================================ */

function addChatMessage(message, type) {

    const body =
        document.getElementById("aiChatBody");


    if (!body) {

        return;

    }


    const wrapper =
        document.createElement("div");


    if (type === "user") {

        wrapper.className =
            "ai-message user-message";


        wrapper.innerHTML = `

            <div class="ai-message-content">

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        `;

    } else {

        wrapper.className =
            "ai-message";


        wrapper.innerHTML = `

            <div class="ai-avatar-small">
                AI
            </div>

            <div class="ai-message-content">

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        `;

    }


    body.appendChild(wrapper);


    body.scrollTop =
        body.scrollHeight;

}


/* ============================================================
   UTILITY: SET TEXT
   ============================================================ */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


/* ============================================================
   UTILITY: FORMAT NUMBER
   ============================================================ */

function formatNumber(value) {

    if (
        value === null ||
        value === undefined ||
        isNaN(Number(value))
    ) {

        return "—";

    }


    return Number(value).toLocaleString("en-IN");

}


/* ============================================================
   UTILITY: ESCAPE HTML
   ============================================================ */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ============================================================
   DEBUG INFORMATION
   ============================================================ */

window.healthcareAnalytics = {

    getData: () => healthcareData,

    getColumns: () => columns,

    getNumericFeatures: () => numericFeatures,

    getCategoricalFeatures: () => categoricalFeatures,

    reload: () => loadHealthcareDataset()

};


console.log(
    "Healthcare Analytics Data Understanding JS loaded successfully."
);