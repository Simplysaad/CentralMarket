const form = document.querySelector("#form");
const btnRegister = document.querySelector("#btnRegister");
const emailAddress = document.querySelector("#emailAddress");

let emailError = document.querySelector(".email-error");

emailAddress.addEventListener("change", async e => {
    e.preventDefault();

    try {
        const response = await fetch("/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ emailAddress: emailAddress })
        });
        const responseData = await response.json();
        console.log(responseData);

        emailError.innerHTML = responseData.message;
    } catch (err) {
        console.error(err);
    }
});
