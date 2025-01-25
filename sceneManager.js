class SceneManager {
    constructor() {
        this.scenes = {
            WELCOME: 'welcome',
            JOURNEY: 'journey',
            LAST: 'last'
        };
        this.currentScene = this.scenes.WELCOME;
    }

    switchScene(newSceneName) {
        console.log(`Switching to scene: ${newSceneName}`);
        
        if (!this.scenes[newSceneName]) {
            console.error(`Scene ${newSceneName} not found!`);
            return;
        }

        // Clean up old scene if needed
        if (this.currentScene.instance && this.currentScene.instance.cleanup) {
            this.currentScene.instance.cleanup();
        }

        // Update current scene
        this.currentScene.name = newSceneName;
        
        // Setup new scene
        this.scenes[newSceneName].setup();
        
        console.log(`Successfully switched to ${newSceneName} scene`);
    }

    draw() {
        // Call current scene's draw method
        this.scenes[this.currentScene.name].draw();
    }

    mousePressed() {
        // Delegate mouse events to current scene
        this.scenes[this.currentScene.name].mousePressed();
    }
}

// Create global instance
//const sceneManager = new SceneManager();