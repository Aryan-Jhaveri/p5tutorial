class LastScene {
    constructor() {
        this.buttonWidth = 200;
        this.buttonHeight = 60;
        this.startButtonX = 0;
        this.startButtonY = 0;
    }

    setup() {
        // Center the button horizontally and position it below the text
        this.startButtonX = windowWidth/2 - this.buttonWidth/2;
        this.startButtonY = windowHeight/2 + 100; // Position button below thank you text
    }

    draw() {
        background(0);
        
        // End text
        push();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(32);
        text('End', windowWidth/2, windowHeight/3);
        
        textSize(24);
        text('Thank you', windowWidth/2, windowHeight/2);
        pop();
        
        // Return to start button
        push();
        // Button background with slight transparency
        fill(100, 100, 100, 200);
        rect(this.startButtonX, this.startButtonY, this.buttonWidth, this.buttonHeight, 10); // Added rounded corners
        
        // Button text
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text('Return Home', 
            this.startButtonX + this.buttonWidth/2, 
            this.startButtonY + this.buttonHeight/2
        );
        pop();
    }

    mousePressed() {
        // Check if mouse is over the button
        if (mouseX > this.startButtonX && 
            mouseX < this.startButtonX + this.buttonWidth &&
            mouseY > this.startButtonY && 
            mouseY < this.startButtonY + this.buttonHeight) {
            sceneManager.switchScene(sceneManager.scenes.WELCOME);
        }
    }

    windowResized() {
        // Update button position on window resize
        this.setup();
    }
}