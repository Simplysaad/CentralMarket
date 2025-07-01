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
        let cartItemIndex = data.cart.items.findIndex(
            item => item.productId === itemId
        );

        if (cartItemIndex !== -1) {
            quantityElement.textContent = cart.items[cartItemIndex].quantity;
            priceElement.textContent = "$" + cart.items[cartItemIndex].subTotal;
        } else {
            window.location.href = "/account/cart";
        }
        cartTotalElements.forEach((element, index) => {
            let cartTotal = data.deliveryFee
                ? data.total + data.deliveryFee
                : data.total;
            // console.log(cartTotal);
            element.textContent = "$" + cartTotal.toLocaleString();
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

let orderForm = document.querySelector("#orderForm");
let fullName = orderForm.querySelector("#fullName").value;
let emailAddress = orderForm.querySelector("#emailAddress").value;
let address = orderForm.querySelector("#address").value;

let btnOrder = document.querySelectorAll(".btn-order");
btnOrder.forEach((btn, index) => {
    btn.addEventListener("click", async e => {
        console.log("order is placed");

        btn.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> <span class="fs-6">Placing order</span> ';
        btn.disabled = true;
        btn.classList.add("btn-disabled");

        fetch("/order", {
            method: "post",
            body: JSON.stringify({
                name,
                emailAddress,
                address
            })
        }).then(response => {
            response.json();
        });
    }).then(data => {
        if (data.data) window.location.href = data.authorization_url;
        return;
    });

    return; //(window.location.href = data.authorization_url);
});
