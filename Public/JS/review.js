let inputRange = document.getElementById("inputRange");
let stars = document.querySelectorAll(".rating-star");
//if (stars) {
stars.forEach((star, index) => {
    star.addEventListener("click", e => {
        console.log(star, index);
        stars.forEach((s, i) => {
            let starIcon = s.querySelector(".fa-star");
            starIcon.classList.toggle("fas", i <= index);
            starIcon.classList.toggle("far", i > index);
        });
        inputRange.value = index + 1;
        console.log(inputRange.value);
    });
});
//}

let reviewTextArea = document.getElementById("reviewTextArea");

if (reviewTextArea) {
    reviewTextArea.maxHeight = "250px";
    reviewTextArea.addEventListener("input", e => {
        console.log(e.target.value);
        let inputValue = e.target.value;

        let characters = inputValue.split("");
        let words = inputValue.split(" ");

        if (characters.length === 300) alert("i'm 300 spartan");
        if (words.length === 300) alert("i'm 300 wordean");

        reviewTextArea.style.height = "auto";
        reviewTextArea.style.height = reviewTextArea.scrollHeight + "px";
    });
}
//
/**
 * createElement()
 * Creates an HTML element with specified attributes and appends it to a parent element.
 * @param {string} parentSelector - The querySelector of the parent HTML element.
 * @param {string} tag - The HTML tag name for the new element.
 * @param {string|Array<string>} classes - A string or array of CSS class names for the new element.
 * @param {string} textContent - The text content for the new element.
 * @param {string} src - The source URL for the new element if its a img or href for anchor element
 */
function createElement(parentSelector, tag, classes, textContent, src) {
    let element = document.createElement(tag);
    let parent = document.querySelector(parentSelector);
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
/**
 * createRatingStars()
 * Creates star elements based on the average rating and appends them to the specified container.
 */
function createRatingStars(rating, parent) {
    for (let i = 0; i < rating; i++) {
        createElement(parent, "i", ["fa", "fa-star"]);
    }
    for (let i = 0; i < 5 - rating; i++) {
        createElement(parent, "i", ["fa-regular", "fa-star"]);
    }
}

let avgRatingDiv = document.getElementById("averageRating");
//let avgRating = Number(avgRatingDiv.textContent);
//createRatingStars(avgRating, "#avgRating");

let ratingStarsDivs = document.querySelectorAll(".rating-stars");
ratingStarsDivs.forEach((starDiv, index) => {
    let ratingNumberDiv = starDiv.querySelector("data");

    let ratingNumber = Number(ratingNumberDiv.textContent) * 1;
    console.log("ratingNumber * 10 = ", ratingNumber * 10);

    // createRatingStars(starDiv, ratingNumber);
    ratingNumber = Math.ceil(ratingNumber);
    for (let i = 0; i < ratingNumber; i++) {
        let newStar = document.createElement("i");
        newStar.classList.add("fas", "fa-star");
        starDiv.append(newStar);
    }
    for (let i = 0; i < 5 - ratingNumber; i++) {
        let newStar = document.createElement("i");
        newStar.classList.add("far", "fa-star");
        starDiv.append(newStar);
    }
    console.log(starDiv);
});
