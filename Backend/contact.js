emailjs.init("Y_YNhVxgJXdIdhPb0");


form.addEventListener("submit", function (event) {
  event.preventDefault();
  sendButton.disabled = true;
  document.getElementById("send-btn").sendForm("service_prxclaq", "template_11decp9", form)

  .then(() => {
    document.getElementById("contact-form").reset();
    document.getElementById("send-btn").disabled = false;
  })
  .catch((err) => {
    alert("Message failed to send. Please try again later.");
    document.getElementById("send-btn").disabled = false;
  });

});