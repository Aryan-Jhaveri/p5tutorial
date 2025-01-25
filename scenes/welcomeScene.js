class WelcomeScene {
    constructor() {
        this.startButtonX = 0;
        this.startButtonY = 0;
        this.buttonWidth = 200;
        this.buttonHeight = 60;
    }

    setup() {
        // Center the button
        this.startButtonX = windowWidth/2 - this.buttonWidth/2;
        this.startButtonY = windowHeight/2 - this.buttonHeight/2;
    }

    draw() {
        background(0);
        
        // Title
        this.drawtitle();
        
        // Start button 
        this.drawstartbutton();
    }

    drawtitle () {
        // Title
        push();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(32);
        text('The Merchant Poem', windowWidth/2, windowHeight/3);
        pop();
    }

    drawstartbutton () {
        // Start button
        push();
        fill(0);
        rect(this.startButtonX, this.startButtonY, this.buttonWidth, this.buttonHeight);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text('Start Journey', this.startButtonX + this.buttonWidth/2, this.startButtonY + this.buttonHeight/2);
        pop();
    }

    mousePressed() {
        // Check if mouse is over the button
        if (mouseX > this.startButtonX && 
            mouseX < this.startButtonX + this.buttonWidth &&
            mouseY > this.startButtonY && 
            mouseY < this.startButtonY + this.buttonHeight) {
            sceneManager.switchScene(sceneManager.scenes.JOURNEY);
        }
    }
}