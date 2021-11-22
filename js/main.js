import {
    kontrastRatio
} from "/modules/module.js";

let mainPart = document.getElementById("main");

let farbenFunktion = (kontrast, bgFarbe, fgFarbe = bgFarbe) => {
    let farbenObj = kontrastRatio(kontrast, bgFarbe, fgFarbe);
    return () => {
        mainPart.style.backgroundColor = farbenObj.bg;
        mainPart.style.color = farbenObj.fg;
    }
}

farbenFunktion(21, "#fff")();

let farbeId = [
    ["cobaltd", 7, "#001324"],
    ["cobalth", 7, "#d0d9e3"],
    ["sepiad", 7, "#602b12"],
    ["sepiah", 7, "#f7e1d6"]
];

farbeId.forEach((arr) => {
    document.getElementById(arr[0])
        .addEventListener('click', farbenFunktion(arr[1], arr[2]));
});
