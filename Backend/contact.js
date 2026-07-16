const contactForm = document.getElementById("contact-form");
const sendMessageButton = document.getElementById("send-btn");

emailjs.init("Y_YNhVxgJXdIdhPb0");

if (contactForm instanceof HTMLFormElement && sendMessageButton instanceof HTMLButtonElement) {
  contactForm.addEventListener("submit", (submitEvent) => {
    submitEvent.preventDefault();
    sendMessageButton.disabled = true;

    emailjs
      .sendForm("service_prxclaq", "template_11decp9", contactForm)
      .then(() => {
        contactForm.reset();
        sendMessageButton.disabled = false;
      })
      .catch((submissionError) => {
        console.error("Email submission failed.", submissionError);
        alert("Message failed to send. Please try again later.");
        sendMessageButton.disabled = false;
      });
  });
}