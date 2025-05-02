const btnAddCart = document.getElementById("btnAddCart");
const btnWishList = document.getElementById("btnWishList");

btnAddCart.addEventListener("click", async e => {
    let { productId } = btnAddCart.dataset;
    let btn = e.target;
    btn.classList.replace("btn-outline-dark", "btn-dark");

    try {
        let response = await fetch(`/cart/${productId}`, {
            method: "post"
            //,headers: {}
        });
        let data = await response.json();
        if (!data.success) console.error(data);

        btn.querySelector("span").textContent = `${data.item.quantity} in cart`;
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
        })
        let data = await response.json()
        console.log(data?.wishlist)
        
    } catch (err) {
        console.error(err);
    }
});
