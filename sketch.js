// Scene instances
let welcomeScene;
let journeyScene;
let lastScene;
let sceneManager;

let fft;
let song;
let res = 100   ;//
let baseAmp = 150;
let time = 0;
let PI;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    sceneManager = new SceneManager();
    
    // Setup all scenes
    sceneManager.welcomeScene.setup();
    sceneManager.journeyScene.setup();
    sceneManager.lastScene.setup();
}

function draw() {

    // Draw current scene
    switch(sceneManager.getCurrentScene()) {
        case sceneManager.scenes.WELCOME:
            sceneManager.welcomeScene.draw();
            break;
        case sceneManager.scenes.JOURNEY:
            sceneManager.journeyScene.draw();
            break;
        case sceneManager.scenes.LAST:
            sceneManager.lastScene.draw();
            break;
    }
}

function mousePressed() {
    switch(sceneManager.getCurrentScene()) {
        case sceneManager.scenes.WELCOME:
            sceneManager.welcomeScene.mousePressed();
            break;
        case sceneManager.scenes.JOURNEY:
            sceneManager.journeyScene.mousePressed();
            break;
        case sceneManager.scenes.LAST:
            sceneManager.lastScene.mousePressed();
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