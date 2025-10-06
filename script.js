const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

const xWinsEl = document.getElementById("xWins");
const oWinsEl = document.getElementById("oWins");
const drawsEl = document.getElementById("draws");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");

let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];
let aiMode = false; 

// Scoreboard counters

let xWins = 0;
let oWins = 0;
let draws = 0;

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer);

  if (checkWinner()) {
    highlightWinningCells();
    statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    updateScore(currentPlayer);
    gameActive = false;
    return;
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a Draw! 🤝";
    updateScore("Draw");
    gameActive = false;
    return;
  }

  // Switch player

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  // If AI mode and O's turn → AI plays
  
  if (aiMode && currentPlayer === "O" && gameActive) {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  let emptyCells = board.map((val, i) => val === "" ? i : null).filter(v => v !== null);
  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const cell = cells[randomIndex];

  board[randomIndex] = "O";
  cell.textContent = "O";
  cell.classList.add("O");

  if (checkWinner()) {
    highlightWinningCells();
    statusText.textContent = `Player O (AI) Wins! 🤖`;
    updateScore("O");
    gameActive = false;
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a Draw! 🤝";
    updateScore("Draw");
    gameActive = false;
  } else {
    currentPlayer = "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  return winningConditions.some(condition => {
    return condition.every(index => board[index] === currentPlayer);
  });
}

function highlightWinningCells() {
  winningConditions.forEach(condition => {
    if (condition.every(index => board[index] === currentPlayer)) {
      condition.forEach(index => {
        cells[index].classList.add("win");
      });
    }
  });
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O", "win");
  });
  statusText.textContent = "Player X's turn";
}

function updateScore(winner) {
  if (winner === "X") {
    xWins++;
    xWinsEl.textContent = xWins;
  } else if (winner === "O") {
    oWins++;
    oWinsEl.textContent = oWins;
  } else {
    draws++;
    drawsEl.textContent = draws;
  }
}

// Mode switching
twoPlayerBtn.addEventListener("click", () => {
  aiMode = false;
  resetGame();
  statusText.textContent = "2 Player Mode: Player X's turn";
});

aiBtn.addEventListener("click", () => {
  aiMode = true;
  resetGame();
  statusText.textContent = "AI Mode: Player X (You) start";
});

// Reset button
resetBtn.addEventListener("click", resetGame);

// Cell click events
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
