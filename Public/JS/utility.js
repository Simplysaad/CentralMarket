let wishListResponse = fetch("/cart?checkWishList=true")
    .then(response => response.json())
    //.then(data => console.log(data.wishlist))
    .catch(err => console.error(err));

let cartResponse = fetch("/cart?checkCart=true")
    .then(response => response.json())
    // .then(data => console.log(data.cart))
    .catch(err => console.error(err));

const checkCart = async productId => {
    let item = await cartResponse.cart.find(
        item => item.productId === productId
    );
    console.log(item);
    return item;
};
const checkWishList = async productId => {
    let item = await wishListResponse.wishlist.find(
        itemId => itemId === productId
    );
    console.log(item);
    return item;
};

const updateBtnWishlist = async (btn, data) => {
    let { productId } = btn.dataset;
    let item = await checkWishList(productId);
    if (item || data.success) {
        btn.innerHTML = `<i class="fa fa-heart"></i>`;
        btn.classList.replace("btn-outline-dark", "btn-outline-secondary");
    }
};

const updateBtnCart = async (btn, data) => {
    let { productId } = btn.dataset;
    let item = await checkCart(productId);
    if (item || data.success) {
        btn.classList.replace("btn-outline-dark", "btn-dark");
        btn.querySelector("span").textContent = `${
            item?.quantity || data?.item.quantity || data.wishlist
        } in cart`;
    }
};
const btnCart = document.querySelectorAll(".btn-cart");
const btnWish = document.querySelectorAll(".btn-wish");

btnCart.forEach(async btn => {
    await updateBtnCart(btn);
    btn.addEventListener("click", async productId => {
        btn.disabled = true;
        try {
            let response = fetch(`/cart/${productId}`, {
                method: "post"
            })
                .then(response => response.json())
                .then(data => updateBtnCart(btn, data))
                .catch(err => console.error(err));
        } catch (err) {
            console.error(err);
        } finally {
            btn.disabled = false;
        }
    });
});
btnWish.forEach(async btn => {
    await updateBtnWishlist(btn);
    btn.addEventListener("click", async productId => {
        btn.disabled = true;
        try {
            let response = await fetch(`/cart/${productId}?wish=add`, {
                method: "post"
            });
            let data = await response.json();
            await updateBtnWishlist(btn, data);
        } catch (err) {
            console.error(err);
        } finally {
            btn.disabled = false;
        }
    });
});
