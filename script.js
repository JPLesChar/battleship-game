const SIZE = 8;

const playerBoard = [];
const computerBoard = [];

const playerGrid = document.getElementById("player-board");
const computerGrid = document.getElementById("computer-board");

const statusText = document.getElementById("status");

const SHIPS = [4, 3, 3, 2, 2];

let gameOver = false;

function createBoard(gridElement, board, showShips = false) {

    gridElement.innerHTML = "";

    for (let row = 0; row < SIZE; row++) {

        board[row] = [];

        for (let col = 0; col < SIZE; col++) {

            board[row][col] = 0;

            const cell = document.createElement("div");
            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;

            gridElement.appendChild(cell);
        }
    }
}

function placeShips(board) {

    SHIPS.forEach(length => {

        let placed = false;

        while (!placed) {

            const horizontal = Math.random() < 0.5;

            const row = Math.floor(Math.random() * SIZE);
            const col = Math.floor(Math.random() * SIZE);

            let ok = true;

            for (let i = 0; i < length; i++) {

                const r = horizontal ? row : row + i;
                const c = horizontal ? col + i : col;

                if (
                    r >= SIZE ||
                    c >= SIZE ||
                    board[r][c] === 1
                ) {
                    ok = false;
                    break;
                }
            }

            if (!ok) continue;

            for (let i = 0; i < length; i++) {

                const r = horizontal ? row : row + i;
                const c = horizontal ? col + i : col;

                board[r][c] = 1;
            }

            placed = true;
        }
    });
}

function drawPlayerShips() {

    document
        .querySelectorAll("#player-board .cell")
        .forEach(cell => {

            const row = +cell.dataset.row;
            const col = +cell.dataset.col;

            if (playerBoard[row][col] === 1) {
                cell.classList.add("ship-carrier");
            }
        });
}

function countShips(board) {

    let total = 0;

    board.forEach(row => {
        row.forEach(cell => {
            if (cell === 1) total++;
        });
    });

    return total;
}

function playerShoot(e) {

    if (gameOver) return;

    const cell = e.target;

    if (!cell.classList.contains("cell")) return;

    const row = +cell.dataset.row;
    const col = +cell.dataset.col;

    const value = computerBoard[row][col];

    if (value === 2 || value === 3) return;

    if (value === 1) {

        computerBoard[row][col] = 2;
        cell.classList.add("hit");

    } else {

        computerBoard[row][col] = 3;
        cell.classList.add("miss");
    }

    checkWin();

    if (!gameOver) {
        setTimeout(computerTurn, 400);
    }
}

function computerTurn() {

    let row;
    let col;

    do {

        row = Math.floor(Math.random() * SIZE);
        col = Math.floor(Math.random() * SIZE);

    } while (
        playerBoard[row][col] === 2 ||
        playerBoard[row][col] === 3
    );

    const value = playerBoard[row][col];

    const cell =
        document.querySelector(
            `#player-board .cell[data-row="${row}"][data-col="${col}"]`
        );

    if (value === 1) {

        playerBoard[row][col] = 2;
        cell.classList.add("hit");

    } else {

        playerBoard[row][col] = 3;
        cell.classList.add("miss");
    }

    checkWin();
}

function checkWin() {

    let playerAlive = 0;
    let computerAlive = 0;

    playerBoard.forEach(r =>
        r.forEach(c => {
            if (c === 1) playerAlive++;
        })
    );

    computerBoard.forEach(r =>
        r.forEach(c => {
            if (c === 1) computerAlive++;
        })
    );

    if (computerAlive === 0) {

        gameOver = true;
        statusText.textContent = "🎉 You Win!";
    }

    if (playerAlive === 0) {

        gameOver = true;
        statusText.textContent = "💀 Computer Wins!";
    }
}

function newGame() {

    gameOver = false;

    createBoard(playerGrid, playerBoard);
    createBoard(computerGrid, computerBoard);

    placeShips(playerBoard);
    placeShips(computerBoard);

    drawPlayerShips();

    statusText.textContent = "Your turn";
}

computerGrid.addEventListener("click", playerShoot);

document
    .getElementById("restart")
    .addEventListener("click", newGame);

newGame();
function drawPlayerShips() {

    document
        .querySelectorAll("#player-board .cell")
        .forEach(cell => {

            const row = +cell.dataset.row;
            const col = +cell.dataset.col;

            if (playerBoard[row][col] === 1) {
                cell.classList.add("ship-carrier");
            }
        });
}
playerCells[1].classList.add("ship-carrier");
playerCells[2].classList.add("ship-carrier");
playerCells[3].classList.add("ship-carrier");
playerCells[4].classList.add("ship-carrier");

playerCells[10].classList.add("ship-cruiser");
playerCells[11].classList.add("ship-cruiser");
playerCells[12].classList.add("ship-cruiser");

playerCells[20].classList.add("ship-patrol");
playerCells[21].classList.add("ship-patrol");