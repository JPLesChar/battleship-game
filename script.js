const SIZE = 8;

const playerBoard = [];
const computerBoard = [];

const playerGrid = document.getElementById("player-board");
const computerGrid = document.getElementById("computer-board");

const statusText = document.getElementById("status");

const SHIPS = [4, 3, 3, 2, 2];
const SHIP_COLORS = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6"];

let gameOver = false;
const computerTargets = [];
let playerShips = [];
let computerShips = [];

function createBoard(gridElement, board) {
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
    const ships = [];

    SHIPS.forEach((length, shipIndex) => {
        let placed = false;

        while (!placed) {
            const horizontal = Math.random() < 0.5;
            const row = Math.floor(Math.random() * SIZE);
            const col = Math.floor(Math.random() * SIZE);
            let ok = true;

            for (let i = 0; i < length; i++) {
                const r = horizontal ? row : row + i;
                const c = horizontal ? col + i : col;

                if (r >= SIZE || c >= SIZE) {
                    ok = false;
                    break;
                }

                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;

                        if (
                            nr >= 0 && nr < SIZE &&
                            nc >= 0 && nc < SIZE &&
                            board[nr][nc] !== 0
                        ) {
                            ok = false;
                            break;
                        }
                    }
                    if (!ok) break;
                }

                if (!ok) break;
            }

            if (!ok) continue;

            const cells = [];
            for (let i = 0; i < length; i++) {
                const r = horizontal ? row : row + i;
                const c = horizontal ? col + i : col;
                board[r][c] = shipIndex + 1;
                cells.push({ row: r, col: c });
            }

            ships.push({ cells, sunk: false });
            placed = true;
        }
    });

    return ships;
}

function drawPlayerShips() {
    document.querySelectorAll("#player-board .cell").forEach(cell => {
        const row = +cell.dataset.row;
        const col = +cell.dataset.col;
        const shipIndex = playerBoard[row][col] - 1;

        if (shipIndex >= 0) {
            cell.classList.add("ship");
            cell.style.backgroundColor = SHIP_COLORS[shipIndex];
        }
    });
}

function checkShipSunk(board, ships, gridElement, shipIndex) {
    const ship = ships[shipIndex - 1];
    if (ship.sunk || !ship.cells.every(({ row, col }) => board[row][col] === -1)) return;

    ship.sunk = true;
    ship.cells.forEach(({ row, col }) => {
        gridElement.querySelector(
            `.cell[data-row="${row}"][data-col="${col}"]`
        ).classList.add("sunk");
    });
}

function playerShoot(e) {
    if (gameOver) return;

    const cell = e.target;
    if (!cell.classList.contains("cell")) return;

    const row = +cell.dataset.row;
    const col = +cell.dataset.col;
    const value = computerBoard[row][col];

    if (value === -1 || value === -2) return;

    if (value > 0) {
        computerBoard[row][col] = -1;
        cell.classList.add("hit");
        checkShipSunk(computerBoard, computerShips, computerGrid, value);
        statusText.textContent = "Hit! Shoot again";
        checkWin();
        return;
    }

    computerBoard[row][col] = -2;
    cell.classList.add("miss");
    statusText.textContent = "Miss! Computer's turn";
    checkWin();

    if (!gameOver) {
        setTimeout(computerTurn, 400);
    }
}

function addComputerTargets(row, col) {
    const neighbors = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1]
    ];

    neighbors.forEach(([targetRow, targetCol]) => {
        if (
            targetRow >= 0 && targetRow < SIZE &&
            targetCol >= 0 && targetCol < SIZE &&
            playerBoard[targetRow][targetCol] !== -1 &&
            playerBoard[targetRow][targetCol] !== -2 &&
            !computerTargets.some(target => target.row === targetRow && target.col === targetCol)
        ) {
            computerTargets.push({ row: targetRow, col: targetCol });
        }
    });
}

function getComputerTarget() {
    while (computerTargets.length > 0) {
        const target = computerTargets.shift();

        if (
            playerBoard[target.row][target.col] !== -1 &&
            playerBoard[target.row][target.col] !== -2
        ) {
            return target;
        }
    }

    let row;
    let col;

    do {
        row = Math.floor(Math.random() * SIZE);
        col = Math.floor(Math.random() * SIZE);
    } while (playerBoard[row][col] === -1 || playerBoard[row][col] === -2);

    return { row, col };
}

function computerTurn() {
    if (gameOver) return;

    const { row, col } = getComputerTarget();
    const value = playerBoard[row][col];
    const cell = document.querySelector(
        `#player-board .cell[data-row="${row}"][data-col="${col}"]`
    );

    if (value > 0) {
        playerBoard[row][col] = -1;
        cell.classList.add("hit");
        checkShipSunk(playerBoard, playerShips, playerGrid, value);
        addComputerTargets(row, col);
    } else {
        playerBoard[row][col] = -2;
        cell.classList.add("miss");
    }

    checkWin();

    if (!gameOver) {
        if (value > 0) {
            statusText.textContent = "Computer hit! Computer shoots again";
            setTimeout(computerTurn, 400);
        } else {
            statusText.textContent = "Your turn";
        }
    }
}

function checkWin() {
    let playerAlive = 0;
    let computerAlive = 0;

    playerBoard.forEach(row => row.forEach(cell => {
        if (cell > 0) playerAlive++;
    }));

    computerBoard.forEach(row => row.forEach(cell => {
        if (cell > 0) computerAlive++;
    }));

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
    computerTargets.length = 0;

    createBoard(playerGrid, playerBoard);
    createBoard(computerGrid, computerBoard);

    playerShips = placeShips(playerBoard);
    computerShips = placeShips(computerBoard);

    drawPlayerShips();
    statusText.textContent = "Your turn";
}

computerGrid.addEventListener("click", playerShoot);
document.getElementById("restart").addEventListener("click", newGame);

newGame();
