import "./App.css";
import Deck from "../node_modules/deck-of-cards/lib/deck";
import { useEffect } from "react";
import card from "deck-of-cards/lib/card";

function App() {
  // Instanciate a deck with all cards
  let cards = <div id="container"></div>;
  let deck = Deck();

  useEffect(() => {
    var cardies = document.getElementById("container");
    deck.mount(cardies);

    const o = [];
    var radius = 0.1;
    var numberOfPoints = 13;
    var theta = (Math.PI * 2) / numberOfPoints;
    for (var i = 1; i <= numberOfPoints; i++) {
      const pointXo = (radius * Math.cos(theta * i) + 0.3) * 0.9; // 0.9 is a slimming factor in x direction
      const pointYo = radius * Math.sin(theta * i) + 0.5;
      o.push([pointXo, pointYo]);
    }

    const p = [];
    for (let i = 0; i < 7; i++) {
      p.push([0.43, 0.5 + i * 0.06]);
    }
    var radius = 0.1;
    var numberOfPoints = 10;
    var theta = (Math.PI * 2) / numberOfPoints;
    for (var i = 0; i <= 2; i++) {
      const pointXp = (radius * Math.cos(theta * i) + 0.5) * 0.9;
      const pointYp = (radius * Math.sin(theta * i) + 0.55) * 0.9;
      p.push([pointXp, pointYp]);
    }
    for (var i = 7; i <= 10; i++) {
      const pointXp = (radius * Math.cos(theta * i) + 0.5) * 0.9;
      const pointYp = (radius * Math.sin(theta * i) + 0.55) * 0.9;
      p.push([pointXp, pointYp]);
    }

    const l = [];
    for (let i = 0; i < 13; i++) {
      l.push([0.6, 0.18 + i * 0.035]);
    }

    const u = [];
    var radius = 0.1;
    var numberOfPoints = 24;
    var theta = (Math.PI * 2) / numberOfPoints;
    for (var i = 0; i <= 12; i++) {
      const pointXu = (radius * Math.cos(theta * i) + 1.35) * 0.53;
      const pointYu = (radius * Math.sin(theta * i) + 0.22) * 2;
      u.push([pointXu, pointYu]);
    }

    deck.cards.forEach((card, index) => {
      card.setSide("front");
      card.enableFlipping();
      card.enableDragging();

      if (index < 13) {
        card.animateTo({
          delay: 1000, // wait 1 second
          duration: 500,
          ease: "quartOut",
          x: o[index][0] * window.innerWidth - window.innerWidth / 2,
          y: o[index][1] * window.innerHeight - window.innerHeight / 2,
        });
      } else if (index >= 13 && index < 26) {
        card.animateTo({
          delay: 1000, // wait 1 second

          duration: 500,
          ease: "quartOut",
          x: p[index - 13]
            ? p[index - 13][0] * window.innerWidth - window.innerWidth / 2
            : 0,
          y: p[index - 13]
            ? p[index - 13][1] * window.innerHeight - window.innerHeight / 2
            : 0,
        });
      } else if (index >= 26 && index < 39) {
        card.animateTo({
          delay: 1000, // wait 1 second

          duration: 500,
          ease: "quartOut",
          x: l[index - 26]
            ? l[index - 26][0] * window.innerWidth - window.innerWidth / 2
            : 0,
          y: l[index - 26]
            ? l[index - 26][1] * window.innerHeight - window.innerHeight / 2
            : 0,
        });
        console.log(1 * window.innerWidth - window.innerWidth / 2);
      } else if (index >= 39 && index < 52) {
        card.animateTo({
          delay: 1000, // wait 1 second
          duration: 500,
          ease: "quartOut",
          x: u[index - 39]
            ? u[index - 39][0] * window.innerWidth - window.innerWidth / 2
            : 0,
          y: u[index - 39]
            ? u[index - 39][1] * window.innerHeight - window.innerHeight / 2
            : 0,
        });
      }
    });

    const spareDeck = Deck(true);
  }, []);

  // display it in a html container
  return (
    <div className="App">
      <header className="App-header">
        <link
          rel="stylesheet"
          href="https://deck-of-cards.js.org/example.css"
        />
        {cards}

        <span id="S">S</span>
      </header>
    </div>
  );
}

export default App;
