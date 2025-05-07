const loginForm = document.querySelector("#loginForm");

const usernameElement = document.querySelector("#username");
const passwordElement = document.querySelector("#loginPassword");
const errorMessage = document.querySelector("#errorMessage");
const btnSubmitLogin = document.getElementById("btnSubmitLogin");

loginForm.addEventListener("submit", e => {
    try {
        e.preventDefault();
        fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: usernameElement.value,
                password: passwordElement.value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.log("data", data.errorMessage);
                    errorMessage.textContent =
                        data.errorMessage || "Invalid credentials";
                    return false;
                } else {
                    window.location.href = data.redirect;
                    return;
                }
            })
            .catch(err => console.error(err));
    } catch (error) {
        console.error(error);
        return;
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
