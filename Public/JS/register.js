let userName = document.getElementById("name");
let emailAddress = document.getElementById("emailAddress");
let phoneNumber = document.getElementById("phoneNumber");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");

let profileImagePreview = document.getElementById("profileImagePreview");
let profileImage = document.getElementById("profileImage");
let birthDate = document.getElementById("birthDate");
let gender = document.querySelector("input[name='gender']:checked");

let address_1 = document.getElementById("address_1");
let address_2 = document.getElementById("address_2");
let state = document.getElementById("state");
let school_name = document.getElementById("school_name");

let btnNextAccountInfo = document.getElementById("btnNext_accountInfo");
let btnNextPersonalInfo = document.getElementById("btnNext_personalInfo");
let btnNextDeliveryInfo = document.getElementById("btnSubmit");
let btnSubmit = document.getElementById("btnSubmit");

let btnPrev = document.getElementById("btnPrev");

let accountInfo = document.getElementById("accountInfo");
let personalInfo = document.getElementById("personalInfo");
let deliveryInfo = document.getElementById("deliveryInfo");

let btnShowPassword = document.getElementById("btnShowPassword");

let allFieldSets = document.querySelectorAll(".fieldset");
let currentIndex = 0;
allFieldSets.forEach((element, index) => {
    if (index != currentIndex) element.classList.replace("d-flex", "d-none");
});
function showNext() {
    allFieldSets.forEach((element, index) => {
        element.classList.replace("d-flex", "d-none");
    });
    if (currentIndex < allFieldSets.length - 1) {
        currentIndex++;
        console.log(allFieldSets[currentIndex], currentIndex);
    }
    allFieldSets[currentIndex].classList.replace("d-none", "d-flex");
}
function showPrev() {
    allFieldSets.forEach((element, index) => {
        element.classList.replace("d-flex", "d-none");
    });
    if (currentIndex > 0) {
        currentIndex--;
        console.log(allFieldSets[currentIndex], currentIndex);
    }
    allFieldSets[currentIndex].classList.replace("d-none", "d-flex");
}
function showToast(message, success) {
    let messageToastCont = document.getElementById("messageToastCont");
    let messageToastText = document.getElementById("messageToastText");
    let messageToastIcon = document.getElementById("messageToastIcon");

    messageToastText.textContent = message;
    messageToastCont.classList.toggle("d-block");

    if (!success) {
        console.log(message, success);
        messageToastCont.classList.add("border-danger");
        messageToastIcon.classList.add("fa-times");
    } else {
        console.log(success, message);
        messageToastCont.classList.add("border-success");
        messageToastIcon.classList.add("fa-tick");
    }

    setTimeout(() => {
        messageToastCont.classList.toggle("d-block");
    }, 2000);
}
function checkIsDirty(element) {
    // if (element.type == "file") console.log(element.files[0]); //!== undefined;
    if (element.type == "file") return element.files[0] !== undefined;
    return element.value !== "";
}
const faultyFields = [];
function showFaultyField(element, condition) {
    element.classList.add("border");
    if (condition) {
        faultyFields.push(element);
        element.classList.contains("border-success")
            ? element.classList.replace("border-success", "border-danger")
            : element.classList.add("border-danger");
    } else {
        element.classList.contains("border-danger")
            ? element.classList.replace("border-danger", "border-success")
            : element.classList.add("border-success");
    }
}
function showPassword(passwordElement) {
    passwordElement.type =
        passwordElement.type === "text" ? "password" : "text";
}
btnShowPassword.addEventListener("click", e => {
    let passwords = document.querySelectorAll(".password");
    for (let password of passwords) {
        showPassword(password);
    }
});

btnPrev.addEventListener("click", showPrev);
profileImage.addEventListener("change", e => {
    let file = e.target.files[0];
    let reader = new FileReader();
    profileImagePreview.src = "/IMG/add-profileImage.jpg";
    reader.onload = () => {
        let imageDataUrl = reader.result;
        profileImagePreview.src = imageDataUrl;
    };
    reader.readAsDataURL(file);
});

btnNextAccountInfo.addEventListener("click", e => {
    e.preventDefault();
    let requiredFields = [
        userName,
        emailAddress,
        password,
        confirmPassword,
        phoneNumber
    ];
    let message;

    requiredFields.forEach((element, index) => {
        let isDirty = checkIsDirty(element);

        if (!isDirty) {
            showFaultyField(element, !isDirty);
            message = `enter all fields ${element.placeholder || ""}`;
        }
    });

    let longUsername = userName.value.length > 2;
    let { isEmailExist } = validateEmailAndPhone();
    let { isPhoneExist } = validateEmailAndPhone();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneNumberRegex =
        /^\+?\d{1,3}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

    let isValidEmail = emailRegex.test(emailAddress.value);

    let longPassword = password.value.length >= 8;
    let confirmedPassword = confirmPassword.value == password.value;
    let isValidPhoneNumber =
        phoneNumber.value.length >= 10 &&
        phoneNumber.value.length <= 11 &&
        phoneNumberRegex.test(phoneNumber.value);

    if (!isValidEmail) {
        showFaultyField(emailAddress, isEmailExist);
        message = "invalid email address";
        console.log(message, faultyFields.length);
    } else if (isEmailExist) {
        showFaultyField(emailAddress, isEmailExist);
        message = "email already exists";
        console.log(message, faultyFields.length);
    } else if (isPhoneExist) {
        showFaultyField(phoneNumber, isPhoneExist);
        message = "phone number already exists";
        console.log(message, faultyFields.length);
    } else if (!confirmedPassword) {
        showFaultyField(confirmPassword, !confirmedPassword);
        message = "Password do not match";
        console.log(message, faultyFields.length);
    } else if (!longPassword) {
        showFaultyField(password, !longPassword);
        message = "Password must be at least 8 characters long";
        console.log(message, faultyFields.length);
    } else if (!isValidPhoneNumber) {
        showFaultyField(phoneNumber, !isValidPhoneNumber);
        message = "Phone number must be at least 10 characters long";
        console.log(message, faultyFields.length);
    } else if (!longUsername) {
        showFaultyField(userName, !longUsername);
        message = "username must be at least 2 characters long";
        console.log(message, faultyFields.length);
    } else if (message !== "" && faultyFields.length !== 0) {
        console.log(message, faultyFields.length);
        // faultyFields.forEach((element, index) => {
        //     showFaultyField(element);
        // });
    } else showNext();

    //requiredFields.forEach((element, index) => {
    //     element.classList.add("border");
    //     let isDirty = checkIsDirty(element);
    //     showFaultyField(element, !isDirty);
    //     if (!isDirty) message = `enter all fields ${element.placeholder || ""}`;
    // });

    //faultyFields.forEach((element, index) => {});
});
btnNextPersonalInfo.addEventListener("click", e => {
    e.preventDefault();
    let requiredFields = [birthDate, profileImage, gender];
    let faultyFields = [];
    let message;
    requiredFields.forEach((element, index) => {
        let isDirty = checkIsDirty(element);
        if (!isDirty) {
            showFaultyField(element, !isDirty);
            message = `enter into all fields: ${element.placeholder}`;
        }
    });

    let uploadedProfileImage =
        profileImage.files && profileImage.files[0] !== undefined;
    let withinBirthRange =
        birthDate.value &&
        birthDate.value < "2010-01-01" &&
        birthDate.value > "1910-01-01";
    let chosenGender = gender && gender.value !== null;

    if (!uploadedProfileImage) {
        message = "upload profile image";
    } else if (!withinBirthRange) {
        showFaultyField(birthDate, !withinBirthRange);
        message = "enter dates between";
    } else if (!chosenGender) {
        showFaultyField(gender, !chosenGender);
        message = "choose a gender";
    }
    if (message) showToast(message);
    else if (faultyFields.length == 0) showNext();
});
btnNextDeliveryInfo.addEventListener("click", e => {
    e.preventDefault();
    let faultyFields = [];
    let message;

    let requiredFields = [address_1, address_2, state, school_name];
    requiredFields.forEach((element, index) => {
        let isDirty = checkIsDirty(element);
        if (!isDirty) {
            showFaultyField(element, !isDirty);
            faultyFields.push(element);
            message = `enter into all fields: ${element.placeholder}`;
        }
    });
    if (message) showToast(message);
    else if (faultyFields.length == 0) registerForm.submit();
});

let validateEmailAndPhone = async () => {
    let body = JSON.stringify({
        emailAddress: emailAddress.value,
        phoneNumber: phoneNumber.value
    });
    let result = fetch("/api/validate", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });

    return result;
};
registerForm.addEventListener("submit", async e => {
    // e.preventDefault();
    alert("the form is to be submitted");
    //     let body = new FormData(registerForm);
    // registerForm
    //     return fetch("/auth/register", {
    //         method: "post",
    //         headers: {
    //             "Content-Type": "multipart/formdata"
    //         },
    //         body
    //     })
    //         .then(response => response.json())
    //         .catch(err => {
    //             console.error(err);
    //         });
});
