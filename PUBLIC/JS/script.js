const charArr = ["a", "b", "c", "d", "e", "f", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const ratings = [5, 4, 5, 5, 3, 1, 5, 3, 5, 5, 3, 4];
//THIS RATING SHOULD COME FROM DATABASE

const getRatings = async () => {
    try {
        const ratings = await fetch("/getRating", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        console.error(err);
    }

    return ratings;
};

function getRandomColor() {
    let color = "#";
    for (let i = 0; i < 6; i++) {
        let ranInt = Math.floor(Math.random() * 16);
        color += charArr[ranInt];
    }
    return color;
}
let cardImage = document.querySelectorAll(".card-image");
let previewImage = document.querySelectorAll(".preview-image");
randomImageColor(cardImage);
randomImageColor(previewImage);
function randomImageColor(Images) {
    Images.forEach(image => {
        //image.textContent += getRandomColor();
        image.style.backgroundColor = getRandomColor();
    });
}

const btnSearch = document.querySelector("#btnSearch");
const searchContainer = document.querySelector("#searchContainer");
const searchInput = document.querySelector("#searchInput");

const showSearchCont = () => {
    let searchDisplay = searchContainer.style.visibility;

    if (searchDisplay === "visible") {
        searchContainer.style.visibility = "hidden";
    } else {
        searchContainer.style.visibility = "visible";
        searchInput.focus();
    }
};

searchContainer.addEventListener("blur", showSearchCont);
btnSearch.addEventListener("click", showSearchCont);

function getAverage(arr) {
    let sum = 0;
    let average;
    for (i = 0; i < arr.length; i++) {
        if (typeof arr[i] === "number") {
            sum += arr[i];
        }
    }
    average = sum / arr.length;
    return average;
}
function createElement(parentId, tag, classes, textContent, src) {
    let element = document.createElement(tag);
    let parent = document.getElementById(parentId);
    element.textContent = textContent;

    if (Array.isArray(classes)) {
        classes.forEach(oneclass => {
            element.classList.add(oneclass);
        });
    } else {
        element.classList.add(classes);
    }
    if (tag === "img") {
        element.src = src;
    }
    element.href = src;
    parent.append(element);
}

function ratingStars() {
    let avgRating = Math.ceil(getAverage(ratings));

    for (i = 0; i < avgRating; i++) {
        createElement("ratingStars", "span", ["fa", "fa-star"]);
    }
    for (i = 0; i < 5 - avgRating; i++) {
        createElement("ratingStars", "span", ["fa-regular", "fa-star"]);
    }
}
ratingStars();

const btnCart = document.getElementById("btnCart");
const threshold = btnCart.offsetTop;
//console.log(threshold)
window.addEventListener("scroll", () => {
    if (window.scrollY >= threshold) {
        btnCart.classList.add("sticky");
        //console.log("ive passed by "+ window.scrollY)
    } else {
        btnCart.classList.remove("sticky");
    }
});
if (window.width >= 600) {
    btnCart.classList.remove("sticky");
}

const btnTag = document.querySelectorAll(".btn-tag");
btnTag.forEach(tag => {
    tag.addEventListener("click", async e => {
        //e.preventDefault();
        let searchTerm = tag.textContent;
        await postSearch(searchTerm);
        console.log(searchTerm);
    });
});

const postSearch = async searchTerm => {
    try {
        let response = await fetch("/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ searchTerm })
        });
        let responseBody = await response.text();

        console.log(responseBody);
        document.body.innerHTML = responseBody;

        if (!response.ok) {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }
    } catch (err) {
        console.error("Error:", err);
    }
};

const showPassword = () => {
    const inputPassword = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    console.log(inputPassword.type);

    const isVisible = inputPassword.type === "text";

    inputPassword.type = isVisible ? "password" : "text";
    confirmPassword.type = isVisible ? "password" : "text";
};

const btnShowPassword = document.querySelectorAll(".btnShowPassword");
btnShowPassword.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        showPassword();
    });
});

const placeOrder = () => {};
const search = async (req, res) => {
    try {
        const tagElements = document.querySelectorAll(".btn-tag");
        tagElements.forEach(tag => {
            const searchTerm = tag.textContent;
            fetch("/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: searchTerm
            }).then(data => console.log(data));
        });
    } catch (err) {
        console.error(err);
    }
};

const btnAddCart = document.querySelectorAll(".btn-add-cart");

btnAddCart.forEach(btn => {
    btn.addEventListener("click", async e => {
        e.preventDefault();
        const itemIdElement = btn.querySelector(".item-id");
        const inputQuantity = btn.querySelector(".input-quantity");
        
        const productId = itemIdElement.textContent; // replace with the actual product ID
        const addCartUrl = "/add-cart/" + productId;
        try {
            const response = await fetch(addCartUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  quantity: inputQuantity.value
                })
            });

            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    });
});
