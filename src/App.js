import "./App.css";
import Deck from "../node_modules/deck-of-cards/lib/deck";
import { useEffect } from "react";
import card from "deck-of-cards/lib/card";

function App() {
  // Instanciate a deck with all cards
  let cards = <div id="container"></div>;

  useEffect(() => {
    let deck = Deck();
    let spareDeck = Deck();
    let removedCards = spareDeck.cards.splice(13, 40);
    removedCards.forEach((removedCard) => removedCard.unmount());
    var cardies = document.getElementById("container");
    deck.mount(cardies);
    spareDeck.mount(cardies);

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
      p.push([0.45, 0.0 + i * 0.06]);
    }
    var radius = 0.1;
    var numberOfPoints = 11;
    var theta = (Math.PI * 2) / numberOfPoints;
    for (var i = 0; i <= 2; i++) {
      const pointXp = (radius * Math.cos(theta * i) + 0.5) * 1;
      const pointYp = (radius * Math.sin(theta * i) + 0.0) * 1.5;
      p.push([pointXp, pointYp]);
    }
    for (var i = 8; i <= 12; i++) {
      const pointXp = (radius * Math.cos(theta * i) + 0.5) * 1;
      const pointYp = (radius * Math.sin(theta * i) + 0.0) * 1.5;
      p.push([pointXp, pointYp]);
    }

    const l = [];
    for (let i = 0; i < 13; i++) {
      l.push([0.7, -0.32 + i * 0.042]);
    }

    const u = [];
    var radius = 0.1;
    var numberOfPoints = 24;
    var theta = (Math.PI * 2) / numberOfPoints;
    for (var i = 0; i <= 12; i++) {
      const pointXu = (radius * Math.cos(theta * i) + 1.09) * 0.8;
      const pointYu = (radius * Math.sin(theta * i) - 0.045) * 2.5;
      u.push([pointXu, pointYu]);
    }

    const s = [];
    var radius = 0.1;
    var numberOfPoints = 15;
    var theta = (Math.PI * 2) / numberOfPoints;
    for (var i = 8; i <= 12; i++) {
      const pointXs = (radius * Math.cos(theta * i) + 1.4) * 0.8;
      const pointYs = (radius * Math.sin(theta * i) - 0.045) * 1.5;
      s.push([pointXs, pointYs]);
    }
    for (var i = 1; i <= 4; i++) {
      const pointXs = (radius * Math.cos(theta * i) + 1.3) * 0.8;
      const pointYs = (radius * Math.sin(theta * i) + 0.005) * 1.5;
      s.push([pointXs, pointYs]);
    }
    for (var i = 12; i <= 15; i++) {
      const pointXs = (radius * Math.cos(theta * i) + 1.3) * 0.8;
      const pointYs = (radius * Math.sin(theta * i) + 0.05) * 1.5;
      s.push([pointXs, pointYs]);
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
          x: o[index][0] * 1200 - window.innerWidth * 0.53,
          y: o[index][1] * 1200 - window.innerHeight * 0.8,
        });
      } else if (index >= 13 && index < 26) {
        card.animateTo({
          delay: 1000, // wait 1 second

          duration: 500,
          ease: "quartOut",
          x: p[index - 13]
            ? p[index - 13][0] * 1200 - window.innerWidth * 0.53
            : 0,
          y: p[index - 13] ? p[index - 13][1] * window.innerHeight * 0.8 : 0,
        });
      } else if (index >= 26 && index < 39) {
        card.animateTo({
          delay: 1000, // wait 1 second

          duration: 500,
          ease: "quartOut",
          x: l[index - 26]
            ? l[index - 26][0] * 1200 - window.innerWidth * 0.53
            : 0,
          y: l[index - 26] ? l[index - 26][1] * window.innerHeight * 0.8 : 0,
        });
      } else if (index >= 39 && index < 52) {
        card.animateTo({
          delay: 1000, // wait 1 second
          duration: 500,
          ease: "quartOut",
          x: u[index - 39]
            ? u[index - 39][0] * 1200 - window.innerWidth * 0.53
            : 0,
          y: u[index - 39] ? u[index - 39][1] * window.innerHeight * 0.8 : 0,
        });
      }
    });
    spareDeck.cards.forEach((card, index) => {
      card.setSide("front");
      card.enableFlipping();
      card.enableDragging();
      card.animateTo({
        delay: 1000, // wait 1 second
        duration: 500,
        ease: "quartOut",
        x: s[index] ? s[index][0] * 1200 - window.innerWidth * 0.53 : 0,
        y: s[index] ? s[index][1] * window.innerHeight * 0.8 : 0,
      });
    });
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
      </header>
    </div>
  );
}

export default App;
