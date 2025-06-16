const storeForm = document.getElementById("storeForm");
const btnSubmitStore = document.getElementById("btnSubmitStore");

//IMAGES section
const coverImageInput = document.getElementById("coverImage");
const coverImagePreview = document.getElementById("coverImagePreview");

//Displaying selected image
coverImageInput.addEventListener("change", function (e) {
    const [file] = this.files;
    if (file) {
        coverImagePreview.src = URL.createObjectURL(file);
    }
});

//Store Information
const storeName = document.getElementById("storeName");
const storeDesc = document.getElementById("storeDesc");

const phoneNumber = document.getElementById("phoneNumber");
const instagram = document.getElementById("instagram");

//Bank Details
const accountName = document.getElementById("accountName");
const accountNumber = document.getElementById("accountNumber");
const bankName = document.getElementById("bankName");

//Address Information
const address_1 = document.getElementById("address_1");
const address_2 = document.getElementById("address_2");
const state = document.getElementById("state");
const lga = document.getElementById("lga");

let errorElements = document.querySelectorAll(".error-message");

function showError(target, message) {
    console.log(target);
    let parent = target.parentElement;
    let errorElement = parent.querySelector(".error-message");

    errorElements.forEach(element => {
        element.textContent = "";
        if (errorElement === element) {
            element.scrollIntoView();
            element.textContent = message || "error in this field";
        }
    });
}
function validateFields() {
    const inputs = storeForm.querySelectorAll(
        "input:not([type='file']), select, textarea"
    );

    if (coverImageInput.files.length === 0) {
        showError(coverImageInput, "cover image has to be entered");
        return false;
    }

    for (let input of inputs) {
        console.log(input.id);
        if (!input.checkValidity()) {
            showError(input, input.validationMessage);
            //input.focus();
            return false;
        }
    }

    return true;
}

function sanitizeFields() {
    const inputs = storeForm.querySelectorAll(
        "input:not([type='file']), select, textarea"
    );
    let regex = new RegExp("<?/.>", "gi");

    inputs.forEach(input => {
        input.value = input.value.trim();
        if (regex.test(input.value)) {
            input.value = input.value.replace(regex, "_");
        }
    });

    return;
}
btnSubmitStore.addEventListener("click", e => {
    e.preventDefault();
    if (!validateFields()) return;

    sanitizeFields();
    storeForm.submit();
});
