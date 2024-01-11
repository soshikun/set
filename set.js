/**
 * Jun Nguyen
 * October 24, 2020
 * CSE 154 AB AU20 - Austin Jenchi
 *
 * This is the script for the set game.
 * It helps create user interactivity when they play the game.
 */
"use strict";

(function() {
  const STYLE = ["solid", "outline", "striped"];
  const COLOR = ["green", "purple", "red"];
  const SHAPE = ["diamond", "oval", "squiggle"];
  const COUNT = [1, 2, 3];
  let timerId;
  let remainingSeconds;

  let cardStyle;
  let cardShape;
  let cardColor;
  let cardCount;

  let easyDiff;
  let difficulty;
  let difficultyTotal;

  window.addEventListener("load", init);

  /**
   * Run on page load. Sets up what each button does to start the game and end the game, as well as
   * refreshing the game.
   */
  function init() {
    id("start-btn").addEventListener("click", startTimer);
    id("start-btn").addEventListener("click", toggleViews);
    id("start-btn").addEventListener("click", createBoard);

    id("back-btn").addEventListener("click", function() {
      id("refresh-btn").disabled = false;
    });
    id("back-btn").addEventListener("click", function() {
      clearInterval(timerId);
    });
    id("back-btn").addEventListener("click", toggleViews);
    id("back-btn").addEventListener("click", clearBoard);
    id("back-btn").addEventListener("click", function() {
      id("set-count").textContent = 0;
    });

    id("refresh-btn").addEventListener("click", refreshBoard);
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
  function isASet(selected) {
    let attribute = [];
    for (let i = 0; i < selected.length; i++) {
      attribute.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attribute[0].length; i++) {
      let diff = attribute[0][i] !== attribute[1][i] &&
                attribute[1][i] !== attribute[2][i] &&
                attribute[0][i] !== attribute[2][i];
      let same = attribute[0][i] === attribute[1][i] &&
                    attribute[1][i] === attribute[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Toggles between the menu and the game screens.
   */
  function toggleViews() {
    if (!id("menu-view").classList.contains("hidden")) {
      id("menu-view").classList.add("hidden");
    } else {
      id("menu-view").classList.remove("hidden");
    }

    if (!id("game-view").classList.contains("hidden")) {
      id("game-view").classList.add("hidden");
    } else {
      id("game-view").classList.remove("hidden");
    }
  }

  /**
   * Gets the difficulty level and returns the difficulty.
   * @returns {string} The difficulty level.
   */
  function getDifficulty() {
    difficulty = qs("input[name='diff']:checked").value;
    return difficulty;
  }

  /**
   * Creates the board, taking into account the difficulty level.
   */
  function createBoard() {
    if (getDifficulty() === "easy") {
      easyDiff = true;
      difficultyTotal = 9;
    } else {
      easyDiff = false;
      difficultyTotal = 12;
    }

    for (let i = 0; i < difficultyTotal; i++) {
      id("board").appendChild(generateUniqueCard(easyDiff));
    }
  }

  /**
   * Clears the board.
   */
  function clearBoard() {
    let board = id("board");
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
  }

  /**
   * Generates random attributes based on style, shape, color, and count. Returns the random
   * attributes.
   * @param {boolean} isEasy - The difficulty of the game.
   * @returns {array} The random attributes array.
   */
  function generateRandomAttributes(isEasy) {
    if (isEasy) {
      cardStyle = STYLE[0];
    } else {
      cardStyle = STYLE[parseInt(Math.random() * 3)];
    }

    cardShape = SHAPE[parseInt(Math.random() * 3)];
    cardColor = COLOR[parseInt(Math.random() * 3)];
    cardCount = COUNT[parseInt(Math.random() * 3)];

    let cardAttributes = [cardStyle, cardShape, cardColor, cardCount];
    return cardAttributes;
  }

  /**
   * Generates a single unique card from the attributes generated. Returns the unique card.
   * @param {boolean} isEasy - The difficulty of the game.
   * @returns {HTMLElement} The unique card generated.
   */
  function generateUniqueCard(isEasy) {
    let cardAttributes = generateRandomAttributes(isEasy);
    let cardId = cardAttributes[0] + "-" + cardAttributes[1] + "-" + cardAttributes[2] +
      "-" + cardAttributes[3];

    // Actually on the board
    while (id(cardId) !== null) {
      cardAttributes = generateRandomAttributes(isEasy);
      cardId = cardAttributes[0] + "-" + cardAttributes[1] + "-" + cardAttributes[2] +
        "-" + cardAttributes[3];
    }

    let newCard = gen("div");
    newCard.id = cardId;
    newCard.classList.add("card");
    generateImage(newCard, cardAttributes);

    newCard.addEventListener("click", cardSelected);
    return newCard;
  }

  /**
   * Generates images based on the card attributes and creates a single card.
   * @param {string} card - The card generated.
   * @param {array} cardAttributes - The random attributes.
   */
  function generateImage(card, cardAttributes) {
    for (let i = 0; i < cardAttributes[3]; i++) {
      let cardImage = gen("img");
      card.appendChild(cardImage);
      cardImage.src = "img/" + cardAttributes[0] + "-" + cardAttributes[1] + "-" +
        cardAttributes[2] + ".png";
      cardImage.alt = cardAttributes[0] + "-" + cardAttributes[1] + "-" + cardAttributes[2] +
        "-" + cardAttributes[3];
    }
  }

  /**
   * Starts the timer/countdown.
   */
  function startTimer() {
    remainingSeconds = findSelect("menu-view");
    timerDisplay();
    timerId = setInterval(advanceTimer, 1000);
  }

  /**
   * Gets the value of the timer options and returns it.
   * @param {string} parent - The ID of the parent.
   * @returns {string} The value of the timer.
   */
  function findSelect(parent) {
    parent = id(parent);
    return parent.firstElementChild.children[1].value;
  }

  /**
   * Advances the countdown and ends the game when the timer hits 0.
   */
  function advanceTimer() {
    remainingSeconds--;
    timerDisplay();
    if (remainingSeconds === 0) {
      id("refresh-btn").disabled = true;
      let selectedCards = qsa(".selected");
      for (let i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.remove("selected");
      }
      let cards = qsa(".card");
      for (let i = 0; i < cards.length; i++) {
        cards[i].removeEventListener("click", cardSelected);
      }
      clearInterval(timerId);
    }
  }

  /**
   * Updates the timer display based on the remaining seconds.
   */
  function timerDisplay() {
    let minutes = parseInt(remainingSeconds / 60);
    let seconds = parseInt(remainingSeconds % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    id("time").innerHTML = "0" + minutes + ":" + seconds;
  }

  /**
   * When cards are selected, it checks if the three selected cards make a set or not, and
   * updates the game based on that. Updates the player's score of sets found.
   */
  function cardSelected() {
    if (!this.classList.contains("selected")) {
      this.classList.add("selected");
      let selectedCards = qsa(".selected");
      if (selectedCards.length === 3) {
        for (let i = 0; i < selectedCards.length; i++) {
          selectedCards[i].classList.remove("selected");
        }
        if (isASet(selectedCards)) {
          let count = id("set-count");
          let total = parseInt(count.textContent);
          count.textContent = total + 1;
          setTrue(selectedCards);
        } else {
          setFalse(selectedCards);
        }
      }
    } else {
      this.classList.remove("selected");
    }
  }

  /**
   * Condition for when the cards selected make a set.
   * @param {array} selectedCards - Array of selected cards.
   */
  function setTrue(selectedCards) {
    let board = id("board");
    for (let i = 0; i < selectedCards.length; i++) {
      let newCard = generateUniqueCard(easyDiff);
      board.replaceChild(newCard, selectedCards[i]);
      newCard.classList.add("hide-imgs");
      let message = createMessage(newCard, "SET!");
      setTimeout(function() {
        newCard.removeChild(message);
        newCard.classList.remove("hide-imgs");
      }, 1000);
    }
  }

  /**
   * Condition for when the cards selected do not make a set.
   * @param {array} selectedCards - Array of selected cards.
   */
  function setFalse(selectedCards) {
    for (let i = 0; i < selectedCards.length; i++) {
      let message = createMessage(selectedCards[i], "Not a Set");
      selectedCards[i].classList.add("hide-imgs");
      setTimeout(function() {
        selectedCards[i].removeChild(message);
        selectedCards[i].classList.remove("hide-imgs");
      }, 1000);
    }
  }

  /**
   * Creates the message for whether or not the cards selected form a set.
   * @param {array} cardsSelected - Array of selected cards.
   * @param {string} setMessage - Message to display when three cards are selected.
   * @returns {HTMLElement} The paragraph element for the message.
   */
  function createMessage(cardsSelected, setMessage) {
    let set = gen("p");
    set.textContent = setMessage;
    cardsSelected.appendChild(set);
    return set;
  }

  /**
   * Refreshes the game cards on the board.
   */
  function refreshBoard() {
    let board = id("board");
    let cards = qsa(".card");
    for (let i = 0; i < cards.length; i++) {
      board.replaceChild(generateUniqueCard(easyDiff), cards[i]);
    }
  }

  /**
   * Returns the DOM element with the given ID.
   * @param {string} idName - The ID to find.
   * @returns {HTMLElement} DOM object associated with id (null if not found).
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {HTMLElement} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Returns a new element that is generated from the given element type.
   * @param {string} elType - HTML element type for new DOM element.
   * @returns {HTMLElement} New DOM object for given HTML tag.
   */
  function gen(elType) {
    return document.createElement(elType);
  }
})();