import { kontrastRatio } from "/modules/module.js";

let mainPart = document.getElementById("main");

Object.prototype.genThemen = function () {
    return () => {
        mainPart.style.backgroundColor = this.bg; // "this" ist Kontext-gebunden hier
        mainPart.style.color = this.fg;
    };
};

let b1 = document.getElementById("cobaltd");
let cobaltD = kontrastRatio(8, "001324").genThemen();
b1.addEventListener("click", cobaltD);

let b2 = document.getElementById("cobalth");
let cobaltH = kontrastRatio(8, "d0d9e3").genThemen();
b2.addEventListener("click", cobaltH);

let b3 = document.getElementById("sepiad");
let sepiaD = kontrastRatio(8, "602b12").genThemen();
b3.addEventListener("click", sepiaD);

let b4 = document.getElementById("sepiah");
let sepiaH = kontrastRatio(8, "f7e1d6").genThemen();
b4.addEventListener("click", sepiaH);
