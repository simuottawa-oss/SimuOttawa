emailjs.init("Y_YNhVxgJXdIdhPb0");

const form = document.getElementById("contact-form");
const sendButton = document.getElementById("send-btn");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  sendButton.disabled = true;
  emailjs.sendForm("service_prxclaq", "template_11decp9", form)

  .then(() => {
    form.reset();
    sendButton.disabled = false;
  })
  .catch((err) => {
    alert("Message failed to send. Please try again later.");
    sendButton.disabled = false;
  });

});