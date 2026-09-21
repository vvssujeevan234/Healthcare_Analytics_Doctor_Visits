/* =====================================================
   HEALTHCARE ANALYTICS FOR DOCTOR VISITS
   HOME PAGE + AI ANALYTICS ASSISTANT
===================================================== */


/* =====================================================
   HERO VIDEO
===================================================== */

const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
    heroVideo.muted = true;

    const playVideo = () => {
        heroVideo.play().catch(() => {
            console.log("Video autoplay was blocked by the browser.");
        });
    };

    playVideo();
}


/* =====================================================
   DEMO STATISTICS
===================================================== */

const demoStatistics = {
    patients: 1000,
    visits: 2500,
    averageVisits: 2.5
};


/* =====================================================
   NUMBER ANIMATION
===================================================== */

function animateNumber(element, target, decimals = 0) {

    if (!element) {
        return;
    }

    const duration = 1200;
    const startTime = performance.now();

    function update(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(
            elapsed / duration,
            1
        );

        const eased =
            1 - Math.pow(1 - progress, 3);

        const current = target * eased;

        if (decimals > 0) {

            element.textContent =
                current.toFixed(decimals);

        } else {

            element.textContent =
                Math.round(current).toLocaleString();

        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


/* =====================================================
   PROJECT STATISTICS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    animateNumber(
        document.getElementById("patientCount"),
        demoStatistics.patients
    );

    animateNumber(
        document.getElementById("visitCount"),
        demoStatistics.visits
    );

    animateNumber(
        document.getElementById("averageVisits"),
        demoStatistics.averageVisits,
        2
    );

});


/* =====================================================
   AI ASSISTANT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const aiRobot =
        document.getElementById("aiRobot");

    const aiChat =
        document.getElementById("aiChat");

    const aiClose =
        document.getElementById("aiClose");

    const aiQuestion =
        document.getElementById("aiQuestion");

    const aiSend =
        document.getElementById("aiSend");

    const aiChatBody =
        document.getElementById("aiChatBody");


    /* =================================================
       CHECK ELEMENTS
    ================================================= */

    if (!aiRobot) {
        console.error("AI Robot button not found.");
        return;
    }

    if (!aiChat) {
        console.error("AI Chat window not found.");
        return;
    }

    if (!aiChatBody) {
        console.error("AI Chat body not found.");
        return;
    }


    /* =================================================
       OPEN CHAT
    ================================================= */

    aiRobot.addEventListener("click", () => {

        aiChat.classList.add("open");

        setTimeout(() => {

            if (aiQuestion) {
                aiQuestion.focus();
            }

        }, 250);

    });


    /* =================================================
       CLOSE CHAT
    ================================================= */

    if (aiClose) {

        aiClose.addEventListener("click", () => {

            aiChat.classList.remove("open");

        });

    }


    /* =================================================
       PROJECT KNOWLEDGE
    ================================================= */

    const projectKnowledge = [

        {
            keywords: [
                "what is this project",
                "project about",
                "about project",
                "healthcare analytics"
            ],
            answer:
                "Healthcare Analytics for Doctor Visits is a data analysis project that studies doctor visit patterns using healthcare data. Python, Pandas, NumPy, Matplotlib and Seaborn are used to understand patient characteristics, illness levels, health conditions and healthcare utilization."
        },

        {
            keywords: [
                "what does the dataset contain",
                "dataset",
                "data contain",
                "columns"
            ],
            answer:
                "The healthcare dataset contains patient-related information used to study doctor visits. The analysis includes variables such as gender, age, illness, visits, chronic conditions, health status and income."
        },

        {
            keywords: [
                "what libraries are used",
                "python",
                "technology",
                "technologies",
                "libraries"
            ],
            answer:
                "The project uses Python with Jupyter Notebook. Pandas is used for data manipulation, NumPy for numerical operations, Matplotlib for plotting, and Seaborn for statistical data visualization."
        },

        {
            keywords: [
                "pandas"
            ],
            answer:
                "Pandas is used to load the CSV dataset and perform DataFrame operations such as head(), tail(), shape, info(), describe(), missing-value checking, grouping and aggregation."
        },

        {
            keywords: [
                "numpy"
            ],
            answer:
                "NumPy is used for numerical and mathematical operations and works together with Pandas and the visualization libraries."
        },

        {
            keywords: [
                "matplotlib"
            ],
            answer:
                "Matplotlib is used to create and customize charts and figures in the Jupyter Notebook analysis."
        },

        {
            keywords: [
                "seaborn"
            ],
            answer:
                "Seaborn is used to create statistical visualizations including count plots, histograms, bar plots, box plots, scatter plots and heatmaps."
        },

        {
            keywords: [
                "explain gender analysis",
                "gender analysis",
                "gender"
            ],
            answer:
                "The gender analysis examines patient distribution by gender and compares the average and median recorded doctor visits between gender groups."
        },

        {
            keywords: [
                "explain age versus doctor visits",
                "explain age vs visits",
                "age vs visits",
                "age versus visits"
            ],
            answer:
                "The age-versus-visits analysis uses a scatter plot to explore how recorded doctor visits vary with patient age. Gender is used to distinguish the observations in the visualization."
        },

        {
            keywords: [
                "explain the illness analysis",
                "explain illness analysis",
                "illness analysis",
                "illness score",
                "illness"
            ],
            answer:
                "The illness analysis groups the data by illness score and calculates the count and mean doctor visits. A visualization is then used to examine the relationship between illness score and average recorded visits."
        },

        {
            keywords: [
                "chronic conditions",
                "chronic"
            ],
            answer:
                "The chronic-condition analysis compares the number of chronic conditions with average doctor visits. It helps explore healthcare utilization across different chronic-condition levels."
        },

        {
            keywords: [
                "health status"
            ],
            answer:
                "The health-status analysis groups records by health status and compares the average number of doctor visits for each group."
        },

        {
            keywords: [
                "income"
            ],
            answer:
                "The income-versus-visits scatter plot explores whether there are visible patterns between income and the recorded number of doctor visits."
        },

        {
            keywords: [
                "correlation heatmap",
                "heatmap",
                "correlation"
            ],
            answer:
                "The correlation heatmap summarizes linear relationships among numerical healthcare variables. Positive values indicate variables that tend to increase together, while negative values indicate an opposite tendency. Correlation alone does not establish causation."
        },

        {
            keywords: [
                "preprocessing",
                "cleaning",
                "null",
                "missing"
            ],
            answer:
                "The preprocessing stage checks the dataset structure, data types, descriptive statistics, missing values and other basic data-quality characteristics before performing analysis."
        },

        {
            keywords: [
                "univariate"
            ],
            answer:
                "Univariate analysis studies one variable at a time. This project includes gender distribution, age distribution and doctor-visit distribution."
        },

        {
            keywords: [
                "multivariate"
            ],
            answer:
                "Multivariate analysis examines multiple variables together. Examples include visits by gender and age versus visits colored by gender."
        },

        {
            keywords: [
                "project conclusion",
                "conclusion",
                "result",
                "conclude"
            ],
            answer:
                "The project demonstrates how healthcare visit data can be explored through statistical summaries and visualizations. It examines patterns involving age, gender, illness, chronic conditions, health status and income."
        }

    ];


    /* =================================================
       DEFAULT RESPONSE
    ================================================= */

    const defaultResponse =
        "I can answer questions about the Healthcare Analytics for Doctor Visits project. Try asking about the dataset, preprocessing, gender, age, illness, chronic conditions, health status, income, correlation heatmap, Python libraries or the conclusion.";


    /* =================================================
       FIND ANSWER
    ================================================= */

    function getAIAnswer(question) {

        const normalized =
            question
                .toLowerCase()
                .trim()
                .replace(/\s+/g, " ");

        if (!normalized) {

            return "Please type a question about the project.";

        }


        for (const item of projectKnowledge) {

            const found =
                item.keywords.some(keyword =>
                    normalized.includes(
                        keyword.toLowerCase()
                    )
                );

            if (found) {

                return item.answer;

            }

        }


        return defaultResponse;
    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =================================================
       SCROLL CHAT
    ================================================= */

    function scrollChat() {

        aiChatBody.scrollTo({
            top: aiChatBody.scrollHeight,
            behavior: "smooth"
        });

    }


    /* =================================================
       ADD USER MESSAGE
    ================================================= */

    function addUserMessage(text) {

        const message =
            document.createElement("div");

        message.className =
            "ai-message user-message";

        message.innerHTML = `

            <div class="message-content">

                <p>
                    ${escapeHTML(text)}
                </p>

            </div>

        `;

        aiChatBody.appendChild(message);

        scrollChat();

    }


    /* =================================================
       ADD BOT MESSAGE
    ================================================= */

    function addBotMessage(text) {

        const message =
            document.createElement("div");

        message.className =
            "ai-message bot";

        message.innerHTML = `

            <div class="message-icon">
                AI
            </div>

            <div class="message-content">

                <p>
                    ${escapeHTML(text)}
                </p>

            </div>

        `;

        aiChatBody.appendChild(message);

        scrollChat();

    }


    /* =================================================
       SEND QUESTION
    ================================================= */

    function sendQuestion(question) {

        const text =
            String(question || "").trim();

        if (!text) {

            return;

        }


        /* SHOW USER QUESTION */

        addUserMessage(text);


        /* CLEAR INPUT */

        if (aiQuestion) {
            aiQuestion.value = "";
        }


        /* SHOW ANSWER */

        setTimeout(() => {

            const answer =
                getAIAnswer(text);

            addBotMessage(answer);

        }, 300);

    }


    /* =================================================
       SEND BUTTON
    ================================================= */

    if (aiSend) {

        aiSend.addEventListener("click", () => {

            if (aiQuestion) {

                sendQuestion(
                    aiQuestion.value
                );

            }

        });

    }


    /* =================================================
       ENTER KEY
    ================================================= */

    if (aiQuestion) {

        aiQuestion.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    sendQuestion(
                        aiQuestion.value
                    );

                }

            }
        );

    }


    /* =================================================
       SUGGESTED QUESTIONS
       IMPORTANT
    ================================================= */

    const questionButtons =
        document.querySelectorAll(
            ".question-btn"
        );


    questionButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const question =
                button.getAttribute(
                    "data-question"
                ) ||
                button.textContent.trim();

            sendQuestion(question);

        });

    });


    /* =================================================
       CLOSE CHAT WITH ESCAPE
    ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                aiChat.classList.contains("open")
            ) {

                aiChat.classList.remove("open");

            }

        }
    );


    console.log(
        "Healthcare Analytics AI Assistant loaded successfully."
    );

});