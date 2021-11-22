# Closure

Im Kern besteht eine Closure aus einer Funktion, die eine innere Funktion einkapselt und als Rückgabewert zurück gibt. Die zurückgegebene Funktion behält dabei Zugriff auf Variablen und Funktionen, die in ihrer mittelbaren und unmittelbaren Umgebung definiert sind, also außerhalb ihrer Definition. Dies wird möglich durch etwas, was "lexical scope" genannt wird: Die innere Funktion kann auf Variablen und Funktionen zugreifen, die in der äußeren Funktion zusätzlich definiert sind, sowie auf die, die in der globalen Umgebung definiert wurden. Nehmen dazu ein Beispiel:

```
let x = 10;

let aussenFunktion = (y) => {

    let hilfsFunktion = () => {
        return x+y;
    }

    let innenFunktion = () => {
        console.log("Output":, x, y, hilfsFunktion());
    }

    return innenFunktion;
}

let closureTest = aussenFunktion(7);

closureTest(); // Output: 10 7 17
```

Zunächst wird anhand von ```let closureTest = aussenFunktion(7)``` eine neue Funktion eingerichtet, ```closureTest()```. Der Wert von der Variablen "y" wird auf 7 festgelegt. Das Resultat der Ausführung von ```closureTest()``` zeigt, dass ```innenFunktion()``` Zugriff sowohl auf der globalen Variable "x", auf die innerhalb von ```aussenFunktion()``` lokal definierten Variable "y", sowie auf die ebenfalls innerhalb von ```aussenFunktion()``` lokal definierten Funktion ```hilfsFunktion()``` behält.  

Aus den Resultat der Ausführung wird folgendes deutlich:

```innenFunktion()``` hat die Möglichkeit, auf die globale Variable "x", auf die Variable "y" von ```aussenFunktion()``` sowie auf ```hilfsFunktion()```, auch  innerhalb von ```aussenFunktion()``` definiert, zuzugreifen.

Ganz trivial ist das nicht: Normalerweise findet ein Aufräumprozeß nach der Laufzeit einer Funktion statt, wo lokale, obsolet gewordene Variablen gelöscht werden (die sog. "garbage collection"). In Javascript erfolgt dieses Aufräumen allerdings nach einem Referenzkriterium: Variablen werden erst dann nach Funktionsausführung gesammelt und gelöscht, wenn keine Referenz mehr auf sie existiert. Da dies hier sowohl für die Variable "y" als auch für ```hilfsFunktion()``` innerhalb von ```aussenFunktion()``` hinsichtlich ```innenFunktion()``` zutrifft, werden bei der Einrichtung der Funktion ```closureTest()``` als Rückgabewert von ```aussenFunktion()``` die Variable "y" und ```hilfsFunktion()``` quasi mitgeliefert.

Dies eröffnet natürlich eine Reihe von Möglichkeiten. Zum Beispiel, Argumente bei der Einrichtung der inneren Funktion zu fixieren:

```
let aussenFunktion = (x) => {

	let y = 10;

    let innenFunktion = () => {
        return x + y;
    }

    return innenFunktion;
}

let siebenPlusZehn = aussenFunktion(7);
let zwanzigPlusZehn = aussenFunktion(20);

console.log( "Output:", siebenPlusZehn(), zwanzigPlusZehn() );

// Output: 17 30
```

Wie bereits angedeutet, beschränkt sich dieser "lexical scope" nicht auf nur eine innere Funktion. [In der Spezifikation zu ECMAScript 2015 (ES6) wird folgendes festgehalten](https://262.ecma-international.org/6.0/#sec-lexical-environments):

> An outer Lexical Environment may, of course, have its own outer Lexical Environment. A Lexical Environment may serve as the outer environment for multiple inner Lexical Environments. For example, if a Function Declaration contains two nested Function Declarations then the Lexical Environments of each of the nested functions will have as their outer Lexical Environment the Lexical Environment of the current evaluation of the surrounding function.

(Als Quelle für diese Information nahm ich die Spezifikation von ES6 (ECMAScript 2015). Beim zitierten Text ist aber das gleiche [in der ES12 (ECMAScript 2021) Spezifikation nachzulesen](https://262.ecma-international.org/12.0/#sec-executable-code-and-execution-contexts)).

Dies bedeutet, dass Closures auch bei eine Verkettung beliebig vieler innerer Funktionen mit dem gleichen Effekt anwendbar ist:

```
let w = 10;

let aussenFunktion = (x) => {
	return (y) => { // Innere Funktion
		return (z) => { // Innere innerer Funktion
			return (x + y + z) / w // Innere innerer innerer Funktion
		}
	}
}

let innereFunktion = aussenFunktion(10);
console.log("Output:", innereFunktion);
// Output: [Function (anonymous)]

let innereInnererFunktion = innereFunktion(20);
console.log("Output:", innereInnererFunktion);
// Output: [Function (anonymous)]

let innereInnererInnererFunktion = innereInnererFunktion(30);
console.log("Output:", innereInnererInnererFunktion);
// Output: 6 ( = (10 + 20 + 30) / 10)
```

Solche verschachtelte Closure Funktionen können auch über eine Verkettung der Argumentenvergabe ausgeführt werden:

```
console.log( "Output:", aussenFunktion(10)(20)(30) );
// Output: 6 ( = (10 + 20 + 30) / 10)
```

Dabei kann es auch natürlich Situationen geben, in denen man Interesse am Einbinden nur bestimmter Argumente hat, um die selbe Funktionalität mit unterschiedlichen Argumenten zu ermöglichen:

```
let plusZehnPlusZwanzigDurchZehn = aussenFunktion(10)(20);
console.log( "Output:", plusZehnPlusZwanzigDurchZehn(50) );
// Output: 8 ( = (10 + 20 + 50) / 10)

let plusAchtPlusSiebzehnDurchZehn = aussenFunktion(8)(17);
console.log( "Output:", plusAchtPlusSiebzehnDurchZehn(50) );
// Output: 7.5 ( = (8 + 17 + 50) / 10)
```

## Praktisches Beispiel

Vor allem im Bereich der Interaktion zwischen Javascript und der Darstellung des HTML mit CSS  (also dem Document Object Model, DOM genannt) eröffnen sich eine Reihe von Möglichkeiten. Eine Innere Funktion, die vom Zugriff auf die Variablen seiner äußeren Umgebung profitiert, kann jeweils mit unterschiedlichen  Umgebungsvariablen unterschiedlichen Funktionsnamen zugewiesen werden: Die Funktionalität der zurückgegebenen inneren Funktion kann damit auf unterschiedliche Variablen angewandt werden.

Im vorliegenden Beispiel geht es um eine Funktion, die einen bestimmten Farbkontrast gemäss den [in diesem WCAG 2 Dokument](https://www.w3.org/TR/WCAG20-TECHS/G18.html) dargestellten Vorgaben sucht. Ausgangspunkt ist eine beliebige Hintergrund Farbe, von der aus die Farbintensität der Textfarbe gesucht wird, so dass ein vorgegebenes Kontrast-Verhältnis erzielt wird. Ich habe diese Funktion für diesen Artikel entwickelt und [kann hier en detail eingesehen werden](https://github.com/a26z/closure). Zu vier Hintergrundfarben suche ich die dazugehörigen Textfarben, die ein Kontrastverhältnis so nah wie möglich an den Wert 7 herankommen sollen. Dabei suche ich die Textfarbe zu folgenden Hintergrundfarben:

- Cobalt dunkel (#001324)
- Cobal hell    (#D0D9E3)
- Sepia dunkel  (#602B12)
- Sepia hell    (#F7E1D6)

Als Rückgabewert kommt ein Objekt, der u.a. die Hintergrund- und dazügehörige Textfarbe (im Objekt sind das die Eigenschaften "bg" und "fg") enthält und einem Kontrastverhältnis-Wert, der nah 7 kommt (sobald der Wert von 7 überschritten wird, beendet die Funktion mit der Rückgabe des Objekts. Details zur Funktion können der [Repo auf Github](https://github.com/a26z/closure) entnommen werden).

Im HTML soll der bereich ```<main>``` mit der Hintergrund und der berechneten Textfarne versehen werden. Dazu importiere ich zunächst die Funktion ```kontrastRatio()``` aus einem Javascript Modul. Dann weise diesem ```<main>``` Bereich eine Variable zu, um Zugang zum Zielbereich der Seite zu erleichtern:

```
import { kontrastRatio } from "/modules/module.js";

let mainPart = document.getElementById("main");
```

Als nächstes bilde ich meine Closure-Funktion und führe sie durch die oben geschilderte Verkettungstechnik sofort aus. Dies hat den Zweck, bein Laden der Seite den ```<main>``` Bereich mit einer Schwarz-Weiss Kombination zu versehen:

```
let farbenFunktion = (kontrast, bgFarbe, fgFarbe = bgFarbe) => {
    let obj = kontrastRatio(kontrast, bgFarbe, fgFarbe);
    return () => {
        mainPart.style.backgroundColor = obj.bg;
        mainPart.style.color = obj.fg;
    }
}

farbenFunktion(21, "#fff")();
```

Anschließend definiere ich ich ein 2-Dimensionales Array, wobei die inneren Arrays mit jeweils drei Array-Zellen belegt sind:

```
let farbeId = [
    ["cobaltd", 7, "#001324"],
    ["cobalth", 7, "#d0d9e3"],
    ["sepiad",  7, "#602b12"],
    ["sepiah",  7, "#f7e1d6"]
];
```
Die Informationen dieser Zellen sind:

- [n][0]. Das ID des Knopfs, wo ein eventListener mit der Inneren Funktion der Closure angebracht wird und darauf wartet, angecklickt zu werden,
- [n][1]. Wert des Kontrstverhältnisses, der angestrebt wird, und
- [n][2]. Die Hintergrundfarbe, die auch als Basis für die Suche nach der angestrebten Textfarbe genutzt wird.

Mit dem 2-dimensionalen Array wird schließlich eine Schleife gespeist, die die Zuordnung der eventListener auf den HTML-Knöpfen regelt. Dort Angehängt wird das Resultat der Ausführung von ```farbenFunktion()```, was die innere Funktion der Closure ist. Diese innere Funtion der Closure hängt dort an den EventListener und verfügt über die jeweils benötigten Parameter (Kontrastwert und Farbe):

```
farbeId.forEach((arr) => {
    document.getElementById(arr[0])
        .addEventListener('click', farbenFunktion(arr[1], arr[2]));
});
```

Beim Laden der Seite wird der HTML-Bereich ```<main>``` zunächst auf Schwarz/Weiss gesetzt. Über das Klicken der über diesen Bereich liegenden Knopfe werden dann über ```eventListener```-gesteuerte Funktionen diese Farben geändert.

Wie gesagt, sowohl diese Seite als auch das Modul können meiner Github-Repo entnommen werden. Bei der lokalen Ausführung muss nur dran gedacht werden, die Seite über ein HTTP-Server zu laden (Njinx, Apache, etc. oder über Node mit ```http-server``` oder ```browser-sync```), da sonst das Modul nicht geladen werden kann.
