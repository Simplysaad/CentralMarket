const roleSelector = document.getElementById("roleSelector");
const personalDetails = document.getElementById("personalDetails");
const businessDetails = document.getElementById("businessDetails");
const roles = document.getElementsByName("role");

const showBusinessBtn = document.querySelector("#showBusinessBtn");
const showBusinessDiv = document.querySelector("#showBusinessDiv");
const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");

businessDetails.style.display = "none";
const preventDefaultListener = e => {
    e.preventDefault();
};

roles.forEach(role => {
    role.addEventListener("click", () => {
        if (role.value === "vendor") {
            businessDetails.style.display = "block";
            showBusinessBtn.addEventListener("click", preventDefaultListener);
            showBusinessDiv.style.display = "none";
        } else if (role.value === "customer") {
            businessDetails.style.display = "none";
            showBusinessDiv.style.display = "block";
            showBusinessBtn.removeEventListener(
                "click",
                preventDefaultListener
            );
        }
    });
});

const showPassword = () => {
    const inputPassword = document.getElementById("password");
    const loginPassword = document.getElementById("loginPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    console.log(inputPassword.type);

    const isVisible =
        inputPassword.type === "text" || loginPassword.type === "text";

    inputPassword.type = isVisible ? "password" : "text";
    loginPassword.type = isVisible ? "password" : "text";
    confirmPassword.type = isVisible ? "password" : "text";
};

const btnShowPassword = document.querySelectorAll(".btnShowPassword");
btnShowPassword.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        showPassword();
    });
});

const validateLogin = async () => {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#loginPassword").value;
    const errorMessage = document.querySelector("#errorMessage");

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!data.success) {
            errorMessage.textContent =
                data.errorMessage || "Invalid credentials";
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const btnSubmitLogin = document.querySelector("#btnSubmitLogin");

btnSubmitLogin.addEventListener("click", async e => {
    e.preventDefault();
    const isValid = await validateLogin();

    if (isValid) {
      loginForm.submit()
    }
});

const validateRegister = async () => {
    const emailAddress = document.querySelector("#emailAddress").value;
    const password = document.querySelector("#password").value;
    const errorMessage = document.querySelector("#errorMessage");

    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailAddress, password }) // Include password in request body
        });

        const data = await response.json();

        if (!data.success) {
            errorMessage.textContent =
                data.errorMessage || "Invalid credentials";
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const btnSubmitRegister = document.querySelector("#btnSubmitRegister");

btnSubmitRegister.addEventListener("click", async e => {
    e.preventDefault();
    const isValid = await validateRegister();

    if (isValid) {
        registerForm.submit();
    }
});
