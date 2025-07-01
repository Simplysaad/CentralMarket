const btnAddCart = document.getElementById("btnAddCart");
const btnWishList = document.getElementById("btnWishList");

btnAddCart.addEventListener("click", async e => {
    let { productId } = btnAddCart.dataset;
    let btn = e.target;
    btn.classList.replace("btn-outline-dark", "btn-dark");

    try {
        let response = await fetch(`/account/cart/${productId}`, {
            method: "post"
            //,headers: {}
        });
        let data = await response.json();
        if (!data.success) {
            console.error(data);
            return;
        } else {
            let cartItemIndex = data.cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (cartItemIndex !== -1) {
              btn.querySelector("span").textContent = `${data.items[cartItemIndex].quantity} in cart`;
            }
            else console.log("item not in cart")
        }

    } catch (err) {
        console.error(err);
    }
});
btnWishList.addEventListener("click", async e => {
    let { productId } = btnWishList.dataset;
    let btn = e.target;
    btn.classList.replace("btn-outline-dark", "btn-secondary");
    btn.innerHTML = `<i class="far fa-heart"></i>`;

    try {
        let response = await fetch(`/cart/${productId}?wish=add`, {
            method: "post"
            //,headers: {}
        });
        let data = await response.json();
        console.log(data?.wishlist);
    } catch (err) {
        console.error(err);
    }
});

// Select elements
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
