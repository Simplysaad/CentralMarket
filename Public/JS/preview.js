// Select elements
const btnWish = document.querySelector(".btn-wish");
const btnCart = document.querySelector(".btn-cart");
const btnGroupAction = document.querySelector(".actions");

// Get the offset top of the cart button
let threshold = btnGroupAction.offsetTop;

/**
 * Event listener for window scroll that adds or removes sticky class
 * based on user scroll Y position
 */
window.addEventListener("scroll", () => {
    if (window.scrollY >= threshold) {
        btnGroupAction.classList.add("fixed-top");
    } else {
        btnGroupAction.classList.remove("fixed-top");
    }
});
// Remove sticky from the cart if widnow size is greater than 600px
if (window.width >= 600) {
    btnGroupAction.classList.remove("sticky");
}
btnCart.addEventListener("click", () => {
    btnCart.classList.replace("btn-outline-dark", "btn-dark");
    btnCart.classList.add("btn-added-cart");
    btnCart.querySelector(".cart-text").textContent = "Added to cart";
    let inputColor = document.querySelectorAll("input[name='color']");
    let inputSizes = document.querySelectorAll("input[name='size']");

    let body = {};
    for (let radio of inputSizes) {
        if (radio.checked) {
            body.size = radio.value;
        }
    }
    for (let radio of inputColor) {
        if (radio.checked) {
            body.color = radio.value;
        }
    }

    fetch(`/cart/${btnGroupAction.dataset.productId}`, {
        method: "post",
        body
    })
        .then(response => response.json())
        .then(data => (document.querySelector(".data-text").textContent = data))
        .catch(err => console.error(err));
});
// btnWish.addEventListener("click", () => {
//     btnWish.classList.toggle("btn-dark");

//     fetch(`/wish/${btnWish.dataset.productId}`, {
//         method: "post"
//     })
//         .then(response => response.json())
//         .catch(err => console.error(err));
// });
