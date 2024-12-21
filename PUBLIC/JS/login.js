const loginForm = document.querySelector("#loginForm");

const username = document.querySelector("#username").value;
const password = document.querySelector("#loginPassword").value;
const errorMessage = document.querySelector("#errorMessage");

const validateLogin = async () => {
    try {
        const response = await fetch("/auth/validate-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!data.success) {
            console.log("data", data);
            errorMessage.textContent =
                data.errorMessage || "Invalid credentials";
            return false;
        } else return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const btnSubmitLogin = document.getElementById("btnSubmitLogin");

btnSubmitLogin.addEventListener("click", async e => {
    e.preventDefault();
    let isValid = await validateLogin();

    if (isValid) {
        loginForm.submit();
        return true;
    } else {
        console.log("Login attempt invalid");
        errorMessage.textContent = "invalid username or password";
        return false;
    }
});

const showPassword_login = () => {
    const loginPassword = document.getElementById("loginPassword");
    const isVisible = loginPassword.type === "text";
    loginPassword.type = isVisible ? "password" : "text";
};

const btnShowPassword_login = document.querySelector(".btnShowPassword");
btnShowPassword_login.addEventListener("click", e => {
    e.preventDefault();
    showPassword_login();
});
