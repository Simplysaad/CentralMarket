//helper functions
const relatedProductsFunc = (arr, n) => {
  let relatedProducts = new Array();
  for (let i = 0; i < n; i++) {
    let randomIndex = Math.floor(Math.random() * arr.length);

    if (!relatedProducts.includes(arr[randomIndex])) {
      relatedProducts.push(arr[randomIndex]);
    }
  }
  // console.log(relatedProducts)
  return relatedProducts;
};


/**
* req.session.destroy((err)=>{
if(!err){
console.log("sessoion destroyed")
}
})

*/

const readTime = (content)=> {
  const words = content.split(' ').length
  const speed = 200

  const readTime = Math.ceil
  (words/speed) + ' min read'


  return readTime
}




// const findProducts = async (query)=>{
//   let products = await Product.find(query)
//   return products
// }
// const getCategories = async ()=>{
//   let categories = await Product.distinct("category")
//   return categories
// }

// const allProducts = findProducts({})
// const categories = getCategories()
// const relatedProducts = relatedProductsFunc(allProducts, 12)







function destroySession() {
  req.session.destroy((err)=> {
    if (!err) {
      console.log("session destroyed")
    }
  })


}

module.exports = {
  relatedProductsFunc, readTime, destroySession
}