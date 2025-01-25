class SceneManager {
    constructor() {
        this.scenes = {
            WELCOME: 'welcome',
            JOURNEY: 'journey',
            LAST: 'last'
        };
        this.currentScene = this.scenes.WELCOME;
    }

    switchScene(newScene) {
        this.currentScene = newScene;
    }

    getCurrentScene() {
        return this.currentScene;
    }
}

// Create global instance
const sceneManager = new SceneManager();