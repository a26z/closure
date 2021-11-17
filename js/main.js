import {
    kontrastRatio
} from "/modules/module.js";

let mainPart = document.getElementById("main");

let farbenFunktion = (kontrast, bgFarbe) => {
    let obj = kontrastRatio(kontrast, bgFarbe);
    return () => {
        mainPart.style.backgroundColor = obj.bg;
        mainPart.style.color = obj.fg;
    }
}

let farbeId = [
    ["cobaltd", 7, "001324"],
    ["cobalth", 7, "d0d9e3"],
    ["sepiad", 7, "602b12"],
    ["sepiah", 7, "f7e1d6"],
    ["sw", 21, "fff"]
];

farbeId.forEach((arr) => {
    document.getElementById(arr[0]).onclick = farbenFunktion(arr[1], arr[2]);
});
