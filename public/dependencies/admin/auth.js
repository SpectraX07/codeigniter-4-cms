"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.querySelector("#formLogin");
    if (!formLogin) return;

    FormValidation.formValidation(formLogin, {
        fields: {
            username: {
                validators: {
                    notEmpty: { message: "Please enter username" },
                    stringLength: { min: 6, message: "Username must be more than 6 characters" }
                }
            },
            email: {
                validators: {
                    notEmpty: { message: "Please enter your email" },
                    emailAddress: { message: "Please enter a valid email address" }
                }
            },
            "email-username": {
                validators: {
                    notEmpty: { message: "Please enter email / username" },
                    stringLength: { min: 6, message: "Username must be more than 6 characters" }
                }
            },
            password: {
                validators: {
                    notEmpty: { message: "Please enter your password" },
                    stringLength: { min: 6, message: "Password must be more than 6 characters" }
                }
            },
            "confirm-password": {
                validators: {
                    notEmpty: { message: "Please confirm password" },
                    identical: {
                        compare: () => formLogin.querySelector('[name="password"]').value,
                        message: "The password and its confirmation do not match"
                    },
                    stringLength: { min: 6, message: "Password must be more than 6 characters" }
                }
            },
            terms: {
                validators: {
                    notEmpty: { message: "Please agree to the terms & conditions" }
                }
            }
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: "",
                rowSelector: ".mb-6"
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            autoFocus: new FormValidation.plugins.AutoFocus()
        },
        init: (instance) => {
            instance.on("plugins.message.placed", (event) => {
                if (event.element.parentElement.classList.contains("input-group")) {
                    event.element.parentElement.insertAdjacentElement("afterend", event.messageElement);
                }
            });
        }
    }).on("core.form.valid", async () => {
        const submitButton = formLogin.querySelector('button[type=submit]');
        const formData = new FormData(formLogin);

        document.querySelectorAll("span.text-danger").forEach(span => span.innerHTML = "");
        submitButton.disabled = true;
        submitButton.textContent = "Loading...";

        try {
            const response = await fetch(formLogin.action, {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            submitButton.disabled = false;
            submitButton.textContent = "Sign in";

            if (response.ok) {
                window.location.href = result.redirect;
            } else if (response.status === 422) {
                Object.entries(result.errors).forEach(([key, message]) => {
                    const errorElement = formLogin.querySelector(`span[name=${key}]`);
                    if (errorElement) errorElement.innerHTML = message;
                });
            } else {
                console.error("Server Error:", result.message);
                if (result.message) {
                    showToast("Error", result.message, "error");
                }
            }
        } catch (error) {
            console.error("Request Failed:", error);
            showToast("Error", "An unexpected error occurred", "error");
            submitButton.disabled = false;
            submitButton.textContent = "Sign in";
        }
    });
});
