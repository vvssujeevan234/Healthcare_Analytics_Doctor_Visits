/* =========================================================
   HEALTHCARE ANALYTICS
   AI ROBOT CHATBOT
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

        const robotButton = document.getElementById("aiRobot");
        const chatWindow = document.getElementById("aiChat");
        const closeButton = document.getElementById("aiClose");
        const chatInput = document.getElementById("aiQuestion");
        const sendButton = document.getElementById("aiSend");
        const chatBody = document.getElementById("aiChatBody");

        if (!robotButton || !chatWindow) {

            console.error(
                "AI Robot: chatbot elements were not found."
            );

            return;
        }


        /* =================================================
           OPEN / CLOSE CHAT
           ================================================= */

        robotButton.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            chatWindow.classList.toggle("active");

            if (chatWindow.classList.contains("active")) {

                if (chatInput) {

                    setTimeout(function () {

                        chatInput.focus();

                    }, 200);

                }

            }

        });


        /* =================================================
           CLOSE BUTTON
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

        if (sendButton && chatInput) {

            sendButton.addEventListener("click", function (event) {

                event.preventDefault();

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
           QUICK QUESTION BUTTONS
           ================================================= */

        const questionButtons =
            document.querySelectorAll(".question-btn");


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
                 * Put question into input
                 */

                if (chatInput) {

                    chatInput.value = question;

                }


                /*
                 * Show user's question
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

                }, 500);

            });

        });


        /* =================================================
           OUTSIDE CLICK
           ================================================= */

        document.addEventListener("click", function (event) {

            if (!chatWindow.contains(event.target) &&
                !robotButton.contains(event.target)) {

                chatWindow.classList.remove("active");

            }

        });


        /*
         * Prevent clicks inside chatbot from closing it
         */

        chatWindow.addEventListener("click", function (event) {

            event.stopPropagation();

        });


        console.log(
            "Healthcare AI Robot initialized successfully."
        );

    }


    /* =====================================================
       SEND USER QUESTION
       ===================================================== */

    function sendUserQuestion() {

        const input =
            document.getElementById("aiQuestion");


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
         * Show typing indicator
         */

        showTyping();


        /*
         * Generate AI response
         */

        setTimeout(function () {

            removeTyping();


            const answer =
                getAIResponse(question);


            addAIMessage(answer);


        }, 500);

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

            <div class="message-content user-message-content">

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

            <div class="message-icon">
                AI
            </div>

            <div class="message-content">

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

            <div class="message-icon">
                AI
            </div>

            <div class="message-content">

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
                "records with patient characteristics and variables used " +
                "to investigate doctor visit patterns."
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
                "The dataset record count is displayed on the " +
                "Data Understanding page."
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
                "The dataset features and variables are displayed " +
                "on the Data Understanding page."
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
           GENDER ANALYSIS
           ================================================= */

        if (
            text.includes("gender")
        ) {

            return (
                "Gender analysis compares doctor visit patterns " +
                "between gender groups. The project uses gender-based " +
                "counts, average visits, median visits and visualizations " +
                "to understand differences between groups."
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
                "to examine the relationship between patient age and " +
                "doctor visit frequency, with gender used to distinguish groups."
            );

        }


        /* =================================================
           ILLNESS ANALYSIS
           ================================================= */

        if (
            text.includes("illness") ||
            text.includes("disease")
        ) {

            return (
                "The illness analysis compares doctor visits across " +
                "different illness categories. Mean visits are used " +
                "to identify differences in healthcare utilization."
            );

        }


        /* =================================================
           CORRELATION HEATMAP
           ================================================= */

        if (
            text.includes("correlation") ||
            text.includes("heatmap")
        ) {

            return (
                "The correlation heatmap shows relationships between " +
                "numeric variables in the dataset. It helps identify " +
                "positive, negative or weak linear relationships."
            );

        }


        /* =================================================
           CHRONIC CONDITIONS
           ================================================= */

        if (
            text.includes("chronic")
        ) {

            return (
                "The chronic-condition analysis compares average doctor " +
                "visits for patients with different chronic-condition statuses."
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
                "whether visit frequency varies across different income levels."
            );

        }


        /* =================================================
           VISITS
           ================================================= */

        if (
            text.includes("visit")
        ) {

            return (
                "Doctor visits are the main outcome explored in the project. " +
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
            text.includes("missing") ||
            text.includes("duplicate")
        ) {

            return (
                "The preprocessing stage checks missing values, duplicate " +
                "records, data types and variables that may require transformation " +
                "before analysis."
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
                "The project uses visualizations such as count plots, " +
                "histograms, box plots, scatter plots and correlation heatmaps " +
                "to explore healthcare visit patterns."
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
                "doctor visits by examining demographic, health and socioeconomic " +
                "variables and presenting the findings through statistical analysis " +
                "and visualizations."
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
                "Data understanding examines the dataset structure, number " +
                "of records, variables, data types, categorical and numerical " +
                "features, missing values and duplicate observations."
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
                "You can ask me about the project, dataset, records, columns, " +
                "libraries, gender analysis, age versus visits, illness analysis, " +
                "correlation heatmap, preprocessing, visualizations or conclusion."
            );

        }


        /* =================================================
           DEFAULT
           ================================================= */

        return (
            "I can answer questions about the Healthcare Analytics for " +
            "Doctor Visits project. Try asking about the dataset, gender, " +
            "age versus visits, illness, correlation, libraries, preprocessing " +
            "or the project conclusion."
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