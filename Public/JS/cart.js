let cartItems = document.querySelectorAll(".cart-item");
let cartTotalElements = document.querySelectorAll(".cart-total");

cartItems.forEach((item, index) => {
    async function handleRequest(method) {
        let response = await fetch(`/cart/${itemId}`, {
            method,
            headers: {
                "Content-Type": "application/json"
            }
        });
        let data = await response.json();
        let cartItemData = data.cart.find(item => item.productId === itemId);

        if (cartItemData) {
            quantityElement.textContent = cartItemData.quantity;
            priceElement.textContent = "$" + cartItemData.price;
        } else {
            window.location.href = "/cart";
        }
        cartTotalElements.forEach((element, index) => {
            let cartTotal = data.deliveryFee
                ? data.cartTotal + data.deliveryFee
                : data.cartTotal;
            console.log(cartTotal);
            element.textContent = "$" + cartTotal.toLocaleString();
            //element.textContent = "$" + data.cartTotal.toLocaleString();
        });
    }
    let btnAddCart = item.querySelector(".btn-add");
    let btnRemoveCart = item.querySelector(".btn-remove");

    let priceElement = item.querySelector(".item-price");
    let quantityElement = item.querySelector(".item-quantity");
    let { itemId } = item.dataset;

    btnAddCart.addEventListener("click", async () => {
        console.log("");
        await handleRequest("post");
    });
    btnRemoveCart.addEventListener("click", async () => {
        console.log("btn remove cart clicked");
        await handleRequest("delete");
    });
});
