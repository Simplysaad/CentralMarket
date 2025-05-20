let btnToggleTheme = document.querySelector("#btnToggleTheme")
let body = document.body

let isDark = window.localStorage.getItem("theme") === "dark"
let toggleTheme = (e) => {
    isDark = window.localStorage.getItem("theme") === "dark"

    body.classList.toggle("bg-dark", isDark)
    body.classList.toggle("text-light", isDark)

    btnToggleTheme.innerHTML = `<i class="fa-solid ${isDark ? "fa-sun text-light" : "fa-moon text-dark"} px-2  float-start"> </i>`

    console.log(`isDark ${isDark}`)


    let links = document.querySelectorAll("a")
    links.forEach((element, index) => {
        element.style.color = "inherit"
        //element.textContent = "green"
    })

}

toggleTheme()

btnToggleTheme.addEventListener("click", (e) => {
    window.localStorage.setItem("theme", `${isDark ? "light" : "dark"}`)
    toggleTheme()
})

// it is not showing the theme in the localStorage : FIXED