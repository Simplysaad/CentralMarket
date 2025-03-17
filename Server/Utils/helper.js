const employees = ["saad", "ishaq", "muadh", "john", "israel", "miracle"];
//length = 6
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
//length = 5

let randomArray = [];
function generateRandom(count) {
    if (!count) return;
    //console.log("count", count);

    //console.log(randomArray);

    for (let i = 0; i <= 100; i++) {
        let randomIndex = Math.floor(Math.random() * count);
        //console.log(randomIndex);

        let isExist = randomArray.includes(randomIndex);
        if (!isExist) {
            randomArray.push(randomIndex);
        }
    }
    //console.log("random array", randomArray);
    return randomArray;
}
//generateRandom();

function shuffle(currentArray) {
    let randomArray = generateRandom(currentArray.length);

    let shuffledArray = [];
    randomArray.forEach(randomIndex => {
        shuffledArray.push(currentArray[randomIndex]);
    });

    //console.log("shuffledArray", shuffledArray);

    return shuffledArray;
}

function multiply(currentArray, count) {
    console.log("currentArray", currentArray);
    let newArray = [];
    for (i = 0; i < count; i++) {
        newArray = newArray.concat(currentArray);
        console.log(i, newArray);
    }
    let shuffledArray = shuffle(newArray);
    console.log(shuffledArray);
}
multiply(employees, 4);

//shuffle(employees);
