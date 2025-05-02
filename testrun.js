class Animal {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    speak() {
        console.log(`${this.name} makes a sound`);
    }
}

class Human extends Animal {
    constructor(oruko, age) {
        super(oruko, age);
    }
}

let Saad = new Human("saad", 20);
console.log(Saad);
Saad.speak();

 
console.log("true" == true)