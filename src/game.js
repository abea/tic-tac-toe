// Establish the "empty" states for the turn, players, and eventual winner.
let turn = 0;
let player1 = {};
let player2 = {};
let winner;

// Identify the starter and reset buttons.
const starter = document.getElementById('starter');
const resetter = document.getElementById('reset');
// Identify each of the spaces on the board.
const spaces = document.querySelectorAll('.board__space');
// Identify the board message element.
const message = document.querySelector('.board__message');
// Identify the instructional region.
const intro = document.getElementById('intro');
// Identify the turn message element.
const turnMsg = document.getElementById('turn-message');

// Set the grid length value.
const gridLength = Math.sqrt(spaces.length);

// Set up the instructions to be shown througout the game.
const instructions = [
  'Your goal is to fill a full row, column or major diagonal with your marker. Press "Start" to start the game.',
  'Player one, click a space in the grid to make your mark.',
  'Player two, it\'s your turn. click a space to make your mark.',
  'Continue going back and forth until someone wins(💥) or all spaces are full.',
];

intro.textContent = instructions[0];

// Set the displayed instructions based on the turn of the game. Once the final
// instruction is shown we leave that in place.
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
  player1 = new Player('one', '✕');
  player2 = new Player('two', '○');

  // Show the turn message and set initial state.
  turnMsg.classList.remove('is-hidden');
  turnMsg.textContent = `Player ${player1.name} (${player1.symbol}), it's your turn.`;

  // Update the introduction text.
  updateIntro(turn);
}

// Resets the game.
function resetGame() {
  // Disable the board spaces, removing their text
  // content.
  spaces.forEach((space) => {
    space.setAttribute('disabled', 'true');
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
starter.addEventListener('click', () => { startGame(); });
resetter.addEventListener('click', () => { resetGame(); });

// Activates the "Game Over" result.
function gameOver() {
  message.textContent = 'Game Over';
  message.classList.remove('is-hidden');
  turnMsg.classList.add('is-hidden');
}

// Activates the "Win" result, based on the player.
function triggerWin(player) {
  winner = player;

  message.textContent = `Player ${player.name} wins!`;
  message.classList.add('is-good');
  message.classList.remove('is-hidden');
  turnMsg.classList.add('is-hidden');

  spaces.forEach((space) => {
    space.setAttribute('disabled', '');
  });
}

// Set up records of possible wins.
const diagWin1 = [];
const diagWin2 = [];
const rowOrCol = {};

// Populate win scenarios based on the grid length.
function setWins (num) {
  for (let i = 1; i < (num + 1); i += 1) {
    diagWin1.push({
      row: i,
      col: i,
    });

    diagWin2.push({
      row: num - (i - 1),
      col: i,
    });

    rowOrCol[`row${i}`] = 0;
    rowOrCol[`col${i}`] = 0;
  }
}

setWins(gridLength);

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
  const checks = Object.assign({}, rowOrCol);

  // Variables to record progress toward a diagonal win.
  let diagWinCount1 = 0;
  let diagWinCount2 = 0;

  // Check each marked space within the player's moves for progress.
  marks.forEach((mark) => {
    // Variables to match the `checks` object keys.
    const currRow = `row${mark.row}`;
    const currCol = `col${mark.col}`;

    // Mark progress toward a row or column win;
    checks[currRow] += 1;
    checks[currCol] += 1;

    if (checks[currRow] === gridLength || checks[currCol] === gridLength) {
      // If a row or column has been filled, trigger a win.
      triggerWin(player);
    } else if (inDiagonalWin(diagWin1, mark) || inDiagonalWin(diagWin2, mark)) {
      // If progress is made toward the first diagonal win, mark progress.
      if (inDiagonalWin(diagWin1, mark)) { diagWinCount1 += 1; }

      // If progress is made toward the second diagonal win, mark progress.
      if (inDiagonalWin(diagWin2, mark)) { diagWinCount2 += 1; }
    }
  });

  if (diagWinCount1 === gridLength || diagWinCount2 === gridLength) {
    // If a diagonal win scenario is fulfilled, trigger a win.
    triggerWin(player);
  }
}

// Function triggered on each move.
function makeMove() {
  // Temporary variable for the player moving.
  let currentPlayer;
  let nextPlayer;
  // Record the space's row and column.
  const spaceValue = {
    row: this.dataset.row,
    col: this.dataset.col,
  };

  // Increment the turn one higher.
  turn += 1;

  // Update the instructions area.
  updateIntro(turn);

  // Check which player has played based on number of turns.
  if ((turn % 2) !== 0) {
    currentPlayer = player1;
    nextPlayer = player2;
  } else {
    currentPlayer = player2;
    nextPlayer = player1;
  }

  // Add the space played to the player's moves array.
  currentPlayer.moves.push(spaceValue);

  // Add the player's symbol to the space played.
  this.textContent = currentPlayer.symbol.toUpperCase();

  // Disable the space once played.
  this.setAttribute('disabled', 'true');

  // Check if the player has won.
  winCheck(currentPlayer, currentPlayer.moves);

  if (turn === spaces.length && !winner) {
    // If the player has not won and all spaces are filled, declare game over
    // and hide the turn message.
    gameOver();
  } else if (!winner) {
    // If the player has not won, set the turn message to the next player.
    turnMsg.textContent = `Player ${nextPlayer.name} (${nextPlayer.symbol}), it's your turn.`;
  }
}

// Add event listeners for the spaces on the board.
spaces.forEach((space) => {
  space.addEventListener('click', makeMove);
});
