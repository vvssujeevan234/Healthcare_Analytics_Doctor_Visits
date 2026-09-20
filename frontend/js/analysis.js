/* =========================================================
   HEALTHCARE ANALYTICS
   ANALYSIS PAGE JAVASCRIPT
   ========================================================= */

let healthcareData = [];

let columnMap = {
    visits: null,
    age: null,
    gender: null,
    health: null
};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

    loadHealthcareCSV();

    initializeAI();

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
   LOAD HEALTHCARE CSV
   ========================================================= */

async function loadHealthcareCSV() {

    updateStatus(
        "Loading healthcare dataset...",
        "loading"
    );

    /*
     * IMPORTANT
     *
     * analysis.html is inside:
     *
     * frontend/pages/analysis.html
     *
     * CSV is inside:
     *
     * frontend/data/healthcare_doctor_visits.csv
     *
     * Therefore:
     *
     * ../data/healthcare_doctor_visits.csv
     *
     * is the correct production URL.
     */

    const datasetURL =
        "../data/healthcare_doctor_visits.csv";

    console.log(
        "Healthcare CSV URL:",
        new URL(
            datasetURL,
            window.location.href
        ).href
    );

    try {

        const response =
            await fetch(
                datasetURL,
                {
                    method: "GET",
                    cache: "no-cache"
                }
            );

        console.log(
            "CSV response:",
            response.status,
            response.statusText
        );

        if (!response.ok) {

            throw new Error(
                `CSV request failed: ${response.status} ${response.statusText}`
            );

        }

        const csvText =
            await response.text();

        if (
            !csvText ||
            csvText.trim().length === 0
        ) {

            throw new Error(
                "CSV file is empty."
            );

        }

        healthcareData =
            parseCSV(csvText);

        if (
            !healthcareData ||
            healthcareData.length === 0
        ) {

            throw new Error(
                "CSV was found, but no records could be parsed."
            );

        }

        console.log(
            "Healthcare dataset loaded:",
            healthcareData.length,
            "records"
        );

        console.log(
            "First record:",
            healthcareData[0]
        );

        detectColumns();

        renderAnalysis();

        updateStatus(
            `Healthcare dataset loaded • ${healthcareData.length.toLocaleString("en-IN")} records`,
            "loaded"
        );

    }
    catch (error) {

        console.error(
            "Healthcare CSV loading error:",
            error
        );

        updateStatus(
            "Unable to load healthcare dataset.",
            "error"
        );

        renderFallback();

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


    if (
        currentValue !== "" ||
        currentRow.length > 0
    ) {

        currentRow.push(
            currentValue.trim()
        );

        rows.push(
            currentRow
        );

    }


    if (
        rows.length < 2
    ) {

        return [];

    }


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


    return rows
        .slice(1)
        .map(row => {

            const object = {};

            headers.forEach(
                (
                    header,
                    index
                ) => {

                    object[header] =
                        row[index] !== undefined
                            ? row[index].trim()
                            : "";

                }
            );

            return object;

        });

}


/* =========================================================
   NORMALIZE COLUMN NAME
   ========================================================= */

function normalizeColumnName(name) {

    return String(name)
        .toLowerCase()
        .replace(
            /[^a-z0-9]/g,
            ""
        );

}


/* =========================================================
   FIND COLUMN
   ========================================================= */

function findColumn(possibleNames) {

    if (
        !healthcareData.length
    ) {

        return null;

    }


    const columns =
        Object.keys(
            healthcareData[0]
        );


    for (
        const wanted of possibleNames
    ) {

        const normalizedWanted =
            normalizeColumnName(
                wanted
            );


        const found =
            columns.find(
                column =>
                    normalizeColumnName(
                        column
                    ) === normalizedWanted
            );


        if (found) {

            return found;

        }

    }


    return null;

}


/* =========================================================
   DETECT COLUMNS
   ========================================================= */

function detectColumns() {

    columnMap.visits =
        findColumn([
            "Doctor_Visits",
            "Doctor Visits",
            "DoctorVisits",
            "Visits",
            "Visit_Count",
            "Visit Count",
            "Number_of_Visits",
            "Number of Visits"
        ]);


    columnMap.age =
        findColumn([
            "Age",
            "Patient_Age",
            "Patient Age"
        ]);


    columnMap.gender =
        findColumn([
            "Gender",
            "Sex"
        ]);


    columnMap.health =
        findColumn([
            "Health",
            "Health_Status",
            "Health Status",
            "Health_Condition",
            "Health Condition",
            "Condition",
            "Disease"
        ]);


    console.log(
        "Detected healthcare columns:",
        columnMap
    );

}


/* =========================================================
   NUMBER CONVERSION
   ========================================================= */

function toNumber(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return null;

    }


    const cleaned =
        String(value)
            .replace(
                /,/g,
                ""
            )
            .replace(
                /%/g,
                ""
            )
            .trim();


    const number =
        Number(cleaned);


    return Number.isFinite(number)
        ? number
        : null;

}


/* =========================================================
   GET NUMERIC VALUES
   ========================================================= */

function getNumericValues(column) {

    if (!column) {

        return [];

    }


    return healthcareData
        .map(
            row =>
                toNumber(
                    row[column]
                )
        )
        .filter(
            value =>
                value !== null
        );

}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(
    number,
    decimals = 0
) {

    if (
        number === null ||
        number === undefined ||
        Number.isNaN(number)
    ) {

        return "—";

    }


    return Number(number)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits:
                    decimals,

                maximumFractionDigits:
                    decimals
            }
        );

}


/* =========================================================
   RENDER ANALYSIS
   ========================================================= */

function renderAnalysis() {

    renderKPIs();

    renderVisitChart();

    renderAgeChart();

    renderCategoryAnalysis();

    renderRelationshipAnalysis();

}


/* =========================================================
   KPI
   ========================================================= */

function renderKPIs() {

    const totalRecords =
        healthcareData.length;


    const visits =
        getNumericValues(
            columnMap.visits
        );


    const ages =
        getNumericValues(
            columnMap.age
        );


    const totalVisits =
        visits.length
            ? visits.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            )
            : null;


    const averageVisits =
        visits.length
            ? totalVisits /
              visits.length
            : null;


    const averageAge =
        ages.length
            ? ages.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            ) / ages.length
            : null;


    setText(
        "totalRecords",
        formatNumber(
            totalRecords
        )
    );


    setText(
        "totalVisits",
        totalVisits === null
            ? "—"
            : formatNumber(
                totalVisits
            )
    );


    setText(
        "averageVisits",
        averageVisits === null
            ? "—"
            : formatNumber(
                averageVisits,
                2
            )
    );


    setText(
        "averageAge",
        averageAge === null
            ? "—"
            : formatNumber(
                averageAge,
                1
            )
    );

}


/* =========================================================
   VISIT CHART
   ========================================================= */

function renderVisitChart() {

    const container =
        document.getElementById(
            "visitChart"
        );


    const summary =
        document.getElementById(
            "visitChartSummary"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const visits =
        getNumericValues(
            columnMap.visits
        );


    if (!visits.length) {

        container.innerHTML =
            createEmptyMessage(
                "Doctor visit column not detected."
            );


        if (summary) {

            summary.textContent =
                "No visit data";

        }


        return;

    }


    const frequency = {};


    visits.forEach(
        value => {

            const integerValue =
                Math.round(value);


            frequency[integerValue] =
                (
                    frequency[integerValue] ||
                    0
                ) + 1;

        }
    );


    const sorted =
        Object.entries(
            frequency
        )
        .sort(
            (
                a,
                b
            ) =>
                Number(a[0]) -
                Number(b[0])
        );


    const displayData =
        sorted.slice(
            0,
            12
        );


    const maxFrequency =
        Math.max(
            ...displayData.map(
                item =>
                    item[1]
            )
        );


    displayData.forEach(
        (
            [visit, count]
        ) => {

            const column =
                document.createElement(
                    "div"
                );


            column.className =
                "bar-column";


            const value =
                document.createElement(
                    "div"
                );


            value.className =
                "bar-value";


            value.textContent =
                count.toLocaleString(
                    "en-IN"
                );


            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "bar";


            const percentage =
                (
                    count /
                    maxFrequency
                ) * 100;


            bar.style.height =
                `${Math.max(
                    percentage,
                    4
                )}%`;


            const label =
                document.createElement(
                    "div"
                );


            label.className =
                "bar-label";


            label.textContent =
                visit;


            column.appendChild(
                value
            );


            column.appendChild(
                bar
            );


            column.appendChild(
                label
            );


            container.appendChild(
                column
            );

        }
    );


    if (summary) {

        const minimum =
            Math.min(
                ...visits
            );


        const maximum =
            Math.max(
                ...visits
            );


        summary.textContent =
            `${formatNumber(
                minimum
            )} – ${formatNumber(
                maximum
            )} visits`;

    }

}


/* =========================================================
   AGE CHART
   ========================================================= */

function renderAgeChart() {

    const container =
        document.getElementById(
            "ageChart"
        );


    const summary =
        document.getElementById(
            "ageChartSummary"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const ages =
        getNumericValues(
            columnMap.age
        );


    if (!ages.length) {

        container.innerHTML =
            createEmptyMessage(
                "Age column not detected."
            );

        return;

    }


    const groups = [

        {
            label: "0–17",
            min: 0,
            max: 17
        },

        {
            label: "18–29",
            min: 18,
            max: 29
        },

        {
            label: "30–44",
            min: 30,
            max: 44
        },

        {
            label: "45–59",
            min: 45,
            max: 59
        },

        {
            label: "60+",
            min: 60,
            max: Infinity
        }

    ];


    const counts =
        groups.map(
            group => ({

                ...group,

                count:
                    ages.filter(
                        age =>
                            age >= group.min &&
                            age <= group.max
                    ).length

            })
        );


    const maximum =
        Math.max(
            ...counts.map(
                group =>
                    group.count
            )
        );


    counts.forEach(
        group => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "age-row";


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "age-label";


            label.textContent =
                group.label;


            const track =
                document.createElement(
                    "div"
                );


            track.className =
                "age-track";


            const fill =
                document.createElement(
                    "div"
                );


            fill.className =
                "age-fill";


            const width =
                maximum > 0
                    ? (
                        group.count /
                        maximum
                    ) * 100
                    : 0;


            fill.style.width =
                `${Math.max(
                    width,
                    1
                )}%`;


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "age-number";


            number.textContent =
                formatNumber(
                    group.count
                );


            track.appendChild(
                fill
            );


            row.appendChild(
                label
            );


            row.appendChild(
                track
            );


            row.appendChild(
                number
            );


            container.appendChild(
                row
            );

        }
    );


    if (summary) {

        summary.textContent =
            `${ages.length.toLocaleString(
                "en-IN"
            )} age values`;

    }

}


/* =========================================================
   CATEGORY ANALYSIS
   ========================================================= */

function renderCategoryAnalysis() {

    const container =
        document.getElementById(
            "categoryAnalysis"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const preferredColumns = [

        columnMap.gender,

        columnMap.health

    ].filter(Boolean);


    let selectedColumn =
        preferredColumns[0];


    if (!selectedColumn) {

        const columns =
            Object.keys(
                healthcareData[0] || {}
            );


        selectedColumn =
            columns.find(
                column => {

                    const values =
                        healthcareData.map(
                            row =>
                                row[column]
                        );


                    const unique =
                        new Set(
                            values
                        ).size;


                    return (
                        unique >= 2 &&
                        unique <= 10
                    );

                }
            );

    }


    if (!selectedColumn) {

        container.innerHTML =
            createEmptyMessage(
                "No suitable category column found."
            );

        return;

    }


    const frequency =
        getFrequency(
            selectedColumn
        );


    const entries =
        Object.entries(
            frequency
        )
        .sort(
            (
                a,
                b
            ) =>
                b[1] -
                a[1]
        )
        .slice(
            0,
            6
        );


    const maximum =
        entries.length
            ? entries[0][1]
            : 0;


    entries.forEach(
        (
            [name, count]
        ) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "category-row";


            const categoryName =
                document.createElement(
                    "span"
                );


            categoryName.className =
                "category-name";


            categoryName.title =
                name;


            categoryName.textContent =
                name;


            const track =
                document.createElement(
                    "div"
                );


            track.className =
                "category-track";


            const fill =
                document.createElement(
                    "div"
                );


            fill.className =
                "category-fill";


            fill.style.width =
                maximum > 0
                    ? `${(
                        count /
                        maximum
                    ) * 100}%`
                    : "0%";


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "category-number";


            number.textContent =
                formatNumber(
                    count
                );


            track.appendChild(
                fill
            );


            row.appendChild(
                categoryName
            );


            row.appendChild(
                track
            );


            row.appendChild(
                number
            );


            container.appendChild(
                row
            );

        }
    );


    const footer =
        container
            .closest(
                ".analysis-card"
            )
            ?.querySelector(
                ".chart-footer span:first-child"
            );


    if (footer) {

        footer.textContent =
            selectedColumn;

    }

}


/* =========================================================
   RELATIONSHIP ANALYSIS
   ========================================================= */

function renderRelationshipAnalysis() {

    const container =
        document.getElementById(
            "relationshipPanel"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const visits =
        getNumericValues(
            columnMap.visits
        );


    const ages =
        getNumericValues(
            columnMap.age
        );


    const averageVisits =
        visits.length
            ? visits.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            ) / visits.length
            : null;


    const averageAge =
        ages.length
            ? ages.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            ) / ages.length
            : null;


    const uniqueColumns =
        healthcareData.length
            ? Object.keys(
                healthcareData[0]
            ).length
            : 0;


    const relationships = [

        {
            number:
                averageVisits === null
                    ? "—"
                    : formatNumber(
                        averageVisits,
                        2
                    ),

            title:
                "Average Visits",

            text:
                "Average doctor visits calculated from the available visit records."
        },

        {
            number:
                averageAge === null
                    ? "—"
                    : formatNumber(
                        averageAge,
                        1
                    ),

            title:
                "Average Age",

            text:
                "Average patient age calculated from the available age values."
        },

        {
            number:
                formatNumber(
                    uniqueColumns
                ),

            title:
                "Variables",

            text:
                "Number of columns detected in the healthcare dataset."
        }

    ];


    relationships.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "relationship-item";


            element.innerHTML = `

                <span class="relationship-number">
                    ${escapeHTML(item.number)}
                </span>

                <h4>
                    ${escapeHTML(item.title)}
                </h4>

                <p>
                    ${escapeHTML(item.text)}
                </p>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================================
   FREQUENCY
   ========================================================= */

function getFrequency(column) {

    const frequency = {};


    healthcareData.forEach(
        row => {

            let value =
                row[column];


            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {

                value =
                    "Unknown";

            }


            value =
                String(value)
                    .trim();


            frequency[value] =
                (
                    frequency[value] ||
                    0
                ) + 1;

        }
    );


    return frequency;

}


/* =========================================================
   STATUS
   ========================================================= */

function updateStatus(
    message,
    state
) {

    const text =
        document.getElementById(
            "statusText"
        );


    const dot =
        document.getElementById(
            "statusDot"
        );


    if (text) {

        text.textContent =
            message;

    }


    if (dot) {

        dot.className =
            "status-dot";


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


        if (
            state === "loading"
        ) {

            dot.classList.add(
                "loading"
            );

        }

    }

}


/* =========================================================
   FALLBACK
   ========================================================= */

function renderFallback() {

    setText(
        "totalRecords",
        "—"
    );

    setText(
        "totalVisits",
        "—"
    );

    setText(
        "averageVisits",
        "—"
    );

    setText(
        "averageAge",
        "—"
    );


    const charts = [

        "visitChart",

        "ageChart",

        "categoryAnalysis",

        "relationshipPanel"

    ];


    charts.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.innerHTML =
                    createEmptyMessage(
                        "Dataset unavailable."
                    );

            }

        }
    );

}


/* =========================================================
   EMPTY MESSAGE
   ========================================================= */

function createEmptyMessage(
    message
) {

    return `

        <div style="
            width:100%;
            min-height:180px;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            color:rgba(255,255,255,.42);
            font-size:11px;
            line-height:1.6;
        ">
            ${escapeHTML(message)}
        </div>

    `;

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


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

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


/* =========================================================
   AI ASSISTANT
   ========================================================= */

function initializeAI() {

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


    const body =
        document.getElementById(
            "aiChatBody"
        );


    if (
        !robot ||
        !chat ||
        !close
    ) {

        console.warn(
            "Analysis AI elements not found."
        );

        return;

    }


    robot.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            chat.classList.add(
                "active"
            );

            if (input) {

                setTimeout(
                    () =>
                        input.focus(),
                    200
                );

            }

        }
    );


    close.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            chat.classList.remove(
                "active"
            );

        }
    );


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
                        button.dataset.question ||
                        button.textContent.trim();


                    addUserMessage(
                        question,
                        body
                    );


                    answerAI(
                        question,
                        body
                    );

                }
            );

        }
    );


    if (
        form &&
        input &&
        body
    ) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const question =
                    input.value.trim();


                if (!question) {

                    return;

                }


                addUserMessage(
                    question,
                    body
                );


                input.value =
                    "";


                answerAI(
                    question,
                    body
                );

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

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
   ADD USER MESSAGE
   ========================================================= */

function addUserMessage(
    message,
    body
) {

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


    scrollChat(
        body
    );

}


/* =========================================================
   AI RESPONSE
   ========================================================= */

function answerAI(
    question,
    body
) {

    if (!body) {

        return;

    }


    const typing =
        document.createElement(
            "div"
        );


    typing.className =
        "ai-message ai-message-bot";


    typing.innerHTML = `

        <div class="ai-avatar-small">
            AI
        </div>

        <div class="ai-message-content">

            <div class="ai-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>

    `;


    body.appendChild(
        typing
    );


    scrollChat(
        body
    );


    setTimeout(
        () => {

            typing.remove();


            const answer =
                generateAIAnswer(
                    question
                );


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "ai-message ai-message-bot";


            wrapper.innerHTML = `

                <div class="ai-avatar-small">
                    AI
                </div>

                <div class="ai-message-content">
                    ${answer}
                </div>

            `;


            body.appendChild(
                wrapper
            );


            scrollChat(
                body
            );

        },
        650
    );

}


/* =========================================================
   GENERATE AI ANSWER
   ========================================================= */

function generateAIAnswer(
    question
) {

    const q =
        question.toLowerCase();


    const visits =
        getNumericValues(
            columnMap.visits
        );


    const ages =
        getNumericValues(
            columnMap.age
        );


    if (
        q.includes("record") ||
        q.includes("rows") ||
        q.includes("dataset")
    ) {

        return `

            <p>
                The healthcare dataset currently contains
                <strong>
                    ${healthcareData.length.toLocaleString("en-IN")}
                </strong>
                records.
            </p>

        `;

    }


    if (
        q.includes("column")
    ) {

        const columns =
            healthcareData.length
                ? Object.keys(
                    healthcareData[0]
                ).length
                : 0;


        return `

            <p>
                The healthcare dataset contains
                <strong>
                    ${columns}
                </strong>
                columns.
            </p>

        `;

    }


    if (
        q.includes("average") &&
        q.includes("visit")
    ) {

        if (!visits.length) {

            return `

                <p>
                    A doctor-visit column could not be detected
                    in the healthcare CSV.
                </p>

            `;

        }


        const average =
            visits.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            ) / visits.length;


        return `

            <p>
                The average number of doctor visits is
                <strong>
                    ${formatNumber(
                        average,
                        2
                    )}
                </strong>.
            </p>

        `;

    }


    if (
        q.includes("age")
    ) {

        if (!ages.length) {

            return `

                <p>
                    An age column could not be detected
                    in the healthcare CSV.
                </p>

            `;

        }


        const average =
            ages.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            ) / ages.length;


        return `

            <p>
                The average patient age is
                <strong>
                    ${formatNumber(
                        average,
                        1
                    )}
                </strong>
                years.
            </p>

        `;

    }


    if (
        q.includes("gender")
    ) {

        if (!columnMap.gender) {

            return `
                <p>
                    A gender column was not detected.
                </p>
            `;

        }


        const frequency =
            getFrequency(
                columnMap.gender
            );


        const result =
            Object.entries(
                frequency
            )
            .map(
                ([name, count]) =>
                    `${name}: ${count}`
            )
            .join(", ");


        return `

            <p>
                Gender distribution:
                <strong>
                    ${escapeHTML(result)}
                </strong>
            </p>

        `;

    }


    if (
        q.includes("visit")
    ) {

        return `

            <p>
                The Analysis page uses the doctor-visit
                values from the healthcare CSV to calculate
                visit frequency, total visits and average visits.
            </p>

        `;

    }


    return `

        <p>
            I can help you understand the healthcare dataset,
            doctor visits, patient age, categories and analysis metrics.
        </p>

        <p>
            Try asking about:
            <strong>
                records, columns, average visits,
                average age or gender.
            </strong>
        </p>

    `;

}


/* =========================================================
   SCROLL CHAT
   ========================================================= */

function scrollChat(
    body
) {

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
    event => {

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