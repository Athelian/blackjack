import "./App.css";
import Deck from "../node_modules/deck-of-cards/lib/deck";
import { useEffect, useState } from "react";

function App() {
  let cards = <div id="container"></div>; //Instantiate
  const [gameReady, setGameReady] = useState(false);
  const [deck, setDeck] = useState([]);
  const [deckReady, setDeckReady] = useState(false);
  const [deckReshuffle, setDeckReshuffle] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [dealerTotal, setDealerTotal] = useState(0);
  const [playerTurn, setPlayerTurn] = useState();
  const [dealerTurn, setDealerTurn] = useState();
  const [scoreboard, setScoreboad] = useState({
    games: 0,
    dealerWins: 0,
    playerWins: 0,
    ties: 0,
  });
  const [showScoreboard, setShowScoreboard] = useState(false);

  useEffect(() => {
    // Initialise Deck
    setDeck(Deck());
    setDeckReady(true);
  }, []);

  useEffect(() => {
    // Game Intro
    if (!deckReady) return; // Waits for deck to be ready
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
          setTimeout(() => {
            setGameReady(true);
            setShowScoreboard(true);
          }, 500);
        }, 500);
      }, 1000);
    }, 7000);
  }, [deckReady]);

  useEffect(() => {
    // Game Start
    if (!gameReady) return;
    deck.blackjack.open((dealtCards) => {
      setDealerHand((prevHand) => prevHand.concat(dealtCards));
      deck.blackjack.open((dealtCards) => {
        setPlayerHand((prevHand) => prevHand.concat(dealtCards));
        setPlayerTurn(true);
      }, true);
    }, false);
  }, [gameReady]);

  useEffect(() => {
    if (!playerTurn) return;
    if (playerTurn && playerTotal === 21)
      return setTimeout(() => gameOver("win"));
  }, [playerTurn]);

  const calcHand = (hand) => {
    let aces = 0; // Ace counter
    let total = hand.reduce((acc, card) => {
      if (card.rank === 1) {
        aces++;
        return ++acc; // Increase by one if the card is an ace
      } else if (card.rank > 10) {
        return (acc += 10);
      } else {
        return (acc += card.rank); // Else by it's value
      }
    }, 0);
    // Add ace bonuses as long as they don't result in bust
    while (aces && total + 10 <= 21) {
      total += 10;
      aces--;
    }
    return total;
  };

  useEffect(() => {
    if (!dealerTurn) return;
    if (dealerTotal >= 17) {
      if (dealerTotal === 21) return gameOver("lose");
      if (dealerTotal === playerTotal) return gameOver();
      if (dealerTotal < playerTotal) return gameOver("win");
      return gameOver("lose");
    }
    setTimeout(
      () => deck.blackjack.hit(setDealerHand, false, dealerHand),
      2000
    );
  }, [dealerTurn]);

  useEffect(
    () => (playerHand.length ? setPlayerTotal(calcHand(playerHand)) : null),
    [playerHand]
  );
  useEffect(
    () => (dealerHand.length ? setDealerTotal(calcHand(dealerHand)) : null),
    [dealerHand]
  );
  useEffect(
    () =>
      playerTotal
        ? playerTotal > 21
          ? gameOver("lose")
          : playerTotal === 21
          ? gameOver("win")
          : null
        : null,
    [playerTotal]
  );
  useEffect(() => {
    if (!dealerTurn) return;
    if (dealerTotal > 21) return gameOver("win");
    if (dealerTotal === 21) return gameOver("lose");
    if (dealerTotal < 17)
      return setTimeout(
        () => deck.blackjack.hit(setDealerHand, false, dealerHand),
        2000
      );
    if (dealerTotal === playerTotal) return gameOver();
    if (dealerTotal < playerTotal) return gameOver("win");
    return gameOver("lose");
  }, [dealerTotal]);

  const gameOver = (result) => {
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerTurn(false);
    setDealerTurn(false);
    setPlayerTotal(0);
    setDealerTotal(0);
    setGameReady(false);
    setTimeout(() => {
      deck.cards = deck.cards.concat(playerHand).concat(dealerHand);
      deck.cards.forEach((card) => card.setSide("back"));
      setDeck(deck);
      setDeckReshuffle(true);
      setScoreboad((prev) => {
        prev.games++;
        prev[
          result === "win"
            ? "playerWins"
            : result === "lose"
            ? "dealerWins"
            : "ties"
        ]++;
        return { ...prev };
      });
      setTimeout(() => setGameReady(true), 2000);
    }, 2000);
  };

  useEffect(() => {
    if (!deckReshuffle) return;
    deck.shuffle();
    setDeckReshuffle(false);
  }, [deckReshuffle]);

  let time;
  const getTime = () => (time = Date.now());
  const checkInterval = () => Date.now() - time > 200;

  return (
    <div className="App">
      <header className="App-header">
        <link
          rel="stylesheet"
          href="https://deck-of-cards.js.org/example.css"
        />
      </header>
      {showScoreboard ? (
        <div id="scoreboard">
          <div>Games: {scoreboard.games}</div>
          <div>Wins: {scoreboard.playerWins}</div>
          <div>Losses: {scoreboard.dealerWins}</div>
          <div>Ties: {scoreboard.ties}</div>
        </div>
      ) : null}
      {playerTurn ? (
        <div id="choice">
          <button
            className="big-button"
            onMouseDown={() => getTime()}
            onMouseUp={async () => {
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
              dealerHand.forEach((card, index) => {
                card.blackjack.stay(() => console.log("done"), index);
              });
              setPlayerTurn(false);
              setDealerTurn(true);
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
