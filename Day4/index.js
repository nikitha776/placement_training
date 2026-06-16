function display(result) {
    console.log(resilt);
}

function add(a,b,callback) {
    let sum = a+b;
    callback(sum);
}

add(10,20,display)

let myPromise = new Promise((resolve, reject) => {
    let success = true; // Simulate success or failure
    if(success) {
        resolve("Operation successful!");
    } else {
        reject("Operation failed!");
    }
});

myPromise.then(result => {
    console.log(result);
}).catch(error => {
    console.error(error);
});