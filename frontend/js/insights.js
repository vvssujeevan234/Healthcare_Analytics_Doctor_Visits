/* =========================================================
   HEALTHCARE ANALYTICS
   INSIGHTS PAGE
   ========================================================= */


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMobileNavigation();

    initializeChatbot();

    initializeSmoothScrolling();

    initializeInsightStatus();

    initializeCardAnimations();

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

        const isOpen =
            mobileNavigation.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
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


    document.addEventListener("click", event => {

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
   CHATBOT
   ========================================================= */

function initializeChatbot() {

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
        !closeButton
    ) {
        return;
    }


    /* =====================================================
       OPEN CHAT
       ===================================================== */

    robotButton.addEventListener("click", () => {

        chatWindow.classList.add("active");

        setTimeout(() => {

            if (chatInput) {
                chatInput.focus();
            }

        }, 250);

    });


    /* =====================================================
       CLOSE CHAT
       ===================================================== */

    closeButton.addEventListener("click", () => {

        chatWindow.classList.remove("active");

    });


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            chatWindow.classList.contains("active")
        ) {

            chatWindow.classList.remove("active");

        }

    });


    /* =====================================================
       QUICK QUESTIONS
       ===================================================== */

    quickQuestions.forEach(button => {

        button.addEventListener("click", async () => {

            const question =
                button.dataset.question ||
                button.textContent.trim();


            addUserMessage(
                question,
                chatBody
            );


            await showAssistantResponse(
                question,
                chatBody
            );

        });

    });


    /* =====================================================
       CHAT FORM
       ===================================================== */

    if (chatForm) {

        chatForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                if (!chatInput) {
                    return;
                }


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


                await showAssistantResponse(
                    question,
                    chatBody
                );

            }
        );

    }

}


/* =========================================================
   ADD USER MESSAGE
   ========================================================= */

function addUserMessage(
    message,
    chatBody
) {

    if (!chatBody) {
        return;
    }


    const messageWrapper =
        document.createElement("div");


    messageWrapper.className =
        "ai-message ai-message-user";


    const messageContent =
        document.createElement("div");


    messageContent.className =
        "ai-user-message-content";


    messageContent.textContent =
        message;


    messageWrapper.appendChild(
        messageContent
    );


    chatBody.appendChild(
        messageWrapper
    );


    scrollChatToBottom(chatBody);

}


/* =========================================================
   ASSISTANT RESPONSE
   ========================================================= */

async function showAssistantResponse(
    question,
    chatBody
) {

    if (!chatBody) {
        return;
    }


    /* =====================================================
       TYPING INDICATOR
       ===================================================== */

    const typingWrapper =
        document.createElement("div");


    typingWrapper.className =
        "ai-message";


    typingWrapper.innerHTML = `
        <div class="ai-avatar-small">
            AI
        </div>

        <div class="ai-message-content">
            <p>Analyzing your question...</p>
        </div>
    `;


    chatBody.appendChild(
        typingWrapper
    );


    scrollChatToBottom(chatBody);


    try {

        /*
         * Send the question to Flask/Python.
         *
         * Change /api/insights/question
         * if your Flask route uses another URL.
         */

        const response = await fetch(
            "/api/insights/question",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        typingWrapper.remove();


        const responseWrapper =
            document.createElement("div");


        responseWrapper.className =
            "ai-message";


        const messageText =
            data.answer ||
            data.message ||
            "I could not generate an answer.";


        responseWrapper.innerHTML = `
            <div class="ai-avatar-small">
                AI
            </div>

            <div class="ai-message-content">
                <p>${escapeHTML(messageText)}</p>
            </div>
        `;


        chatBody.appendChild(
            responseWrapper
        );


        scrollChatToBottom(chatBody);


    } catch (error) {

        console.error(
            "Healthcare AI error:",
            error
        );


        typingWrapper.remove();


        const errorWrapper =
            document.createElement("div");


        errorWrapper.className =
            "ai-message";


        errorWrapper.innerHTML = `
            <div class="ai-avatar-small">
                AI
            </div>

            <div class="ai-message-content">
                <p>
                    I couldn't connect to the healthcare
                    analytics server. Please make sure the
                    Flask backend is running.
                </p>
            </div>
        `;


        chatBody.appendChild(
            errorWrapper
        );


        scrollChatToBottom(chatBody);

    }

}


/* =========================================================
   ESCAPE HTML
   =========================================================
   
   Prevents user/backend text from being interpreted
   as HTML inside the chatbot.
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;

}


/* =========================================================
   SCROLL CHAT
   ========================================================= */

function scrollChatToBottom(chatBody) {

    if (!chatBody) {
        return;
    }


    setTimeout(() => {

        chatBody.scrollTo({

            top:
                chatBody.scrollHeight,

            behavior:
                "smooth"

        });

    }, 50);

}


/* =========================================================
   SMOOTH SCROLLING
   ========================================================= */

function initializeSmoothScrolling() {

    const anchors =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchors.forEach(anchor => {

        anchor.addEventListener(
            "click",
            event => {

                const targetId =
                    anchor.getAttribute("href");


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

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }
        );

    });

}


/* =========================================================
   STATUS
   ========================================================= */

function initializeInsightStatus() {

    const status =
        document.getElementById(
            "insightStatus"
        );


    if (!status) {
        return;
    }


    status.textContent =
        "Healthcare insights loaded";

}


/* =========================================================
   CARD ANIMATIONS
   ========================================================= */

function initializeCardAnimations() {

    const cards =
        document.querySelectorAll(
            ".insight-card, .metric-card, .highlight-item"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.style.opacity =
                            "1";


                        entry.target.style.transform =
                            "translateY(0)";


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    cards.forEach(card => {

        card.style.opacity =
            "0";


        card.style.transform =
            "translateY(18px)";


        card.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";


        observer.observe(card);

    });

}


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            const status =
                document.getElementById(
                    "insightStatus"
                );


            if (status) {

                status.textContent =
                    "Healthcare insights loaded";

            }

        }

    }
);