let person = {
    // name: "saad"
    age: 3,
    child: {}
};

//let { age } = person ?? {};
let age = person.age ? person.age : undefined;
//console.log(age ?? 0);
if (Object.keys(person.child).length == 0) console.log(person.age);
if (JSON.stringify(person.child) == "{}") console.log(person.age);
