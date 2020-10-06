class Game {
    constructor(){
        this.gameScore = 0;
        this.init();
    }

    init(){
        this.loadBlockImages();
        this.backDrop = this.createBackDrop(10, 20);
    }

    set backDrop(value){
        this.backDropArr = value;
    }

    get backDrop(){
        return this.backDropArr;
    }

    renderBgImage(){
        context.fillStyle = context.createPattern(bgImage, 'repeat');
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * updates the brick to new matrix and color and reposition it
     * @param type
     */
    createBrickMatrix(type) {
        brick.matrix = brickMatrix[type].matrix;
        defaultColor = brickMatrix[type].color;
        brick.pos = this.resetBrickPos();
    }

    /**
     * creates a backdrop/bg virtual matrix
     * @param w is width of matrix
     * @param h is height of matrix
     * @returns {Array}
     */
    createBackDrop(w, h) {
        const matrix = [];
        while(h--){
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    /**
     * gets a random brick
     */
    resetBrick(){
        const bricksType = "TILOSZ";
        const randomType = bricksType[bricksType.length * Math.random() | 0];
        this.createBrickMatrix(randomType);
        this.checkResetGame();

    }

    /**
     * check if game is in reset position
     */
    checkResetGame(){
        if(this.detectCollision(this.backDrop, brick)){
            this.backDrop.forEach(row => row.fill(0));
            this.score = 0;
        }
    }

    /**
     * loads all small blocks to create bricks
     */
    loadBlockImages() {
        colorsArr.forEach((value, index) => {
            if(value !== ""){
                blockImages[index] = new Image();
                blockImages[index].src = 'src/assets/images/block_'+value+'.png';
            }
        });
    }

    /**
     * helper function - draws shape from matrix
     * @param matrix
     * @param offset
     */
    drawShape(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if(value !== 0){
                    const boxX = x * box;
                    const boxY = y * box;
                    context.fillStyle = context.createPattern(blockImages[value], 'repeat');
                    context.fillRect(boxX + offset.x,
                        boxY + offset.y, box, box);
                }
            });
        });
    }

    /**
     * checks if there is a collision
     * @param backDrop
     * @param brick
     * @returns {boolean}
     */
    detectCollision(backDrop, brick) {
        const [matrix, pos] = [brick.matrix, brick.pos];
        for(let y = 0; y < matrix.length; y++){
            for(let x = 0; x < matrix[y].length; x++){
                const value = matrix[y][x];
                const posX = pos.x / box;
                const posY = pos.y / box;
                //console.log(value, this.backDrop, y, x, posX, posY);
                if(value !== 0 && (backDrop[y + posY] && backDrop[y + posY][x + posX]) !== 0){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * checks side wall collision and bounce brick back
     * @param direction
     */
    checkSideWallCollision(direction) {
        const pos = brick.pos.x;
        let moveCounter = 1;
        while(this.detectCollision(this.backDrop, brick)){
            brick.moveLeftRight(box, moveCounter);
            moveCounter = -(moveCounter + (moveCounter > 0 ? 1 : -1));
            if(moveCounter > brick.matrix[0].length){
                brick.rotate(brick.matrix, direction);
                brick.pos.x = pos;
                return;
            }
        }
    }

    /**
     * merge matrix of brick and backDrop
     * @param backDrop
     * @param brick
     */
    mergeMatrix(backDrop, brick){
        brick.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if(value !== 0){
                    const bdPosX = brick.pos.x / box;
                    const bdPosY = brick.pos.y / box;
                    backDrop[y + bdPosY][x + bdPosX] = value;
                }
            });
        });
    }

    resetBrickPos() {
        return {x: canvas.width/2 - box, y: box}
    }

    /**
     * checks if there is a winning sequence in matrix
     * @returns {number}
     */
    detectWinning() {
        let line = 0;
        row: for(let y = this.backDrop.length - 1; y > 0; y--){
            for(let x = 0; x < this.backDrop[y].length; x++){
                if(this.backDrop[y][x] === 0){
                    continue row;
                }
            }

            const rowToDelete = this.backDrop.splice(y, 1)[0].fill(0);
            this.backDrop.unshift(rowToDelete);
            y++;
            line++;
        }
        return line;
    }

    calculateScore(lines){
        this.score += lines*10;
        //console.log(this.score);
    }

    get score(){
        return this.gameScore;
    }

    set score(score){
        this.gameScore = score;
        document.getElementById("score").innerText = score;
    }

    /**
     * move brick to left / right direction
     * @param direction
     */
    moveBrick(direction) {
        brick.moveLeftRight(box, direction);
        if(this.detectCollision(this.backDrop, brick)){
            brick.moveLeftRight(box, -direction);
        }
    }

    /**
     * moves brick down and check other actions to perform
     */
    moveBrickDown() {
        brick.moveDown(box);
        if(this.detectCollision(this.backDrop, brick)){
            brick.moveDown(-box);
            this.mergeMatrix(this.backDrop, brick);
            this.resetBrick();
            this.calculateScore(this.detectWinning());
        }
        brickDropCounter = 0;
    }

    /**
     * rotate brick
     * @param direction
     */
    rotateBrick(direction) {
        brick.rotate(brick.matrix, direction);
        this.checkSideWallCollision(direction);
    }

    drawGame(){
        this.renderBgImage();

        this.drawShape(this.backDrop, {x: 0, y: 0});
        this.drawShape(brick.matrix, brick.pos);
    }
}
