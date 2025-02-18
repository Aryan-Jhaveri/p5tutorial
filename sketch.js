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

// Global scene manager instance
// Global scene manager instance
// Create a single instance of SceneManager
let mgr;

function setup() {
    createCanvas(windowWidth, windowHeight);
    mgr = new SceneManager();
    
    // Adds scenes to the manager
    mgr.addScene('WELCOME', WelcomeScene);
    mgr.addScene('JOURNEY', JourneyScene);
    mgr.addScene('LAST', LastScene);
    
    // Show the first scene
    mgr.showScene('WELCOME');
}

function draw() {
    // Let the SceneManager handle the drawing
    mgr.draw();
}

// Handle window resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if (mgr.getCurrentScene()) {
        mgr.getCurrentScene().windowResized();
    }
}
function mousePressed(event) {
    // Let the scene manager handle the event
    return mgr.mousePressed(event);
}

// Make sceneManager available globally for UI controls
window.getSceneManager = function() {
    return sceneManager;
}