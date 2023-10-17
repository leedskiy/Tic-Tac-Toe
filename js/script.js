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
    const mainContainer = document.querySelector('.main__container');
    const startButton = document.querySelector('.startButton');
    const gameContent = document.querySelector('.gameContent');
    const gameboardButtons = document.querySelectorAll('.gameboard__button');

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
            updateBoard();
        });
    });

    const updateBoard = () => {
        for (let i = 0; i < 9; i++) {
            gameboardButtons[i].innerHTML = gameBoard.getField(i); // updates DOM board according to js board
        }
    }

    return { updateBoard }
})();

const gameController = (function () {
    const player1 = createPlayer("x");
    const player2 = createPlayer("o");
    let turn = 0;
    let roundCount = 1;
    let live = true;

    const makeAPlay = (index) => {
        if (live) {
            if (gameBoard.getField(index) == "") {
                ++turn;
                gameBoard.setField(index, getSign());
            }
            if (checkWin()) {
                console.log("win " + getSign());
                live = false;
            }
            else if (turn === 9) {
                console.log("draw");
            }
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
                if (gameBoard.getField(i) === getSign()) { // get all indexes with the current sign
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

    const getSign = () => {
        return turn % 2 == 1 ? player1.getSign() : player2.getSign(); // get curr sign (odd = x)
    }

    return { makeAPlay, checkWin, getSign }
})();