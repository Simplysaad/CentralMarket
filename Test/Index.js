let arr1 = ["ismail", "salih", "saad", "ismail", "musa", "salih", "adam"]
let arr2 = ["saad", "salih", "ibrahim", "saad", "ibrahim", "ibrahim", "adam", "ismail"]

const getFrequencies = (arr) => {
  let freqMap = {}
  arr.forEach(element => {
    if (freqMap[element]) {
      freqMap[element]++
    }
    else {
      freqMap[element] = 1
    }
  })

  let frequencyTable = Object.keys(freqMap).map(key =>
  ({
    name: key,
    frequency: freqMap[key]
  })
  )
  let sortedArray = frequencyTable.sort((a, b) => b.frequency - a.frequency)

  console.log(arr, freqMap, sortedArray)
  return sortedArray
}

let searchProducts = getFrequencies(arr1)
let saad = searchProducts.filter((element) => element.frequency < 2)
console.log("saad", saad)

let sortedProducts = []
searchProducts.forEach(element => {
  let product = element.element
  sortedProducts.push(product)
})
console.log("sortedProducts", sortedProducts)






const arrayAverage = (...listOfArrays) => {



  let totalArray = listOfArrays.flat()
  console.log(getFrequencies(totalArray))
  let sum = totalArray.reduce((acc, elem) =>
    acc + elem, 0)
  let average = sum / totalArray.length
  console.log(average)

}
arrayAverage(arr1, arr2)

const newfunction = (...list) => {
  console.log(list)
}

newfunction("a", "b", "c")

