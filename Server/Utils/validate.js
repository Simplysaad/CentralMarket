// const Joi = require('joi');

// const validateProduct = (product) => {
//   const schema = Joi.object({
//     name: Joi.string().required().min(3).max(50),
//     description: Joi.string().required().min(10).max(500),
//     price: Joi.number().required().min(0).max(100000),
//     category: Joi.string().required().valid('electronics', 'fashion', 'home', 'beauty'),
//     brand: Joi.string().required().min(3).max(50),
//     stock: Joi.number().required().min(0).max(1000),
//   });

//   const result = schema.validate(product);
//   if (result.error) {
//     return null;
//   }
//   return product;
// };

// const validateFile = (file) => {
//   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
//   if (!allowedMimeTypes.includes(file.mimetype)) {
//     return false;
//   }
//   if (file.size > 5 * 1024 * 1024) { // 5MB
//     return false;
//   }
//   return true;
// };

let actualBody = {};
let person = {
    name: "saad",
    age: undefined,
    school: "oau"
};

for (prop in person) {
    if (person[prop]) {
        actualBody[prop] = person[prop];
    }
}
console.log(actualBody);