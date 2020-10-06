class Brick {
    constructor(matrix, pos, color){
        this.matrix = matrix;
        this.pos = pos;
        this.color = color;
    }

    /**
     * rotate brick matrix
     * @param dir
     */
    rotate(dir) {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < y; x++) {
                [
                    this.matrix[x][y],
                    this.matrix[y][x]
                ] = [
                    this.matrix[y][x],
                    this.matrix[x][y]
                ];
            }
        }

        if(dir > 0){
            this.matrix.forEach(row => row.reverse());
        }
        else{
            this.matrix.reverse();
        }
    }

    /**
     * moves brick to left/right direction
     * @param factor
     * @param dir
     */
    moveLeftRight(factor, dir) {
        brick.pos.x += (factor*dir);
    }

    /**
     * moves brick down
     * @param factor
     */
    moveDown(factor){
        brick.pos.y += factor;
    }
}
