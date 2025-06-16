document.addEventListener("DOMContentLoaded", () => {
    let registerForm = document.getElementById("registerForm");

    let errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach(element => {
        element.textContent = "";
    });

    function showError(target, errorMessage) {
        console.log(target);
        let parent = target.parentElement;
        let errorElement = parent.querySelector(".error-message");

        errorElements.forEach(element => {
            element.textContent = "";
            if (errorElement === element) {
                element.scrollIntoView();
                element.textContent = errorMessage || "error in this field";
            }
        });
    }

    // Fieldset validation
    async function validateFieldsets() {
        const inputs = registerForm.querySelectorAll(
            'input:not([type="file"])'
        );
        let profileImage = document.getElementById("profileImage");
        let profileImagePreview = document.getElementById(
            "profileImagePreview"
        );

        if (profileImage.files.length === 0) {
            showError(profileImage, "profile Image is required");
            profileImagePreview.scrollIntoView();
            return false;
        }

        // Custom validations
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        const emailAddress = document.getElementById("emailAddress");
        const phoneNumber = document.getElementById("phoneNumber");


        if (password.validity.tooShort) {
            showError(password, "Passwords must contain at least 8 characters");
            password.focus()
            return false;
        }

        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, "Passwords do not match");
            confirmPassword.focus()
            return false;
        }

        // if (!/^\+?\$/.test(phoneNumber)) {
        //     showError(phoneNumber, "Invalid phone number format");
        //    phoneNumber.focus() 
        // return false;
        // }

        for (const input of inputs) {
            if (!input.checkValidity()) {
                showError(input, input.validationMessage); //"field can not be empty");
                input.focus();
                return false;
            }
        }
        const response = await fetch("/auth/register?checkEmail=true", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailAddress: emailAddress.value,
                phoneNumber: phoneNumber.value
            })
        });
        let data = await response.json();

        if (!data || !data.success) {
            showError(emailAddress, "email is already in use");
            return false;
        }
        return true;
    }

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
    console.log(registerForm);

    document.getElementById("btnShowPassword").addEventListener("click", e => {
        e.preventDefault();
        const passwords = document.querySelectorAll(".password");
        const isPassword = passwords[0].type === "password";

        console.log(registerForm);
        passwords.forEach(p => (p.type = isPassword ? "text" : "password"));
        e.currentTarget.querySelector(".fa").className = `fa fa-eye${
            isPassword ? "-slash" : ""
        }`;
    });

    // Profile image preview

    profileImage.addEventListener("change", function (e) {
        const [file] = this.files;
        if (file) {
            profileImagePreview.src = URL.createObjectURL(file);
        }
    });
    // Set max birth date dynamically
    document.getElementById("birthDate").max = new Date()
        .toISOString()
        .split("T")[0];

    let btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.addEventListener("click", async e => {
        e.preventDefault();
        if (!(await validateFieldsets())) return;
        registerForm.submit();
    });
});
