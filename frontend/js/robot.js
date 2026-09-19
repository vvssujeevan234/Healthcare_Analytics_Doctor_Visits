/* =========================================================
   HEALTHCARE ANALYTICS AI ASSISTANT
   Common Robot for ALL Pages
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------------------------------------------------------
       PREVENT DUPLICATE ROBOT
    --------------------------------------------------------- */

    if (document.getElementById("healthcare-ai-widget")) {
        return;
    }


    /* ---------------------------------------------------------
       DETERMINE IMAGE PATH
       Works on:
       frontend/index.html
       frontend/pages/*.html
    --------------------------------------------------------- */

    const isInsidePages =
        window.location.pathname.includes("/pages/");

    const robotImage = isInsidePages
        ? "../assets/images/ai-robot.png"
        : "assets/images/ai-robot.png";


    /* ---------------------------------------------------------
       CREATE WIDGET
    --------------------------------------------------------- */

    const widget = document.createElement("div");

    widget.id = "healthcare-ai-widget";


    /* ---------------------------------------------------------
       CHATBOT HTML
    --------------------------------------------------------- */

    widget.innerHTML = `

        <!-- ================================
             AI CHAT WINDOW
        ================================= -->

        <div
            class="ai-chat-window"
            id="aiChatWindow"
            aria-hidden="true"
        >

            <!-- HEADER -->

            <div class="ai-chat-header">

                <div class="ai-header-left">

                    <div class="ai-header-icon">
                        AI
                    </div>

                    <div>

                        <h3>
                            Healthcare AI Assistant
                        </h3>

                        <span>
                            <span class="ai-online-dot"></span>
                            Online
                        </span>

                    </div>

                </div>


                <!-- CLOSE -->

                <button
                    class="ai-close-button"
                    id="aiCloseButton"
                    type="button"
                    aria-label="Close AI Assistant"
                    title="Close"
                >
                    ×
                </button>

            </div>


            <!-- CHAT BODY -->

            <div
                class="ai-chat-body"
                id="aiChatBody"
            >

                <!-- INTRO -->

                <div class="ai-message ai-message-bot">

                    <div class="ai-avatar-small">
                        AI
                    </div>

                    <div class="ai-message-content">

                        <p>
                            Hello! I'm your
                            <strong>
                                Healthcare Analytics AI Assistant.
                            </strong>
                        </p>

                        <p>
                            Ask me about the dataset,
                            analysis, visualizations,
                            insights or project.
                        </p>

                    </div>

                </div>


                <!-- QUICK QUESTIONS -->

                <div class="ai-quick-section">

                    <h4>
                        TRY ASKING
                    </h4>


                    <button class="ai-question" type="button">
                        What is this project about?
                    </button>


                    <button class="ai-question" type="button">
                        What does the dataset contain?
                    </button>


                    <button class="ai-question" type="button">
                        What libraries are used?
                    </button>


                    <button class="ai-question" type="button">
                        Explain gender analysis
                    </button>


                    <button class="ai-question" type="button">
                        Explain age vs visits
                    </button>


                    <button class="ai-question" type="button">
                        Explain illness analysis
                    </button>


                    <button class="ai-question" type="button">
                        Explain correlation heatmap
                    </button>


                    <button class="ai-question" type="button">
                        Explain chronic conditions
                    </button>


                    <button class="ai-question" type="button">
                        Explain health status analysis
                    </button>


                    <button class="ai-question" type="button">
                        Explain income vs doctor visits
                    </button>


                    <button class="ai-question" type="button">
                        What are the main insights?
                    </button>


                    <button class="ai-question" type="button">
                        What is the conclusion?
                    </button>

                </div>

            </div>


            <!-- INPUT -->

            <div class="ai-chat-input-area">

                <input
                    type="text"
                    id="aiUserInput"
                    placeholder="Ask about the project..."
                    autocomplete="off"
                >


                <button
                    id="aiSendButton"
                    class="ai-send-button"
                    type="button"
                    aria-label="Send message"
                    title="Send"
                >
                    ➤
                </button>

            </div>

        </div>


        <!-- ================================
             FLOATING ROBOT
        ================================= -->

        <button
            class="ai-robot-button"
            id="aiRobotButton"
            type="button"
            aria-label="Open Healthcare AI Assistant"
            title="Ask Healthcare AI"
        >

            <img
                src="${robotImage}"
                alt="Healthcare AI Assistant"
            >

            <span class="ai-robot-badge">
                AI
            </span>

        </button>

    `;


    /* ---------------------------------------------------------
       ADD WIDGET TO PAGE
    --------------------------------------------------------- */

    document.body.appendChild(widget);


    /* ---------------------------------------------------------
       GET ELEMENTS
    --------------------------------------------------------- */

    const robotButton =
        document.getElementById("aiRobotButton");

    const chatWindow =
        document.getElementById("aiChatWindow");

    const closeButton =
        document.getElementById("aiCloseButton");

    const sendButton =
        document.getElementById("aiSendButton");

    const userInput =
        document.getElementById("aiUserInput");

    const chatBody =
        document.getElementById("aiChatBody");


    /* ---------------------------------------------------------
       OPEN CHAT
    --------------------------------------------------------- */

    robotButton.addEventListener("click", function () {

        chatWindow.classList.add("active");

        chatWindow.setAttribute(
            "aria-hidden",
            "false"
        );

        setTimeout(function () {

            userInput.focus();

        }, 250);

    });


    /* ---------------------------------------------------------
       CLOSE CHAT
    --------------------------------------------------------- */

    closeButton.addEventListener("click", function () {

        chatWindow.classList.remove("active");

        chatWindow.setAttribute(
            "aria-hidden",
            "true"
        );

        robotButton.focus();

    });


    /* ---------------------------------------------------------
       ESCAPE KEY
    --------------------------------------------------------- */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            chatWindow.classList.remove("active");

            chatWindow.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    });


    /* ---------------------------------------------------------
       USER MESSAGE
    --------------------------------------------------------- */

    function addUserMessage(message) {

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "ai-message ai-message-user";

        messageElement.innerHTML = `

            <div class="ai-user-message-content">

                ${escapeHTML(message)}

            </div>

        `;

        chatBody.appendChild(messageElement);

        scrollChatToBottom();

    }


    /* ---------------------------------------------------------
       BOT MESSAGE
    --------------------------------------------------------- */

    function addBotMessage(message) {

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "ai-message ai-message-bot";

        messageElement.innerHTML = `

            <div class="ai-avatar-small">
                AI
            </div>

            <div class="ai-message-content">

                ${message}

            </div>

        `;

        chatBody.appendChild(messageElement);

        scrollChatToBottom();

    }


    /* ---------------------------------------------------------
       TYPING INDICATOR
    --------------------------------------------------------- */

    function showTyping() {

        if (document.getElementById("aiTyping")) {
            return;
        }

        const typing =
            document.createElement("div");

        typing.id =
            "aiTyping";

        typing.className =
            "ai-message ai-message-bot";

        typing.innerHTML = `

            <div class="ai-avatar-small">
                AI
            </div>

            <div class="ai-typing">

                <span></span>
                <span></span>
                <span></span>

            </div>

        `;

        chatBody.appendChild(typing);

        scrollChatToBottom();

    }


    /* ---------------------------------------------------------
       REMOVE TYPING
    --------------------------------------------------------- */

    function removeTyping() {

        const typing =
            document.getElementById("aiTyping");

        if (typing) {

            typing.remove();

        }

    }


    /* =========================================================
       HEALTHCARE PROJECT KNOWLEDGE BASE
       ========================================================= */

    function getAIResponse(question) {

        const q =
            question.toLowerCase().trim();


        /* -----------------------------------------------------
           PROJECT
        ----------------------------------------------------- */

        if (
            q.includes("what is this project") ||
            q.includes("project about") ||
            q.includes("purpose")
        ) {

            return `

                <strong>
                    Healthcare Analytics for Doctor Visits
                </strong>

                is a data analytics project that studies
                patient information and doctor visit patterns.

                <br><br>

                The project uses
                <strong>
                    Python, Pandas, NumPy, Matplotlib
                    and Seaborn
                </strong>
                to explore relationships between patient
                characteristics and recorded doctor visits.

            `;

        }


        /* -----------------------------------------------------
           DATASET
        ----------------------------------------------------- */

        if (
            q.includes("dataset") ||
            q.includes("data contain") ||
            q.includes("columns")
        ) {

            return `

                The healthcare dataset contains
                patient-related information used to
                analyze doctor visits.

                <br><br>

                Important variables include:

                <br><br>

                • Gender<br>
                • Age<br>
                • Doctor Visits<br>
                • Illness<br>
                • Chronic Conditions<br>
                • Health Status<br>
                • Income

                <br><br>

                These variables are explored using
                statistical summaries and visualizations.

            `;

        }


        /* -----------------------------------------------------
           TECHNOLOGY
        ----------------------------------------------------- */

        if (
            q.includes("libraries") ||
            q.includes("technology") ||
            q.includes("tools")
        ) {

            return `

                The project uses:

                <br><br>

                • Python<br>
                • Jupyter Notebook<br>
                • Pandas<br>
                • NumPy<br>
                • Matplotlib<br>
                • Seaborn

                <br><br>

                Pandas and NumPy are used for
                data processing.

                <br>

                Matplotlib and Seaborn are used
                for visualization.

            `;

        }


        /* -----------------------------------------------------
           GENDER
        ----------------------------------------------------- */

        if (
            q.includes("gender")
        ) {

            return `

                Gender analysis examines the
                distribution of patients across
                gender categories.

                <br><br>

                It also compares recorded doctor
                visits between gender groups.

                <br><br>

                Count plots, grouped statistics,
                bar charts and box plots can be
                used to understand the pattern.

            `;

        }


        /* -----------------------------------------------------
           AGE
        ----------------------------------------------------- */

        if (
            q.includes("age vs") ||
            q.includes("age and visits") ||
            q.includes("age")
        ) {

            return `

                Age analysis studies whether
                doctor visit patterns vary
                across different age groups.

                <br><br>

                A scatter plot can compare
                <strong>age</strong> with
                <strong>number of doctor visits</strong>.

                <br><br>

                Age-group analysis can also
                compare average visits between
                different age categories.

            `;

        }


        /* -----------------------------------------------------
           ILLNESS
        ----------------------------------------------------- */

        if (
            q.includes("illness")
        ) {

            return `

                Illness analysis examines the
                relationship between illness level
                and recorded doctor visits.

                <br><br>

                Average visits can be calculated
                for different illness levels and
                visualized using a line chart.

            `;

        }


        /* -----------------------------------------------------
           CORRELATION
        ----------------------------------------------------- */

        if (
            q.includes("correlation") ||
            q.includes("heatmap")
        ) {

            return `

                The correlation heatmap displays
                relationships between numerical
                healthcare variables.

                <br><br>

                Values closer to
                <strong>+1</strong>
                indicate a positive linear relationship.

                <br><br>

                Values closer to
                <strong>-1</strong>
                indicate a negative linear relationship.

                <br><br>

                Values near
                <strong>0</strong>
                indicate a weaker linear relationship.

            `;

        }


        /* -----------------------------------------------------
           CHRONIC CONDITIONS
        ----------------------------------------------------- */

        if (
            q.includes("chronic")
        ) {

            return `

                Chronic-condition analysis examines
                how the number of chronic conditions
                relates to average doctor visits.

                <br><br>

                A bar chart can compare average
                recorded visits for different numbers
                of chronic conditions.

            `;

        }


        /* -----------------------------------------------------
           HEALTH STATUS
        ----------------------------------------------------- */

        if (
            q.includes("health status") ||
            q.includes("health analysis")
        ) {

            return `

                Health-status analysis compares
                average doctor visits across
                different health-status categories.

                <br><br>

                A bar chart makes it easier to
                compare recorded average visits
                between health groups.

            `;

        }


        /* -----------------------------------------------------
           INCOME
        ----------------------------------------------------- */

        if (
            q.includes("income")
        ) {

            return `

                Income analysis investigates the
                relationship between patient income
                and recorded doctor visits.

                <br><br>

                A scatter plot can be used to
                observe whether changes in income
                are associated with changes in
                recorded visits.

            `;

        }


        /* -----------------------------------------------------
           VISITS
        ----------------------------------------------------- */

        if (
            q.includes("doctor visits") ||
            q.includes("visits distribution") ||
            q.includes("number of visits")
        ) {

            return `

                Doctor-visits distribution shows
                how frequently different numbers
                of visits occur in the dataset.

                <br><br>

                A histogram can be used to visualize
                the frequency of recorded doctor visits.

            `;

        }


        /* -----------------------------------------------------
           MAIN INSIGHTS
        ----------------------------------------------------- */

        if (
            q.includes("main insights") ||
            q.includes("insights")
        ) {

            return `

                The analysis covers several areas:

                <br><br>

                • Patient demographic distribution<br>
                • Age and doctor-visit patterns<br>
                • Gender and visit patterns<br>
                • Illness and visit relationships<br>
                • Chronic-condition patterns<br>
                • Health-status comparisons<br>
                • Income and visit relationships<br>
                • Correlations between numerical variables

                <br><br>

                These areas help organize the
                healthcare dataset into meaningful
                analytical patterns.

            `;

        }


        /* -----------------------------------------------------
           CONCLUSION
        ----------------------------------------------------- */

        if (
            q.includes("conclusion") ||
            q.includes("summary")
        ) {

            return `

                The project demonstrates how
                healthcare data can be explored
                using Python-based data analytics.

                <br><br>

                Statistical analysis and
                visualizations make patient and
                doctor-visit patterns easier
                to understand.

                <br><br>

                The resulting analysis can support
                further healthcare data exploration
                and reporting.

            `;

        }


        /* -----------------------------------------------------
           JUPYTER / NOTEBOOK
        ----------------------------------------------------- */

        if (
            q.includes("jupyter") ||
            q.includes("notebook") ||
            q.includes("code")
        ) {

            return `

                The analysis is developed in a
                <strong>Jupyter Notebook</strong>.

                <br><br>

                The notebook performs:

                <br>

                • Data loading<br>
                • Data understanding<br>
                • Statistical analysis<br>
                • Visualization<br>
                • Interpretation

                <br><br>

                The focus is healthcare doctor-visit
                data analysis.

            `;

        }


        /* -----------------------------------------------------
           PREPROCESSING
        ----------------------------------------------------- */

        if (
            q.includes("preprocessing") ||
            q.includes("clean")
        ) {

            return `

                Data preprocessing includes:

                <br><br>

                • Understanding the dataset<br>
                • Checking dataset structure<br>
                • Examining statistical information<br>
                • Checking missing values<br>
                • Preparing data for visualization<br>
                • Preparing data for analysis

            `;

        }


        /* -----------------------------------------------------
           DEFAULT RESPONSE
        ----------------------------------------------------- */

        return `

            I can help you with the
            <strong>
                Healthcare Analytics for Doctor Visits
            </strong>
            project.

            <br><br>

            Try asking:

            <br><br>

            • What is this project about?<br>
            • What does the dataset contain?<br>
            • What libraries are used?<br>
            • Explain gender analysis<br>
            • Explain age vs visits<br>
            • Explain illness analysis<br>
            • Explain correlation heatmap<br>
            • Explain chronic conditions<br>
            • Explain health status<br>
            • Explain income vs doctor visits<br>
            • What are the main insights?<br>
            • What is the conclusion?

        `;

    }


    /* =========================================================
       SEND MESSAGE
       ========================================================= */

    function sendMessage() {

        const message =
            userInput.value.trim();


        if (!message) {
            return;
        }


        addUserMessage(message);

        userInput.value = "";

        showTyping();


        setTimeout(function () {

            removeTyping();

            const response =
                getAIResponse(message);

            addBotMessage(response);

        }, 600);

    }


    /* ---------------------------------------------------------
       SEND BUTTON
    --------------------------------------------------------- */

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    /* ---------------------------------------------------------
       ENTER KEY
    --------------------------------------------------------- */

    userInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* ---------------------------------------------------------
       QUICK QUESTIONS
    --------------------------------------------------------- */

    const questions =
        widget.querySelectorAll(".ai-question");


    questions.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const question =
                    button.textContent.trim();


                addUserMessage(question);

                showTyping();


                setTimeout(function () {

                    removeTyping();

                    const response =
                        getAIResponse(question);

                    addBotMessage(response);

                }, 500);

            }
        );

    });


    /* ---------------------------------------------------------
       SCROLL CHAT
    --------------------------------------------------------- */

    function scrollChatToBottom() {

        chatBody.scrollTop =
            chatBody.scrollHeight;

    }


    /* ---------------------------------------------------------
       SECURITY
    --------------------------------------------------------- */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

});