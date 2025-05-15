let sideNav = document.querySelector("#sideNav");
let isSmallScreen = window.innerWidth <= 768;

sideNav.classList.toggle("collapse", isSmallScreen);
sideNav.classList.toggle("position-fixed", isSmallScreen);

const btnCart = document.querySelectorAll(".btn-cart");
const btnWish = document.querySelectorAll(".btn-wish");

btnCart.forEach((btn, index) => {
    btn.addEventListener("click", async e => {
        let { productId } = btn.dataset;
        btn.disabled = true;
        try {
            fetch(`/account/cart/${productId}`, {
                method: "post"
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(`${data?.item?.productId} in cart`);

                        btn.classList.replace("btn-outline-dark", "btn-dark");
                        btn.querySelector("span").textContent = `${
                            data?.item?.quantity || 0
                        } in cart`;
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
            fetch(`/account/wishlist/${productId}`, {
                method: "post"
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data.message);
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
