document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        const answer = item.querySelector(".faq-answer");
        const isOpen = item.classList.contains("active");

        if (isOpen) {
            // CLOSE
            item.classList.add("closing");
            answer.style.height = answer.scrollHeight + "px";

            requestAnimationFrame(() => {
                answer.style.height = "0px";
            });

            item.classList.remove("active");

            setTimeout(() => {
                item.classList.remove("closing");
            }, 450);
        } else {
            // OPEN
            item.classList.add("active");
            answer.style.height = answer.scrollHeight + "px";
        }
    });
});