/////////////////////////////// Cards ///////////////////////////////////////////
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "ace"];
const names = [
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Jack",
  "Queen",
  "King",
  "Ace",
];
const suits = ["Diamonds", "Hearts", "Clubs", "Spades"];
const getRandomCard = () =>
  deck.splice(Math.floor(Math.random() * deck.length - 1), 1);

// Generate the deck
const createDeck = () => {
  const deck = [];
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push({
        name: `${names[i]} of ${suits[j]}`,
        value: values[i],
      });
    }
  }
  return deck;
};

// Give the players cards
const deal = () => {
  playerHand.push(...getRandomCard());
  playerHand.push(...getRandomCard());
  dealerHand.push(...getRandomCard());
  dealerHand.push(...getRandomCard());
  updatePlayerTotal();
  updateDealerTotal();
};
////////////////////////////////////////////////////////////////////////////////

///////////////////////// Point Calculations ///////////////////////////////////
let playerTotal = 0;
let dealerTotal = 0;
const updatePlayerTotal = () => (playerTotal = calcHand(playerHand));
const updateDealerTotal = () => (dealerTotal = calcHand(dealerHand));

const calcHand = (hand) => {
  let aces = 0; // Ace counter
  let total = hand.reduce((acc, card) => {
    if (card.value === "ace") {
      aces++;
      return ++acc; // Increase by one if the card is an ace
    } else {
      return (acc += card.value); // Else by it's value
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
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////// Logic ///////////////////////////////////////
const gameOver = () => {
  if (playerTotal === dealerTotal) return ties++, "Tie!";
  if (playerTotal === "Bust" || dealerTotal === "Blackjack")
    return dealerWins++, "You lose!";
  if (dealerTotal === "Bust" || playerTotal === "Blackjack")
    return playerWins++, "You win!";
  if (dealerTotal > playerTotal) return dealerWins++, "You lose!";
  if (playerTotal > dealerTotal) return playerWins++, "You win!";
};
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////// UI /////////////////////////////////////////
const gameState = () => `You have${playerHand.map(
  (item) => ` ${item.name}`
)}  \nDealer has${dealerHand.map(
  (item) => ` ${item.name}`
)}\n\n  Your total is ${playerTotal}
  Dealer's total is ${dealerTotal}
  \n${(() => {
    if (playerTurn) return "Would you like to hit?";
    if (dealerTurn) {
      return "Dealer hitting";
    } else return gameOver();
  })()}
  \n  Rounds: ${rounds}
  Player wins: ${playerWins}
  Dealer wins: ${dealerWins}
  Ties: ${ties}
  `;
////////////////////////////////////////////////////////////////////////////////

//////////////////////////////// Engine ////////////////////////////////////////
const round = () => {
  deal();
  updatePlayerTotal();
  updateDealerTotal();

  if (playerTotal === "Blackjack") {
    if (dealerTotal === "Blackjack") dealerTotal = "Irrelevant!"; // In unlikely case of both blackjacks on first hand
    return endRound();
  }

  while (true) {
    if (playerTotal !== "Blackjack" && confirm(gameState())) {
      playerHand.push(...getRandomCard());
      updatePlayerTotal();
      if (playerTotal === "Blackjack") break;
      if (playerTotal === "Bust") return endRound();
    } else {
      break;
    }
  }

  playerTurn = false; // Change the turns
  dealerTurn = true; // Use two booleans to allow for line 101

  alert(gameState());

  while (dealerTotal < 17) {
    dealerHand.push(...getRandomCard());
    updateDealerTotal();
    if (dealerTotal === "Blackjack" || dealerTotal === "Bust")
      return endRound();
    alert(gameState());
  }

  // If we are here we have to focus on either drawing with or surpassing the player
  const target = playerTotal === "Blackjack" ? 21 : playerTotal;
  while (dealerTotal < target) {
    dealerHand.push(...getRandomCard());
    updateDealerTotal();
    if (dealerTotal === "Blackjack" || dealerTotal === "Bust") break;
    alert(gameState());
  }
  return endRound();
};

const endRound = () => {
  playerTurn = false;
  dealerTurn = false;
  return alert(gameState());
};
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////// main /////////////////////////////////////////
let playerWins = 0;
let dealerWins = 0;
let ties = 0;
let rounds = 0;
let playerTurn = true;
let dealerTurn = false;
let deck = createDeck();
let playerHand = [];
let dealerHand = [];

while (true) {
  round();
  rounds++;
  // Reset
  playerHand = [];
  dealerHand = [];
  deck = createDeck();
  playerTurn = true;
}
////////////////////////////////////////////////////////////////////////////////
