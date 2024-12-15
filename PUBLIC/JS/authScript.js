const roleSelector = document.getElementById("roleSelector");
const personalDetails = document.getElementById("personalDetails");
const businessDetails = document.getElementById("businessDetails");
const roles = document.getElementsByName("role");

const showBusinessBtn = document.querySelector("#showBusinessBtn");
const showBusinessDiv = document.querySelector("#showBusinessDiv");
const registerForm = document.querySelector("#registerForm");

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
    const confirmPassword = document.getElementById("confirmPassword");
    console.log(inputPassword.type);
    
    const isVisible = inputPassword.type === "text"
    
    inputPassword.type = isVisible ? "password" : "text"
    confirmPassword.type = isVisible ? "password" : "text"
};
showPassword()

const btnShowPassword = document.querySelectorAll(".btnShowPassword")
btnShowPassword.forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    e.preventDefault()
    showPassword()
  })
})