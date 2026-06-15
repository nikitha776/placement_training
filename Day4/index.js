function display(result) {
    console.log(resilt);
}

function add(a,b,callback) {
    let sum = a+b;
    callback(sum);
}

add(10,20,display)