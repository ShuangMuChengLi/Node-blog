async function fn(){
    return false;
}
async function fn2() {
    let result = await fn();
    console.log(result)
    return result;
}
let r = fn();
console.log(r)
