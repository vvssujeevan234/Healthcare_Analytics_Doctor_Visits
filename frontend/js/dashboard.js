/* ==========================================================
   HEALTHCARE ANALYTICS POWER DASHBOARD
   ========================================================== */

const API_BASE = "";

const charts = {};

let currentFilters = {};


// ==========================================================
// DOM HELPER
// ==========================================================

function $(id) {
    return document.getElementById(id);
}


// ==========================================================
// NUMBER FORMAT
// ==========================================================

function formatNumber(value) {

    if (value === null || value === undefined) {
        return "—";
    }

    return Number(value).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );
}


// ==========================================================
// FETCH JSON
// ==========================================================

async function fetchJSON(url, options = {}) {

    const response = await fetch(
        url,
        options
    );

    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );
    }

    return await response.json();
}


// ==========================================================
// LOAD DATASET FILTER OPTIONS
// ==========================================================

async function loadFilterOptions() {

    try {

        const result = await fetchJSON(
            `${API_BASE}/api/dashboard`
        );

        if (!result.success) {
            throw new Error(result.error);
        }


        // Gender options
        const genderChart =
            result.charts.gender;

        populateSelect(
            "genderFilter",
            genderChart.labels
        );


        // Illness options
        populateSelect(
            "illnessFilter",
            result.charts.illness_distribution.labels
        );


        // Health options
        populateSelect(
            "healthFilter",
            result.charts.health.labels
        );


        // Chronic options
        populateSelect(
            "chronicFilter",
            result.charts.chronic.labels
        );


    } catch (error) {

        console.error(
            "Filter loading error:",
            error
        );
    }
}


// ==========================================================
// SELECT POPULATION
// ==========================================================

function populateSelect(
    id,
    values
) {

    const select = $(id);

    if (!select) {
        return;
    }

    const existing =
        select.value;

    select.innerHTML = "";


    const allOption =
        document.createElement(
            "option"
        );

    allOption.value = "all";

    allOption.textContent =
        "All";

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


    if (
        existing &&
        [...select.options]
            .some(
                option =>
                    option.value === existing
            )
    ) {

        select.value =
            existing;
    }
}


// ==========================================================
// GET FILTERS
// ==========================================================

function getFilters() {

    return {

        gender:
            $("genderFilter").value,

        age_group:
            $("ageGroupFilter").value,

        illness:
            $("illnessFilter").value,

        health:
            $("healthFilter").value,

        chronic:
            $("chronicFilter").value,

        private:
            $("privateFilter").value,

        freepoor:
            $("freepoorFilter").value,

        freerepat:
            $("freerepatFilter").value,

        min_visits:
            $("minVisitsFilter").value,

        max_visits:
            $("maxVisitsFilter").value

    };
}


// ==========================================================
// BUILD QUERY
// ==========================================================

function buildQuery(filters) {

    const params =
        new URLSearchParams();


    Object.entries(filters)
        .forEach(
            ([key, value]) => {

                if (
                    value !== undefined &&
                    value !== null &&
                    value !== "" &&
                    value !== "all"
                ) {

                    params.set(
                        key,
                        value
                    );

                }

            }
        );


    const query =
        params.toString();

    return query
        ? `?${query}`
        : "";
}


// ==========================================================
// ACTIVE FILTER DISPLAY
// ==========================================================

function displayActiveFilters(filters) {

    const container =
        $("activeFilters");

    if (!container) {
        return;
    }


    const active = [];


    Object.entries(filters)
        .forEach(
            ([key, value]) => {

                if (
                    value &&
                    value !== "all"
                ) {

                    active.push(
                        `${key}: ${value}`
                    );

                }

            }
        );


    if (active.length === 0) {

        container.textContent =
            "No filters applied";

        return;
    }


    container.innerHTML =
        active
            .map(
                item =>
                    `<span>${item}</span>`
            )
            .join("");
}


// ==========================================================
// DESTROY CHART
// ==========================================================

function destroyChart(id) {

    if (charts[id]) {

        charts[id].destroy();

        delete charts[id];

    }
}


// ==========================================================
// COMMON CHART OPTIONS
// ==========================================================

function commonOptions() {

    return {

        responsive: true,

        maintainAspectRatio: false,

        animation: {
            duration: 700
        },

        plugins: {

            legend: {
                labels: {
                    color: "#9eb4b7"
                }
            },

            tooltip: {
                enabled: true
            }

        },

        scales: {

            x: {

                ticks: {
                    color: "#81999d"
                },

                grid: {
                    color:
                        "rgba(255,255,255,0.05)"
                }

            },

            y: {

                ticks: {
                    color: "#81999d"
                },

                grid: {
                    color:
                        "rgba(255,255,255,0.05)"
                }

            }

        }

    };
}


// ==========================================================
// GENDER DONUT
// ==========================================================

function createGenderChart(data) {

    destroyChart(
        "genderChart"
    );


    charts.genderChart =
        new Chart(
            $("genderChart"),
            {

                type: "doughnut",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Patients",

                            data:
                                data.values,

                            borderWidth: 2,

                            borderColor:
                                "#ffffff",

                            backgroundColor: [

                                "#38a8e8",

                                "#ff6384",

                                "#7bdcb5",

                                "#ffd166",

                                "#9b8cff"

                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "58%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {
                                color:
                                    "#a6b9bc"
                            }

                        }

                    }

                }

            }
        );
}


// ==========================================================
// AGE HISTOGRAM
// ==========================================================

function createAgeChart(data) {

    destroyChart(
        "ageChart"
    );


    charts.ageChart =
        new Chart(
            $("ageChart"),
            {

                type: "bar",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Number of Patients",

                            data:
                                data.values,

                            backgroundColor:
                                "rgba(61, 174, 235, 0.75)",

                            borderColor:
                                "#3daedb",

                            borderWidth: 1,

                            borderRadius: 5

                        }

                    ]

                },

                options:
                    commonOptions()

            }
        );
}


// ==========================================================
// VISITS HISTOGRAM
// ==========================================================

function createVisitsChart(data) {

    destroyChart(
        "visitsDistributionChart"
    );


    charts.visitsDistributionChart =
        new Chart(
            $("visitsDistributionChart"),
            {

                type: "bar",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Patients",

                            data:
                                data.values,

                            backgroundColor:
                                "rgba(255, 107, 129, 0.75)",

                            borderColor:
                                "#ff6b81",

                            borderWidth: 1,

                            borderRadius: 4

                        }

                    ]

                },

                options:
                    commonOptions()

            }
        );
}


// ==========================================================
// GENDER AVERAGE
// ==========================================================

function createGenderAverageChart(data) {

    destroyChart(
        "genderAverageChart"
    );


    charts.genderAverageChart =
        new Chart(
            $("genderAverageChart"),
            {

                type: "bar",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Mean Visits",

                            data:
                                data.values,

                            backgroundColor:
                                "rgba(62, 190, 175, 0.75)",

                            borderColor:
                                "#3ebead",

                            borderWidth: 1,

                            borderRadius: 6

                        }

                    ]

                },

                options:
                    commonOptions()

            }
        );
}


// ==========================================================
// ILLNESS VS VISITS
// ==========================================================

function createIllnessVisitsChart(data) {

    destroyChart(
        "illnessVisitsChart"
    );


    charts.illnessVisitsChart =
        new Chart(
            $("illnessVisitsChart"),
            {

                type: "line",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Average Visits",

                            data:
                                data.values,

                            borderColor:
                                "#56d6c1",

                            backgroundColor:
                                "rgba(86,214,193,0.15)",

                            fill: true,

                            tension: 0.35,

                            pointRadius: 5,

                            pointBackgroundColor:
                                "#56d6c1"

                        }

                    ]

                },

                options:
                    commonOptions()

            }
        );
}


// ==========================================================
// ILLNESS DISTRIBUTION
// ==========================================================

function createIllnessDistributionChart(data) {

    destroyChart(
        "illnessDistributionChart"
    );


    charts.illnessDistributionChart =
        new Chart(
            $("illnessDistributionChart"),
            {

                type: "bar",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Patients",

                            data:
                                data.values,

                            backgroundColor:
                                "rgba(143, 113, 232, 0.75)",

                            borderColor:
                                "#8f71e8",

                            borderWidth: 1,

                            borderRadius: 5

                        }

                    ]

                },

                options:
                    commonOptions()

            }
        );
}


// ==========================================================
// AGE VS VISITS
// ==========================================================

function createAgeVisitsChart(data) {

    destroyChart(
        "ageVisitsChart"
    );


    const female =
        data
            .filter(
                p =>
                    String(
                        p.gender
                    ).toLowerCase()
                    === "female"
            )
            .map(
                p => ({
                    x: p.x,
                    y: p.y
                })
            );


    const male =
        data
            .filter(
                p =>
                    String(
                        p.gender
                    ).toLowerCase()
                    === "male"
            )
            .map(
                p => ({
                    x: p.x,
                    y: p.y
                })
            );


    charts.ageVisitsChart =
        new Chart(
            $("ageVisitsChart"),
            {

                type: "scatter",

                data: {

                    datasets: [

                        {

                            label:
                                "Female",

                            data:
                                female,

                            backgroundColor:
                                "#38a8e8"

                        },

                        {

                            label:
                                "Male",

                            data:
                                male,

                            backgroundColor:
                                "#ff6384"

                        }

                    ]

                },

                options: {

                    ...commonOptions(),

                    scales: {

                        x: {

                            type:
                                "linear",

                            position:
                                "bottom",

                            title: {

                                display:
                                    true,

                                text:
                                    "Age",

                                color:
                                    "#9eb4b7"

                            },

                            ticks: {
                                color:
                                    "#81999d"
                            },

                            grid: {
                                color:
                                    "rgba(255,255,255,0.05)"
                            }

                        },

                        y: {

                            title: {

                                display:
                                    true,

                                text:
                                    "Doctor Visits",

                                color:
                                    "#9eb4b7"

                            },

                            ticks: {
                                color:
                                    "#81999d"
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


// ==========================================================
// AGE GROUP
// ==========================================================

function createAgeGroupChart(data) {

    destroyChart(
        "ageGroupChart"
    );


    charts.ageGroupChart =
        new Chart(
            $("ageGroupChart"),
            {

                type: "bar",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Average Visits",

                            data:
                                data.values,

                            backgroundColor:
                                "rgba(66, 160, 220, 0.75)",

                            borderColor:
                                "#42a0dc",

                            borderWidth: 1,

                            borderRadius: 5

                        }

                    ]

                },

                options:
                    commonOptions()

            }
        );
}


// ==========================================================
// CHRONIC
// ==========================================================

function createChronicChart(data) {

    destroyChart(
        "chronicChart"
    );


    charts.chronicChart =
        new Chart(
            $("chronicChart"),
            {

                type: "bar",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Average Visits",

                            data:
                                data.values,

                            backgroundColor:
                                "rgba(255, 177, 89, 0.75)",

                            borderColor:
                                "#ffb159",

                            borderWidth: 1,

                            borderRadius: 5

                        }

                    ]

                },

                options:
                    commonOptions()

            }
        );
}


// ==========================================================
// HEALTH
// ==========================================================

function createHealthChart(data) {

    destroyChart(
        "healthChart"
    );


    charts.healthChart =
        new Chart(
            $("healthChart"),
            {

                type: "bar",

                data: {

                    labels:
                        data.labels,

                    datasets: [

                        {

                            label:
                                "Average Visits",

                            data:
                                data.values,

                            backgroundColor:
                                "rgba(255, 99, 132, 0.7)",

                            borderColor:
                                "#ff6384",

                            borderWidth: 1,

                            borderRadius: 5

                        }

                    ]

                },

                options:
                    commonOptions()

            }
        );
}


// ==========================================================
// CORRELATION MATRIX
// ==========================================================

function createCorrelationMatrix(data) {

    const container =
        $("correlationMatrix");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !data ||
        !data.labels ||
        !data.values
    ) {

        container.textContent =
            "No correlation data.";

        return;
    }


    const table =
        document.createElement(
            "table"
        );

    table.className =
        "correlation-table";


    // Header

    const thead =
        document.createElement(
            "thead"
        );

    const headerRow =
        document.createElement(
            "tr"
        );


    const blank =
        document.createElement(
            "th"
        );

    blank.textContent =
        "Variable";

    headerRow.appendChild(
        blank
    );


    data.labels.forEach(
        label => {

            const th =
                document.createElement(
                    "th"
                );

            th.textContent =
                label;

            headerRow.appendChild(
                th
            );

        }
    );


    thead.appendChild(
        headerRow
    );


    // Body

    const tbody =
        document.createElement(
            "tbody"
        );


    data.values.forEach(
        (row, rowIndex) => {

            const tr =
                document.createElement(
                    "tr"
                );


            const rowName =
                document.createElement(
                    "th"
                );

            rowName.textContent =
                data.labels[rowIndex];

            tr.appendChild(
                rowName
            );


            row.forEach(
                value => {

                    const td =
                        document.createElement(
                            "td"
                        );

                    td.textContent =
                        Number(value)
                            .toFixed(2);


                    const intensity =
                        Math.min(
                            Math.abs(
                                Number(value)
                            ),
                            1
                        );


                    td.style.background =
                        `rgba(44, 208, 190, ${0.08 + intensity * 0.35})`;


                    tr.appendChild(
                        td
                    );

                }
            );


            tbody.appendChild(
                tr
            );

        }
    );


    table.appendChild(
        thead
    );

    table.appendChild(
        tbody
    );

    container.appendChild(
        table
    );
}


// ==========================================================
// KPI UPDATE
// ==========================================================

function updateStatistics(data) {

    const stats =
        data.statistics;


    $("totalPatients").textContent =
        formatNumber(
            stats.total_records
        );


    $("totalVisits").textContent =
        formatNumber(
            stats.total_visits
        );


    $("averageVisits").textContent =
        formatNumber(
            stats.average_visits
        );


    $("averageAge").textContent =
        formatNumber(
            stats.average_age
        );
}


// ==========================================================
// TABLE
// ==========================================================

function updateTable(data) {

    const header =
        $("tableHeader");

    const body =
        $("tableBody");


    header.innerHTML = "";

    body.innerHTML = "";


    if (
        !data.records ||
        !data.records.columns
    ) {

        return;
    }


    data.records.columns.forEach(
        column => {

            const th =
                document.createElement(
                    "th"
                );

            th.textContent =
                column;

            header.appendChild(
                th
            );

        }
    );


    data.records.rows.forEach(
        row => {

            const tr =
                document.createElement(
                    "tr"
                );


            row.forEach(
                value => {

                    const td =
                        document.createElement(
                            "td"
                        );

                    td.textContent =
                        value ?? "—";

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


    $("recordCount").textContent =
        `Showing ${data.records.rows.length} records`;
}


// ==========================================================
// INSIGHT
// ==========================================================

function updateInsight(data) {

    $("dashboardInsightTitle")
        .textContent =
        data.insight.title;


    $("dashboardInsight")
        .textContent =
        data.insight.message;
}


// ==========================================================
// LOAD DASHBOARD
// ==========================================================

async function loadDashboard(
    filters = {}
) {

    try {

        currentFilters =
            filters;


        displayActiveFilters(
            filters
        );


        $("chartStatus")
            .textContent =
            "Loading data...";


        const query =
            buildQuery(
                filters
            );


        const data =
            await fetchJSON(
                `${API_BASE}/api/dashboard${query}`
            );


        if (!data.success) {

            throw new Error(
                data.error
            );
        }


        // --------------------------------------------------
        // Connection
        // --------------------------------------------------

        $("connectionStatus")
            .textContent =
            "CSV Connected";


        $("datasetStatus")
            .textContent =
            `${data.filter_count.toLocaleString()} filtered records`;


        $("datasetStatusDot")
            .classList.add(
                "connected"
            );


        $("statusDot")
            .classList.add(
                "connected"
            );


        // --------------------------------------------------
        // Statistics
        // --------------------------------------------------

        updateStatistics(
            data
        );


        // --------------------------------------------------
        // Charts
        // --------------------------------------------------

        createGenderChart(
            data.charts.gender
        );


        createAgeChart(
            data.charts.age
        );


        createVisitsChart(
            data.charts.visits
        );


        createGenderAverageChart(
            data.charts.gender_average
        );


        createIllnessVisitsChart(
            data.charts.illness_visits
        );


        createIllnessDistributionChart(
            data.charts.illness_distribution
        );


        createAgeVisitsChart(
            data.charts.age_visits
        );


        createAgeGroupChart(
            data.charts.age_group
        );


        createChronicChart(
            data.charts.chronic
        );


        createHealthChart(
            data.charts.health
        );


        createCorrelationMatrix(
            data.charts.correlation
        );


        // --------------------------------------------------
        // Insight
        // --------------------------------------------------

        updateInsight(
            data
        );


        // --------------------------------------------------
        // Table
        // --------------------------------------------------

        updateTable(
            data
        );


        $("chartStatus")
            .textContent =
            "Charts updated from CSV";


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        $("connectionStatus")
            .textContent =
            "Backend Error";


        $("datasetStatus")
            .textContent =
            "Unable to load dataset";


        $("chartStatus")
            .textContent =
            error.message;


        $("dashboardInsight")
            .textContent =
            "Please make sure the Flask backend is running on port 5000.";

    }

}


// ==========================================================
// APPLY FILTERS
// ==========================================================

function applyFilters() {

    const filters =
        getFilters();


    loadDashboard(
        filters
    );
}


// ==========================================================
// RESET FILTERS
// ==========================================================

function resetFilters() {

    const ids = [

        "genderFilter",

        "ageGroupFilter",

        "illnessFilter",

        "healthFilter",

        "chronicFilter",

        "privateFilter",

        "freepoorFilter",

        "freerepatFilter"

    ];


    ids.forEach(
        id => {

            const element =
                $(id);

            if (element) {

                element.value =
                    "all";

            }

        }
    );


    $("minVisitsFilter")
        .value = "";


    $("maxVisitsFilter")
        .value = "";


    loadDashboard({});
}


// ==========================================================
// AI ROBOT
// ==========================================================

function initializeAI() {

    const robot =
        $("aiRobotButton");

    const windowElement =
        $("aiChatWindow");

    const close =
        $("aiCloseButton");


    robot.addEventListener(
        "click",
        () => {

            windowElement.classList.toggle(
                "open"
            );

        }
    );


    close.addEventListener(
        "click",
        () => {

            windowElement.classList.remove(
                "open"
            );

        }
    );


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
                            button.dataset.question;

                        askAI(
                            question
                        );

                    }
                );

            }
        );


    $("aiChatForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const input =
                    $("aiChatInput");


                const question =
                    input.value.trim();


                if (!question) {
                    return;
                }


                askAI(
                    question
                );


                input.value = "";

            }
        );

}


// ==========================================================
// ADD CHAT MESSAGE
// ==========================================================

function addChatMessage(
    message,
    type = "bot"
) {

    const body =
        $("aiChatBody");


    const div =
        document.createElement(
            "div"
        );


    div.className =
        `ai-message ai-message-${type}`;


    const p =
        document.createElement(
            "p"
        );


    p.textContent =
        message;


    div.appendChild(
        p
    );


    body.appendChild(
        div
    );


    body.scrollTop =
        body.scrollHeight;
}


// ==========================================================
// ASK AI
// ==========================================================

async function askAI(
    question
) {

    addChatMessage(
        question,
        "user"
    );


    try {

        const response =
            await fetch(
                `${API_BASE}/api/ask`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            question:
                                question,

                            ...currentFilters

                        })

                }
            );


        const data =
            await response.json();


        if (
            !data.success
        ) {

            throw new Error(
                data.error
            );

        }


        addChatMessage(
            data.answer,
            "bot"
        );


    } catch (error) {

        console.error(
            error
        );


        addChatMessage(
            "I could not connect to the Flask backend. Please check that the backend is running.",
            "bot"
        );

    }

}


// ==========================================================
// MOBILE MENU
// ==========================================================

function initializeMobileMenu() {

    const button =
        $("dashboardMenuToggle");

    const navigation =
        $("dashboardMobileNavigation");


    if (!button || !navigation) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "open"
            );

        }
    );

}


// ==========================================================
// EVENTS
// ==========================================================

function initializeEvents() {

    $("applyFilters")
        .addEventListener(
            "click",
            applyFilters
        );


    $("resetFilters")
        .addEventListener(
            "click",
            resetFilters
        );


    [
        "genderFilter",
        "ageGroupFilter",
        "illnessFilter",
        "healthFilter",
        "chronicFilter",
        "privateFilter",
        "freepoorFilter",
        "freerepat"
    ]
        .forEach(
            id => {

                const element =
                    $(id);

                if (element) {

                    element.addEventListener(
                        "change",
                        () => {
                            // User clicks Apply
                        }
                    );

                }

            }
        );

}


// ==========================================================
// INITIALIZE
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeEvents();

        initializeAI();

        initializeMobileMenu();

        await loadFilterOptions();

        await loadDashboard({});

    }
);
