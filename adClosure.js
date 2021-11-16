// https://vmarchesin.medium.com/javascript-arrow-functions-and-closures-4e53aa30b774
let genObj = (a, b, c) => {
    return {
        a: a,
        b: b,
        c: c
    };
}

let z = genObj(36, 85, 25);

z.retMax = function() {
    return () => Math.max(this.a, this.b, this.c);
}

console.log(z);

console.log(z.retMax()());
