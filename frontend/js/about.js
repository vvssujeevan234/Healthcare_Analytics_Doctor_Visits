/* =========================================================
   HEALTHCARE ANALYTICS
   ABOUT PAGE JAVASCRIPT
   ========================================================= */


/* =========================================================
   WAIT FOR PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMobileNavigation();

    initializeAIChat();

    initializeScrollAnimations();

});


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initializeMobileNavigation() {

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileNavigation =
        document.getElementById("mobileNavigation");


    if (!menuToggle || !mobileNavigation) {
        return;
    }


    menuToggle.addEventListener("click", () => {

        mobileNavigation.classList.toggle("open");

        const isOpen =
            mobileNavigation.classList.contains("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    const mobileLinks =
        mobileNavigation.querySelectorAll("a");


    mobileLinks.forEach((link) => {

        link.addEventListener("click", () => {

            mobileNavigation.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


    document.addEventListener("click", (event) => {

        if (
            !mobileNavigation.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            mobileNavigation.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

}


/* =========================================================
   AI CHATBOT
   ========================================================= */

function initializeAIChat() {

    const robotButton =
        document.getElementById("aiRobotButton");

    const chatWindow =
        document.getElementById("aiChatWindow");

    const closeButton =
        document.getElementById("aiCloseButton");

    const chatForm =
        document.getElementById("aiChatForm");

    const chatInput =
        document.getElementById("aiChatInput");

    const chatBody =
        document.getElementById("aiChatBody");

    const quickQuestions =
        document.querySelectorAll(".ai-question");


    if (
        !robotButton ||
        !chatWindow ||
        !closeButton ||
        !chatForm ||
        !chatInput ||
        !chatBody
    ) {
        return;
    }


    /* =====================================================
       OPEN CHAT
       ===================================================== */

    function openChat() {

        chatWindow.classList.add("active");

        chatWindow.setAttribute(
            "aria-hidden",
            "false"
        );

        setTimeout(() => {
            chatInput.focus();
        }, 250);

    }


    /* =====================================================
       CLOSE CHAT
       ===================================================== */

    function closeChat() {

        chatWindow.classList.remove("active");

        chatWindow.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    robotButton.addEventListener(
        "click",
        openChat
    );


    closeButton.addEventListener(
        "click",
        closeChat
    );


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeChat();
            }

        }
    );


    /* =====================================================
       QUICK QUESTIONS
       ===================================================== */

    quickQuestions.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const question =
                    button.dataset.question;

                if (!question) {
                    return;
                }

                addUserMessage(
                    question,
                    chatBody
                );

                processQuestion(
                    question,
                    chatBody
                );

            }
        );

    });


    /* =====================================================
       FORM SUBMISSION
       ===================================================== */

    chatForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const question =
                chatInput.value.trim();

            if (!question) {
                return;
            }

            addUserMessage(
                question,
                chatBody
            );

            chatInput.value = "";

            processQuestion(
                question,
                chatBody
            );

        }
    );

}


/* =========================================================
   ADD USER MESSAGE
   ========================================================= */

function addUserMessage(
    message,
    chatBody
) {

    const messageWrapper =
        document.createElement("div");

    messageWrapper.className =
        "ai-message ai-message-user";


    const content =
        document.createElement("div");

    content.className =
        "ai-user-message-content";

    content.textContent =
        message;


    messageWrapper.appendChild(
        content
    );


    chatBody.appendChild(
        messageWrapper
    );


    scrollChatToBottom(chatBody);

}


/* =========================================================
   ADD AI MESSAGE
   ========================================================= */

function addAIMessage(
    message,
    chatBody
) {

    const messageWrapper =
        document.createElement("div");

    messageWrapper.className =
        "ai-message";


    const avatar =
        document.createElement("div");

    avatar.className =
        "ai-avatar-small";

    avatar.textContent =
        "AI";


    const content =
        document.createElement("div");

    content.className =
        "ai-message-content";


    const paragraph =
        document.createElement("p");

    paragraph.textContent =
        message;


    content.appendChild(
        paragraph
    );


    messageWrapper.appendChild(
        avatar
    );

    messageWrapper.appendChild(
        content
    );


    chatBody.appendChild(
        messageWrapper
    );


    scrollChatToBottom(chatBody);

}


/* =========================================================
   CHAT RESPONSES
   ========================================================= */

function processQuestion(
    question,
    chatBody
) {

    const normalizedQuestion =
        question.toLowerCase();


    let response =
        "I can help you explore the Healthcare Analytics Doctor Visits project, including the dataset, preprocessing, analysis and insights.";


    if (
        normalizedQuestion.includes("project") ||
        normalizedQuestion.includes("about")
    ) {

        response =
            "This project analyzes healthcare doctor visit data. It provides a structured workflow covering data understanding, preprocessing, analysis, visualization and insights.";

    }


    else if (
        normalizedQuestion.includes("technology") ||
        normalizedQuestion.includes("technologies") ||
        normalizedQuestion.includes("tech stack")
    ) {

        response =
            "The project uses technologies including Python, Pandas, NumPy, Matplotlib, Seaborn and Flask.";

    }


    else if (
        normalizedQuestion.includes("workflow") ||
        normalizedQuestion.includes("process")
    ) {

        response =
            "The workflow moves through data collection, data understanding, preprocessing, analysis, visualization and interpretation of findings.";

    }


    else if (
        normalizedQuestion.includes("data") ||
        normalizedQuestion.includes("dataset")
    ) {

        response =
            "The project uses a healthcare doctor visits dataset. The Data Understanding page is designed to show the dataset structure, fields and basic characteristics.";

    }


    else if (
        normalizedQuestion.includes("preprocess") ||
        normalizedQuestion.includes("clean")
    ) {

        response =
            "The preprocessing stage focuses on preparing the dataset for analysis by examining data quality, missing values, duplicates and other relevant preparation steps.";

    }


    else if (
        normalizedQuestion.includes("analysis") ||
        normalizedQuestion.includes("analyze")
    ) {

        response =
            "The analysis stage uses statistical summaries and visualizations to explore patterns, distributions and relationships in the healthcare data.";

    }


    else if (
        normalizedQuestion.includes("insight") ||
        normalizedQuestion.includes("finding")
    ) {

        response =
            "The Insights section organizes observations from the analysis into clear data-driven findings.";

    }


    else if (
        normalizedQuestion.includes("learn")
    ) {

        response =
            "This project demonstrates a complete beginner-friendly data analytics workflow, from understanding a dataset to presenting analytical findings through a web interface.";

    }


    /* =====================================================
       DELAYED RESPONSE
       ===================================================== */

    setTimeout(() => {

        addAIMessage(
            response,
            chatBody
        );

    }, 450);

}


/* =========================================================
   SCROLL CHAT
   ========================================================= */

function scrollChatToBottom(chatBody) {

    setTimeout(() => {

        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: "smooth"
        });

    }, 50);

}


/* =========================================================
   SCROLL ANIMATIONS
   ========================================================= */

function initializeScrollAnimations() {

    const elements =
        document.querySelectorAll(
            ".summary-card, " +
            ".objective-item, " +
            ".technology-card, " +
            ".workflow-step, " +
            ".project-card"
        );


    if (!elements.length) {
        return;
    }


    /* Initial state */

    elements.forEach((element) => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(20px)";

        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

    });


    /* Intersection Observer */

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.style.opacity =
                        "1";

                    entry.target.style.transform =
                        "translateY(0)";


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach((element) => {

        observer.observe(element);

    });

}


/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(
                    targetId
                );

            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});