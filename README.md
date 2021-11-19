# kontrastRatio(k, h, t = h)

Die Funktion erfüllt folgenden Zweck: sie berechnet den Wert einer Textfarbe, die einem vorgegebenen Kontrastverhältnis zur Hintergrundfarbe genügt. Dabei werden nicht Abstufungen von schwarz oder weiss angewandt, sondern Abstufungen der Hintergrundfarbe selbst. Wahlweise besteht allerdings die Möglichkeit, eine beliebige Farbe als Basis für den Ton der Textfarbe zu wählen.

Funktionsargumente sind Kontrastverhältnis (k; numerischer Wert zwischen 1 und 21), Hintergrungsfarbe im Hex-Format (h) sowie wahlweise die basis im Hex-Format der Textfarbe (t). Das '#'-Zeichen vor der Hex-Folge ist optional. Ebenso kann sie aus 3 wie aus 6 Werten bestehen:

```
'#abc' = 'abc' = '#aabbcc' = 'aabbcc'
```

Rüchkabewert der Funktion ist ein Objekt, der Vordergrundfarbe (bg), Textfarbe (fg), Kontrastwert (kr) und eventuell eine Meldung (msg) enthält.

## Beispiele

```
kontrastRatio(7, "ff0");
/**
 * Ergebnis:
 *
 * {
 *    bg: '#ffff00',
 *    kr: 7.1,
 *    fg: '#575700'
 * }
 */

kontrastRatio(7, "ff0", "#f4a3e5");
/**
 * Ergebnis:
 *
 * {
 *    bg: '#ffff00',
 *    kr: 7.18,
 *    fg: '#853375'
 * }
 */

kontrastRatio(7, "f00");
/**
 * Ergebnis:
 *
 * {
 *    msg: 'Zielkonstrat von 7 mit vorgegebener Hintergrundfarbe
 *    #f00 nicht erzielbar. Es wird der maximal erreichbare
 *    Wert von 5.25 genommen.',
 *    bg: '#ffff00',
 *    kr: 5.25,
 *    fg: '#853375'
 * }
 */

kontrastRatio(7, "#ffffff", "#000000");
/**
 * Ergebnis:
 *
 * {
 *   krStart: 7,
 *   msg: 'Vorgefundener Kontrast von 21 ist höher als 7',
 *   bg: '#ffffff',
 *   kr: 21,
 *   fg: '#000000'
 * }
 */

```








Es handelt sich um eine Funktion, die ich eigentlich für ein Bespiel eines Artikels zu Closures geschrieben habe. Beim Programmieren hat sie sich allerdings irgendwie verselbständigt und wurde sozusagen immer "mehr". An einem bestimmten Punkt musste ich sie daher eher abrupt beenden. Die Funktion funktioniert soweit, ich hätte aber gerne noch im Bereich des HTML weiter ausgearbeitet.

Die Funktion erfüllt einen einfachen Zweck: sie berechnet den Wert einer Textfarbe, die einer Vorgabe des Kontrastverhältnisses zur Hintergrundfarbe genügt. Dabei werden nicht nur einfach Abstufungen von schwarz oder weiss angewandt (die Möglichkeit besteht), sondern Abstufungen der Hintergrundfarbe selbst.
