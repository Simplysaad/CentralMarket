let cartItems = document.querySelectorAll(".cart-item");
let cartTotalElements = document.querySelectorAll(".cart-total");

cartItems.forEach((item, index) => {
    async function handleRequest(method) {
        let response = await fetch(`/account/cart/${itemId}`, {
            method,
            headers: {
                "Content-Type": "application/json"
            }
        });
        let data = await response.json();
        let cartItemData = data.cart.find(item => item.productId === itemId);

        if (cartItemData) {
            quantityElement.textContent = cartItemData.quantity;
            priceElement.textContent = "$" + cartItemData.subTotal;
        } else {
            window.location.href = "/account/cart";
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
let btnOrder = document.querySelectorAll(".btn-order");
btnOrder.forEach((btn, index) => {
    btn.addEventListener("click", async e => {
      console.log("order is placed")
        let response = await fetch("/order", {
            method: "post"
        });
        let data = await response.json();
        //return (window.location.href = "/vendor/");
    });
});
