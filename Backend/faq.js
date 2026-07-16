document.querySelectorAll(".faq-question").forEach((faqQuestionButton) => {
    faqQuestionButton.addEventListener("click", () => {
        const faqItem = faqQuestionButton.closest(".faq-item");
        if (!faqItem) {
            return;
        }

        const faqAnswer = faqItem.querySelector(".faq-answer");
        if (!(faqAnswer instanceof HTMLElement)) {
            return;
        }

        const isFaqItemOpen = faqItem.classList.contains("active");

        if (isFaqItemOpen) {
            // CLOSE
            faqItem.classList.add("closing");
            faqAnswer.style.height = faqAnswer.scrollHeight + "px";

            requestAnimationFrame(() => {
                faqAnswer.style.height = "0px";
            });

            faqItem.classList.remove("active");

            setTimeout(() => {
                faqItem.classList.remove("closing");
            }, 450);
        } else {
            // OPEN
            faqItem.classList.add("active");
            faqAnswer.style.height = faqAnswer.scrollHeight + "px";
        }
    });
});