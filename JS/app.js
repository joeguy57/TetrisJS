const  grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid > div"));
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById('start-button');
const width = 10;

//The Tetrimino
/**
 * ltetrimino to  display the L shape in its rotations
 * # #
 *   #
 *   #
 * @array {number[][]}
 */
const ltetrimino = [
    [1, width + 1, (2 * width) + 1,2],
    [width, width + 1, width + 2, (2 * width) +2],
    [1, (width +1), (2 * width) + 1,(2 * width)],
    [width, (2 * width), (2 * width) + 1, (2 * width) +2]
];
/**
 * otetrimino displays a square shape in its rotations
 * # #
 * # #
 *
 * @array {number[][]}
 */
const oTetrimino = [
    [0, 1,width,width+1],
    [0, 1,width,width+1],
    [0, 1,width,width+1],
    [0, 1,width,width+1]
];
/**
 *  zTetrimino displays skew shape and its rotations
 *  # #
 *    # #
 * @array {number[][]}
 */
const zTetrimino = [
    [(2 * width), (2 * width) + 1, width + 1, width + 2],
    [0, width, width +1, (2 * width) + 1],
    [(2 * width), (2 * width) + 1, width + 1, width + 2],
    [0, width, width +1, (2 * width) + 1]
];
/**
 * iTetrimino displays a straight lin
 * # # # #
 * @array {number[][]}
 */
const iTetrimino = [
    [1, width + 1, (2 * width) + 1,(3 * width) + 1],
    [width, width + 1, width + 2, width +3],
    [1, width + 1, (2 * width) + 1,(3 * width) + 1],
    [width, width + 1, width + 2, width +3]
]
/**
 * tTetrimino displays a t shape
 *   #
 * # # #
 * @type {*[][]}
 */
const tTetrimino = [
    [1, width, width + 1, width + 2],
    [1, (2 * width) + 1, (2 * width) + 2, (3 * width) + 1],
    [width, width + 1, width + 2, (2 * width) + 1],
    [1, width, width + 1, (2 * width) +1]
];

// Array of all available tetriminos
const theTetriminos = [ltetrimino, iTetrimino, zTetrimino, oTetrimino];

let currentPosition = 4;
let currentRotation = 0;
//select tetriminos randomly
let randomShape = Math.floor((Math.random()*theTetriminos.length));
//let randomRotation = Math.floor((Math.random()*theTetriminos[0].length));
let current = theTetriminos[randomShape][currentRotation];

//draws tetrimino
function draw() {
    current.forEach(index =>{
        squares[currentPosition + index].classList.add('tetrimino');
    })
    
}

//undraw the tetrimino
function undraw() {
    current.forEach(index =>{
        squares[currentPosition + index].classList.remove('tetrimino');
    })
}

//make tetrimino move down
const timerId = setInterval(moveDown, 1000)
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    stopFall();
}

//must prevent the shape from falling off the grid.
function stopFall(){
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        randomShape = Math.floor(Math.random() * theTetriminos.length);
        current = theTetriminos[randomShape][currentRotation];
        currentPosition = 4;
        draw()
    }
}