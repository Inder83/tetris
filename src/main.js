const colorsArr = ["", "blue", "cyan", "green", "orange", "purple", "red"];
const brickMatrix = {
    T: {
        matrix:
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ]
    },
    I: {
        matrix:
            [
                [0, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0]
            ]
    },
    L: {
        matrix:
            [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3]
            ]
    },
    O: {
        matrix:
            [
                [4, 4],
                [4, 4]
            ]
    },
    S: {
        matrix:
            [
                [0, 5, 5],
                [5, 5, 0],
                [0, 0, 0]
            ]
    },
    Z: {
        matrix:
            [
                [6, 6, 0],
                [0, 6, 6],
                [0, 0, 0]
            ]
    }
};

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const box = 16;
const brick = new Brick(brickMatrix.T.matrix, {x: canvas.width/2 - box, y: box}, colorsArr[1]);

let defaultColor = undefined;
const blockImages = [];
const bgImage = new Image();

let brickDropCounter = 0;
let brickDropInterval = 1000;
let lastTime = 0;

const tetris = new Game();
const tetrisController = new TetrisController(tetris);

function updateGame(time = 0) {
    const timeDifference = time - lastTime;

    lastTime = time;
    brickDropCounter += timeDifference;
    if(brickDropCounter > brickDropInterval){
        tetris.moveBrickDown();
    }
    tetris.drawGame();
    requestAnimationFrame(updateGame);
}
updateGame();
