class SceneManager {
    constructor() {
        // Scene storage - now stores both name and constructor
        this.scenes = [];
        this.currentSceneIndex = -1;
        this.currentScene = null;
        
        // Debug mode flag
        this.debug = false;
        
        // Wire p5.js events
        this.wireEvents();
    }
    
    // Enhanced scene addition that maintains order
    addScene(sceneName, sceneClass) {
        this.scenes.push({
            name: sceneName,
            class: sceneClass,
            instance: null
        });
        
        // If this is our first scene, initialize it
        if (this.scenes.length === 1) {
            this.showScene(sceneName);
        }
    }
    
    // New method to support automatic progression
    showNextScene() {
        const nextIndex = (this.currentSceneIndex + 1) % this.scenes.length;
        const nextScene = this.scenes[nextIndex];
        this.showScene(nextScene.name);
    }
    
    // Enhanced scene switching with better lifecycle management
    showScene(sceneName) {
        // Find requested scene
        const sceneIndex = this.scenes.findIndex(s => s.name === sceneName);
        if (sceneIndex === -1) {
            console.error(`Scene ${sceneName} not found`);
            return;
        }
        
        // Clean up current scene
        if (this.currentScene) {
            if (this.currentScene.cleanup) {
                this.currentScene.cleanup();
            }
            // Allow scene to save state before destruction
            if (this.currentScene.onExit) {
                this.currentScene.onExit();
            }
        }
        
        // Update scene tracking
        this.currentSceneIndex = sceneIndex;
        const sceneInfo = this.scenes[sceneIndex];
        
        // Create new scene instance
        sceneInfo.instance = new sceneInfo.class(this);
        this.currentScene = sceneInfo.instance;
        
        // Initialize new scene
        if (this.currentScene.setup) {
            this.currentScene.setup();
        }
        
        // Call enter method if it exists (from other approach)
        if (this.currentScene.enter) {
            this.currentScene.enter();
        }
    }
    
    // Find a scene by class (from other approach)
    findScene(sceneClass) {
        const scene = this.scenes.find(s => s.class === sceneClass);
        return scene ? scene.instance : null;
    }
    
    handleEvent(eventName, event) {
        const currentScene = this.getCurrentScene();
        if (currentScene && typeof currentScene[eventName] === 'function') {
            try {
                return currentScene[eventName](event);
            } catch (error) {
                console.error(`Error in ${eventName} handler:`, error);
                return false;
            }
        }
        return true; // Allow event to propagate if no handler exists
    }

    // Specific method for mouse events to ensure proper handling
    mousePressed(event) {
        return this.handleEvent('mousePressed', event);
    }
    
    // Wire p5.js events with more flexibility
    wireEvents() {
        const p5Events = [
            "mouseClicked", "mousePressed", "mouseReleased",
            "mouseMoved", "mouseDragged", "doubleClicked",
            "mouseWheel", "keyPressed", "keyReleased",
            "keyTyped", "touchStarted", "touchMoved", "touchEnded"
        ];
        
        p5Events.forEach(eventName => {
            window[eventName] = (...args) => this.handleEvent(eventName, ...args);
        });
    }
    
    draw() {
        if (!this.currentScene) return;
        
        if (this.currentScene.draw) {
            this.currentScene.draw();
        }
        
        if (this.debug) {
            this.drawDebugInfo();
        }
    }
    
    drawDebugInfo() {
        push();
        fill(255);
        noStroke();
        textSize(16);
        text(`Current Scene: ${this.scenes[this.currentSceneIndex].name}`, 10, 20);
        text(`Scene Index: ${this.currentSceneIndex}/${this.scenes.length - 1}`, 10, 40);
        pop();
    }
    
    getCurrentScene() {
        return this.currentScene;
    }
    
    getCurrentSceneName() {
        return this.scenes[this.currentSceneIndex]?.name;
    }
}