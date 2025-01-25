let fft;
let song;
let res = 100   ;//
let baseAmp = 150;
let time = 0;
let PI;

//Variables for poetry system
let currentSection = 0;
let scrollY = 0;
let targetScrollY = 0;
let sections = [];  // Will hold our poetry sections
let isDesktopView = true;  // For responsive layout

// Variable for tracking snap animation
let isSnapping = false;
let snapTarget = 0;


// Oscillation parameters
const oscillation = {
    baseFreq: 0.02,
    amplitude: 30,
    phaseShift: PI / 4
};

function setup() {
    // Instead of just windowWidth/Height, let's make sure we have enough space for all sections
    let canvasHeight = windowHeight * sections.length; // Total height needed for all sections
    createCanvas(windowWidth, canvasHeight);

    colorMode(HSB, 100);
    noFill();
    fft = new p5.FFT(0.8, 1024);
  
    // Initialize sections with proper spacing
    setupSections();

    checkDisplayMode();  // Check initial display mode
  
    song = loadSound('./public/Life of Pi.mp3',
        () => {
            console.log('Audio loaded');
            song.connect(fft);
        },
        (error) => console.error('Error loading audio:', error)
    );

    // Calculate total scrollable height based on number of sections
    totalScrollHeight = (sections.length * windowHeight);
}


// Poetry Sections
function setupSections() {
    sections = [
        {
            text: "I take after my forefathers of the lush gardens of hind,\n" +
                  "And my blood takes after my seafaring grand uncles that sold merch's;\n" +
                  "They gifted me with the wisdom to find all that is diplomatic,\n" +
                  "and with the sight to see at all our world's opportunities,",
            yPos: 0
        },
        {
            text: "I hope to see more green, and more blue,\n" +
                  "Hope our kins' minds and health are freed,",
            yPos: windowHeight
        },
        {
            text: "But I am disappointed in this world's bright red hue,\n" +
                  "And it's archaic autocrats,\n" +
                  "With their crowns shining it's zirconium streak,",
            yPos: windowHeight * 2
        },
        {
            text: "My land's grandmother paralyzes me in my slumber,\n" +
                  "She's there, as I try to to fight the images of wars,\n" +
                  "As I hope to bargain for some peace in my sleep.\n\n" +
                  "But I see my stubbornness in her,\n" +
                  "I see her going through my drawers and stash,\n" +
                  "Frantically even, I see her balancing my sheets,",
            yPos: windowHeight * 3
        },
        {
            text: "Her cold face cannot hide her paranoia,\n" +
                  "Her forehead and neck failing to contain her sweat,\n" +
                  "That loving phantom is funnily scared much like me,\n" +
                  "My crystal image, in her, I see.",
            yPos: windowHeight * 4
        },
        {
            text: "She's worried if I am keeping my stomach fed and my back warm,\n" +
                  "warm is her demeanour usually,\n\n" +
                  "But she started seething when I turned 23.\n" +
                  "\"23?!\", \"Ba-trees?!\"",
            yPos: windowHeight * 5
        },
        {
            text: "\"You better be planting those trees when your on my sister's land,\n" +
                  "Turtle island blemished with the their greedy plans;\n" +
                  "Pillaged my nephews and nieces,\n" +
                  "Under the guise of the ol' divine providence;\n" +
                  "They killed her kin with no remorse," +
                  "and I haven't seen my sister's weeping stop ever since\"",
            yPos: windowHeight * 6
        },
        {
            text: "She's telling me to be humble\n" +
                  "She's yelling at me to do better,",
            yPos: windowHeight * 7
        },
        {
            text: "Get a kevlar, graphite or carbon leaded fibres covering my spinal,\n" +
                  "\"Better now!\" she thinks, -\n" +
                  "Learnt from the cycles of the eons, she's seen,\n" +
                  "before she too has to see my head anchored off my body,\n" +
                  "chopped, and rolling down some random hill\n", //+
                  //"victim again of the fanatics of the world",
            yPos: windowHeight * 8
        },
        {
            text: "She's telling me about about Dara Shikoh,\n" +
                  "Shankracharya and Rumi;\n" +
                  "Twisting my neck; She's stretching my ears,\n" +
                  "From acroos the world, and back to the East,\n" +
                  "So I don't discriminate against Tzu, and Han's Philosophies,",
            yPos: windowHeight * 9
        },
        {
            text: "She's telling me to be humble when Bakr calls me a Blasphemer,\n" +
                  "And Augustine labels me a Heretic,\n" +
                  "\"Don't take it to heart, that's not what matters\",\n" +
                  "You need their vision and wisdom, don't discriminate with good data,\n" +
                  "The good ideas,\n" +
                  "Good morals,\n" +
                  "Good will,\n" +
                  "and the good Ethics,\n" +
                  "Be it Christ, Vishnu, Buddha,\n" +
                  "or through the One for whom the whole world wishes bundles of peace.",
            yPos: windowHeight * 10
        },
        {
            text: "Bow down your bony occipital,\n" +
                  "Don't rush to judge all of our global wisdom,\n" +
                  "Let it through your top that I know is thick,\n\n" +
                  "She's telling me..\n\n" +
                  "She's telling me to be humble\n" +
                  "She's yelling at me to do better,\n" +
                  "Cover my neck, and balance me sheets,\n" +
                  "\"Never stop that education !\"\n" +
                  "Just so I can make arrangements for my own personal peace.",
            yPos: windowHeight * 11
        },
        {
            text: "Be it dusty leather bond books,\n" +
                  "Or Einstein's and Curie's papers about this world as they See.",
            yPos: windowHeight * 12
        },
        {
            text: "She's telling me to be humble\n" +
                  "She's yelling at me to do better,\n" +
                  "Cover my neck, and balance my sheets,\n" +
                  "\"Never stop that education !\"\n" +
                  "Just so I can make arrangements for my own personal peace.",
            yPos: windowHeight * 13
        }
    ];
}

// Responsive layout
function checkDisplayMode() {
    isDesktopView = windowWidth > 768;
}
// Scroll snapping
function mouseWheel(event) {
    event.preventDefault();
    
    if (isSnapping) return false; // Prevent scrolling during snap animation
    
    // Add minimum scroll threshold
    if (Math.abs(event.delta) < 10) return false; // Ignore very small scroll events

    // Determine direction of scroll
    const direction = event.delta > 0 ? 1 : -1;
    
    // Calculate current section
    let currentSection = Math.round(scrollY / windowHeight);
    
    // Calculate target section
    let targetSection = currentSection + direction;
    targetSection = constrain(targetSection, 0, sections.length - 1);
    
    // Set target scroll position to exact section height
    targetScrollY = targetSection * windowHeight;
    
    // Optional: Add snapping animation
    isSnapping = true;
    setTimeout(() => {
        isSnapping = false;
    }, 950); // Adjust timing as needed
    
    return false;
}

// Helper functions: It will help us to get the energy of a specific frequency range
function getFrequencyRangeEnergy(spectrum, lowFreq, highFreq) {
    let lowIndex = Math.floor(map(lowFreq, 0, 22050, 0, spectrum.length));
    let highIndex = Math.floor(map(highFreq, 0, 22050, 0, spectrum.length));
    let total = 0;
    
    for (let i = lowIndex; i <= highIndex; i++) {
        total += spectrum[i];
    }
    return total / (highIndex - lowIndex + 1);
}

// Polar distortion function: It will return a value that will be used to distort the radius of the bands
function getPolarDistortion(angle, energy, bandConfig) {
    // Create multiple oscillating waves
    let wave1 = sin(angle * 3 + frameCount * 0.02) * oscillation.amplitude;
    let wave2 = cos(angle * 5 + frameCount * 0.015) * oscillation.amplitude;
    let wave3 = sin(angle * 2 + time * 2) * oscillation.amplitude;
    
    // Combine waves and make them energy-responsive
    return (wave1 + wave2 + wave3) * map(energy, 0, 255, 0.1, 1.0);
}

// define bands after the functions it uses
const bands = {
    lowBass: {
        iter: 12,
        offset: 0,
        noiseScale: 0.01,
        baseStrokeWidth: 2,
        color: [0, 0, 100],
        radiusOffset: 10,
        freqRange: [70, 100],
        energyScale: 1.4,
        polarScale: 1.2
    },
    midBass: {
        iter: 10,
        offset: 0,
        noiseScale: 0.008,
        baseStrokeWidth: 1.8,
        color: [0, 0, 90],
        radiusOffset: 180,
        freqRange: [160, 200],
        energyScale: 1.2,
        polarScale: 1.0
    },
    lowMid: {
        iter: 8,
        offset: 0,
        noiseScale: 0.006,
        baseStrokeWidth: 2,
        color: [0, 0, 80],
        radiusOffset: 360,
        freqRange: [300, 360],
        energyScale: 1.0,
        polarScale: 0.8
    },
    midMid: {
        iter: 8,
        offset: 0,
        noiseScale: 0.005,
        baseStrokeWidth: 3,
        color: [0, 0, 70],
        radiusOffset: 500,
        freqRange: [360, 2500],
        energyScale: 0.8,
        polarScale: 0.6
    },
    highMid: {
        iter: 6,
        offset: 0,
        noiseScale: 0.001,
        baseStrokeWidth: 1.5,
        color: [0, 0, 60],
        radiusOffset: 600,
        freqRange: [2500, 2800],
        energyScale: 0.6,
        polarScale: 0.4
    }
};

// Drawing functions: It will draw the bands based on the configuration
function drawFrequencyBand(bandConfig, energy, name) {
    for (let j = 0; j < bandConfig.iter; j++) {
        beginShape();
        
        let dynamicStrokeWeight = map(energy, 0, 255, 
            bandConfig.baseStrokeWidth, 
            bandConfig.baseStrokeWidth * 2
        );
        strokeWeight(dynamicStrokeWeight);
        
        let opacity = map(energy, 0, 255, 3, 9);
        stroke(
            bandConfig.color[0],
            bandConfig.color[1],
            bandConfig.color[2],
            opacity
        );
        
        for (let i = 0; i < res; i++) {
            let angle = i * TWO_PI / res;
            
            // Get noise distortion
            let n = map(noise(
                bandConfig.offset + sin(angle) * bandConfig.noiseScale * j,
                bandConfig.offset + cos(angle) * bandConfig.noiseScale * j,
                time
            ), 0, 1, 0.9, 1.1);
            
            // Get polar distortion
            let polarDist = getPolarDistortion(angle, energy, bandConfig) * bandConfig.polarScale;
            
            // Combine all effects
            let energyResponse = map(energy, 0, 255, 0.8, bandConfig.energyScale);
            let baseRadius = baseAmp * n * energyResponse;
            let finalRadius = baseRadius + bandConfig.radiusOffset + polarDist;
            
            // Add frameCount-based rotation
            let rotationOffset = frameCount * 0.001 * (j + 1);
            let x = sin(angle + rotationOffset) * finalRadius;
            let y = cos(angle + rotationOffset) * finalRadius;
            
            vertex(x, y);
        }
        endShape(CLOSE);
    }
}

// Scrolling content: The function will draw the scrolling content
function drawScrollingContent() {
    push();
    resetMatrix(); // Reset any transformations
    translate(0, -scrollY);  // Apply scroll offset
    
    sections.forEach((section, index) => {
        let sectionY = index * windowHeight; // Use windowHeight for consistent section heights
        
        // Only draw if section is in view
        if (sectionY + windowHeight < scrollY - windowHeight || sectionY > scrollY + windowHeight * 2) {
            return;
        }
        
        if (isDesktopView) {
            // Desktop: Split screen
            // First draw the image placeholder on the left
            fill(40);
            color(0, 0, 100);
            rect(0, sectionY, width/2, height);  // Changed from width/2 to 0 for left side
            
            // Then draw text on the right
            fill(255);
            noStroke();
            textAlign(LEFT, CENTER);
            textSize(24);
            text(section.text, width/2 + 50, sectionY + height/2, width/2 - 100);  // Changed starting x position to width/2 + 50
        } else {
            // Mobile: Stacked layout
            // Image area on top
            fill(40);
            rect(0, sectionY, width, height/2);
            
            // Text area below
            fill(255);
            noStroke();
            textAlign(LEFT, CENTER);
            textSize(24);
            text(section.text, 50, sectionY + height/2, width - 100);
        }
    });
    pop();
}

// Audio visualization: The function will draw the audio visualization
function drawAudioVisualization() {
    push();
    // Center the visualization in the window
    translate(windowWidth/2, windowHeight/2);
    
    let spectrum = fft.analyze();
        time += 0.0003;
        let timeOffset = time * 0.05;
        
        Object.keys(bands).forEach((bandName, index) => {
            bands[bandName].offset = sin(timeOffset + index * 0.5) * 50;
            
            let energy = getFrequencyRangeEnergy(
                spectrum,
                bands[bandName].freqRange[0],
                bands[bandName].freqRange[1]
            );
            
            drawFrequencyBand(bands[bandName], energy, bandName);
        });
        pop();
    }

// Main draw loop
function draw() {
    background(0, 0, 10);
    
    // Smoother lerping for snapped scrolling
    const scrollEasing = isSnapping ? 0.05 : 0.02; // Adjust easing as needed
    scrollY = lerp(scrollY, targetScrollY, scrollEasing);
    
    // If very close to target, snap exactly
    if (Math.abs(scrollY - targetScrollY) < 0.1) {
        scrollY = targetScrollY;
    }
    
    currentSection = floor(scrollY / windowHeight);
    //translate(width / 2, height / 2);
    // Update scroll position with smooth lerping
    
    // 1. Audio visualization
    drawAudioVisualization();
    // 2. Scrolling content
    drawScrollingContent();
}

// Resize canvas and recalculate layout
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    checkDisplayMode();
    
    // Recalculate total scroll height
    totalScrollHeight = (sections.length * windowHeight) - windowHeight;
    
    // Update band radiusOffsets for new window size
    Object.keys(bands).forEach((band, index) => {
        bands[band].radiusOffset = windowWidth * (0.01 + (index * 0.07));
    });
    
    // Constrain scroll position
    targetScrollY = constrain(targetScrollY, 0, totalScrollHeight);
    scrollY = constrain(scrollY, 0, totalScrollHeight);
}


