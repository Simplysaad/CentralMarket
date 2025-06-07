document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const form = document.getElementById("registerForm");
    const fieldsets = {
        accountInfo: document.getElementById("accountInfo"),
        personalInfo: document.getElementById("personalInfo")
        // deliveryInfo: document.getElementById('deliveryInfo'), // Uncomment if used
    };

    const btnPrev = document.getElementById("btnPrev");
    const btnNextAccount = document.getElementById("btnNext_accountInfo");
    const btnSubmit = document.getElementById("btnSubmit"); // Uncomment if deliveryInfo is used

    const btnShowPassword = document.getElementById("btnShowPassword");
    const passwordInputs = form.querySelectorAll("input.password");

    // Toast elements and Bootstrap Toast instance
    const toastElement = document.getElementById("messageToastCont");
    const toastText = document.getElementById("messageToastText");
    const toastIcon = document.getElementById("messageToastIcon");
    const toast = new bootstrap.Toast(toastElement);

    // State tracking current step
    const steps = ["accountInfo", "personalInfo"]; // Add 'deliveryInfo' if needed
    let currentStepIndex = 0;

    // Helper: Show toast message
    function showToast(message, type = "error") {
        toastText.textContent = message;

        // Update icon and color based on type
        if (type === "error") {
            toastIcon.className = "fa fa-times text-danger";
        } else if (type === "success") {
            toastIcon.className = "fa fa-check text-success";
        } else {
            toastIcon.className = "fa fa-info-circle text-info";
        }

        toast.show();
    }

    // Helper: Show current step and hide others
    function showStep(index) {
        Object.entries(fieldsets).forEach(([key, fs]) => {
            if (fs) {
                fs.classList.toggle("d-none", key !== steps[index]);
            }
        });

        // Show/hide Prev button
        btnPrev.style.display = index === 0 ? "none" : "inline-block";

        currentStepIndex = index;
    }

    // Validate current step inputs (basic HTML5 validation)
    function validateAccountInfo() {
        const currentFieldset = fieldsets[steps[currentStepIndex]];
        if (!currentFieldset) return true;

        // Use checkValidity on inputs inside current fieldset
        const inputs = currentFieldset.querySelectorAll(
            "input, select, textarea"
        );

        let name = document.getElementById("name");
        let emailAddress = document.getElementById("emailAddress");
        let phoneNumber = document.getElementById("phoneNumber");
        let password = document.getElementById("password");
        let confirmPassword = document.getElementById("confirmPassword");

        for (const input of inputs) {
            input.addEventListener("input", e => {
                input.value = input.value.replace(/[<>]/g, " ");
                console.log(input.value);
            });

            if (!input.checkValidity()) {
                input.focus();
                showToast(
                    input.validationMessage ||
                        "Please fill out this field correctly.",
                    "error"
                );
                return false;
            }
        }

        if (phoneNumber.value.length < 10) {
            showToast("Invalid Phone number", "error");
            return false;
        }

        if (passwordInputs[0].value.length < 8) {
            showToast("Passwords must be at least 8 characters", "");
            return false;
        }

        if (passwordInputs[0].value !== passwordInputs[1].value) {
            showToast("Passwords do not match");
            return false;
        }
        fetch("/auth/register?checkEmail=true", {
            method: "post",
            body: JSON.stringify({
                emailAddress: emailAddress.value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    showToast(data.message, "error");
                    emailAddress.focus()
                    return false;
                } else return true;
            });
            
            
    }

    // Event: Next button on Account Info
    btnNextAccount.addEventListener("click", () => {
        let formData = new FormData(registerForm);
        console.log(formData);

        if (!validateAccountInfo()) return;
        showStep(currentStepIndex + 1);
    });

    function validatePersonalInfo() {
        const currentFieldset = fieldsets[steps[currentStepIndex]];
        if (!currentFieldset) return true;

        const inputs = currentFieldset.querySelectorAll(
            "input, select, textarea"
        );

        for (const input of inputs) {
            input.addEventListener("input", e => {
                input.value = input.value.replace(/[<>]/g, "").trim();
                console.log(input.value);
            });

            if (!input.checkValidity()) {
                input.focus();
                showToast(
                    input.validationMessage ||
                        "Please fill out this field correctly.",
                    "error"
                );
                return false;
            }
        }

        let birthDate = document.getElementById("birthDate");
        let profileImage = document.getElementById("profileImage");

        if (profileImage.value == null) {
            showToast("please add an image", "error");
            profileImage.focus();
            return false;
        }
        if (birthDate.value == null) {
            showToast("Enter your birthdate", "error");
            birthDate.focus();
            return false;
        }
        console.log(profileImage.value);
        return true;
    }
    //   // Event: Next button on Personal Info
    btnSubmit.addEventListener("click", e => {
        e.preventDefault();

        if (!validatePersonalInfo()) return;
        // If you have deliveryInfo step, show it here, else submit or show message
        // showStep(currentStepIndex + 1);

        showToast("Personal information validated.", "success");
        let formData = new FormData(registerForm);
        console.log(formData);
        registerForm.submit();
    });

    // Event: Prev button
    btnPrev.addEventListener("click", () => {
        if (currentStepIndex > 0) {
            showStep(currentStepIndex - 1);
        }
    });

    // Event: Toggle password visibility
    btnShowPassword.addEventListener("click", () => {
        passwordInputs.forEach(input => {
            if (input.type === "password") {
                input.type = "text";
                btnShowPassword.setAttribute("aria-label", "Hide password");
            } else {
                input.type = "password";
                btnShowPassword.setAttribute("aria-label", "Show password");
            }
        });
    });

    // Initialize: show first step and hide others
    showStep(0);

    // Optional: handle profile image preview
    const profileImageInput = document.getElementById("profileImage");
    const profileImagePreview = document.getElementById("profileImagePreview");
    if (profileImageInput && profileImagePreview) {
        profileImageInput.addEventListener("change", event => {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = e => {
                    profileImagePreview.src = e.target.result;
                    profileImagePreview.alt = "Selected profile image preview";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Optional: keyboard accessibility for profile image label
    const profileImageLabel = document.getElementById("profileImageCont");
    if (profileImageLabel) {
        profileImageLabel.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                profileImageInput.click();
            }
        });
    }
});
