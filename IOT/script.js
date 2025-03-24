// Dark Mode Toggle
document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});

// Contact Form Handler
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("form-message").innerText = "Message Sent Successfully!";
});
