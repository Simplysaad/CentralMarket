let loginForm = document.getElementById("loginForm");
let btnSubmit = document.getElementById("btnSubmit");

let emailAddress = document.getElementById("emailAddress");
let password = document.getElementById("password");

let btnShowPassword = document.getElementById("btnShowPassword");

function showPassword(passwordElement) {
    passwordElement.type =
        passwordElement.type === "text" ? "password" : "text";
}
btnShowPassword.addEventListener("click", () => {
    showPassword(password);
    
});
function showToast(message, success) {
    let messageToastCont = document.getElementById("messageToastCont");
    let messageToastText = document.getElementById("messageToastText");
    let messageToastIcon = document.getElementById("messageToastIcon");

    messageToastText.textContent = message;
    messageToastCont.classList.toggle("d-block");

    if (!success) {
        console.log(message, success);
        messageToastCont.classList.add("border-danger");
        messageToastIcon.classList.add("fa-times");
    } else {
        console.log(success, message);
        messageToastCont.classList.add("border-success");
        messageToastIcon.classList.add("fa-tick");
    }

    setTimeout(() => {
        messageToastCont.classList.toggle("d-block");
    }, 2000);
}
function checkIsDirty(element) {
    // if (element.type == "file") console.log(element.files[0]); //!== undefined;
    if (element.type == "file") return element.files[0] !== undefined;
    return element.value !== "";
}
const faultyFields = [];
function showFaultyField(element, condition, message) {
    element.classList.add("border");
    if (condition) {
        element.classList.replace("border-success", "border-danger");
        element.classList.add("border-danger");
        faultyFields.push(element);
    } else {
        element.classList.replace("border-danger", "border-success");
        element.classList.add("border-success");
    }
}

btnSubmit.addEventListener("click", async e => {
    e.preventDefault();
    let message;
    let requiredFields = [emailAddress, password];
    requiredFields.forEach((element, index) => {
        let isDirty = checkIsDirty(element);
        showFaultyField(element, !isDirty);
        if (!isDirty) message = `enter all fields ${element.placeholder || ""}`;
    });
    if (message) showToast(message);
    else if (faultyFields.length == 0) loginForm.submit();
});

loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    let formdata = new FormData(loginForm);
    let jsonBody = Object.fromEntries(formdata.entries());

    let body = JSON.stringify(jsonBody);

    fetch("/auth/login", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            password.value = "";
            if (!data.success) {
                showToast(data.message);
            }
        });
});
