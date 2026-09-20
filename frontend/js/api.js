/* =========================================================
   HEALTHCARE ANALYTICS
   CENTRAL API MODULE
   ========================================================= */

const API_BASE_URL = "http://127.0.0.1:5000";


/* =========================================================
   GENERIC API REQUEST
   ========================================================= */

async function apiRequest(endpoint, options = {}) {

    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        body: options.body
            ? JSON.stringify(options.body)
            : undefined
    });

    let result = null;

    try {
        result = await response.json();
    } catch (error) {
        result = null;
    }

    if (!response.ok) {

        throw new Error(
            result?.message ||
            result?.error ||
            `API request failed: ${response.status}`
        );

    }

    return result;
}


/* =========================================================
   HEALTH CHECK
   ========================================================= */

async function checkAPIHealth() {

    return await apiRequest("/");


}


/* =========================================================
   GET DATASET
   ========================================================= */

async function getDataset() {

    return await apiRequest("/dataset");

}


/* =========================================================
   GET DATASET INFORMATION
   ========================================================= */

async function getDatasetInfo() {

    return await apiRequest("/dataset/info");

}


/* =========================================================
   GET DATASET SUMMARY
   ========================================================= */

async function getDatasetSummary() {

    return await apiRequest("/dataset/summary");

}


/* =========================================================
   GET ANALYTICS
   ========================================================= */

async function getAnalytics() {

    return await apiRequest("/analytics");

}


/* =========================================================
   GET INSIGHTS
   ========================================================= */

async function getInsights() {

    return await apiRequest("/insights");

}


/* =========================================================
   EXPORT
   ========================================================= */

window.HealthcareAPI = {

    baseURL: API_BASE_URL,

    request: apiRequest,

    health: checkAPIHealth,

    getDataset: getDataset,

    getDatasetInfo: getDatasetInfo,

    getDatasetSummary: getDatasetSummary,

    getAnalytics: getAnalytics,

    getInsights: getInsights

};


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.getDataset = getDataset;

window.getDatasetInfo = getDatasetInfo;

window.getDatasetSummary = getDatasetSummary;

window.getAnalytics = getAnalytics;

window.getInsights = getInsights;