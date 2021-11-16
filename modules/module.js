/**
 * Wandelt den Hex-String einer Farbendefinition in ein Array mit
 * 3 Elementen. Der Parameter mag '#' voran haben oder nicht.
 * @param {string} hex Den Hex-String (zBs. '#ffab56', '#abc' oder 'ffab56', 'abc')
 * @return {string[]} Array mit 3 (Hex) Elementen (zBs. ['ff', 'ab', '56'])
 * @see {@link hexToRgbStd}
 */
let hexToArr = (hex) => {
    let dreier = /\b[a-f0-9]{3}\b/i;
    let sechser = /\b[a-f0-9]{6}\b/i;
    try {
        if (dreier.test(hex)) {
            return hex.match(/[a-f0-9]{1}/gi).map((char) => char + char);
        } else if (sechser.test(hex)) {
            return hex.match(/[a-f0-9]{2}/gi);
        } else {
            throw "Es ist ein Fehler im Format der eingegebenen Farben vorhanden."
        }
    } catch (e) {
        console.error(e)
    }
}

/**
 * Rundet eine Dezimalzahl auf 2 Stellen auf (zBs. 3,785 auf 3,79).
 * @see {@link https://www.jacklmoore.com/notes/rounding-in-javascript/}
 * @param {number} val Dezimalzahl, die aufgerundet werden soll.
 * @param {number} [dec = 2] Dezimalstellen (Optional. 2 Stellen sind voreingestellt.)
 * @return {number} Aufgerundete Zahl.
 */
let roundPct = (val, dec = 2) => Math.round(Number(Math.round(val + "e" + dec) + "e-" + dec) * 100);

/**
 * Wandelt zwei als Hex-String definierte Farben in RGB-Standarisierte
 * Werte (Jeweils 1 Array mit drei Werten, die von 0 bis 1 gehen).
 * @param {string} bgHexVal String der Hintergrundfarbe, mit oder ohne '#' voran.
 * @param {string} [fgHexVal = bgHexVal] Optionaler String der Vordergrundfarbe, mit oder ohne '#' voran. Voreingestellt ist die Hintergrundfarbe.
 * @return {number[][]} 2-Dimensionales (1x2) Array mit Dezimalwerten zw. 0.00 und 1.00
 */
let hexToRgbStd = (bgHexVal, fgHexVal = bgHexVal) => {
    let arr = [hexToArr(bgHexVal), hexToArr(fgHexVal)];
    return arr.map((a) => a.map((el) => roundPct(parseInt(el, 16) / 255)));
};

/**
 * Teilt Zahlen zwischen 0 und 100 (RGB-Werte in Prozent dargestellt) eines
 * 2-Dimensionalen Arrays durch 100:
 * [ [1, 2, 3], [30, 40, 70] ] -> [ [0.01, 0.02, 0.03], [0.3, 0.4, 0.7] ])
 * @param {number[][]} arrVals 2-Dimensionales (1x2) Array mit Werten zw. 0 und 100.
 * @return {number[][]} 2-Dimensionales (1x2) Array mit Dezimalwerten zw. 0.00 und 1.00)
 */
let pctToFloat = (arrVals) => {
    let floatArr = [];
    arrVals.forEach((arr) => floatArr.push(arr.map((val) => val / 100)));
    return floatArr;
};

/**
 * Wandelt die RGB-Prozenwerte innerhalb eines Arrays in einen
 * Hex-String um.
 * @param {string[]} Array mit 3 Hex-Wertepaare
 * @return {string} Farbendefinion in Hex-Format mit '#' voran
 */
let pctToHex = (arr) => {
    return (
        arr
        .map((pct) => Math.round((pct * 255) / 100))
        .map((rgb) => (rgb < 16 ? "0" + rgb.toString(16) : rgb.toString(16)))
        .join("")
    );
};

/**
 * Berechnet die Luminosität von zwei Farben.
 * @param {number[][]} farben 2 Dimensionales Array mir RGB-Werten ausgedrückt in Prozentzahlen
 * @return {number[]} Array mit 2 Luminositaet-Werten
 */
let lumi = (farben) => {
    let farbenFloat = pctToFloat(farben);
    const spekGew = [0.2126, 0.7152, 0.0722];
    let luminositaet = [];
    farbenFloat.forEach((arr) =>
        luminositaet.push(
            arr
            .map((normFarbe) =>
                normFarbe <= 0.03928 ? normFarbe / 12.92 : ((normFarbe + 0.055) / 1.055) ** 2.4
            )
            .map((angepFarbe, i) => angepFarbe * spekGew[i])
            .reduce((a, b) => a + b, 0)
        )
    );
    return luminositaet;
};

/**
 * Berechnet den Kontrast zwischen 2 Luminosität-Werten
 * @param {number[]} arrWerte Array mit zwei Luminosität-Werten
 * @return {number} Kontrast zwischen den Luminosität-Werten
 */
let kontrast = (arrWerte) => {
    let l1 = arrWerte[0],
        l2 = arrWerte[1];
    if (l2 > l1)
        [l1, l2] = [l2, l1];
    return (l1 + 0.05) / (l2 + 0.05);
};

/**
 * Berechnet Farbe für ein erwünschtes Kontrastverhältniss (kr)
 * @param {number} kr Das gewünschte Kontrastverhältnis
 * @param {string} bg Die Hintergrungfarbe in Hex-Format
 * @param {string} [fg = bg] Die Textfarbe
   @return {Object} Objekt mit berechneten Farben (Hintergrund und Text) in Hex-Format.
*/
let kontrastRatio = (kr, bg, fg = bg) => {
    let resultatObj = {};
    let krStart = kr;
    let bgStdArr = hexToRgbStd(bg, fg);
    let lumis = lumi(bgStdArr);
    let arr = [...hexToRgbStd(bg, fg)[1]];
    let kontrMitSchwarz = kontrast(lumi([bgStdArr[0],
        [0, 0, 0]
    ]));
    let kontrMitWeiss = kontrast(lumi([bgStdArr[0],
        [100, 100, 100]
    ]));
    let step = kontrMitSchwarz > kontrMitWeiss ? 1 : -1;
    if (kontrMitSchwarz < kr && kontrMitWeiss < kr) {
        kr = Math.max(kontrMitSchwarz, kontrMitWeiss);
        resultatObj.msg = `Zielkonstrat von ${roundPct(krStart)/100} mit vorgegebener Hintergrundfarbe ${"#"+bg} nicht erzielbar. Es wird der maximal erreichbarer Wert von ${roundPct(kr)/100} genommen.`;
    }
    if (kontrast(lumis) > kr) {
        kr = kontrast(lumis); //return "Kontrast ist bereits größer als Zielkontrast.";
        resultatObj.msg = `Vorgefundener Kontrast von ${kr} ist höher als erwünschten von ${krStart}`;
    }
    let anpassen = () => {
        if (kontrast(lumis) >= kr) {
            return arr;
        }
        for (let i = 0; i < arr.length; i++) {
            if (step == -1) {
                if (arr[i] == 100) continue;
            } else {
                if (arr[i] < 1) continue;
            }
            arr[i] = arr[i] -= step;
        }
        lumis = lumi([arr, [...hexToRgbStd(bg, fg)[0]]]);
        return anpassen();
    };
    resultatObj.bg = "#" + hexToArr(bg).join("");
    resultatObj.fg = "#" + pctToHex(anpassen());
    console.log(resultatObj);
    return resultatObj;
};

export {
    kontrastRatio
};
