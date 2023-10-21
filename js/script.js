const gameBoard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getField = (index) => {
        return board[index];
    }

    const setField = (index, sign) => {
        board[index] = sign;
    }

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    const print = () => {
        console.log(board.map((e) => e));
    }

    return { getField, setField, reset, print };
})();

function createPlayer(sign) {
    this.sign = sign;

    const getSign = () => {
        return sign;
    }

    return { getSign };
};

const displayController = (function () {
    const headerRight = document.querySelector('.header__right');
    const headerScore = document.querySelector('.header__score');
    const scorePlayer1 = document.querySelector('.score__player1');
    const scorePlayer2 = document.querySelector('.score__player2');
    const startButton = document.querySelector('.startButton');
    const gameContentAnnouncement = document.querySelector('.gameContent__announcement');
    const gameContent = document.querySelector('.gameContent');
    const gameboardButtons = document.querySelectorAll('.gameboard__button');

    window.addEventListener("resize", () => {
        let elemWidth = document.documentElement.clientWidth;

        if (elemWidth < 370) {
            headerScore.innerHTML = `score:<br/><span class="score__player1">${gameController.getWins()[0]}
                </span> - <span class="score__player2">${gameController.getWins()[1]}</span>`;
        }
        else {
            headerScore.innerHTML = `score: <span class="score__player1">${gameController.getWins()[0]}
                </span> - <span class="score__player2">${gameController.getWins()[1]}</span>`;
        }
    });

    startButton.style.cssText = `transition: background-color 0.4s, opacity 0.3s;`;
    gameContent.style.cssText = `transition: opacity 1s;`;
    headerRight.style.cssText = `transition: opacity 1s;`;

    startButton.addEventListener('click', (e) => {
        startButton.style.opacity = 0;
        startButton.addEventListener('transitionend', () => {
            startButton.style.display = 'none';
        }, { once: true });

        setTimeout(() => {
            gameContent.classList.toggle('gameContent-not-active');
            headerRight.classList.toggle('header__right-not-active');
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    gameContent.style.opacity = 1;
                    headerRight.style.opacity = 1;
                })
            });
        }, 500);
    });

    gameboardButtons.forEach(elem => {
        elem.addEventListener('click', (e) => {
            gameController.makeAPlay(elem.getAttribute('data-index'));
        });
    });

    const updateScore = () => {
        scorePlayer1.innerHTML = gameController.getWins()[0];
        scorePlayer2.innerHTML = gameController.getWins()[1];
    }

    const updateBoard = () => {
        for (let i = 0; i < 9; i++) {
            gameboardButtons[i].innerHTML = gameBoard.getField(i); // updates DOM board according to js board
        }
    }

    const turnAnnounce = (sign) => {
        gameContentAnnouncement.innerHTML = `Turn of ${sign == 'x' ? 'X' : 'O'}`;
    }

    const drawAnnounce = () => {
        gameContentAnnouncement.innerHTML = `It is a draw`;
    }

    const roundWinAnnounce = (sign) => {
        gameContentAnnouncement.innerHTML = `Player ${sign.toUpperCase()} won ${gameController.getRoundCount()} round`;
    }

    const displayWin = (sign) => {
        setTimeout(() => {
            gameContent.style.cssText = `transition: opacity 1s;`;
            headerRight.style.cssText = `transition: opacity 1s;`;

            gameContent.style.opacity = 0;
            headerRight.style.opacity = 0;

            headerRight.addEventListener('transitionend', () => {
                headerRight.classList.toggle('header__right-not-active');
                gameContent.classList.toggle('gameContent-not-active');
            }, { once: true });
        }, 500)
    }

    return { updateScore, updateBoard, turnAnnounce, drawAnnounce, roundWinAnnounce, displayWin }
})();

const gameController = (function () {
    const player1 = createPlayer("x");
    const player2 = createPlayer("o");
    let turn = 0;
    let roundCount = 1;
    let wins1 = 0;
    let wins2 = 0;

    const getRoundCount = () => {
        return roundCount;
    }

    const getWins = () => {
        return [wins1, wins2];
    }

    const getCurrSign = () => {
        if (roundCount === 1 || roundCount === 3) {
            return turn % 2 == 0 ? player1.getSign() : player2.getSign(); // get curr sign (even = x)
        }
        else {
            return turn % 2 == 0 ? player2.getSign() : player1.getSign(); // get curr sign (even = o)
        }
    }

    const checkWin = () => {
        if (turn > 3) {
            const winCombinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];

            const indexesOfCurr = [];

            for (let i = 0; i < 9; i++) {
                if (gameBoard.getField(i) === getCurrSign()) { // get all indexes with the current sign
                    indexesOfCurr.push(i);
                }
            }

            let row3 = 0;

            for (let i = 0; i < winCombinations.length && !(row3 === 3); i++) {
                for (let j = 0; j < winCombinations[i].length; j++) {
                    // if index from win combination is in indexes of curr sign, then ++row3
                    if ((indexesOfCurr.filter((x) => x === winCombinations[i][j]).length) === 1) {
                        ++row3;
                    }
                    // if index from win combination is not in indexes of curr sign, then it is not a correct combination
                    else {
                        row3 = 0;
                        break;
                    }
                }
            }
            // if all three indexes from one of win combinations are in indexes of current sign, then win
            return row3 === 3;
        }

        return false;
    }

    const makeAPlay = (index) => {
        if (roundCount <= 3) {
            if (gameBoard.getField(index) == "") {
                gameBoard.setField(index, getCurrSign());

                if (checkWin()) {
                    if (getCurrSign() == 'x') { // round win for x
                        ++wins1;
                        displayController.roundWinAnnounce('x');
                        ++turn;
                        displayController.updateBoard();

                        if (wins1 !== 2) {
                            setTimeout(() => {
                                displayController.turnAnnounce('o'); // next round
                                displayController.updateScore();
                                gameBoard.reset();
                                displayController.updateBoard(); // clear board
                                turn = 0;
                            }, 1500);
                        }
                        else {
                            displayController.displayWin('x'); // game win for x
                        }
                    }
                    else { // round win for o
                        ++wins2;
                        displayController.roundWinAnnounce('o');
                        ++turn;
                        displayController.updateBoard();

                        if (wins2 !== 2) {
                            setTimeout(() => {
                                displayController.turnAnnounce('x'); // next round
                                displayController.updateScore();
                                gameBoard.reset();
                                displayController.updateBoard(); // clear board
                                turn = 0;
                            }, 1500);
                        }
                        else {
                            displayController.displayWin('o'); // game win for o
                        }
                    }

                    ++roundCount;
                }
                else {
                    ++turn;

                    if (turn === 9) {
                        displayController.drawAnnounce();
                        displayController.updateBoard();

                        setTimeout(() => {
                            displayController.turnAnnounce(getCurrSign()); // restart round
                            gameBoard.reset();
                            displayController.updateBoard(); // clear board
                            turn = 0;
                        }, 1500);
                    }
                    else {
                        displayController.turnAnnounce(getCurrSign());
                        displayController.updateBoard();
                    }
                }
            }
        }
    }

    return { getRoundCount, getWins, getCurrSign, checkWin, makeAPlay }
})();