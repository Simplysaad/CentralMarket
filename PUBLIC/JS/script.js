
/**
* toggleDisplay()
* Function to toggle display of html element
* @param {HTMLElement} targetElement - The HTML element whose display will be toggled.
* @param {HTMLElement} control - The HTML element that triggers the toggle action.
  * @param {string} event - The event that triggers the toggle action.
*/
const toggleDisplay = (targetElement, control, event) => {
  control.addEventListener(event || "click", () => {
    targetElement.style.display = targetElement.style.display === "block" ? "none" : "block"
  })
}
// Select sidebar and buttons for toggle
const sidebar = document.querySelector(".sidebar");
const btnShowSidebar = document.getElementById("btnShowSidebar");
const btnHideSidebar = document.getElementById("btnHideSidebar");
// Implement toggle display for sidebar
toggleDisplay(sidebar, btnShowSidebar);
toggleDisplay(sidebar, btnHideSidebar)

// Select search container and button for toggle
const searchCont = document.querySelector(".search-container")
const btnShowSearch = document.querySelector("#btnShowSearch")
// Implement toggle display for search container
toggleDisplay(searchCont, btnShowSearch)




const anchorTags = document.querySelectorAll("a[href]")
anchorTags.forEach(tag => {
  tag.classList.toggle("active", tag.href == window.location.href)
})


// Array of characters used for generating random colors
let charArray = ["a", "b", "c", "d", "e", "f", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];







/**
* getRatings()
* Fetches ratings data from the server.
* @returns {Promise<Response>} A promise that resolves to the fetched ratings data.
*/
const getRatings = async () => {
  try {
    const ratings = await fetch("/getRating", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return ratings;
  } catch (err) {
    console.error("Error fetching ratings:", err);
    return null; // Or handle error appropriately
  }
};

/**
* getRandomColor()
* Generates a random hexadecimal color code.
* @returns {string} A random color code in the format #RRGGBB.
*/
function getRandomColor() {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    let ranInt = Math.floor(Math.random() * 16);
    color += charArray[ranInt];
  }
  return color;
}

/**
* randomImageColor()
* Applies a random background color to each image element in the provided NodeList.
* @param {NodeList} Images - A NodeList of HTML elements representing images.
*/
function randomImageColor(Images) {
  Images.forEach(image => {
    image.style.backgroundColor = getRandomColor();
  });
}
// Select all card and preview images
let cardImage = document.querySelectorAll(".card-image");
let categoryBox = document.querySelectorAll(".category-box");
let previewImage = document.querySelectorAll(".preview-image");
let randomColorImage = document.querySelectorAll(".random-color");
// Apply random colors to card and preview images
randomImageColor(cardImage);
randomImageColor(categoryBox);
randomImageColor(randomColorImage);
//randomImageColor(previewImage);



// Select search elements
const btnSearch = document.querySelector("#btnSearch");
const searchContainer = document.querySelector("#searchContainer");
const searchInput = document.querySelector("#searchInput");

/**
* showSearchCont()
* Toggles the visibility of the search container.
*/
const showSearchCont = () => {
  let searchDisplay = searchContainer.style.visibility;

  if (searchDisplay === "visible") {
    searchContainer.style.visibility = "hidden";
  } else {
    searchContainer.style.visibility = "visible";
    searchInput.focus();
  }
};
// Add event listeners to toggle search container
searchContainer.addEventListener("blur", showSearchCont);
btnSearch.addEventListener("click", showSearchCont);

/**
* getAverage()
* Calculates the average of numeric values in an array.
* @param {Array<number>} arr - An array of numbers.
* @returns {number} The average of the numeric values in the array.
*/
function getAverage(arr) {
  let sum = 0;
  let average;
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === "number") {
      sum += arr[i];
    }
  }
  average = sum / arr.length;
  return average;
}

/**
* createElement()
* Creates an HTML element with specified attributes and appends it to a parent element.
* @param {string} parentId - The ID of the parent HTML element.
* @param {string} tag - The HTML tag name for the new element.
* @param {string|Array<string>} classes - A string or array of CSS class names for the new element.
* @param {string} textContent - The text content for the new element.
* @param {string} src - The source URL for the new element if its a img or href for anchor element
*/
function createElement(parentId, tag, classes, textContent, src) {
  let element = document.createElement(tag);
  let parent = document.getElementById(parentId);
  element.textContent = textContent;

  if (Array.isArray(classes)) {
    classes.forEach(oneclass => {
      element.classList.add(oneclass);
    });
  } else {
    element.classList.add(classes);
  }
  if (tag === "img") {
    element.src = src;
  }
  element.href = src;
  parent.append(element);
}


// Select the cart button
const btnCart = document.getElementById("btnCart");
// Get the offset top of the cart button
const threshold = btnCart.offsetTop;

/**
* Event listener for window scroll that adds or removes sticky class
* based on user scroll Y position
*/
window.addEventListener("scroll", () => {
  if (window.scrollY >= threshold) {
    btnCart.classList.add("sticky");
  } else {
    btnCart.classList.remove("sticky");
  }
});
// Remove sticky from the cart if widnow size is greater than 600px
if (window.width >= 600) {
  btnCart.classList.remove("sticky");
}
// Select all tag button elements
const btnTag = document.querySelectorAll(".btn-tag");

/**
* Event listener for tag button that post the tag name to server
*/
btnTag.forEach(tag => {
  tag.addEventListener("click", async e => {
    e.preventDefault();
    let searchTerm = tag.textContent;
    await postSearch(searchTerm);
    console.log(searchTerm);
  });
});
/**
* postSearch()
* Post search term to the server and replaces the body of the document with the response
* @param {string} searchTerm - The search term to be sent to the server.
*/
const postSearch = async searchTerm => {
  try {
    let response = await fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ searchTerm })
    });
    let responseBody = await response.text();

    console.log(responseBody);
    document.body.innerHTML = responseBody;

    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
};
/**
* showPassword()
* Toggle the password type between text and password
*/
const showPassword = () => {
  const inputPassword = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const isVisible = inputPassword.type === "text";

  inputPassword.type = isVisible ? "password" : "text";
  confirmPassword.type = isVisible ? "password" : "text";
};
// select the show password buttons
const btnShowPassword = document.querySelectorAll(".btnShowPassword");
/**
* Event listener for show password button
*/
btnShowPassword.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    showPassword();
  });
});



/**
* search()
* Sends search term to the server via post request (IN PROGRESS)
*/
const search = async (req, res) => {
  try {
    const tagElements = document.querySelectorAll(".btn-tag");
    tagElements.forEach(tag => {
      const searchTerm = tag.textContent;
      fetch("/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: searchTerm
      }).then(data => console.log(data));
    });
  } catch (err) {
    console.error(err);
  }
};


// Select all add to cart buttons
const btnAddCart = document.querySelectorAll(".btn-add-cart");
/**
* Event listener for add to cart buttons
*/
// btnAddCart.forEach(btn => {
//   btn.addEventListener("click", async e => {
//     e.preventDefault();
//     const itemIdElement = btn.querySelector(".item-id");
//     const inputQuantity = btn.querySelector(".input-quantity");
//     
//     const color = 
//     
//     const productId = itemIdElement.textContent; // replace with the actual product ID
//     const addCartUrl = "/cart/" + productId + "/add?quantity=" + inputQuantity.value;
//     try {
//       const response = await fetch(addCartUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json"
//         },
//       });
// 
//       const data = await response.json();
//       console.log(data);
//     } catch (err) {
//       console.error(err);
//     }
//   });
// });
// 



const createIssue = async (e, username,  title, description) => {
  e.preventDefault()

  title = title.value
  username = username.value
  description = description.value

  const url = "https://api.github.com/repos/simplysaad/CentralMarket/issues"
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
  }
  const data = {
    "title": title,
    "body": `${username} \n ${description}`,
    "assignees": ["simplysaad"],
    "labels": ["customer feedback"]
  }


  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      console.log("error creating new issue")
    }
    else {
      console.log("issue created successfully")
      setTimeout(()=>{
        window.location.href = "/"
      }, 3000)
    }
  }
  catch (err) {
    console.error(err)
  }
}


const issueForm = document.getElementById("issueForm")
let title = document.getElementById("title")
let username = document.getElementById("username")
let description = document.getElementById("description")


let appreciation = document.getElementById("appreciate")


appreciation.style.display = "none"
issueForm.style.display = "block"
issueForm.addEventListener("submit", (e)=>{
  e.preventDefault()
  createIssue(e, username,  title, description)
})

/**
 * this function is used to shorten the links given preferredText and expiryDays
 */
 
// const getShortUrl = async (originalUrl, preferredText, expiryDays) => {
//   try {
//     const body = { originalUrl, preferredText, expiryDays };
//     const response = await fetch("https://short-en.onrender.com/api", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });
//     console.log(response)
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
// 
//     const jsonData = await response.json();
//     console.log(jsonData);
//   } catch (err) {
//     console.error(err);
//   }
// }
// 
/**
 * Generates a short URL using the short-en.onrender.com API.
 *
 * @async
 * @param {string} originalUrl - The original URL to be shortened.
 * @param {string} [preferredText] - The preferred text for the short URL.
 * @param {number} [expiryDays] - The number of days until the short URL expires.
 * @throws {Error} If the API request fails.
 * @returns {Promise<void>}
 */
const getShortUrl = async (originalUrl, preferredText, expiryDays) => {
  try {
    const body = { originalUrl, preferredText, expiryDays };
    const response = await fetch("https://short-en.onrender.com/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    console.log(jsonData);
  } catch (err) {
    console.error(err);
  }
}

//getShortUrl()
