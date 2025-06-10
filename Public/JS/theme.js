let btnToggleTheme = document.querySelector("#btnToggleTheme");
let body = document.body;
sideNav = document.querySelector("#sideNav");
let tables = document.querySelectorAll(".table");

let isDark = window.localStorage.getItem("theme") === "dark";
let toggleTheme = () => {
    isDark = window.localStorage.getItem("theme") === "dark";
    body.classList.replace(
        isDark ? "bg-light" : "bg-dark",
        isDark ? "bg-dark" : "bg-light"
    );
    body.classList.replace(
        isDark ? "text-dark" : "text-light",
        isDark ? "text-light" : "text-dark"
    );

    sideNav.classList.toggle("bg-dark", isDark);
    sideNav.classList.toggle("bg-light", !isDark);

    if (tables.length > 0)
        tables.forEach(table => {
            table.classList.toggle("table-dark", isDark);
        });

    btnToggleTheme.innerHTML = `<i class="fa-solid ${
        isDark ? "fa-sun text-light" : "fa-moon text-dark"
    } px-2  float-start"> </i>`;
    console.log(`isDark ${isDark}`);
    document
        .querySelectorAll("a")
        .forEach(element => (element.style.color = "inherit"));
};

toggleTheme();

btnToggleTheme.addEventListener("click", e => {
    window.localStorage.setItem("theme", `${isDark ? "light" : "dark"}`);
    toggleTheme();
});

// it is not showing the theme in the localStorage : FIXED
