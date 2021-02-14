import "./App.css";
import Deck from "../node_modules/deck-of-cards/lib/deck";
import { useEffect, useState } from "react";

function App() {
  let cards = <div id="container"></div>; //Instantiate
  const [gameReady, setGameReady] = useState(false);
  const [deck, setDeck] = useState([]);
  const [firstRender, setFirstRender] = useState(true);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerTurn, setPlayerTurn] = useState();
  const [dealerTurn, setDealerTurn] = useState();
  const [hit, setHit] = useState();

  useEffect(() => {
    // Initialise Deck
    setDeck(Deck());
  }, []);

  useEffect(() => {
    // Game Intro
    if (firstRender) return setFirstRender(false); // Waits for deck to be ready
    let cardsContainer = document.getElementById("container");
    let deckContainer = document.getElementsByClassName("deck");
    deck.mount(cardsContainer);
    const jokerDecks = [];
    (() => {
      for (let i = 0; i < 4; i++) {
        let spareDeck = Deck(true);
        spareDeck.cards.forEach((card) => card.unmount());
        spareDeck.cards.splice(0, 52);
        // removed.forEach((card) => card.unmount());
        spareDeck.mount(cardsContainer);
        jokerDecks.push(spareDeck);
      }
    })();

    setTimeout(() => {
      deck.sort();
      setTimeout(() => {
        deck.fan();
        setTimeout(() => {
          jokerDecks.forEach((deck) =>
            deck.cards.forEach((card) => card.mount(cardsContainer))
          );
        }, 3000);
      }, 1000);
    }, 1000);

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

    const delay = 5000;
    const duration = 500;
    const widthScaleConstant = window.innerWidth * 0.53;
    const heightScaleConstant = window.innerHeight * 0.8;

    const animateTitle = (card, index) => {
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
    };

    deck.cards.forEach((card, index) => {
      animateTitle(card, index);
    });

    jokerDecks.forEach((array, indexArray) => {
      array.cards.forEach((card, indexCard) => {
        animateTitle(card, indexArray * 3 + indexCard + 52);
      });
    });

    setTimeout(() => {
      deck.shuffle();
      jokerDecks.forEach((deck) => deck.shuffle());
      setTimeout(() => {
        jokerDecks.forEach((deck) =>
          deck.cards.forEach((card) => card.unmount())
        );
        deck.flip();
        setTimeout(() => {
          deckContainer[0].style.position = "absolute";
          deckContainer[0].style.transition = "left 1s";
          deckContainer[0].style.left = "0";
          setTimeout(() => {
            deckContainer[0].style.left = "343px";
            deck.cards.forEach((card) => {
              card.setSide("back");
              card.disableFlipping();
              card.disableDragging();
            });
            setTimeout(() => setGameReady(true), 500);
          }, 500);
        });
      }, 1000);
    }, 7000);
  }, [deck]);

  useEffect(() => {
    // Game Start
    if (!gameReady) return;
    deck.blackjack.open((dealtCards) => {
      setPlayerHand((prevHand) => prevHand.concat(dealtCards));
      deck.blackjack.open((dealtCards) => {
        setDealerHand((prevHand) => prevHand.concat(dealtCards));
        setPlayerTurn(true);
      }, false);
    }, true);
  }, [gameReady]);

  const calcHand = (hand) => {
    let aces = 0; // Ace counter
    let total = hand.reduce((acc, value) => {
      if (value === 1) {
        aces++;
        return ++acc; // Increase by one if the card is an ace
      } else {
        return (acc += value); // Else by it's value
      }
    }, 0);
    // Add ace bonuses as long as they don't result in bust
    while (aces && total + 10 <= 21) {
      total += 10;
      aces--;
    }

    if (total > 21) {
      return "Bust";
    } else if (total === 21) {
      return "Blackjack";
    }
    return total;
  };

  let time;
  const getTime = () => (time = Date.now());
  const checkInterval = () => Date.now() - time > 400;

  return (
    <div className="App">
      <header className="App-header">
        <link
          rel="stylesheet"
          href="https://deck-of-cards.js.org/example.css"
        />
      </header>
      {playerTurn ? (
        <div id="choice">
          <button
            className="big-button"
            onMouseDown={() => getTime()}
            onMouseUp={() => {
              if (!checkInterval()) return (time = null);
              deck.blackjack.hit(setPlayerHand, true, playerHand);
              time = null;
            }}
          >
            <span>Hit</span>
          </button>
          <button
            className="big-button"
            onMouseDown={() => getTime()}
            onMouseUp={() => {
              if (!checkInterval()) return (time = null);
              dealerHand.forEach((card, index) =>
                card.blackjack.stay(() => console.log("done"), index)
              );
              time = null;
            }}
          >
            <span>Stay</span>
          </button>
        </div>
      ) : null}
      {cards}
    </div>
  );
}

export default App;
