import { kontrastRatio } from "/modules/module.js";

let mainPart = document.getElementById("main");

function farbenFunktion() {
    return () => {
        mainPart.style.backgroundColor = this.bg;
        mainPart.style.color = this.fg;
    }
}

let b1 = document.getElementById("cobaltd");
let cobaltD = kontrastRatio(7, "001324");
cobaltD.farbeWechseln = farbenFunktion;
b1.addEventListener("click", cobaltD.farbeWechseln());

let b2 = document.getElementById("cobalth");
let cobaltH = kontrastRatio(7, "d0d9e3");
cobaltH.farbeWechseln = farbenFunktion;
b2.addEventListener("click", cobaltH.farbeWechseln());

let b3 = document.getElementById("sepiad");
let sepiaD = kontrastRatio(7, "602b12");
sepiaD.farbeWechseln = farbenFunktion;
b3.addEventListener("click", sepiaD.farbeWechseln());

let b4 = document.getElementById("sepiah");
let sepiaH = kontrastRatio(7, "f7e1d6");
sepiaH.farbeWechseln = farbenFunktion;
b4.addEventListener("click", sepiaH.farbeWechseln());
