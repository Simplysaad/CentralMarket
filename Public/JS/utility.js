const btnCart = document.querySelectorAll(".btn-cart");
const btnWish = document.querySelectorAll(".btn-wish");

btnCart.forEach((btn, index) => {
    btn.addEventListener("click", async e => {
        let { productId } = btn.dataset;
        btn.disabled = true;
        try {
            fetch(`/cart/${productId}`, {
                method: "post"
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log("in cart");
                        btn.classList.replace("btn-outline-dark", "btn-dark");
                        btn.querySelector(
                            "span"
                        ).textContent = `${data?.item.quantity} in cart`;
                    }
                })
                .catch(err => console.error(err));
        } catch (err) {
            console.error(err);
        } finally {
            btn.disabled = false;
        }
    });
});
btnWish.forEach((btn, index) => {
    btn.addEventListener("click", async e => {
        let { productId } = btn.dataset;
        btn.disabled = true;
        try {
            fetch(`/cart/${productId}?wish=add`, {
                method: "post"
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        btn.classList.replace(
                            "btn-outline-dark",
                            "btn-secondary"
                        );
                        btn.innerHTML = "<i class='fa fa-heart'></i>";
                    }
                })
                .catch(err => console.error(err));
        } catch (err) {
            console.error(err);
        } finally {
            btn.disabled = false;
        }
    });
});

// window.addEventListener("load", async e => {
//     try {
fetch(`/cart?checkWishlist=true`)
    .then(response => response.json())
    .then(data => {
        let { wishlist = [] } = data;
        btnWish.forEach((btn, index) => {
            let { productId } = btn.dataset;
        console.log(wishlist, productId);
            if (!wishlist.includes(productId)) {
                btn.classList.replace("btn-outline-dark", "btn-secondary");
                btn.innerHTML = "<i class='fa fa-heart'></i>";
            }
        });
    });

// fetch(`/cart?checkCart=true`)
//     .then(response => response.json())
//     .then(data => {
//         let { cart } = data;
//         btnCart.forEach((btn, index) => {
//             let { productId } = btn.dataset;
//             if (cart.some(item => item.productId === productId)) {
//                 btn.classList.replace("btn-outline-dark", "btn-dark");
//                 btn.querySelector(
//                     "span"
//                 ).textContent = `${data?.item.quantity} in cart`;
//             }
//         });
//     });
//     } catch (err) {
//         console.error(err);
//     }
// });
