// ============================================================
// HEALTHCARE ANALYTICS - FRONTEND API
// ============================================================

const API_BASE_URL =
    "https://healthcare-analytics-doctor-visits.vercel.app/api";


// ============================================================
// GENERIC API REQUEST
// ============================================================

async function apiRequest(endpoint, options = {}) {

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,

                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                `API Error: ${response.status}`
            );
        }

        return data;

    } catch (error) {

        console.error(
            "API request failed:",
            endpoint,
            error
        );

        throw error;
    }
}


// ============================================================
// HEALTH
// ============================================================

async function getHealth() {

    return await apiRequest("/health");
}


// ============================================================
// DATASET
// ============================================================

async function getDataset() {

    return await apiRequest("/dataset");
}


// ============================================================
// DASHBOARD
// ============================================================

async function getDashboard() {

    return await apiRequest("/dashboard");
}


// ============================================================
// ANALYSIS
// ============================================================

async function getAnalysis() {

    return await apiRequest("/analysis");
}


// ============================================================
// INSIGHTS
// ============================================================

async function getInsights() {

    return await apiRequest("/insights");
}


// ============================================================
// RECENT RECORDS
// ============================================================

async function getRecords(limit = 10) {

    return await apiRequest(
        `/records?limit=${limit}`
    );
}


// ============================================================
// FILTERED ANALYSIS
// ============================================================

async function getFilteredAnalysis(filters = {}) {

    const params =
        new URLSearchParams();

    Object.entries(filters).forEach(
        ([key, value]) => {

            if (
                value !== undefined &&
                value !== null &&
                value !== "" &&
                value !== "all"
            ) {

                params.append(
                    key,
                    value
                );
            }
        }
    );

    const query =
        params.toString();

    return await apiRequest(
        query
            ? `/analysis?${query}`
            : "/analysis"
    );
}


// ============================================================
// FILTERED DASHBOARD
// ============================================================

async function getFilteredDashboard(filters = {}) {

    const params =
        new URLSearchParams();

    Object.entries(filters).forEach(
        ([key, value]) => {

            if (
                value !== undefined &&
                value !== null &&
                value !== "" &&
                value !== "all"
            ) {

                params.append(
                    key,
                    value
                );
            }
        }
    );

    const query =
        params.toString();

    return await apiRequest(
        query
            ? `/dashboard?${query}`
            : "/dashboard"
    );
}


// ============================================================
// DATASET CONNECTION STATUS
// ============================================================

async function showDatasetStatus(
    elementId = "dataset-status"
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    try {

        element.textContent =
            "Connecting to dataset...";

        const data =
            await getHealth();

        if (
            data.success === true &&
            data.status === "connected"
        ) {

            element.textContent =
                `Dataset Connected • ${formatNumber(data.rows)} records • ${formatNumber(data.columns)} columns`;

            element.classList.add(
                "connected"
            );

            element.classList.remove(
                "disconnected"
            );

        } else {

            element.textContent =
                "Dataset connection unavailable";

            element.classList.add(
                "disconnected"
            );

            element.classList.remove(
                "connected"
            );
        }

    } catch (error) {

        element.textContent =
            "Dataset connection unavailable";

        element.classList.add(
            "disconnected"
        );

        element.classList.remove(
            "connected"
        );
    }
}


// ============================================================
// LOAD COMMON PAGE DATA
// ============================================================

async function loadCommonData() {

    try {

        const [
            health,
            dataset
        ] = await Promise.all([

            getHealth(),
            getDataset()

        ]);

        return {
            health,
            dataset
        };

    } catch (error) {

        console.error(
            "Unable to load common data:",
            error
        );

        throw error;
    }
}


// ============================================================
// NUMBER FORMAT
// ============================================================

function formatNumber(
    value,
    decimals = 0
) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits:
                decimals,

            maximumFractionDigits:
                decimals
        }
    );
}


// ============================================================
// SAFE TEXT
// ============================================================

function safeText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }

    return String(value);
}