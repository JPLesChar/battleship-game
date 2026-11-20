function computerTurn() {

    const { row, col } = getComputerTarget();
    const value = playerBoard[row][col];

    const cell =
        document.querySelector(
            `#player-board .cell[data-row="${row}"][data-col="${col}"]`
        );

    if (value > 0) {

        playerBoard[row][col] = -1;
        cell.classList.add("hit");
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
