let welcomeScene;
class WelcomeScene {
  constructor() {
    this.sceneManager = null;

    // Visual elements
    this.stars = [];
    this.clouds = [];
    this.cloudImages = [];
    this.moon = [];
    this.floatingMerchant = null;
    
    // Animation properties
    this.yoff = WelcomeScene.VISUAL_SETTINGS.WAVE.Y_OFFSET_START;
    this.yRange = {
      min: 450,
      max: 460
    };
    
    // Asset storage
    this.assets = {
      merchantImage: null,
      moonImage: null
    };
    
    // Canvas dimensions
    this.canvasw = 0;
    this.canvash = 0;
    this.buttonWidth = 0;
    this.buttonHeight = 0;
    this.startButtonX = 0;
    this.startButtonY = 0;

    // Additional class definitions
    this.Star = class {
        constructor() {
          this.reset();
          this.initializePosition();
        }

        initializePosition() {
          this.xPercent = random(0, 1);
          this.yPercent = random(0, 1);
          this.updatePosition();
        }

        reset() {
          const windowDiagonal = sqrt(windowWidth * windowWidth + windowHeight * windowHeight);
          this.baseSize = random(WelcomeScene.VISUAL_SETTINGS.STAR_SIZE.MIN, 
                              WelcomeScene.VISUAL_SETTINGS.STAR_SIZE.MAX) * 
                          (windowDiagonal / 1500);
          
          this.opacity = map(
            this.baseSize,
            WelcomeScene.VISUAL_SETTINGS.STAR_SIZE.MIN * (windowDiagonal / 1500),
            WelcomeScene.VISUAL_SETTINGS.STAR_SIZE.MAX * (windowDiagonal / 1500),
            WelcomeScene.VISUAL_SETTINGS.STAR_OPACITY.MIN,
            WelcomeScene.VISUAL_SETTINGS.STAR_OPACITY.MAX
          );

          this.twinkleSpeed = random(0.02, 0.05);
          this.twinklePhase = random(TWO_PI);
        }

        updatePosition() {
          this.x = this.xPercent * windowWidth;
          this.y = this.yPercent * windowHeight;
        }

        handleResize() {
          this.reset();
          this.updatePosition();
        }

        update() {
          this.opacity = map(
            sin(frameCount * this.twinkleSpeed + this.twinklePhase),
            -1, 1,
            WelcomeScene.VISUAL_SETTINGS.STAR_OPACITY.MIN,
            WelcomeScene.VISUAL_SETTINGS.STAR_OPACITY.MAX
          );
        }

        display() {
          noStroke();
          fill(255, 255, 255, this.opacity);
          ellipse(this.x, this.y, this.baseSize, this.baseSize);
        }
      };

      // Cloud class manages individual cloud elements in the scene
      this.Cloud = class {
        constructor(img, speed) {
          this.img = img;
          this.speed = speed * 0.3;
          this.initializeCloud();
        }

        initializeCloud() {
          // Set initial position as percentages for responsiveness
          this.xPercent = random(0, 1);
          this.yPercent = random(0, 0.2);
          this.updateDimensions();
          
          // Animation properties for smooth movement and fading
          this.opacity = 0;
          this.targetOpacity = random(300, 400);
          this.fadeSpeed = 0.0005;
          this.ySpeed = random(0.001, 0.002);
          this.yAmplitude = random(5, 10);
          
          // Cloud lifecycle management
          this.lifespan = random(600, 1000);
          this.age = 0;
        }

        updateDimensions() {
          // Update position and size based on window dimensions
          this.x = this.xPercent * windowWidth;
          this.y = this.yPercent * windowHeight;
          this.originalY = this.y;
          this.width = windowWidth * 0.2;
          this.height = this.width * 0.66;
        }

        update() {
          this.age++;
          // Horizontal movement
          this.x += this.speed;
          // Vertical floating motion
          this.y = this.originalY + sin(frameCount * this.ySpeed) * this.yAmplitude;

          // Handle cloud lifecycle with smooth transitions
          if (this.age < 60) {
            // Fade in
            this.opacity = lerp(this.opacity, this.targetOpacity, 0.02);
          } else if (this.age > this.lifespan - 100) {
            // Fade out
            this.opacity = lerp(this.opacity, 0, 0.02);
          }

          // Reset cloud when it moves off screen or completes lifecycle
          if (this.age > this.lifespan || this.x > windowWidth + this.width) {
            this.reset();
          }
        }

        reset() {
          this.initializeCloud();
        }

        handleResize() {
          this.updateDimensions();
        }

        display() {
          push();
          if (this.img && this.img.width > 0) {
            tint(255, this.opacity);
            image(this.img, this.x, this.y, this.width, this.height);
          }
          pop();
        }
    };

    // Moon class handles the moon's display and gentle floating animation
    this.Moon = class {
      constructor(img) {
        this.img = img;
        this.calculateDimensions();
        // Properties for floating animation
        this.floatSpeed = 0.002;
        this.floatAmplitude = 15;
        this.floatOffset = 0;
      }

      calculateDimensions() {
        // Position moon in the right portion of the screen
        this.leftBoundary = (windowWidth * 5) / 7;
        this.size = windowWidth * 0.2;
        this.x = this.leftBoundary + (windowWidth - this.leftBoundary) / 2;
        this.y = windowHeight * 0.15;
      }

      update() {
        // Calculate vertical floating motion
        this.floatOffset = sin(frameCount * this.floatSpeed) * this.floatAmplitude;
      }

      display() {
        push();
        tint(255, 220);
        image(
          this.img,
          this.x - this.size / 2,
          this.y + this.floatOffset - this.size / 2,
          this.size,
          this.size
        );
        pop();
      }

      handleResize() {
        this.calculateDimensions();
      }
    };

    // FloatingImage class manages the merchant character's movement
    this.FloatingImage = class {
      constructor(img) {
        this.img = img;
        this.initializeProperties();
      }

      initializeProperties() {
        // Define position constraints
        this.xMin = 100;
        this.xMax = 200;
        this.yMin = 330;
        this.yMax = 500;

        // Set initial position and dimensions
        this.x = (this.xMin + this.xMax) / 2;
        this.y = (this.yMin + this.yMax) / 2;
        this.width = 230;
        this.height = 200;

        // Physics properties for realistic movement
        this.velocity = createVector(0, 0);
        this.dampening = 0.96;
        this.waveInfluenceStrength = 0.04;
        this.prevWaveHeight = 0;
      }

      getWaveHeightAtPosition(xoff, yoff) {
        return map(
          noise(this.x * WelcomeScene.VISUAL_SETTINGS.WAVE.NOISE_SCALE + xoff, yoff),
          0, 1,
          this.yMin,
          this.yMax
        );
      }

      update() {
        // Calculate wave influence on movement
        let currentWaveHeight = this.getWaveHeightAtPosition(0, this.yoff);
        let waveVelocity = (currentWaveHeight - this.prevWaveHeight) * this.waveInfluenceStrength;

        // Apply physics
        this.velocity.y += waveVelocity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Constrain position
        this.x = constrain(this.x, this.xMin, this.xMax);
        this.y = constrain(this.y, this.yMin, this.yMax);

        // Apply dampening
        this.velocity.mult(this.dampening);
        this.prevWaveHeight = currentWaveHeight;
      }

      display() {
        push();
        image(
          this.img,
          this.x - this.width / 2,
          this.y - this.height / 2,
          this.width,
          this.height
        );
        pop();
      }
    };
  }
  preload() {
    // Load images
    this.assets.merchantImage = loadImage("./assets/merch.png", 
      () => console.log("Merchant image loaded successfully"),
      (err) => console.error("Failed to load merchant image:", err)
    );
    
    this.assets.moonImage = loadImage("./assets/moon.png",
      () => console.log("Moon image loaded successfully"),
      (err) => console.error("Failed to load moon image:", err)
    );
    
    // Load cloud images
    for (let i = 1; i <= 4; i++) {
      loadImage(`./assets/cloud${i}.png`, 
        (img) => {
          this.cloudImages[i - 1] = img;
          console.log(`Cloud image ${i} loaded successfully`);
        },
        (err) => console.error(`Failed to load cloud${i}.png:`, err)
      );
    }
  }

  setup() {
    this.canvasw = windowWidth;
    this.canvash = windowHeight;
    createCanvas(this.canvasw, this.canvash);

    // Initialize visual elements
    this.moon = new this.Moon(this.assets.moonImage);
    this.initializeStars();
    this.initializeInterface();
    this.setupClouds();
    
    
    //Initialize merchant
    this.floatingMerchant = new this.FloatingImage(this.assets.merchantImage);
    
    
    // Error checking for required assets
    if (!this.assets.moonImage || !this.assets.merchantImage) {
      console.error('Required assets not loaded properly');
    }
  }

  initializeStars() {
    for (let i = 0; i < WelcomeScene.VISUAL_SETTINGS.STAR_COUNT; i++) {
        console.log('init stars');
        this.stars.push(new this.Star(this));
        }
  }
  
  initializeInterface() {
      this.buttonWidth = min(this.canvasw * WelcomeScene.VISUAL_SETTINGS.CANVAS.BUTTON_WIDTH_PERCENT, 
                       WelcomeScene.VISUAL_SETTINGS.CANVAS.MAX_BUTTON_WIDTH);
      this.buttonHeight = min(this.canvash * WelcomeScene.VISUAL_SETTINGS.CANVAS.BUTTON_HEIGHT_PERCENT,
                        WelcomeScene.VISUAL_SETTINGS.CANVAS.MAX_BUTTON_HEIGHT);
      this.updateButtonPosition();
  }
  
  setupClouds() {
  for (let i = 0; i < this.cloudImages.length * 3; i++) {
    this.clouds.push(new this.Cloud(
      this.cloudImages[i % this.cloudImages.length],
      random(0.1, 0.3)
    ));
  }
  }

  draw() {
      // Clear the canvas with a semi-transparent black
      background(0, 45);

      // Layer 1: Deepest background elements
      this.drawStarryBackground();
      
      
      // Layer 2: Moon in the background
      this.moon.update();
      this.moon.display();
      
    
      // Layer 3: Clouds floating in front of the moon
      this.drawClouds();
      

      // Layer 4: Ocean waves
      this.drawWave();
      

      // Layer 5: Merchant character in the foreground
      this.floatingMerchant.update();
      this.floatingMerchant.display();
      
        
      // Layer 6: UI elements always on top
      this.drawStartButton();
      this.drawTitle();
      
  }

  drawStarryBackground() {
      this.stars.forEach(star => {
        star.update();
        star.display();
    });
  }
  
  drawClouds() {
    this.clouds.forEach(cloud => {
      cloud.update();
      cloud.display();
    });
  }
  
  drawWave() {
  const t = frameCount * 0.0003; // Time variable for texture animation
  
  // Draw three wave layers with different properties
  for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
    push();
    
    // Configure wave layer properties
    const alpha = map(waveIndex, 0, 2, 300, 50);
    const waveColor = color(55, 78, 135, alpha);
    
    // Calculate wave boundaries
    const yMin = this.yRange.min;
    const yMax = this.yRange.max;
    
    // Create the main wave shape
    beginShape();
    noStroke();
    fill(waveColor);
    
    // Generate wave points using Perlin noise
    const wavePoints = [];
    let xoff = 0;
    
    // Create wave vertices
    vertex(-20, height);
    for (let x = -20; x <= width + 20; x += WelcomeScene.VISUAL_SETTINGS.WAVE.STEP) {
      const y = map(
        noise(xoff, this.yoff + waveIndex * 0.5),
        0, 1,
        yMin, yMax
      );
      vertex(x, y);
      wavePoints.push({ x, y });
      xoff += WelcomeScene.VISUAL_SETTINGS.WAVE.NOISE_SCALE;
    }
    vertex(width + 20, height);
    endShape(CLOSE);
    
    // Add pixelated texture within the wave shape
    this.addWaveTexture(wavePoints, waveColor, alpha, t, waveIndex);
    
    pop();
  }
  
  // Update noise offset for continuous wave movement
  this.yoff += WelcomeScene.VISUAL_SETTINGS.WAVE.Y_INCREMENT;
  }
  
  addWaveTexture(wavePoints, waveColor, alpha, t, waveIndex) {
  const pixelSize = 20;
  
  for (let x = 0; x < width; x += pixelSize) {
    // Find wave height at current x position
    const waveX = x + 20;
    const index = constrain(
      floor(waveX / WelcomeScene.VISUAL_SETTINGS.WAVE.STEP),
      0,
      wavePoints.length - 2
    );
    
    // Interpolate wave height
    const waveHeight = lerp(
      wavePoints[index].y,
      wavePoints[index + 1].y,
      (waveX % WelcomeScene.VISUAL_SETTINGS.WAVE.STEP) / WelcomeScene.VISUAL_SETTINGS.WAVE.STEP
    );
    
    // Draw textured pixels from wave height to bottom
    for (let y = floor(waveHeight); y < height; y += pixelSize) {
      const noiseVal = noise(0.06 * x * t, 0.03 * y + waveIndex * 0.5);
      const brightness = map(noiseVal, 0, 2, 0.7, 1);
      
      // Apply noise-based brightness to wave color
      const pixelColor = color(
        red(waveColor) * brightness,
        green(waveColor) * brightness,
        blue(waveColor) * brightness,
        alpha
      );
      
      fill(pixelColor);
      noStroke();
      rect(x, y, pixelSize, pixelSize);
    }
  }
  }

  drawTitle() {
      push();
      // Set text properties
      fill(WelcomeScene.TYPOGRAPHY.TITLE.COLOR);
      textAlign(CENTER, CENTER);
      textFont(WelcomeScene.TYPOGRAPHY.TITLE.FONT);
      textSize(WelcomeScene.TYPOGRAPHY.TITLE.SIZE);
      textLeading(WelcomeScene.TYPOGRAPHY.TITLE.SIZE * WelcomeScene.TYPOGRAPHY.TITLE.LEADING);

      // Add gentle floating motion to title
      const titleY = this.canvash / 3 + sin(frameCount * 0.02) * 5;

      // Add subtle text shadow for depth
      this.drawTextWithShadow(
        "The Merchant Poem",
        this.canvasw / 2,
        titleY,
        color(0, 0, 0, 100),  // Shadow color
        2                      // Shadow offset
      );
    
      pop();
  }
  

  drawStartButton() {
    // Start button
    push();
    fill(0);
    rect(this.startButtonX, this.startButtonY, this.buttonWidth, this.buttonHeight);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text('Start Journey', this.startButtonX + this.buttonWidth/2, this.startButtonY + this.buttonHeight/2);
    pop();

    /** 
    push();
    const buttonHover = this.isMouseOverButton();

    // Draw button with hover effect
    fill(buttonHover ? color(120, 120, 120, 200) : color(100, 100, 100, 180));


    // Draw button text
    fill(WelcomeScene.TYPOGRAPHY.BUTTON.COLOR);
    textAlign(CENTER, CENTER);
    textFont(WelcomeScene.TYPOGRAPHY.BUTTON.FONT);
    textSize(WelcomeScene.TYPOGRAPHY.BUTTON.SIZE);
    textLeading(WelcomeScene.TYPOGRAPHY.BUTTON.SIZE * WelcomeScene.TYPOGRAPHY.BUTTON.LEADING);

    // Draw text with subtle shadow
    this.drawTextWithShadow(
      "Start Journey",
      this.startButtonX + this.buttonWidth / 2,
      this.startButtonY + this.buttonHeight / 2,
      color(0, 0, 0, 80),
      1
    );
    pop();
    */
  }
  
  drawTextWithShadow(txt, x, y, shadowColor, offset) {
    // Draw shadow
    fill(shadowColor);
    text(txt, x + offset, y + offset);

    // Draw main text
    fill(WelcomeScene.TYPOGRAPHY.TITLE.COLOR);
    text(txt, x, y);
  }
  
  isMouseOverButton() {
  const isOver = mouseX > this.startButtonX &&
    mouseX < this.startButtonX + this.buttonWidth &&
    mouseY > this.startButtonY &&
    mouseY < this.startButtonY + this.buttonHeight;

    console.log(`Mouse position: (${mouseX}, ${mouseY})`);
    console.log(`Button bounds: (${this.startButtonX}, ${this.startButtonY}) to (${this.startButtonX + this.buttonWidth}, ${this.startButtonY + this.buttonHeight})`);
    console.log(`Is over button: ${isOver}`);
    
    return isOver;
  }
  
  updateButtonPosition() {
    this.startButtonX = this.canvasw / 2 - this.buttonWidth / 2;
    this.startButtonY = this.canvash / 2 - this.buttonHeight / 2;
  }
  
  windowResized() {
    // Update canvas dimensions
      this.canvasw = windowWidth;
      this.canvash = windowHeight;
      resizeCanvas(this.canvasw, this.canvash);

      // Update all responsive elements
      this.stars.forEach(star => star.handleResize());
      //clouds.forEach(cloud => cloud.handleResize());
      //moon.handleResize();
      

      /** Update interface elements
      buttonWidth = min(canvasw * VISUAL_SETTINGS.CANVAS.BUTTON_WIDTH_PERCENT,
                       VISUAL_SETTINGS.CANVAS.MAX_BUTTON_WIDTH);
      buttonHeight = min(canvash * VISUAL_SETTINGS.CANVAS.BUTTON_HEIGHT_PERCENT,
                        VISUAL_SETTINGS.CANVAS.MAX_BUTTON_HEIGHT);
      updateButtonPosition();
      */

      /**Update wave boundaries
      yRange = {
        min: canvash * 0.6,
        max: canvash * 0.8
      };
      */
    }
  
    mousePressed() {
      if (this.isMouseOverButton()) {
          console.log("Button clicked, initiating scene transition...");
          
          // Add error checking
          if (!this.sceneManager) {
              console.error('SceneManager not initialized in WelcomeScene');
              return;
          }
          
          // Use the scenes enum from SceneManager
          this.sceneManager.switchScene(this.sceneManager.scenes.JOURNEY);
      }
  }

  // Add debug method
  debugSceneManager() {
      console.log('SceneManager Status:', {
          exists: !!this.sceneManager,
          scenes: this.sceneManager ? Object.keys(this.sceneManager.scenes) : 'none',
          currentScene: this.sceneManager ? this.sceneManager.getCurrentScene() : 'none'
      });
  }

  /** 
    mousePressed() {
        if (this.isMouseOverButton()) {
            console.log("switching scene");
            // Use the stored sceneManager reference
            sceneManager.switchScene(sceneManager.scenes.JOURNEY);
        }
    }
  */
}

WelcomeScene.TYPOGRAPHY = {
    TITLE: {
      FONT: 'Jacquard 12',
      SIZE: 48,
      LEADING: 1.2,
      COLOR: '#FFFFFF'
    },
    BUTTON: {
      FONT: 'Jacquard 12',
      SIZE: 24,
      LEADING: 1.1,
      COLOR: '#FFFFFF'
    },
    POETRY: {
      FONT: 'Jacquard 12',
      SIZE: 32,
      LEADING: 1.4,
      COLOR: '#FFFFFF'
    }
  }

WelcomeScene.VISUAL_SETTINGS = {
    // Star field configuration
    STAR_COUNT: 240,
    STAR_SIZE: {
      MIN: 0.5,
      MAX: 2
    },
    STAR_OPACITY: {
      MIN: 50,
      MAX: 200
    },

    // Wave animation properties
    WAVE: {
      Y_OFFSET_START: 0.09,
      STEP: 3,
      NOISE_SCALE: 0.0001,
      Y_INCREMENT: 0.004
    },

    // Canvas layout defaults
    CANVAS: {
      BUTTON_WIDTH_PERCENT: 0.3,
      BUTTON_HEIGHT_PERCENT: 0.1,
      MAX_BUTTON_WIDTH: 200,
      MAX_BUTTON_HEIGHT: 60
    }
  };

function preload() {
  welcomeScene = new WelcomeScene();
  welcomeScene.preload();
}

function setup() {
  welcomeScene.setup();
}

function draw() {
  welcomeScene.draw();
}

function windowResized() {
  welcomeScene.windowResized();
}

function mousePressed() {
  welcomeScene.mousePressed();
}

function preload() {
  welcomeScene = new WelcomeScene();
  welcomeScene.preload();
}

function setup() {
  welcomeScene.setup();
}

function draw() {
  welcomeScene.draw();
}

function windowResized() {
  welcomeScene.windowResized();
}

function mousePressed() {
  welcomeScene.mousePressed();
}