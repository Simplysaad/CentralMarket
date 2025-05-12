let btnRemove = document.querySelectorAll(".btn-remove");

btnRemove.forEach((btn, index) => {
    btn.addEventListener("click", async e => {
        let { productId } = btn.dataset;
        btn.disabled = true;
        try {
            fetch(`/account/wishlist/${productId}`, {
                method: "delete"
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data.message);

                        let parent = btn.closest(".wishlist-card");
                        parent.remove();
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
