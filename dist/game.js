'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Establish the "empty" states for the turn, players, and eventual winner.
var turn = 0;
var player1 = {};
var player2 = {};
var winner = void 0;

// Identify the starter and reset buttons.
var starter = document.getElementById('starter');
var resetter = document.getElementById('reset');
// Identify each of the spaces on the board.
var spaces = document.querySelectorAll('.board__space');
// Identify the board message element.
var message = document.querySelector('.board__message');
// Identify the instructional region.
var intro = document.getElementById('intro');

var instructions = ['Your goal is to fill a full row, column or major diagonal with your marker. Press "Start" to start the game.', 'Player one, click a space in the grid to make your mark.', 'Player two, it\'s your turn. click a space to make your mark.', 'Continue going back and forth until someone wins(💥) or all spaces are full.'];

function updateIntro(stage) {
  switch (stage) {
    case 0:
      intro.textContent = instructions[1];
      break;
    case 1:
      intro.textContent = instructions[2];
      break;
    case 2:
      intro.textContent = instructions[3];
      break;
    default:
      break;
  }
}

// Creates a player class to be used once the game begins. Each player has a
// name, symbol, and array of moves they have made.

var Player = function Player(name, symbol) {
  _classCallCheck(this, Player);

  this.name = name;
  this.symbol = symbol;
  this.moves = [];
};

// Initializes the game.


function startGame() {
  // Remove disabled state from board space buttons.
  spaces.forEach(function (space) {
    space.removeAttribute('disabled');
  });

  // Disable the starter and enable the reset button.
  resetter.removeAttribute('disabled');
  starter.setAttribute('disabled', 'true');

  // Create new players.
  player1 = new Player('one', 'x');
  player2 = new Player('two', 'o');

  // Update the introduction text.
  updateIntro(turn);
}

// Resets the game.
function resetGame() {
  // Disable the board spaces, removing their data-played attribute and text
  // content.
  spaces.forEach(function (space) {
    space.setAttribute('disabled', 'true');
    space.removeAttribute('data-played');
    /* eslint-disable no-param-reassign */
    space.innerHTML = '';
    /* eslint-enable no-param-reassign */
  });

  // Reset each player's moves, the winner, and the turn count.
  player1.moves = [];
  player2.moves = [];
  winner = undefined;
  turn = 0;

  // Reset the game message to be empty and hidden.
  message.textContent = '';
  message.classList.add('is-hidden');
  message.classList.remove('is-good');

  // Reset the instructions.
  intro.textContent = instructions[0];

  // Enable the start button and disable the reset button.
  starter.removeAttribute('disabled');
  resetter.setAttribute('disabled', 'true');
}

// Initialize the game when the starter is clicked.
starter.addEventListener('click', function () {
  startGame();
});
resetter.addEventListener('click', function () {
  resetGame();
});

// Activates the "Game Over" result.
function gameOver() {
  message.textContent = 'Game Over';
  message.classList.remove('is-hidden');
}

// Activates the "Win" result, based on the player.
function triggerWin(player) {
  winner = player;

  message.textContent = 'Player ' + player.name + ' wins!';
  message.classList.add('is-good');
  message.classList.remove('is-hidden');

  spaces.forEach(function (space) {
    space.setAttribute('disabled', '');
  });
}

// Identify the two possible diagonal wins.
var diagWin1 = [{
  row: 1,
  col: 1
}, {
  row: 2,
  col: 2
}, {
  row: 3,
  col: 3
}];

var diagWin2 = [{
  row: 3,
  col: 1
}, {
  row: 2,
  col: 2
}, {
  row: 1,
  col: 3
}];

// Check if a given space is within a given diagonal win array.
function inDiagonalWin(diagArr, test) {
  // Get the index of the diagonal win array where the test's row matches.
  var rowIdx = diagArr.findIndex(function (item) {
    return item.row === parseInt(test.row, 10);
  });

  // Get the index of the diagonal win array where the test's column matches.
  var colIdx = diagArr.findIndex(function (item) {
    return item.col === parseInt(test.col, 10);
  });

  if (rowIdx > -1 && colIdx === rowIdx) {
    // If the index of the row test is present and equal to the column index,
    // return true.
    return true;
  }

  return false;
}

// Function to check if a player has won the game.
function winCheck(player, arr) {
  // Make a temporary array from the player's moves.
  var marks = [].concat(_toConsumableArray(arr));

  // Object to record instances of moves within each row and column.
  var checks = {
    row1: 0,
    row2: 0,
    row3: 0,
    col1: 0,
    col2: 0,
    col3: 0
  };

  // Variables to record progress toward a diagonal win.
  var diagWinner1 = 0;
  var diagWinner2 = 0;

  // Check each marked space within the player's moves for progress.
  marks.forEach(function (mark) {
    // Variables to match the `checks` object keys.
    var currRow = 'row' + mark.row;
    var currCol = 'col' + mark.col;

    // Mark progress toward a row or column win;
    checks[currRow] += 1;
    checks[currCol] += 1;

    if (checks[currRow] === 3 || checks[currCol] === 3) {
      // If a row or column has been filled, trigger a win.
      triggerWin(player);
    } else if (inDiagonalWin(diagWin1, mark) || inDiagonalWin(diagWin2, mark)) {
      // If progress is made toward the first diagonal win, mark progress.
      if (inDiagonalWin(diagWin1, mark)) {
        diagWinner1 += 1;
      }

      // If progress is made toward the second diagonal win, mark progress.
      if (inDiagonalWin(diagWin2, mark)) {
        diagWinner2 += 1;
      }
    }
  });

  if (diagWinner1 === 3 || diagWinner2 === 3) {
    // If a diagonal win scenario is fulfilled, trigger a win.
    triggerWin(player);
  }
}

// Function triggered on each move.
function makeMove() {
  // Temporary variable for the player moving.
  var currentPlayer = void 0;
  // Record the space's row and column.
  var spaceValue = {
    row: this.dataset.row,
    col: this.dataset.col
  };

  // Increment the turn one higher.
  turn += 1;

  // Update the instructions area.
  updateIntro(turn);

  // Check which player has played based on number of turns.
  if (turn % 2 !== 0) {
    currentPlayer = player1;
  } else {
    currentPlayer = player2;
  }

  // Add the space played to the player's moves array.
  currentPlayer.moves.push(spaceValue);

  // Add the player's symbol to the space played as data value and content.
  this.dataset.played = currentPlayer.symbol;
  this.textContent = currentPlayer.symbol.toUpperCase();

  // Disable the space once played.
  this.setAttribute('disabled', 'true');

  // Check if the player has won.
  winCheck(currentPlayer, currentPlayer.moves);

  // If the player has not won and all spaces are filled, declare game over.
  if (turn === spaces.length && !winner) {
    gameOver();
  }
}

// Add event listeners for the spaces on the board.
spaces.forEach(function (space) {
  space.addEventListener('click', makeMove);
});
//# sourceMappingURL=game.js.map
