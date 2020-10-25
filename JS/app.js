const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid > div"));
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById('start-button');
const width = 10;
let nextRand = 0;
let timerId;
let score = 0;
const color = [
    '#DC143C',
    '#2AB7CA',
    '#FED65D',
    '#ab87ff',
    '#fface4'
]

//The Tetrimino
/**
 * ltetrimino to  display the L shape in its rotations
 * # #
 *   #
 *   #
 * @array {number[][]}
 */
const ltetrimino = [
    [1, width + 1, (2 * width) + 1, 2],
    [width, width + 1, width + 2, (2 * width) + 2],
    [1, (width + 1), (2 * width) + 1, (2 * width)],
    [width, (2 * width), (2 * width) + 1, (2 * width) + 2]
];
/**
 * otetrimino displays a square shape in its rotations
 * # #
 * # #
 *
 * @array {number[][]}
 */
const oTetrimino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];
/**
 *  zTetrimino displays skew shape and its rotations
 *  # #
 *    # #
 * @array {number[][]}
 */
const zTetrimino = [
    [(2 * width), (2 * width) + 1, width + 1, width + 2],
    [0, width, width + 1, (2 * width) + 1],
    [(2 * width), (2 * width) + 1, width + 1, width + 2],
    [0, width, width + 1, (2 * width) + 1]
];
/**
 * iTetrimino displays a straight lin
 * # # # #
 * @array {number[][]}
 */
const iTetrimino = [
    [1, width + 1, (2 * width) + 1, (3 * width) + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, (2 * width) + 1, (3 * width) + 1],
    [width, width + 1, width + 2, width + 3]
]
/**
 * tTetrimino displays a t shape
 *   #
 * # # #
 * @type {*[][]}
 */
const tTetrimino = [
    [1, width, width + 1, width + 2],
    [1, (width) + 1, (width) + 2, (2 * width) + 1],
    [width, width + 1, width + 2, (2 * width) + 1],
    [1, width, width + 1, (2 * width) + 1]
];

// Array of all available tetriminos
const theTetriminos = [ltetrimino, iTetrimino, zTetrimino, oTetrimino, tTetrimino];

let currentPosition = 4;
let currentRotation = 0;
//select tetriminos randomly
let randomShape = Math.floor((Math.random() * theTetriminos.length));
//let randomRotation = Math.floor((Math.random()*theTetriminos[0].length));
let current = theTetriminos[randomShape][currentRotation];

//draws tetrimino
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetrimino');
        squares[currentPosition + index].style.backgroundColor = color[randomShape];
    })

}

//undraw the tetrimino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetrimino');
        squares[currentPosition + index].style.backgroundColor = '';
    })
}

/**
 * Keycodes for tetrimino
 *  ^ = 36
 *  > = 39
 *  < = 37
 *  down = 40
 */
function control(e) {
    switch (e.key) {
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowUp":
            rotate();
            break;
        case "ArrowDown":
            moveDown();
            break;
    }
}

document.addEventListener('keyup', control);

//make tetrimino move down

function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    stopFall();
}

//must prevent the shape from falling off the grid.
function stopFall() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        randomShape = nextRand;
        nextRand = Math.floor(Math.random() * theTetriminos.length);
        current = theTetriminos[randomShape][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

//set limit on left allow movement of left unless at limit
// index mod 10 = 0
function moveLeft() {
    undraw();
    const isLeftEdge = current.some(index => ((currentPosition + index) % width) === 0);
    if (!isLeftEdge) {
        currentPosition--;
    }
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition++;
    }
    draw();
}

function moveRight() {
    undraw();
    const isRightEdge = current.some(index => ((currentPosition + index) % width) === width - 1);
    if (!isRightEdge) {
        currentPosition++;
    }
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition--;
    }
    draw();
}

function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
        currentRotation = 0;
    }
    current = theTetriminos[randomShape][currentRotation];
    draw();

}

//show mini-grid
const nextSquare = document.querySelectorAll(".mini-grid > div");
const miniWidth = 4;

let displayIndex = 0;

//The tetrimino without rotation
const nextTetrimino = [
    [1, miniWidth + 1, (2 * miniWidth) + 1, 2], //l
    [1, miniWidth + 1, (2 * miniWidth) + 1, (3 * miniWidth) + 1],//i
    [(2 * miniWidth), (2 * miniWidth) + 1, miniWidth + 1, miniWidth + 2],//z
    [0, 1, miniWidth, miniWidth + 1],//o
    [1, miniWidth, miniWidth + 1, miniWidth + 2]//t
];

//display shape
function displayShape() {
    nextSquare.forEach(square => {
        square.classList.remove('tetrimino');
        square.style.backgroundColor = '';
    });
    nextTetrimino[nextRand].forEach(index => {
            nextSquare[displayIndex + index].classList.add('tetrimino');
            nextSquare[displayIndex + index].style.backgroundColor = color[nextRand];
        }
    );
}

//add functionality to start and pause button
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        draw()
        timerId = setInterval(moveDown, 1000);
        nextRand = Math.floor(Math.random() * theTetriminos.length);
        displayShape()
    }
})

function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetrimino');
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'endGame';
        clearInterval(timerId);
    }
}

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);