/* =========================================================
   HEALTHCARE ANALYTICS
   AI ROBOT CHATBOT
   File: frontend/js/robot.js
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       START
       ===================================================== */

    document.addEventListener("DOMContentLoaded", function () {
        initializeRobot();
    });


    /* =====================================================
       INITIALIZE ROBOT
       ===================================================== */

    function initializeRobot() {

        /*
         * IMPORTANT:
         * These IDs MUST match data-understanding.html
         */

        const robotButton =
            document.getElementById("aiRobotButton");

        const chatWindow =
            document.getElementById("aiChatWindow");

        const closeButton =
            document.getElementById("aiCloseButton");

        const chatInput =
            document.getElementById("aiChatInput");

        const sendButton =
            document.getElementById("aiSendButton");

        const chatBody =
            document.getElementById("aiChatBody");


        /* =================================================
           CHECK ELEMENTS
           ================================================= */

        if (!robotButton) {
            console.error("AI Robot: #aiRobotButton not found.");
            return;
        }

        if (!chatWindow) {
            console.error("AI Robot: #aiChatWindow not found.");
            return;
        }

        if (!chatBody) {
            console.error("AI Robot: #aiChatBody not found.");
            return;
        }


        console.log(
            "Healthcare AI Robot initialized successfully."
        );


        /* =================================================
           OPEN CHAT
           ================================================= */

        robotButton.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            chatWindow.classList.toggle("active");

            if (chatWindow.classList.contains("active")) {

                setTimeout(function () {

                    if (chatInput) {
                        chatInput.focus();
                    }

                    scrollChat();

                }, 200);

            }

        });


        /* =================================================
           CLOSE CHAT
           ================================================= */

        if (closeButton) {

            closeButton.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                chatWindow.classList.remove("active");

            });

        }


        /* =================================================
           ESCAPE KEY
           ================================================= */

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                chatWindow.classList.remove("active");

            }

        });


        /* =================================================
           SEND BUTTON
           ================================================= */

        if (sendButton) {

            sendButton.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                sendUserQuestion();

            });

        }


        /* =================================================
           ENTER KEY
           ================================================= */

        if (chatInput) {

            chatInput.addEventListener("keydown", function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    sendUserQuestion();

                }

            });

        }


        /* =================================================
           QUICK QUESTIONS
           
           HTML uses:
           .ai-question
           ================================================= */

        const questionButtons =
            document.querySelectorAll(".ai-question");


        questionButtons.forEach(function (button) {

            button.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();


                const question =
                    button.getAttribute("data-question");


                if (!question) {
                    return;
                }


                /*
                 * Show user question
                 */

                addUserMessage(question);


                /*
                 * Clear input
                 */

                if (chatInput) {
                    chatInput.value = "";
                }


                /*
                 * Generate answer
                 */

                showTyping();


                setTimeout(function () {

                    removeTyping();

                    const answer =
                        getAIResponse(question);

                    addAIMessage(answer);

                }, 600);

            });

        });


        /* =================================================
           OUTSIDE CLICK
           ================================================= */

        document.addEventListener("click", function (event) {

            if (
                !chatWindow.contains(event.target) &&
                !robotButton.contains(event.target)
            ) {

                chatWindow.classList.remove("active");

            }

        });


        /* =================================================
           PREVENT CHAT FROM CLOSING
           ================================================= */

        chatWindow.addEventListener("click", function (event) {

            event.stopPropagation();

        });

    }


    /* =====================================================
       SEND USER QUESTION
       ===================================================== */

    function sendUserQuestion() {

        const input =
            document.getElementById("aiChatInput");


        if (!input) {
            return;
        }


        const question =
            input.value.trim();


        if (!question) {
            return;
        }


        /*
         * Show user question
         */

        addUserMessage(question);


        /*
         * Clear input
         */

        input.value = "";


        /*
         * Show typing
         */

        showTyping();


        /*
         * AI response
         */

        setTimeout(function () {

            removeTyping();

            const answer =
                getAIResponse(question);

            addAIMessage(answer);

        }, 600);

    }


    /* =====================================================
       ADD USER MESSAGE
       ===================================================== */

    function addUserMessage(message) {

        const chatBody =
            document.getElementById("aiChatBody");


        if (!chatBody) {
            return;
        }


        const messageElement =
            document.createElement("div");


        messageElement.className =
            "ai-message user";


        messageElement.innerHTML = `

            <div class="ai-message-content user-message-content">

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        `;


        chatBody.appendChild(messageElement);


        scrollChat();

    }


    /* =====================================================
       ADD AI MESSAGE
       ===================================================== */

    function addAIMessage(message) {

        const chatBody =
            document.getElementById("aiChatBody");


        if (!chatBody) {
            return;
        }


        const messageElement =
            document.createElement("div");


        messageElement.className =
            "ai-message bot";


        messageElement.innerHTML = `

            <div class="ai-avatar-small">
                AI
            </div>

            <div class="ai-message-content">

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        `;


        chatBody.appendChild(messageElement);


        scrollChat();

    }


    /* =====================================================
       TYPING INDICATOR
       ===================================================== */

    function showTyping() {

        const chatBody =
            document.getElementById("aiChatBody");


        if (!chatBody) {
            return;
        }


        removeTyping();


        const typing =
            document.createElement("div");


        typing.id =
            "aiTypingIndicator";


        typing.className =
            "ai-message bot";


        typing.innerHTML = `

            <div class="ai-avatar-small">
                AI
            </div>

            <div class="ai-message-content">

                <p>
                    Thinking...
                </p>

            </div>

        `;


        chatBody.appendChild(typing);


        scrollChat();

    }


    /* =====================================================
       REMOVE TYPING
       ===================================================== */

    function removeTyping() {

        const typing =
            document.getElementById(
                "aiTypingIndicator"
            );


        if (typing) {

            typing.remove();

        }

    }


    /* =====================================================
       SCROLL CHAT
       ===================================================== */

    function scrollChat() {

        const chatBody =
            document.getElementById("aiChatBody");


        if (!chatBody) {
            return;
        }


        setTimeout(function () {

            chatBody.scrollTo({

                top:
                    chatBody.scrollHeight,

                behavior:
                    "smooth"

            });

        }, 50);

    }


    /* =====================================================
       AI RESPONSE ENGINE
       ===================================================== */

    function getAIResponse(question) {

        const text =
            question
                .toLowerCase()
                .trim();


        /* =================================================
           PROJECT
           ================================================= */

        if (
            text.includes("project") &&
            (
                text.includes("about") ||
                text.includes("what is")
            )
        ) {

            return (
                "This project is Healthcare Analytics for Doctor Visits. " +
                "It analyzes healthcare doctor-visit data to understand " +
                "patient characteristics, visit patterns and healthcare utilization."
            );

        }


        /* =================================================
           DATASET
           ================================================= */

        if (
            text.includes("dataset") &&
            (
                text.includes("contain") ||
                text.includes("about") ||
                text.includes("what")
            )
        ) {

            return (
                "The dataset contains healthcare-related doctor visit " +
                "records with patient characteristics and variables " +
                "used to investigate doctor visit patterns."
            );

        }


        /* =================================================
           RECORDS
           ================================================= */

        if (
            text.includes("record") ||
            text.includes("rows") ||
            text.includes("observations") ||
            text.includes("patients")
        ) {

            if (
                window.healthcareDatasetInfo &&
                window.healthcareDatasetInfo.rows !== undefined
            ) {

                return (
                    "The dataset contains " +
                    window.healthcareDatasetInfo.rows +
                    " records."
                );

            }


            return (
                "The dataset record count is displayed " +
                "on the Data Understanding page."
            );

        }


        /* =================================================
           COLUMNS
           ================================================= */

        if (
            text.includes("column") ||
            text.includes("feature") ||
            text.includes("variable")
        ) {

            if (
                window.healthcareDatasetInfo &&
                window.healthcareDatasetInfo.columns !== undefined
            ) {

                return (
                    "The dataset contains " +
                    window.healthcareDatasetInfo.columns +
                    " columns."
                );

            }


            return (
                "The dataset features and variables are " +
                "displayed on the Data Understanding page."
            );

        }


        /* =================================================
           NUMERICAL
           ================================================= */

        if (
            text.includes("numerical") ||
            text.includes("numeric")
        ) {

            if (
                window.healthcareDatasetInfo &&
                window.healthcareDatasetInfo.numeric !== undefined
            ) {

                return (
                    "The dataset contains " +
                    window.healthcareDatasetInfo.numeric +
                    " numerical features."
                );

            }


            return (
                "Numerical features are quantitative variables " +
                "used for measurements and statistical analysis."
            );

        }


        /* =================================================
           CATEGORICAL
           ================================================= */

        if (
            text.includes("categorical")
        ) {

            if (
                window.healthcareDatasetInfo &&
                window.healthcareDatasetInfo.categorical !== undefined
            ) {

                return (
                    "The dataset contains " +
                    window.healthcareDatasetInfo.categorical +
                    " categorical features."
                );

            }


            return (
                "Categorical features describe groups or categories " +
                "such as gender, illness or health-related status."
            );

        }


        /* =================================================
           MISSING VALUES
           ================================================= */

        if (
            text.includes("missing") ||
            text.includes("null")
        ) {

            return (
                "Missing values are checked during the data " +
                "understanding and preprocessing stages. " +
                "The Data Quality section shows the detected count."
            );

        }


        /* =================================================
           DUPLICATES
           ================================================= */

        if (
            text.includes("duplicate")
        ) {

            return (
                "Duplicate rows are checked as part of the initial " +
                "data-quality assessment before deeper analysis."
            );

        }


        /* =================================================
           LIBRARIES
           ================================================= */

        if (
            text.includes("library") ||
            text.includes("libraries") ||
            text.includes("technology") ||
            text.includes("tools")
        ) {

            return (
                "The project uses Python with Jupyter Notebook " +
                "and data-analysis libraries including Pandas, " +
                "NumPy, Matplotlib and Seaborn."
            );

        }


        /* =================================================
           GENDER
           ================================================= */

        if (
            text.includes("gender")
        ) {

            return (
                "Gender analysis compares doctor visit patterns " +
                "between gender groups using counts, average visits, " +
                "median visits and visualizations."
            );

        }


        /* =================================================
           AGE VS VISITS
           ================================================= */

        if (
            (
                text.includes("age") &&
                text.includes("visit")
            ) ||
            text.includes("age versus") ||
            text.includes("age vs")
        ) {

            return (
                "The age-versus-visits analysis uses a scatter plot " +
                "to examine the relationship between patient age " +
                "and doctor visit frequency."
            );

        }


        /* =================================================
           ILLNESS
           ================================================= */

        if (
            text.includes("illness") ||
            text.includes("disease")
        ) {

            return (
                "The illness analysis compares doctor visits across " +
                "different illness categories using mean visit values."
            );

        }


        /* =================================================
           CORRELATION
           ================================================= */

        if (
            text.includes("correlation") ||
            text.includes("heatmap")
        ) {

            return (
                "The correlation heatmap shows relationships between " +
                "numeric variables and helps identify positive, " +
                "negative or weak linear relationships."
            );

        }


        /* =================================================
           CHRONIC
           ================================================= */

        if (
            text.includes("chronic")
        ) {

            return (
                "The chronic-condition analysis compares average " +
                "doctor visits for different chronic-condition statuses."
            );

        }


        /* =================================================
           HEALTH STATUS
           ================================================= */

        if (
            text.includes("health status") ||
            text.includes("health condition")
        ) {

            return (
                "Health-status analysis compares average doctor visits " +
                "across different health-status groups."
            );

        }


        /* =================================================
           INCOME
           ================================================= */

        if (
            text.includes("income")
        ) {

            return (
                "Income can be examined against doctor visits to explore " +
                "whether visit frequency varies across income levels."
            );

        }


        /* =================================================
           VISITS
           ================================================= */

        if (
            text.includes("visit")
        ) {

            return (
                "Doctor visits are the main outcome explored in this project. " +
                "The analysis examines visit frequency by gender, age, illness, " +
                "chronic conditions, health status and income."
            );

        }


        /* =================================================
           PREPROCESSING
           ================================================= */

        if (
            text.includes("preprocess") ||
            text.includes("clean") ||
            text.includes("duplicate")
        ) {

            return (
                "The preprocessing stage checks missing values, duplicate " +
                "records, data types and variables that may require transformation."
            );

        }


        /* =================================================
           VISUALIZATION
           ================================================= */

        if (
            text.includes("visualization") ||
            text.includes("chart") ||
            text.includes("plot")
        ) {

            return (
                "The project uses count plots, histograms, box plots, " +
                "scatter plots and correlation heatmaps to explore " +
                "healthcare visit patterns."
            );

        }


        /* =================================================
           CONCLUSION
           ================================================= */

        if (
            text.includes("conclusion") ||
            text.includes("result")
        ) {

            return (
                "The project provides a structured analysis of healthcare " +
                "doctor visits by examining demographic, health and " +
                "socioeconomic variables."
            );

        }


        /* =================================================
           DATA UNDERSTANDING
           ================================================= */

        if (
            text.includes("understanding") ||
            text.includes("structure")
        ) {

            return (
                "Data understanding examines the dataset structure, " +
                "records, variables, numerical and categorical features, " +
                "missing values and duplicate observations."
            );

        }


        /* =================================================
           HELP
           ================================================= */

        if (
            text.includes("help") ||
            text.includes("what can you")
        ) {

            return (
                "You can ask me about the project, dataset, records, " +
                "columns, numerical features, categorical features, " +
                "gender, age, illness, correlation, preprocessing " +
                "or visualizations."
            );

        }


        /* =================================================
           DEFAULT
           ================================================= */

        return (
            "I can answer questions about the Healthcare Analytics " +
            "for Doctor Visits project. Try asking about the dataset, " +
            "records, columns, gender, age, illness, correlation, " +
            "preprocessing or visualizations."
        );

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value;

        return div.innerHTML;

    }


})();