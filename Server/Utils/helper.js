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
 exports.shuffle=(array)=> {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap elements
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Example usage:
// const arr = [1, 2, 3, 4, 5];
// console.log(shuffle(arr)); // Output: [3, 1, 5, 4, 2] (order will vary)

// exports.shuffle = (currentArray, maxCount) => {
//     let randomArray = generateRandom(currentArray.length);

//     let shuffledArray = [];
//     randomArray.forEach(randomIndex => {
//         if (maxCount && randomArray.length > maxCount) return;
//         else shuffledArray.push(currentArray[randomIndex]);
//     });
// console.log(shuffledArray)
//     return shuffledArray;
// };

// function multiply(currentArray, count) {
//     //console.log("currentArray", currentArray);
//     let newArray = [];
//     for (i = 0; i < count; i++) {
//         newArray = newArray.concat(currentArray);
//         console.log(i, newArray);
//     }
//     let shuffledArray = shuffle(newArray);
//     console.log(shuffledArray);
// }
// //multiply(employees, 4);

// //shuffle(employees);

// const multer = require("multer");
// const { cloudinary } = require("cloudinary").v2;
// const upload = multer({ dest: "./uploads" });

// const uploadImage = async () => {
//     try {
//         const cloudinary_response = await cloudinary.uploader.upload(
//             req.file.path
//         );
//         if (cloudinary_response.ok)
//             return res.json({
//                 message: "image uploaded successfully",
//                 cloudinary_response
//             });
//     } catch (err) {}
// };

// module.exports = {
//     shuffle,
//     uploadImage,
//     multiply,
//     generateRandom
// };
exports.generate_random_color = () => {
    let color = "#";
    let characters = "0123456789ABCDEF";

    for (let i = 0; i < 8; i++) {
        color += characters[Math.floor(Math.random() * 16)];
        //console.log(color);
    }
    //console.log(`rgb(${colors}, 255)`);
};
//generate_random_color();
