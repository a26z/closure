Closure
-------

Im Kern besteht eine Closure aus einer (äußeren) Funktion "A", die (mindestens) eine Funktion "B" einkapselt. Diese Letzte hat Zugriff auf Variablen (und eventuell auch Funktionen), die in ihrer mittelbaren und unmittelbaren Umgebung definiert sind, also außerhalb ihrer Definition. Dies wird möglich durch etwas, was "lexical scope" genannt wird: Die innere Funktion "B" kann auf Variablen (und Funktionen) zugreifen, die in der äußeren Funktion "A" definiert sind, sowie auf die, die in der äußeren Umgebung der Funktion "A" definiert wurden (etwa in der "globalen" Umgebung). Nehmen dazu ein Beispiel:

```
let x = 10;
let fA = () => {
    let y = 20;
    let fB = () => {
        return x + y;
    }
    return fB;
}

let fSumme = fA();
console.log( fSumme() ); // = 30.
```

Aus diesem Beispiel werden zunächst 2 wichtige Punkte deutlich:

- Die innere Funktion "fB()" greift sowohl auf Variable "x" in der globalen Umgebung als auch auf die Variable "y" in ihrer äußeren Umgebung (aus Funktion "fA()"),

- Die inneren Funktion "fB()" nimmt, in ihrer Rolle als Rückgabewert der äußeren Funktion "fA()", die Variable "y" der äußeren Funktion "fA()" mit. Aus diesem Grund kann die neugelidete Funktion "fSumme()" ohne irgendein beigegebenes Argument 20 auf die globale Variable "x" (mit einem Wert von 10) aufsummieren. 

Ganz trivial ist das nicht: Normalerweise findet ein Aufräumprozeß nach der Laufzeit einer Funktion statt, wo lokale, obsolet gewordene Variablen gelöscht werden (die sog. "garbage collection"). In Javascript erfolgt dieses Aufräumen allerdings nach einem Referenzkriterium: Variablen werden erst dann nach Funktionsausführung gesammelt und gelöscht, wenn keine Referenz mehr auf sie existiert. Da dies hier für "y" innerhalb von "fA()" hinsichtlich "fB()" zutrifft, wird bei der Einrichtung der Funktion "fSumme())" mit "fB()" als Rückgabewert von "fA()" die Variable "y" als "fB()"-zugehörig mitgeliefert.

Dies eröffnet natürlich eine Reihe von Möglichkeiten. Zum Beispiel, Argumente bei der Einrichtung der inneren Funktion darin zu fixieren:

```
let fA = (x) => {
	let y = 10;
    let fB = () => {
        return x + y;
    }
    return fB;
}

let siebenPlusZehn = fA(7);
let zwanzigPlusZehn = fA(20);
console.log( `${siebenPlusZehn()}, ${zwanzigPlusZehn()}` );
// = 17, 30
```

Wie bereits angedeutet, beschränkt sich dieser "lexical scope" nicht auf nur eine innere Funktion. [In der Spezifikation zu ECMAScript 2015 (ES6) wird folgendes festgehalten](https://262.ecma-international.org/6.0/#sec-lexical-environments):

> An outer Lexical Environment may, of course, have its own outer Lexical Environment. A Lexical Environment may serve as the outer environment for multiple inner Lexical Environments. For example, if a Function Declaration contains two nested Function Declarations then the Lexical Environments of each of the nested functions will have as their outer Lexical Environment the Lexical Environment of the current evaluation of the surrounding function.

(Als Quelle für diese Information nahm ich die Spezifikation von ES6 (ECMAScript 2015). Beim zitierten Text ist aber das gleiche [in der ES12 (ECMAScript 2021) Spezifikation nachzulesen](https://262.ecma-international.org/12.0/#sec-executable-code-and-execution-contexts)).

Dies hat zur Folge, dass Closures auch bei eine Verkettung beliebig vieler innerer Funktionen mit dem gleichen Effekt anwendbar ist:

```
let w = 10;
let fA = (x) => {
	return (y) => {
		return (z) => {
			return (x + y + z) / w
		}
	}
}
let resultat = fA(20)(30)(40); // (20 + 30 + 40) / 10
console.log( resultat ); // 9
```

Oder, sollte man ein Interesse am Beibehalten der zwei ersten Argumenten (über "fA()" an die ersten zwei verschachteten anonymen Funktionen gegeben) haben:

```
let testFunktion = fA(20)(30);
let testHundert = testFunktion(100); // (20 + 30 + 100) / 10 = 15
let testSieben =  testFunktion(7); // (20 + 30 + 7) / 10 = 5.7
```

Praktische Beispiele
--------------------

Vor allem im Bereich der Interaktion von Javascript und der Gestaltung des HTML (präzisär: dem Document Object Model, auch DOM genannt) eröffnen sich eine Reihe von Möglichkeiten. 

