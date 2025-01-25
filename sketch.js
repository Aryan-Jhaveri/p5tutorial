// Scene instances
let welcomeScene;
let journeyScene;
let lastScene;

let fft;
let song;
let res = 100   ;//
let baseAmp = 150;
let time = 0;
let PI;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Initialize scenes
    welcomeScene = new WelcomeScene();
    journeyScene = new JourneyScene();
    lastScene = new LastScene();
    
    // Setup all scenes
    welcomeScene.setup();
    journeyScene.setup();
    lastScene.setup();
}

function draw() {
    // Call the appropriate scene's draw method
    switch(sceneManager.getCurrentScene()) {
        case sceneManager.scenes.WELCOME:
            welcomeScene.draw();
            break;
        case sceneManager.scenes.JOURNEY:
            journeyScene.draw();
            break;
        case sceneManager.scenes.LAST:
            lastScene.draw();
            break;
    }
}

function mousePressed() {
    // Forward mouse events to current scene
    switch(sceneManager.getCurrentScene()) {
        case sceneManager.scenes.WELCOME:
            welcomeScene.mousePressed();
            break;
    }
}
function mouseWheel(event) {
    // Forward mouse wheel events to journey scene when active
    if (sceneManager.getCurrentScene() === sceneManager.scenes.JOURNEY) {
        return journeyScene.mouseWheel(event);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Update scenes if needed
    welcomeScene.setup(); // Recenter button
}