import "./App.css";
import Deck from "../node_modules/deck-of-cards/lib/deck";
import { useEffect } from "react";

function App() {
  let cards = <div id="container"></div>; //Instantiate

  useEffect(() => {
    let deck = Deck();
    let cardsContainer = document.getElementById("container");
    deck.mount(cardsContainer);
    const jokerDecks = [];

    (() => {
      for (let i = 0; i < 4; i++) {
        let spareDeck = Deck(true);
        let removed = spareDeck.cards.splice(0, 52);
        removed.forEach((card) => card.unmount());
        spareDeck.mount(cardsContainer);
        jokerDecks.push(spareDeck);
      }
    })();

    const oplus = [];

    // o = straight circle
    let radius = 0.1;
    let numberOfPoints = 13;
    let theta = (Math.PI * 2) / numberOfPoints;
    for (let i = 1; i <= numberOfPoints; i++) {
      const x = radius * Math.cos(theta * i) + 0.25;
      const y = radius * Math.sin(theta * i) * 1.5;
      oplus.push([x, y]);
    }

    for (let i = 0; i < 7; i++) {
      oplus.push([0.45, 0.0 + i * 0.06]);
    }
    radius = 0.1;
    numberOfPoints = 11;
    theta = (Math.PI * 2) / numberOfPoints;
    for (let i = 0; i <= 10; i++) {
      if (i > 2 && i < 8) continue;
      const x = (radius * Math.cos(theta * i) + 0.5) * 1;
      const y = (radius * Math.sin(theta * i) + 0.0) * 1.5;
      oplus.push([x, y]);
    }

    // l = straight line
    for (let i = 0; i < 13; i++) {
      oplus.push([0.7, -0.32 + i * 0.042]);
    }

    // u = semi-circle
    radius = 0.1;
    numberOfPoints = 24;
    theta = (Math.PI * 2) / numberOfPoints;
    for (let i = 0; i <= 12; i++) {
      const x = (radius * Math.cos(theta * i) + 1.09) * 0.8;
      const y = (radius * Math.sin(theta * i) - 0.045) * 2.5;
      oplus.push([x, y]);
    }

    // s = two stretched semi-circles
    radius = 0.1;
    theta = (Math.PI * 2) / 17;
    for (let i = 1; i <= 15; i++) {
      if (i <= 4) {
        const x = (radius * Math.cos(theta * i * 1.1) + 1.3) * 0.8;
        const y = (radius * Math.sin(theta * i) + 0.005) * 1.5;
        oplus.push([x, y]);
      }
      if (i >= 5 && i <= 12) {
        const x = (radius * Math.cos(theta * i * 1.1) + 1.4) * 0.8;
        const y = (radius * Math.sin(theta * i) - 0.045) * 1.5;
        oplus.push([x, y]);
      }
    }

    const delay = 1000;
    const duration = 500;
    const widthScaleConstant = window.innerWidth * 0.53;
    const heightScaleConstant = window.innerHeight * 0.8;

    deck.cards.forEach((card, index) => {
      card.setSide("front");
      card.enableFlipping();
      card.enableDragging();
      card.animateTo({
        delay: delay,
        duration: duration,
        ease: "quartOut",
        x: oplus[index][0] * 1200 - widthScaleConstant,
        y: oplus[index][1] * heightScaleConstant,
      });
    });

    jokerDecks.forEach((array, indexArray) => {
      array.cards.forEach((card, indexCard) => {
        card.setSide("front");
        card.enableFlipping();
        card.enableDragging();
        card.animateTo({
          delay: delay,
          duration: duration,
          ease: "quartOut",
          x:
            oplus[indexArray * 3 + indexCard + 52][0] * 1200 -
            widthScaleConstant,
          y: oplus[indexArray * 3 + indexCard + 52][1] * heightScaleConstant,
        });
      });
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <link
          rel="stylesheet"
          href="https://deck-of-cards.js.org/example.css"
        />
      </header>
      <body>{cards}</body>
    </div>
  );
}

export default App;
