const roleSelector = document.getElementById("roleSelector");
const businessDetails = document.getElementById("businessDetails");
//const personalDetails = document.getElementById("personalDetails");

const showBusinessDiv = document.querySelector("#showBusinessDiv");

const inputPassword = document.getElementById("password");
const inputEmail = document.getElementById("emailAddress");
const inputUsername = document.getElementById("username");
const confirmPassword = document.getElementById("confirmPassword");
const checkAgreement = document.getElementById("checkAgreement");

const errorMessage = document.querySelector("#errorMessage");

const roles = document.querySelectorAll(".checkbox");

roles.forEach(role => {
    businessDetails.style.display = "none";
    role.addEventListener("input", () => {
        console.log("role", role.value);
        if (role.value !== "customer") {
            businessDetails.style.display = "block";
            showBusinessDiv.style.display = "none";
        } else {
            businessDetails.style.display = "none";
            showBusinessDiv.style.display = "block";
        }
    });
});

const showPassword_register = () => {
    const isVisible = inputPassword.type === "text";
    inputPassword.type = isVisible ? "password" : "text";
    confirmPassword.type = isVisible ? "password" : "text";
};

const btnShowPassword = document.querySelector(".btnShowPassword");
btnShowPassword.addEventListener("click", e => {
    e.preventDefault();
    showPassword_register();
});

const registerForm = document.querySelector("#registerForm");
registerForm.addEventListener("submit", async e => {
    e.preventDefault();

    const emailAddress = inputEmail.value;
    const password = inputPassword.value;
    const username = inputUsername.value;
    const confirmPasswordValue = confirmPassword.value;

    try {
        if (password !== confirmPasswordValue) {
            errorMessage.textContent = "Passwords do not match";
            confirmPassword.focus();
            confirmPassword.classList.add("border-danger");
            
            return false;
        } else if (!checkAgreement.checked) {
            errorMessage.textContent = "Agree to Terms and conditions ";
            checkAgreement.focus();
            return false;
        }
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailAddress, username, password })
        });
        console.log(JSON.stringify(response));
        const data = await response.json();

        if (data.success) {
            window.location.href = data.redirect;
            return;
        } else {
            errorMessage.textContent = data.errorMessage;
            inputEmail.focus();
            inputEmail.classList.add("border-danger");

            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
});
