// Establish the "empty" states for the turn and players.
let turn = 0;
let player1 = {};
let player2 = {};

// Identify the starter and reset buttons.
const starter = document.getElementById('starter');
const resetter = document.getElementById('reset');
// Identify each of the spaces on the board.
const spaces = document.querySelectorAll('.board__space');
// Identify the board message element.
const message = document.querySelector('.board__message');

// Creates a player class to be used once the game begins. Each player has a
// name, symbol, and array of moves they have made.
class Player {
  constructor (name, symbol) {
    this.name = name;
    this.symbol = symbol;
    this.moves = [];
  }
}

// Initializes the game.
function startGame() {
  // Remove disabled state from board space buttons.
  spaces.forEach((space) => {
    space.removeAttribute('disabled');
  });

  // Disable the starter and enable the reset button.
  resetter.removeAttribute('disabled');
  starter.setAttribute('disabled', 'true');

  // Create new players.
  player1 = new Player('one', 'x');
  player2 = new Player('two', 'o');
}

// Resets the game.
function resetGame() {
  // Disable the board spaces, removing their data-played attribute and text
  // content.
  spaces.forEach((space) => {
    space.setAttribute('disabled', 'true');
    space.removeAttribute('data-played');
    /* eslint-disable no-param-reassign */
    space.innerHTML = '';
    /* eslint-enable no-param-reassign */
  });

  // Reset each player's moves and the turn count.
  player1.moves = [];
  player2.moves = [];
  turn = 0;

  // Reset the game message to be empty and hidden.
  message.textContent = '';
  message.classList.add('is-hidden');

  // Enable the start button and disable the reset button.
  starter.removeAttribute('disabled');
  resetter.setAttribute('disabled', 'true');
}

// Initialize the game when the starter is clicked.
starter.addEventListener('click', () => { startGame(); });
resetter.addEventListener('click', () => { resetGame(); });

// Activates the "Game Over" result.
function gameOver() {
  message.textContent = 'Game Over';
  message.classList.remove('is-hidden');
}

// Activates the "Win" result, based on the player.
function triggerWin(player) {
  message.textContent = `Player ${player.name} wins!`;
  message.classList.remove('is-hidden');

  spaces.forEach((space) => {
    space.setAttribute('disabled', '');
  });
}

// Identify the two possible diagonal wins.
const diagWin1 = [
  {
    row: 1,
    col: 1,
  },
  {
    row: 2,
    col: 2,
  },
  {
    row: 3,
    col: 3,
  },
];

const diagWin2 = [
  {
    row: 3,
    col: 1,
  },
  {
    row: 2,
    col: 2,
  },
  {
    row: 1,
    col: 3,
  },
];

// Check if a given space is within a given diagonal win array.
function inDiagonalWin(diagArr, test) {
  // Get the index of the diagonal win array where the test's row matches.
  const rowIdx = diagArr.findIndex(item => item.row === parseInt(test.row, 10));

  // Get the index of the diagonal win array where the test's column matches.
  const colIdx = diagArr.findIndex(item => item.col === parseInt(test.col, 10));

  if ((rowIdx > -1) && (colIdx === rowIdx)) {
    // If the index of the row test is present and equal to the column index,
    // return true.
    return true;
  }

  return false;
}

// Function to check if a player has won the game.
function winCheck(player, arr) {
  // Make a temporary array from the player's moves.
  const marks = [...arr];

  // Object to record instances of moves within each row and column.
  const checks = {
    row1: 0,
    row2: 0,
    row3: 0,
    col1: 0,
    col2: 0,
    col3: 0,
  };

  // Variables to record progress toward a diagonal win.
  let diagWinner1 = 0;
  let diagWinner2 = 0;

  // Check each marked space within the player's moves for progress.
  marks.forEach((mark) => {
    // Variables to match the `checks` object keys.
    const currRow = `row${mark.row}`;
    const currCol = `col${mark.col}`;

    // Mark progress toward a row or column win;
    checks[currRow] += 1;
    checks[currCol] += 1;

    if (checks[currRow] === 3 || checks[currCol] === 3) {
      // If a row or column has been filled, trigger a win.
      triggerWin(player);
    } else if (inDiagonalWin(diagWin1, mark) || inDiagonalWin(diagWin2, mark)) {
      // If progress is made toward the first diagonal win, mark progress.
      if (inDiagonalWin(diagWin1, mark)) { diagWinner1 += 1; }

      // If progress is made toward the second diagonal win, mark progress.
      if (inDiagonalWin(diagWin2, mark)) { diagWinner2 += 1; }
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
  let currentPlayer;
  // Record the space's row and column.
  const spaceValue = {
    row: this.dataset.row,
    col: this.dataset.col,
  };

  // Increment the turn one higher.
  turn += 1;

  // Check which player has played based on number of turns.
  if ((turn % 2) !== 0) {
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
  if (turn === spaces.length) { gameOver(); }
}

// Add event listeners for the spaces on the board.
spaces.forEach((space) => {
  space.addEventListener('click', makeMove);
});
