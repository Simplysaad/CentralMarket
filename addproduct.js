// Input Description Auto-Resize
const inputDesc = document.querySelector(".input-desc");
inputDesc.addEventListener("input", () => {
    inputDesc.style.height = "auto";
    inputDesc.style.maxHeight = "200px";
    inputDesc.style.height = `${inputDesc.scrollHeight}px`;
});

// Tag Input Handling
const tagInput = document.getElementById("tagInput");
const selectedTagsList = document.getElementById("selectedTagsList");
const selectedTagsArray = new Set();

tagInput.addEventListener("input", e => {
    const tagValue = e.target.value.trim();
    const containsComma = tagValue.includes(",");

    if (containsComma) {
        const newTag = tagValue.replaceAll(/,/g, "").toLocaleLowerCase();
        selectedTagsArray.add(newTag);
        e.target.value = "";
    }

    updateSelectedTagsList();
});

// Update Selected Tags List
function updateSelectedTagsList() {
    selectedTagsList.replaceChildren();

    if (selectedTagsArray.size === 0) {
        const defaultListItem = document.createElement("li");
        defaultListItem.classList.add("p-2", "position-relative", "top-50");
        defaultListItem.textContent = "Separate tags with commas";
        selectedTagsList.append(defaultListItem);
    } else {
        selectedTagsArray.forEach(tag => {
            const tagElement = createTagElement(tag);
            selectedTagsList.append(tagElement);
        });
    }
}

// Create Tag Element
function createTagElement(tag) {
    const tagElement = document.createElement("li");
    tagElement.classList.add(
        "tag",
        "d-flex",
        "align-items-center",
        "justify-content-between",
        "gap-2",
        "rounded-pill",
        "px-2",
        "bg-dark",
        "text-light"
    );
    tagElement.setAttribute("itemId", tag);
    tagElement.textContent = tag;

    const tagRemove = document.createElement("span");
    tagRemove.classList.add("p-1", "tag-remove");
    tagRemove.innerHTML = `<i class="fa fa-times"> </i>`;
    tagRemove.addEventListener("click", () => {
        const parent = tagRemove.closest("li");
        selectedTagsList.removeChild(parent);
        selectedTagsArray.delete(parent.textContent);
        updateSelectedTagsList();
    });

    tagElement.append(tagRemove);
    return tagElement;
}

let productImageInput = document.getElementById("productImage");
let productImagePreview = document.getElementById("productImagePreview");
productImageInput.addEventListener("change", e => {
    productImagePreview.src = "./Public/IMG/add-image-icon.png";

    let productImage = e.target.files[0];
    console.log(productImage);

    let reader = new FileReader();
    reader.onload = () => {
        let imageDataUrl = reader.result;
        productImagePreview.src = imageDataUrl;
    };
    reader.readAsDataURL(productImage);
});

let productGallery = [];
let productGalleryElements = document.querySelectorAll(".product-gallery");
productGalleryElements.forEach((element, index) => {
    element.addEventListener("change", e => {
        let image = e.target.files[0];
        console.log(image);
        productGallery.push(image);

        let parent = productGalleryElements[index].parentElement;
        console.log(parent);

        let productPreview = parent.querySelector(".product-gallery-preview");
        productPreview.src="./Public/IMG/add-image-icon.png"
      
        let reader = new FileReader();
        reader.onload = () => {
            let imageDataUrl = reader.result;
            productPreview.src = imageDataUrl;
            console.log(productGalleryElements[index], productPreview);
        };
        reader.readAsDataURL(image);
    });
});

//productGallery;

//let productGallery = document.getElementsByName("productGallery")
//console.log(productGallery);
// productGallery.addEventListener("change", e => {
//     console.log(e.target.value);
//     console.log("input changed");

//     let fileArray = Array.from(e.target.files);
//     alert([...fileArray]);
// });
// setTimeout(function () {
//     console.log(productGallery.value);
//     console.log(productGallery.files);
// }, 6000);

// let inputFile = document.querySelector("#inputFile");
// inputFile.addEventListener("focus", () => {
//     setTimeout(function () {
//         console.log(inputFile.files);
//     }, 7000);
// });
