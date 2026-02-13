//Cria o gameboard
const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function getBoard() {
    return board;
  }

  function setCell(index, marker) {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  }

  function reset() {
    board = ["", "", "", "", "", "", "", "", ""];
  }

  return { getBoard, setCell, reset };
})();

//Cria a factory function do jogador
function Player(name, symbol) {
  return { name, symbol };
}

const gameController = (function () {
  const player1 = Player("jogador1", "X");
  const player2 = Player("jogador2", "O");

  let currentPlayer = player1;
  let gameOver = false;

  function turnChange() {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  }

  function verifyVictory() {
    const board = Gameboard.getBoard();

    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];

      if (
        board[a] === currentPlayer.symbol &&
        board[b] === currentPlayer.symbol &&
        board[c] === currentPlayer.symbol
      ) {
        gameOver = true;
        return true;
      }
    }

    return false;
  }

  function verifyDraw() {
    const board = Gameboard.getBoard();

    if (!board.includes("") && !gameOver) {
      gameOver = true;
      return true;
    }
    return false;
  }

  function playRound(index) {
    if (gameOver) return;

    const validMove = Gameboard.setCell(index, currentPlayer.symbol);

    if (!validMove) {
      DOMController.showMessage("Posição ocupada!");
      return;
    }

    DOMController.updateBoard();

    if (verifyVictory()) {
      DOMController.showMessage(`${currentPlayer.name} venceu!`);
      return;
    }

    if (verifyDraw()) {
      DOMController.showMessage("Empate!");
      return;
    }

    turnChange();
    DOMController.showMessage(`Vez de: ${currentPlayer.symbol}`);
  }

  function resetGame() {
    Gameboard.reset();
    currentPlayer = player1;
    gameOver = false;
  }

  return {
    playRound,
    resetGame,
    getCurrentPlayer: () => currentPlayer,
    getGameOver: () => gameOver,
  };
})();

//DOM Controller
const DOMController = (function () {
  const cells = document.querySelectorAll(".cell");
  const status = document.getElementById("status");
  const resetButton = document.getElementById("reset");

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const index = cell.getAttribute("data-index");
      gameController.playRound(index);
    });
  });

  resetButton.addEventListener("click", () => {
    gameController.resetGame();
    updateBoard();
    showMessage("Vez de: X");
  });

  function updateBoard() {
    const board = Gameboard.getBoard();
    cells.forEach((cell, i) => {
      cell.textContent = board[i];
    });
  }

  function showMessage(msg) {
    status.textContent = msg;
  }

  return { updateBoard, showMessage };
})();

DOMController.updateBoard();
