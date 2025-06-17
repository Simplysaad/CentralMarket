let btnToggleTheme = document.querySelector("#btnToggleTheme");
let body = document.body;
sideNav = document.querySelector("#sideNav");
let tables = document.querySelectorAll(".table");
let formControls = document.querySelectorAll(".form-control");

let isDark = window.localStorage.getItem("theme") === "dark";
let toggleTheme = () => {
    isDark = window.localStorage.getItem("theme") === "dark";

    // isDark = window.localStorage.getItem("theme") === "dark";
    // body.classList.replace(
    //     isDark ? "bg-light" : "bg-dark",
    //     isDark ? "bg-dark" : "bg-light"
    // );
    // body.classList.replace(
    //     isDark ? "text-dark" : "text-light",
    //     isDark ? "text-light" : "text-dark"
    // );

    // sideNav.classList.toggle("bg-dark", isDark);
    // sideNav.classList.toggle("bg-light", !isDark);

    // if (tables.length > 0)
    //     tables.forEach(table => {
    //         table.classList.toggle("table-dark", isDark);
    //     });

    // console.log(`isDark ${isDark}`);
    // document
    //     .querySelectorAll("a")
    //     .forEach(element => (element.style.color = "inherit"));

    //IN THIS LIFE, KNOWLEDGE IS POWER,
    //SEE HOW MANY LINES I WROTENJUST TO ACJHI3VE SOMETHING 4 LINES COULD
    btnToggleTheme.innerHTML = `<i class="fa-solid ${
        isDark ? "fa-sun text-light" : "fa-moon text-dark"
    } px-2  float-start"> </i>`;

    let theme = isDark ? "dark" : "light";
    document.body.setAttribute("data-bs-theme", theme);
    console.log(theme, isDark);
};


getPreferredTheme();

btnToggleTheme.addEventListener("click", e => {
    window.localStorage.setItem("theme", `${isDark ? "light" : "dark"}`);
    toggleTheme();
});

// it is not showing the theme in the localStorage : FIXED
function getPreferredTheme() {
    let localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
        let preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";

        window.localStorage.setItem("theme", preferredTheme);
        console.log(localTheme, preferredTheme);
    }
    console.log(localTheme);

    toggleTheme();
}
