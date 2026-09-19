/* =========================================================
   HEALTHCARE ANALYTICS
   PORTFOLIO DATA ENGINE
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const DATA_PATHS = [

    "../../healthcare_doctor_visits.csv",

    "../data/healthcare_doctor_visits.csv",

    "/healthcare_doctor_visits.csv"

];


let allData = [];

let filteredData = [];

let columns = [];

let numericColumns = [];

let categoricalColumns = [];

let dateColumns = [];

let currentPage = 1;

const rowsPerPage = 10;

const charts = {};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeNavigation();

        initializeRobot();

        initializeControls();

        loadHealthcareDataset();

    }
);


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const mobileNavigation =
        document.getElementById(
            "mobileNavigation"
        );


    if (
        menuToggle &&
        mobileNavigation
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                mobileNavigation.classList.toggle(
                    "open"
                );

            }
        );


        mobileNavigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileNavigation.classList.remove(
                            "open"
                        );

                    }
                );

            });

    }

}


/* =========================================================
   CONTROL BUTTONS
========================================================= */

function initializeControls() {

    document
        .querySelectorAll(
            ".control-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    document
                        .querySelectorAll(
                            ".control-button"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    this.classList.add(
                        "active"
                    );


                    const view =
                        this.dataset.view;

                    applyDashboardView(
                        view
                    );

                }
            );

        });


    const refreshButton =
        document.getElementById(
            "loadDatasetButton"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadHealthcareDataset
        );

    }


    const resetButton =
        document.getElementById(
            "resetFilters"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFilters
        );

    }


    const previousButton =
        document.getElementById(
            "previousPage"
        );


    const nextButton =
        document.getElementById(
            "nextPage"
        );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                if (currentPage > 1) {

                    currentPage--;

                    renderTable();

                }

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                const totalPages =
                    Math.ceil(
                        filteredData.length /
                        rowsPerPage
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderTable();

                }

            }
        );

    }

}


/* =========================================================
   LOAD DATASET
========================================================= */

async function loadHealthcareDataset() {

    setStatus(
        "Loading healthcare dataset...",
        "loading"
    );


    let csvText = null;


    for (
        const path of DATA_PATHS
    ) {

        try {

            const response =
                await fetch(path);


            if (
                response.ok
            ) {

                csvText =
                    await response.text();

                break;

            }

        } catch (error) {

            console.warn(
                "Dataset path failed:",
                path
            );

        }

    }


    if (!csvText) {

        setStatus(
            "Unable to load CSV. Start the project using a local server.",
            "error"
        );

        return;

    }


    try {

        allData =
            parseCSV(csvText);


        filteredData =
            [...allData];


        if (
            allData.length === 0
        ) {

            throw new Error(
                "CSV contains no records."
            );

        }


        analyzeColumns();


        updateKPIs();


        createDynamicFilters();


        createCharts();


        createColumnProfile();


        currentPage = 1;


        renderTable();


        setStatus(
            `${allData.length.toLocaleString()} healthcare records loaded`,
            "loaded"
        );


    } catch (error) {

        console.error(error);


        setStatus(
            "Dataset could not be processed.",
            "error"
        );

    }

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

        const next =
            text[i + 1];


        if (
            character === '"' &&
            insideQuotes &&
            next === '"'
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
                next === "\n"
            ) {

                i++;

            }


            row.push(
                value.trim()
            );


            if (
                row.some(
                    cell =>
                        cell !== ""
                )
            ) {

                rows.push(row);

            }


            row = [];

            value = "";

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

        rows.push(row);

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
                    .replace(/^\uFEFF/, "")
                    .trim()
        );


    return rows
        .slice(1)
        .map(row => {

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

        });

}


/* =========================================================
   ANALYZE COLUMNS
========================================================= */

function analyzeColumns() {

    columns =
        Object.keys(
            allData[0] || {}
        );


    numericColumns = [];

    categoricalColumns = [];

    dateColumns = [];


    columns.forEach(
        column => {

            const values =
                allData
                    .map(row => row[column])
                    .filter(
                        value =>
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                    );


            if (
                values.length === 0
            ) {

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


            const dateCount =
                values.filter(
                    value =>
                        isDateLike(value)
                ).length;


            const numericRatio =
                numericCount /
                values.length;


            const dateRatio =
                dateCount /
                values.length;


            if (
                numericRatio >= 0.80
            ) {

                numericColumns.push(
                    column
                );

            }
            else if (
                dateRatio >= 0.80
            ) {

                dateColumns.push(
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
   NUMERIC DETECTION
========================================================= */

function isNumeric(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return false;

    }


    const cleaned =
        String(value)
            .replace(/,/g, "")
            .replace(/%/g, "")
            .trim();


    return (
        cleaned !== "" &&
        !isNaN(Number(cleaned))
    );

}


/* =========================================================
   DATE DETECTION
========================================================= */

function isDateLike(value) {

    if (
        typeof value !== "string"
    ) {

        return false;

    }


    if (
        /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/
            .test(value)
    ) {

        return true;

    }


    if (
        /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/
            .test(value)
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   STATUS
========================================================= */

function setStatus(
    message,
    state
) {

    const statusText =
        document.getElementById(
            "statusText"
        );


    const statusDot =
        document.getElementById(
            "statusDot"
        );


    if (statusText) {

        statusText.textContent =
            message;

    }


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
            state === "error"
        ) {

            statusDot.classList.add(
                "error"
            );

        }

    }

}


/* =========================================================
   KPI UPDATE
========================================================= */

function updateKPIs() {

    const totalRecords =
        document.getElementById(
            "totalRecords"
        );


    const uniquePatients =
        document.getElementById(
            "uniquePatients"
        );


    const totalColumns =
        document.getElementById(
            "totalColumns"
        );


    const completeness =
        document.getElementById(
            "completeness"
        );


    if (totalRecords) {

        totalRecords.textContent =
            filteredData.length.toLocaleString();

    }


    if (totalColumns) {

        totalColumns.textContent =
            columns.length;

    }


    const patientColumn =
        findColumn([
            "patient_id",
            "patientid",
            "patient",
            "id"
        ]);


    if (uniquePatients) {

        if (patientColumn) {

            const unique =
                new Set(
                    filteredData.map(
                        row =>
                            row[patientColumn]
                    )
                );


            uniquePatients.textContent =
                unique.size.toLocaleString();

        } else {

            uniquePatients.textContent =
                "—";

        }

    }


    let totalCells =
        filteredData.length *
        columns.length;


    let validCells = 0;


    filteredData.forEach(
        row => {

            columns.forEach(
                column => {

                    if (
                        row[column] !== "" &&
                        row[column] !== null &&
                        row[column] !== undefined
                    ) {

                        validCells++;

                    }

                }
            );

        }
    );


    const percent =
        totalCells > 0
            ? (
                validCells /
                totalCells *
                100
            ).toFixed(1)
            : 0;


    if (completeness) {

        completeness.textContent =
            `${percent}%`;

    }

}


/* =========================================================
   FIND COLUMN
========================================================= */

function findColumn(
    possibleNames
) {

    const normalized =
        columns.map(
            column => ({
                original: column,
                normalized:
                    normalizeColumn(column)
            })
        );


    for (
        const name of possibleNames
    ) {

        const target =
            normalizeColumn(name);


        const match =
            normalized.find(
                item =>
                    item.normalized === target
            );


        if (match) {

            return match.original;

        }

    }


    return null;

}


/* =========================================================
   NORMALIZE COLUMN
========================================================= */

function normalizeColumn(
    column
) {

    return String(column)
        .toLowerCase()
        .replace(
            /[^a-z0-9]/g,
            ""
        );

}


/* =========================================================
   DYNAMIC FILTERS
========================================================= */

function createDynamicFilters() {

    const container =
        document.getElementById(
            "dynamicFilters"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const filterColumns =
        categoricalColumns
            .slice(0, 4);


    if (
        filterColumns.length === 0
    ) {

        container.innerHTML =
            `<div class="filter-loading">
                No categorical fields available.
            </div>`;

        return;

    }


    filterColumns.forEach(
        column => {

            const values =
                getTopCategories(
                    filteredData,
                    column,
                    30
                );


            const group =
                document.createElement(
                    "div"
                );


            group.className =
                "filter-group";


            const label =
                document.createElement(
                    "label"
                );


            label.textContent =
                formatColumnName(
                    column
                );


            const select =
                document.createElement(
                    "select"
                );


            select.dataset.column =
                column;


            const allOption =
                document.createElement(
                    "option"
                );


            allOption.value = "";

            allOption.textContent =
                `All ${formatColumnName(column)}`;


            select.appendChild(
                allOption
            );


            values.forEach(
                value => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        value;


                    option.textContent =
                        value;


                    select.appendChild(
                        option
                    );

                }
            );


            select.addEventListener(
                "change",
                applyFilters
            );


            group.appendChild(
                label
            );


            group.appendChild(
                select
            );


            container.appendChild(
                group
            );

        }
    );

}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    const selects =
        document.querySelectorAll(
            ".dynamic-filters select"
        );


    filteredData =
        allData.filter(
            row => {

                return Array
                    .from(selects)
                    .every(
                        select => {

                            if (
                                select.value === ""
                            ) {

                                return true;

                            }


                            return (
                                String(
                                    row[
                                        select.dataset.column
                                    ]
                                ) ===
                                select.value
                            );

                        }
                    );

            }
        );


    currentPage = 1;


    updateKPIs();


    createCharts();


    renderTable();

}


/* =========================================================
   RESET FILTERS
========================================================= */

function resetFilters() {

    document
        .querySelectorAll(
            ".dynamic-filters select"
        )
        .forEach(
            select => {

                select.value = "";

            }
        );


    filteredData =
        [...allData];


    currentPage = 1;


    updateKPIs();


    createCharts();


    renderTable();

}


/* =========================================================
   GET TOP CATEGORIES
========================================================= */

function getTopCategories(
    data,
    column,
    limit
) {

    const counts = {};


    data.forEach(
        row => {

            const value =
                String(
                    row[column] ?? ""
                ).trim();


            if (
                value === ""
            ) {

                return;

            }


            counts[value] =
                (counts[value] || 0) + 1;

        }
    );


    return Object
        .entries(counts)
        .sort(
            (a,b) =>
                b[1] - a[1]
        )
        .slice(0, limit)
        .map(
            item => item[0]
        );

}


/* =========================================================
   CREATE CHARTS
========================================================= */

function createCharts() {

    destroyCharts();


    createMainCategoryChart();


    createDonutChart();


    createHistogram();


    createScatterChart();


    createLineChart();


    createMissingChart();

}


/* =========================================================
   DESTROY OLD CHARTS
========================================================= */

function destroyCharts() {

    Object.keys(charts)
        .forEach(
            key => {

                if (
                    charts[key]
                ) {

                    charts[key].destroy();

                    delete charts[key];

                }

            }
        );

}


/* =========================================================
   CHART COLORS
========================================================= */

const chartColors = [
    "#65e7d8",
    "#35b9bd",
    "#258b98",
    "#5ad0c5",
    "#86eee2",
    "#15727d",
    "#8bcfc8",
    "#3aa5a6",
    "#70d9ce",
    "#1f6872"
];


/* =========================================================
   CHART DEFAULT OPTIONS
========================================================= */

function baseChartOptions() {

    return {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                labels: {

                    color:
                        "rgba(255,255,255,0.6)",

                    font: {
                        size: 9
                    }

                }

            }

        },

        scales: {

            x: {

                ticks: {

                    color:
                        "rgba(255,255,255,0.48)",

                    font: {
                        size: 8
                    }

                },

                grid: {

                    color:
                        "rgba(255,255,255,0.05)"

                }

            },

            y: {

                ticks: {

                    color:
                        "rgba(255,255,255,0.48)",

                    font: {
                        size: 8
                    }

                },

                grid: {

                    color:
                        "rgba(255,255,255,0.06)"

                }

            }

        }

    };

}


/* =========================================================
   MAIN CATEGORY CHART
========================================================= */

function createMainCategoryChart() {

    const canvas =
        document.getElementById(
            "mainCategoryChart"
        );


    if (!canvas) {

        return;

    }


    const column =
        chooseCategoryColumn();


    if (!column) {

        return;

    }


    const entries =
        getCategoryEntries(
            filteredData,
            column,
            12
        );


    charts.main =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        entries.labels,

                    datasets: [

                        {

                            label:
                                formatColumnName(
                                    column
                                ),

                            data:
                                entries.values,

                            backgroundColor:
                                chartColors[0],

                            borderRadius: 6

                        }

                    ]

                },

                options: {

                    ...baseChartOptions(),

                    plugins: {

                        legend: {
                            display: false
                        }

                    }

                }

            }
        );

}


/* =========================================================
   DONUT
========================================================= */

function createDonutChart() {

    const canvas =
        document.getElementById(
            "categoryDonutChart"
        );


    if (!canvas) {

        return;

    }


    const column =
        chooseCategoryColumn();


    if (!column) {

        return;

    }


    const entries =
        getCategoryEntries(
            filteredData,
            column,
            7
        );


    charts.donut =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels:
                        entries.labels,

                    datasets: [

                        {

                            data:
                                entries.values,

                            backgroundColor:
                                chartColors,

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "64%",

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color:
                                    "rgba(255,255,255,0.6)",

                                font: {
                                    size: 8
                                },

                                padding: 12

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   HISTOGRAM
========================================================= */

function createHistogram() {

    const canvas =
        document.getElementById(
            "numericHistogram"
        );


    if (!canvas) {

        return;

    }


    const column =
        chooseNumericColumn();


    if (!column) {

        return;

    }


    const values =
        filteredData
            .map(
                row =>
                    toNumber(
                        row[column]
                    )
            )
            .filter(
                value =>
                    Number.isFinite(value)
            );


    if (
        values.length === 0
    ) {

        return;

    }


    const min =
        Math.min(...values);


    const max =
        Math.max(...values);


    const bins = 10;


    const width =
        max === min
            ? 1
            : (max - min) / bins;


    const counts =
        new Array(bins)
            .fill(0);


    values.forEach(
        value => {

            let index =
                Math.floor(
                    (value - min) /
                    width
                );


            if (
                index >= bins
            ) {

                index =
                    bins - 1;

            }


            counts[index]++;

        }
    );


    const labels =
        counts.map(
            (_, index) => {

                const start =
                    min +
                    index *
                    width;


                return formatNumber(
                    start
                );

            }
        );


    charts.histogram =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                formatColumnName(
                                    column
                                ),

                            data:
                                counts,

                            backgroundColor:
                                chartColors[1],

                            borderRadius: 5

                        }

                    ]

                },

                options:
                    baseChartOptions()

            }
        );

}


/* =========================================================
   SCATTER
========================================================= */

function createScatterChart() {

    const canvas =
        document.getElementById(
            "scatterChart"
        );


    if (!canvas) {

        return;

    }


    if (
        numericColumns.length < 2
    ) {

        return;

    }


    const xColumn =
        numericColumns[0];


    const yColumn =
        numericColumns[1];


    const points =
        filteredData
            .map(
                row => ({

                    x:
                        toNumber(
                            row[xColumn]
                        ),

                    y:
                        toNumber(
                            row[yColumn]
                        )

                })
            )
            .filter(
                point =>
                    Number.isFinite(
                        point.x
                    ) &&
                    Number.isFinite(
                        point.y
                    )
            )
            .slice(0, 1000);


    charts.scatter =
        new Chart(
            canvas,
            {

                type: "scatter",

                data: {

                    datasets: [

                        {

                            label:
                                `${formatColumnName(xColumn)} vs ${formatColumnName(yColumn)}`,

                            data:
                                points,

                            backgroundColor:
                                chartColors[2],

                            pointRadius: 4,

                            pointHoverRadius: 6

                        }

                    ]

                },

                options: {

                    ...baseChartOptions(),

                    scales: {

                        x: {

                            title: {

                                display: true,

                                text:
                                    formatColumnName(
                                        xColumn
                                    ),

                                color:
                                    "rgba(255,255,255,0.55)",

                                font: {
                                    size: 8
                                }

                            },

                            ticks: {

                                color:
                                    "rgba(255,255,255,0.45)",

                                font: {
                                    size: 8
                                }

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        },

                        y: {

                            title: {

                                display: true,

                                text:
                                    formatColumnName(
                                        yColumn
                                    ),

                                color:
                                    "rgba(255,255,255,0.55)",

                                font: {
                                    size: 8
                                }

                            },

                            ticks: {

                                color:
                                    "rgba(255,255,255,0.45)",

                                font: {
                                    size: 8
                                }

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   LINE CHART
========================================================= */

function createLineChart() {

    const canvas =
        document.getElementById(
            "lineChart"
        );


    if (!canvas) {

        return;

    }


    const column =
        chooseNumericColumn();


    if (!column) {

        return;

    }


    const values =
        filteredData
            .map(
                row =>
                    toNumber(
                        row[column]
                    )
            )
            .filter(
                value =>
                    Number.isFinite(value)
            )
            .slice(0, 100);


    charts.line =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels:
                        values.map(
                            (_, index) =>
                                index + 1
                        ),

                    datasets: [

                        {

                            label:
                                formatColumnName(
                                    column
                                ),

                            data:
                                values,

                            borderColor:
                                chartColors[3],

                            backgroundColor:
                                "rgba(101,231,216,0.08)",

                            fill: true,

                            tension: 0.35,

                            pointRadius: 2

                        }

                    ]

                },

                options:
                    baseChartOptions()

            }
        );

}


/* =========================================================
   MISSING VALUES
========================================================= */

function createMissingChart() {

    const canvas =
        document.getElementById(
            "missingChart"
        );


    if (!canvas) {

        return;

    }


    const missing =
        columns.map(
            column => {

                return allData.filter(
                    row =>
                        row[column] === "" ||
                        row[column] === null ||
                        row[column] === undefined
                ).length;

            }
        );


    const sorted =
        columns
            .map(
                (column, index) => ({

                    column,

                    value:
                        missing[index]

                })
            )
            .sort(
                (a,b) =>
                    b.value -
                    a.value
            )
            .slice(0, 12);


    charts.missing =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        sorted.map(
                            item =>
                                formatColumnName(
                                    item.column
                                )
                        ),

                    datasets: [

                        {

                            label:
                                "Missing Values",

                            data:
                                sorted.map(
                                    item =>
                                        item.value
                                ),

                            backgroundColor:
                                "#35b9bd",

                            borderRadius: 5

                        }

                    ]

                },

                options:
                    baseChartOptions()

            }
        );

}


/* =========================================================
   CATEGORY COLUMN
========================================================= */

function chooseCategoryColumn() {

    const preferred = [
        "gender",
        "sex",
        "illness",
        "healthcondition",
        "disease",
        "condition",
        "region",
        "occupation",
        "education"
    ];


    const found =
        findColumn(
            preferred
        );


    if (found) {

        return found;

    }


    return (
        categoricalColumns[0] ||
        null
    );

}


/* =========================================================
   NUMERIC COLUMN
========================================================= */

function chooseNumericColumn() {

    const preferred = [
        "age",
        "visits",
        "doctorvisits",
        "income",
        "expenditure",
        "cost",
        "distance"
    ];


    const found =
        findColumn(
            preferred
        );


    if (found) {

        return found;

    }


    return (
        numericColumns[0] ||
        null
    );

}


/* =========================================================
   CATEGORY ENTRIES
========================================================= */

function getCategoryEntries(
    data,
    column,
    limit
) {

    const counts = {};


    data.forEach(
        row => {

            const value =
                String(
                    row[column] ?? "Unknown"
                );


            counts[value] =
                (counts[value] || 0) + 1;

        }
    );


    const sorted =
        Object
            .entries(counts)
            .sort(
                (a,b) =>
                    b[1] -
                    a[1]
            )
            .slice(
                0,
                limit
            );


    return {

        labels:
            sorted.map(
                item =>
                    shorten(
                        item[0],
                        18
                    )
            ),

        values:
            sorted.map(
                item =>
                    item[1]
            )

    };

}


/* =========================================================
   COLUMN PROFILE
========================================================= */

function createColumnProfile() {

    const container =
        document.getElementById(
            "columnProfile"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    columns.forEach(
        column => {

            const values =
                allData.map(
                    row =>
                        row[column]
                );


            const nonEmpty =
                values.filter(
                    value =>
                        value !== ""
                );


            const unique =
                new Set(
                    nonEmpty
                ).size;


            let type =
                "Categorical";


            if (
                numericColumns.includes(
                    column
                )
            ) {

                type = "Numeric";

            }
            else if (
                dateColumns.includes(
                    column
                )
            ) {

                type = "Date";

            }


            let min = "—";

            let max = "—";


            if (
                numericColumns.includes(
                    column
                )
            ) {

                const nums =
                    values
                        .map(
                            toNumber
                        )
                        .filter(
                            Number.isFinite
                        );


                if (
                    nums.length
                ) {

                    min =
                        formatNumber(
                            Math.min(...nums)
                        );

                    max =
                        formatNumber(
                            Math.max(...nums)
                        );

                }

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "profile-card";


            card.innerHTML = `

                <div class="profile-card-top">

                    <div class="profile-name">
                        ${escapeHTML(column)}
                    </div>

                    <span class="type-badge">
                        ${type}
                    </span>

                </div>


                <div class="profile-stats">

                    <div class="profile-stat">

                        <span>
                            VALUES
                        </span>

                        <strong>
                            ${nonEmpty.length.toLocaleString()}
                        </strong>

                    </div>


                    <div class="profile-stat">

                        <span>
                            UNIQUE
                        </span>

                        <strong>
                            ${unique.toLocaleString()}
                        </strong>

                    </div>


                    <div class="profile-stat">

                        <span>
                            MIN
                        </span>

                        <strong>
                            ${min}
                        </strong>

                    </div>


                    <div class="profile-stat">

                        <span>
                            MAX
                        </span>

                        <strong>
                            ${max}
                        </strong>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   DATA TABLE
========================================================= */

function renderTable() {

    const tableHead =
        document.getElementById(
            "tableHead"
        );


    const tableBody =
        document.getElementById(
            "tableBody"
        );


    if (
        !tableHead ||
        !tableBody
    ) {

        return;

    }


    tableHead.innerHTML = "";


    tableBody.innerHTML = "";


    columns.forEach(
        column => {

            const th =
                document.createElement(
                    "th"
                );


            th.textContent =
                column;


            tableHead.appendChild(
                th
            );

        }
    );


    const start =
        (
            currentPage -
            1
        ) *
        rowsPerPage;


    const pageRows =
        filteredData.slice(
            start,
            start + rowsPerPage
        );


    pageRows.forEach(
        row => {

            const tr =
                document.createElement(
                    "tr"
                );


            columns.forEach(
                column => {

                    const td =
                        document.createElement(
                            "td"
                        );


                    td.textContent =
                        row[column] ?? "";


                    tr.appendChild(
                        td
                    );

                }
            );


            tableBody.appendChild(
                tr
            );

        }
    );


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredData.length /
                rowsPerPage
            )
        );


    const pageInfo =
        document.getElementById(
            "pageInfo"
        );


    if (pageInfo) {

        pageInfo.textContent =
            `Page ${currentPage} of ${totalPages}`;

    }


    const previous =
        document.getElementById(
            "previousPage"
        );


    const next =
        document.getElementById(
            "nextPage"
        );


    if (previous) {

        previous.disabled =
            currentPage <= 1;

    }


    if (next) {

        next.disabled =
            currentPage >= totalPages;

    }

}


/* =========================================================
   DASHBOARD VIEW
========================================================= */

function applyDashboardView(
    view
) {

    const chartCards =
        document.querySelectorAll(
            ".chart-card"
        );


    if (
        view === "overview"
    ) {

        chartCards.forEach(
            card => {

                card.style.opacity =
                    "1";

            }
        );

    }


    if (
        view === "demographics"
    ) {

        chartCards.forEach(
            card => {

                card.style.opacity =
                    "0.55";

            }
        );


        const categoryChart =
            document.getElementById(
                "mainCategoryChart"
            );


        if (
            categoryChart
        ) {

            categoryChart
                .closest(".chart-card")
                .style.opacity = "1";

        }


        const donut =
            document.getElementById(
                "categoryDonutChart"
            );


        if (
            donut
        ) {

            donut
                .closest(".chart-card")
                .style.opacity = "1";

        }

    }


    if (
        view === "patterns"
    ) {

        chartCards.forEach(
            card => {

                card.style.opacity =
                    "0.55";

            }
        );


        [
            "numericHistogram",
            "scatterChart",
            "lineChart"
        ]
            .forEach(
                id => {

                    const canvas =
                        document.getElementById(
                            id
                        );


                    if (canvas) {

                        canvas
                            .closest(".chart-card")
                            .style.opacity =
                            "1";

                    }

                }
            );

    }

}


/* =========================================================
   FORMAT COLUMN NAME
========================================================= */

function formatColumnName(
    column
) {

    return String(column)
        .replace(
            /_/g,
            " "
        )
        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
        )
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(
    value
) {

    if (
        !Number.isFinite(value)
    ) {

        return "—";

    }


    if (
        Math.abs(value) >= 1000000
    ) {

        return (
            value /
            1000000
        ).toFixed(1) + "M";

    }


    if (
        Math.abs(value) >= 1000
    ) {

        return (
            value /
            1000
        ).toFixed(1) + "K";

    }


    return Number(
        value.toFixed(2)
    ).toLocaleString();

}


/* =========================================================
   TO NUMBER
========================================================= */

function toNumber(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return NaN;

    }


    return Number(
        String(value)
            .replace(/,/g, "")
            .replace(/%/g, "")
            .trim()
    );

}


/* =========================================================
   SHORTEN
========================================================= */

function shorten(
    text,
    length
) {

    text =
        String(text);


    if (
        text.length <= length
    ) {

        return text;

    }


    return (
        text.substring(
            0,
            length
        ) + "…"
    );

}


/* =========================================================
   ESCAPE HTML
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


/* =========================================================
   AI ROBOT
========================================================= */

function initializeRobot() {

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


    const input =
        document.getElementById(
            "aiInput"
        );


    const sendButton =
        document.getElementById(
            "aiSendButton"
        );


    if (
        !robotButton ||
        !chatWindow
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


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                chatWindow.classList.remove(
                    "active"
                );

            }
        );

    }


    document
        .querySelectorAll(
            ".ai-question"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const question =
                            button.textContent.trim();


                        addUserMessage(
                            question
                        );


                        setTimeout(
                            () => {

                                addAIMessage(
                                    answerQuestion(
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


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendAIMessage
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    sendAIMessage();

                }

            }
        );

    }

}


/* =========================================================
   SEND AI MESSAGE
========================================================= */

function sendAIMessage() {

    const input =
        document.getElementById(
            "aiInput"
        );


    if (
        !input
    ) {

        return;

    }


    const question =
        input.value.trim();


    if (
        !question
    ) {

        return;

    }


    addUserMessage(
        question
    );


    input.value = "";


    setTimeout(
        () => {

            addAIMessage(
                answerQuestion(
                    question
                )
            );

        },
        350
    );

}


/* =========================================================
   AI ANSWERS
========================================================= */

function answerQuestion(
    question
) {

    const lower =
        question.toLowerCase();


    if (
        lower.includes("how many") &&
        lower.includes("record")
    ) {

        return `The current filtered dataset contains ${filteredData.length.toLocaleString()} records.`;

    }


    if (
        lower.includes("variable") ||
        lower.includes("column")
    ) {

        return `The dataset contains ${columns.length} variables: ${columns.slice(0, 8).join(", ")}${columns.length > 8 ? ", and more." : "."}`;

    }


    if (
        lower.includes("missing") ||
        lower.includes("null")
    ) {

        const missing =
            allData.reduce(
                (total, row) => {

                    return total +
                        columns.filter(
                            column =>
                                row[column] === ""
                        ).length;

                },
                0
            );


        return `The dataset currently has ${missing.toLocaleString()} empty cells across its variables.`;

    }


    if (
        lower.includes("category") ||
        lower.includes("categor")
    ) {

        if (
            categoricalColumns.length
        ) {

            return `Detected categorical variables include ${categoricalColumns.slice(0, 6).join(", ")}.`;

        }


        return "No categorical variables were detected.";

    }


    if (
        lower.includes("numeric") ||
        lower.includes("number")
    ) {

        if (
            numericColumns.length
        ) {

            return `Detected numeric variables include ${numericColumns.slice(0, 6).join(", ")}.`;

        }


        return "No numeric variables were detected.";

    }


    if (
        lower.includes("dataset")
    ) {

        return `This portfolio is connected to the healthcare doctor visits CSV. It currently contains ${allData.length.toLocaleString()} records and ${columns.length} variables.`;

    }


    return `I can help you explore ${allData.length.toLocaleString()} healthcare records, ${columns.length} variables, categorical distributions, numeric patterns and missing values.`;

}


/* =========================================================
   ADD USER MESSAGE
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


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "ai-message";

    wrapper.style.justifyContent =
        "flex-end";


    wrapper.innerHTML = `

        <div
            style="
                max-width:275px;
                padding:10px 12px;
                border-radius:13px 3px 13px 13px;
                background:linear-gradient(
                    135deg,
                    #087fce,
                    #00a8d6
                );
                color:white;
                font-size:11px;
                line-height:1.5;
            "
        >

            ${escapeHTML(message)}

        </div>

    `;


    body.appendChild(
        wrapper
    );


    body.scrollTop =
        body.scrollHeight;

}


/* =========================================================
   ADD AI MESSAGE
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


    const wrapper =
        document.createElement(
            "div"
        );


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


    body.appendChild(
        wrapper
    );


    body.scrollTop =
        body.scrollHeight;

}