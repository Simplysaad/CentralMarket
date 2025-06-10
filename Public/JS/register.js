document.addEventListener("DOMContentLoaded", () => {
    // Fieldset navigation
    const fieldsets = document.querySelectorAll("fieldset");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext_accountInfo");
    const toast = new bootstrap.Toast(
        document.getElementById("messageToastCont")
    );
    let currentStep = 0;

    // Initialize form
    fieldsets.forEach((fieldset, index) => {
        fieldset.style.display = index === currentStep ? "block" : "none";
    });
    btnPrev.style.display = "none";

    // Fieldset display control
    function showFieldset(step) {
        currentStep = step;
        fieldsets.forEach((fieldset, index) => {
            fieldset.style.display = index === step ? "block" : "none";
        });
        btnPrev.style.display = step === 0 ? "none" : "block";
    }
    showFieldset(currentStep);

    // Navigation handlers
    btnNext.addEventListener("click", async e => {
        if (!(await validateFieldset(currentStep))) return;
        showFieldset(currentStep + 1);
    });

    btnPrev.addEventListener("click", () => {
        showFieldset(currentStep - 1);
    });

    // Fieldset validation
    async function validateFieldset(step) {
        const fieldset = fieldsets[step];
        const inputs = fieldset.querySelectorAll('input:not([type="file"])');

        for (const input of inputs) {
            if (!input.checkValidity()) {
                showToast("Please fill all required fields correctly", "error");
                //   input.reportValidity();
                input.focus();
                return false;
            }
        }

        // Custom validations
        if (step === 0) {
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirmPassword");
            const emailAddress = document.getElementById("emailAddress").value;
            const phoneNumber = document.getElementById("phoneNumber").value;

            const response = await fetch("/auth/register?checkEmail=true", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailAddress,
                    phoneNumber
                })
            });

            let data = await response.json();
            
            if (!data.success) {
                showToast("email is already in use", "error");
                return false;
            }
            
            if (password.value !== confirmPassword.value) {
                showToast("Passwords do not match", "error");
                return false;
            }

            if (!/^\+?\d{8,15}$/.test(phoneNumber)) {
                showToast("Invalid phone number format", "error");
                return false;
            }
        }

        return true;
    }

    // Form submission
    // document
    //     .getElementById("registerForm")
    //     .addEventListener("submit", async e => {
    //         e.preventDefault();

    //         if (!(await validateFieldset(currentStep))) return;

    //         const formData = new FormData(e.target);
    //         try {
    //             const response = await fetch(e.target.action, {
    //                 method: "POST",
    //                 body: formData
    //             });

    //             const result = await response.json();
    //             if (response.ok) {
    //                 showToast(
    //                     "Registration successful! Redirecting...",
    //                     "success"
    //                 );
    //                 setTimeout(
    //                     () => (window.location.href = "/auth/login"),
    //                     2000
    //                 );
    //             } else {
    //                 showToast(result.message || "Registration failed", "error");
    //             }
    //         } catch (error) {
    //             showToast("Network error. Please try again.", "error");
    //         }
    //     });

    // Toast notifications
    function showToast(message, type) {
        const toastIcon = document.getElementById("messageToastIcon");
        const toastText = document.getElementById("messageToastText");

        toastText.textContent = message;
        toastIcon.className = `fa fa-${
            type === "success" ? "check" : "times"
        } text-${type}`;
        toast.show();
    }

    // Additional features
    // Password visibility toggle
    document.getElementById("btnShowPassword").addEventListener("click", e => {
        e.preventDefault();
        const passwords = document.querySelectorAll(".password");
        const isPassword = passwords[0].type === "password";

        passwords.forEach(p => (p.type = isPassword ? "text" : "password"));
        e.currentTarget.querySelector(".fa").className = `fa fa-eye${
            isPassword ? "-slash" : ""
        }`;
    });

    // Profile image preview
    document
        .getElementById("profileImage")
        .addEventListener("change", function (e) {
            const [file] = this.files;
            if (file) {
                document.getElementById("profileImagePreview").src =
                    URL.createObjectURL(file);
            }
        });

    // Set max birth date dynamically
    document.getElementById("birthDate").max = new Date()
        .toISOString()
        .split("T")[0];

    let btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.addEventListener("click", async e => {
      e.preventDefault()
      if(!await validateFieldset(currentStep)) return;
      registerForm.submit()
    });
});
