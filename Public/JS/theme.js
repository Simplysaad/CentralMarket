let btnToggleTheme = document.querySelector("#btnToggleTheme")
let body = document.body

let isDark = window.localStorage.getItem("theme") === "dark"
let toggleTheme = (e) => {
    isDark = window.localStorage.getItem("theme") === "dark"

    body.classList.toggle("bg-dark", isDark)
    body.classList.toggle("text-light", isDark)

    btnToggleTheme.innerHTML = `<i class="fa-solid ${isDark ? "fa-moon" : "fa-sun"} px-2  float-start"> </i>`

    window.localStorage.setItem("theme", `${isDark ? "light" : "dark"}`)
    console.log(`isDark ${isDark}`)

}

toggleTheme()

btnToggleTheme.addEventListener("click", toggleTheme)

// it is not showing the theme in the localStorage