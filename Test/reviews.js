let inputRange = document.getElementById("inputRange");
let stars = document.querySelectorAll(".rating-star");

stars.forEach((star, index) => {
    star.addEventListener("click", () => {
        stars.forEach((s, i) => {
            s.classList.toggle("fas", i <= index);
        });
        inputRange.value = index + 1;
        console.log(inputRange.value);
    });
});

let reviewTextArea = document.getElementById("reviewTextArea")
reviewTextArea.addEventListener("input", ()=>{
  reviewTextArea.style.height = "auto"
  reviewTextArea.style.height = reviewTextArea.scrollHeight + "px"
})