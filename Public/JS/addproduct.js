let addProductsForm = document.getElementById("addProductsForm");

// Input Description Auto-Resize
const inputDesc = document.querySelector(".input-desc");
inputDesc.addEventListener("input", () => {
    inputDesc.style.height = "auto";
    inputDesc.style.maxHeight = "200px";
    inputDesc.style.height = `${inputDesc.scrollHeight}px`;
});

const productName = document.getElementById("productName");
const productDesc = document.getElementById("productDesc");
const productPrice = document.getElementById("productPrice");
const productDiscount = document.getElementById("productDiscount");

const productCategory = document.getElementById("productCategory");
const amountInStock = document.getElementById("amountInStock");

const productImage = document.getElementById("productImage");

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

addProductsForm.addEventListener("submit", e => {
    e.preventDefault();
    let formdata = new FormData(addProductsForm);
    let tags = [];
    selectedTagsArray.forEach(element => {
        tags.push(element);
    });

    let formDataObject = Object.fromEntries(formdata.entries());
    formDataObject.keywords = tags;
    console.log(formDataObject);

    let newFormdata = new FormData();
    Object.keys(formDataObject).forEach(key => {
        newFormdata.append(key, formDataObject[key]);
    });
    let response = fetch("/vendor/products/add", {
        method: "post",
        // headers: {
        //     "Content-Type": "multipart/form-data"
        // },
        body: newFormdata
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    console.log(response);
});
