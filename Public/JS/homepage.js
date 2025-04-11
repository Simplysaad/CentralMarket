const btnCart = document.querySelectorAll(".btn-cart");
const btnWish = document.querySelectorAll(".btn-wish");
const btnSearch = document.querySelector("#btnSearch");
const navBarSearch = document.querySelector(".navbar-search");

btnCart.forEach((btn, index) => {
    btn.addEventListener("click", async e => {
        let { productId } = btn.dataset;

        console.log(`btn cart clicked id: ${productId}`);
        let url = `/cart/${productId}`;
        let response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }
        });
        let data = await response.json();

        let cartItem = data.cart.find(
            element => element.productId == productId
        );
        if (cartItem) {
            console.log(`item is in the cart ${cartItem.quantity} times`);
            btn.querySelector(
                "span"
            ).innerHTML = `${cartItem.quantity} in cart`;
        }
    });
});
// btnWish.forEach((btn, index) => {
//     btn.addEventListener("click", async e => {
//         let url = `/wishlist/${productId}`;
//         let response = await fetch(url, {
//             method: "post",
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });
//         let data = await response.json();
//         console.log(data);
//     });
// });
btnSearch.addEventListener("click", e => {
    //e.preventDefault();
    console.log("btnSearch clikced");
    navBarSearch.classList.toggle("d-none");
    btnSearch.classList.toggle("text-muted");
});
