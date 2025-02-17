// let arr1 = ["ismail", "salih", "saad", "ismail", "musa", "salih", "adam"]
// let arr2 = ["saad", "salih", "ibrahim", "saad", "ibrahim", "ibrahim", "adam", "ismail"]
// 
// const getFrequencies = (arr) => {
//   let freqMap = {}
//   arr.forEach(element => {
//     if (freqMap[element]) {
//       freqMap[element]++
//     }
//     else {
//       freqMap[element] = 1
//     }
//   })
// 
//   let frequencyTable = Object.keys(freqMap).map(key =>
//   ({
//     name: key,
//     frequency: freqMap[key]
//   })
//   )
//   let sortedArray = frequencyTable.sort((a, b) => b.frequency - a.frequency)
// 
//   console.log(arr, freqMap, sortedArray)
//   return sortedArray
// }
// 
// let searchProducts = getFrequencies(arr1)
// let saad = searchProducts.filter((element) => element.frequency < 2)
// console.log("saad", saad)
// 
// let sortedProducts = []
// searchProducts.forEach(element => {
//   let product = element.element
//   sortedProducts.push(product)
// })
// console.log("sortedProducts", sortedProducts)
// 
// 
// 
// 
// 
// 
// const arrayAverage = (...listOfArrays) => {
// 
// 
// 
//   let totalArray = listOfArrays.flat()
//   console.log(getFrequencies(totalArray))
//   let sum = totalArray.reduce((acc, elem) =>
//     acc + elem, 0)
//   let average = sum / totalArray.length
//   console.log(average)
// 
// }
// arrayAverage(arr1, arr2)
// 
// const newfunction = (...list) => {
//   console.log(list)
// }
// newfunction("a", "b", "c")


// const getAge = (timestamp) => {
//   // setInterval(() => {
//   //   const date = new Date(Date.now())
//   //   console.log(`the time is ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`)
//   // }, 1)
//   let interval = Date.now() - timestamp
// 
//   let oneYear = 365 * 24 * 60 * 60 * 1000
//   let oneMonth = 30 * 24 * 60 * 60 * 1000
//   let oneWeek = 7 * 24 * 60 * 60 * 1000
//   let oneDay = 24 * 60 * 60 * 1000
//   let oneHour = 60 * 60 * 1000
//   let oneMinute = 60 * 1000
// 
// 
// 
// 
//   let age = Math.floor(interval / oneYear)
//   let message = `${age} ${age > 1 ? "years" : "year"} old`
// 
//   if (age < 1) {
//     age = Math.floor(interval / oneMonth)
//     message = `${age} ${age > 1 ? "months" : "month"} old`
//   }
// 
//   if (age < 1) {
//     age = Math.floor(interval / oneWeek)
//     message = `${age} ${age > 1 ? "weeks" : "week"} old`
//   }
// 
//   if (age < 1) {
//     age = Math.floor(interval / oneDay)
//     message = `${age} ${age > 1 ? "days" : "day"} old`
//   }
// 
//   if (age < 1) {
//     age = Math.floor(interval / oneHour)
//     message = `${age} ${age > 1 ? "hours" : "hour"} old`
//   }
// 
//   if (age < 1) {
//     age = Math.floor(interval / oneMinute)
//     message = `${age} ${age > 1 ? "minutes" : "minute"} old`
//   }
// 
// 
// 
// 
//   console.log(message)
// 
// 
//   let particularDate = new Date(timestamp)
//   //currentDate = new Date(Date.now())
//   let hours = particularDate.getHours()
//   let years = particularDate.getFullYear()
// 
//   //console.log(date.getMilliseconds())//.getFullYear())
// }
// 
// console.log(Date.now())
// 
// //currentDate = 1739718060695
//getDaysFunction(1770716079007)
const getAge = (timestamp) => {
  const units = [
    {
      name: "year",
      factor: 365 * 24 * 60 * 60 * 1000
    },
    {
      name: "month",
      factor: 30 * 24 * 60 * 60 * 1000
    },
    {
      name: "week",
      factor: 7 * 24 * 60 * 60 * 1000
    },
    {
      name: "day",
      factor: 24 * 60 * 60 * 1000
    },
    {
      name: "hour",
      factor: 60 * 60 * 1000
    },
    {
      name: "minute",
      factor: 60 * 1000
    },
  ]
  
  
  let interval = Date.now() - timestamp 
  
  for(const unit of units){
    let age = Math.floor(interval/unit.factor)
    if(age > 0){
      console.log(`${age} ${age > 1 ? unit.name +"s" : unit.name } ago`)
      break;
    }
  }
}
 
currentDate = 1739719489743
console.log(Date.now())
getAge(currentDate)



