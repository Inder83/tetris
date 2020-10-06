class TetrisController {
    constructor(view){
        this.view = view;
        this.initController();
    }

    initController() {
        this.setupEvents();
        this.loadBg();
    }

    setupEvents() {
        document.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    loadBg(){
        const scope = this;
        bgImage.src = 'src/assets/images/background.png';

        bgImage.onload = function(){
            scope.view.renderBgImage();
        }
    }

    onKeyDown(event){
        if(event.keyCode === 39){
            this.view.moveBrick(1);
        }
        else if(event.keyCode === 37){
            this.view.moveBrick(-1);
        }
        else if(event.keyCode === 40){
            this.view.moveBrickDown();
        }
        else if(event.keyCode === 38){
            this.view.rotateBrick(1);
        }
    }
}
