let navbarToggler = document.querySelector(".navbar-toggler");
let mainHeader = document.querySelector("#mainHeader");

navbarToggler.addEventListener("click", () => {
    mainHeader.classList.toggle("position-relative");
});
