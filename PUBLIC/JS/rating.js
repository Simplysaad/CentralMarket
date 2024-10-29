let arr = [2, 1, 3, 2, 5, 4, 5, 2];
/**
 * get the Array
 * add the first element to the second
 * add their sum to the third
 * add their sum to the fourth
 * contiue the process until i = arr.length
 */
function findArrayAverage(arr) {
    let sum = 0;
    for (i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    let realAverage = sum / arr.length
    let average = Math.ceil(realAverage);
    console.log(average);
    return average, sum;
}

function RatingStars(arr) {
    let sum = 0;
    for (i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    let avg = Math.ceil(sum / arr.length);
    console.log(avg);

    let starParent = document.getElementById("starParent");
    for (i = 0; i < avg; i++) {
        let starFilled = document.createElement("span");
        starFilled.classList.add("fa", "fa-star");
        starParent.append(starFilled);
    }
    for (i = 0; i < 5 - avg; i++) {
        let starEmpty = document.createElement("span");
        starEmpty.classList.add("fa-regular", "fa-star");
        starParent.append(starEmpty);
    }
    let rate = document.createElement("span");
    rate.classList.add("mx-2");
    rate.textContent = " (" + arr.length + ")";
    starParent.append(rate);
}

//RatingStars(arr);
const client = new imgur({ clientId: env.CLIENT_ID });
console.log(Math.floor(Math.random()*100372600))
