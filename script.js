// === Canvas Setup ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// UI Elements
const stepDisplay = document.getElementById("steps");
const generationDisplay = document.getElementById("generation");
const rewardP1Display = document.getElementById("rewardP1");
const rewardP2Display = document.getElementById("rewardP2");
const hsDisplay = document.getElementById("hs");
const elR = document.getElementById("runnerscore");
const elT = document.getElementById("taggerscore");

let levelCount = 0;
let aiRunning = false;
let paused = false;
let spectateMode = false;
let TILE_SIZE = 40;
const GRID_SIZE = 15;

let phoneMode = false;
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function testMobile() {
    if (isMobileDevice()) {
        console.log("You're on a mobile device!");
        // You can trigger mobile-specific behavior here
        phoneMode = true;
      } else {
        console.log("You're on a desktop!");
        phoneMode = false;
      }
}
testMobile();

function positionCanvas() {
    let desiredWidth, desiredHeight;
    if (!phoneMode) {
    phoneMode = true;
      desiredWidth = 700;
      desiredHeight = 700;
      TILE_SIZE = 40;
      canvas.style.position = "absolute";
      canvas.style.left = (700) + 'px';
        canvas.style.top = (400 - desiredHeight / 2) + 'px';

    } else {
        phoneMode = false;
      desiredWidth = 300;
      desiredHeight = 300;
      TILE_SIZE = 20;
      canvas.style.position = "absolute";
      canvas.style.left = (20) + 'px';
        canvas.style.top = (350 - desiredHeight / 2) + 'px';
    }

    canvas.width = desiredWidth;
    canvas.height = desiredHeight;
}
positionCanvas();


const TILE = {
    EMPTY: 0,
    WALL: 0.3,
    TAGGER: 1,
    RUNNER: 0.99
};
// Keyboard input
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);
// Controls
 // Controls
 const controls1 = { forward: false, left: false, right: false, down: false};
 const controls2 = { forward: false, left: false, right: false, down: false};
 const AI1Controls = { forward: false, left: false, right: false, down: false };
 const AI2Controls = { forward: false, left: false, right: false, down: false };
// Level definitions
let tagger = {
    x: 0,
    y: 0,
    win: false,
    population:[]
};
let runner = {
    x: 0,
    y: 0,
    win: false,
    population:[]
};
let taggerScore = 0;
let runnerScore = 0;
let moves = 0;
let grid = [];
let stepLoop = 0;

function resetGame() {
    moves = 0;
    //Empty the Grid
    grid = Array.from({
        length: GRID_SIZE
    }, () => Array(GRID_SIZE).fill(TILE.EMPTY));

    if(runner.win || tagger.win) {
        if (runner.win) {
          runnerScore++;
        }
        if (tagger.win) {
          taggerScore++;
        }
    }

    // Place walls around the border
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[0][i] = TILE.WALL;
        grid[GRID_SIZE - 1][i] = TILE.WALL;
        grid[i][0] = TILE.WALL;
        grid[i][GRID_SIZE - 1] = TILE.WALL;
    }
    // Custom level design 
    tagger = {
        x: 3,
        y: 3
    };
    runner = {
        x: 9,
        y: 3
    }
    tagger = { x:tagger.x, y:tagger.y, 
        win:false,
        population:[]
    };
      runner = { x:runner.x, y:runner.y,
        win:false,
        population:[]
    };
    //Make sure grid is correct
    grid[tagger.y][tagger.x] = TILE.TAGGER;
    grid[runner.y][runner.x] = TILE.RUNNER;
}
resetGame();
// === Control Logic ===
function updateP1Controls() {
    if (aiRunning) {
      controls1.forward = AI1Controls.forward;
      controls1.left = AI1Controls.left;
      controls1.right = AI1Controls.right;
      controls1.down = AI1Controls.down;
    } else {
      controls1.forward = keys["ArrowUp"];
      controls1.left = keys["ArrowLeft"];
      controls1.right = keys["ArrowRight"];
      controls1.down = keys["ArrowDown"];
    }
  }
  
  function updateP2Controls() {
    if (aiRunning) {
      controls2.forward = AI2Controls.forward;
      controls2.left = AI2Controls.left;
      controls2.right = AI2Controls.right;
      controls2.down = AI2Controls.down;
    } else {
      controls2.forward = keys["w"];
      controls2.left = keys["a"];
      controls2.right = keys["d"];
      controls2.down = keys["s"];
    }
  }

let runningBest = false;
// === Drawing Functions ===
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            switch (grid[y][x]) {
                case TILE.WALL:
                    ctx.fillStyle = "#555";
                    break;
                case TILE.TAGGER:
                    ctx.fillStyle = "#3b48bf";
                    if (runningBest) {
                        ctx.fillStyle = "#1b2157";
                    }
                    break;
                case TILE.RUNNER:
                    ctx.fillStyle = "#f5aa42";
                    if(runningBest) {
                      ctx.fillStyle = "#966724";
                    }
                    break;
                default:
                    ctx.fillStyle = "#222";
            }
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function updateScores() {
    elR.textContent = "Runner: " + runnerScore;
    elT.textContent = "Tagger: " + taggerScore;
  
    // Remove all state classes
    elR.classList.remove("winning", "losing", "tie");
    elT.classList.remove("winning", "losing", "tie");
  
    if (runnerScore > taggerScore) {
      elR.classList.add("winning");
      elT.classList.add("losing");
    } else if (taggerScore > runnerScore) {
      elR.classList.add("losing");
      elT.classList.add("winning");
    } else {
      elR.classList.add("tie");
      elT.classList.add("tie");
    }
  }

// === Update Functions ===
 function isWalkable(x, y, resCol = false) {
  if(resCol) {
    return grid[y][x] !== TILE.RUNNER && grid[y][x] !== TILE.TAGGER;
  }else {
    return grid[y][x] !== TILE.WALL && grid[y][x] !== TILE.RUNNER && grid[y][x] !== TILE.TAGGER;
  }
 }

function moveplayer(player, tiletype, dy, dx) {
  //Make sure the grid doesn't have multiple objects
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (isWalkable(nx, ny)  && (dx != 0 || dy != 0)) {
   grid[player.y][player.x] = TILE.EMPTY;
   player.x = nx;
   player.y = ny;
   moves++;
  } else if (grid[ny][nx] === TILE.RUNNER && tiletype === TILE.TAGGER) {
    // A runner got tagged by a tagger
    tagger.win = true;
    resetGame();
    stepLoop = 0;
    return;
  }

  //Make sure grid is correct
  grid[player.y][player.x] = tiletype;
}

function updatetagger() {
  updateP1Controls();
  const dy = (controls1.forward ? -1 : 0) + (controls1.down ? 1 : 0); 
  const dx = (controls1.left ? -1 : 0) + (controls1.right ? 1 : 0);
  moveplayer(tagger, TILE.TAGGER, dy, dx);
}

function updaterunner() {
    updateP2Controls();
    const dy = (controls2.forward ? -1 : 0) + (controls2.down ? 1 : 0); 
    const dx = (controls2.left ? -1 : 0) + (controls2.right ? 1 : 0);
    moveplayer(runner, TILE.RUNNER, dy, dx);
  }
  

  function updateGame() {
    updatetagger();
    updaterunner();
  }

function pauseGame() {
    paused = true;
}

function resumeGame() {
    paused = false;
}
// === Render ===
function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}
  // === Game Loop ===
  async function gameLoop() {
    if (!paused) {
      try {
        updateGame();
      } catch (e) {
        console.error("updateGame() error: ", e);
      }

      try {
        renderGame();
      } catch (e) {
        console.error("renderGame() error: ", e);
      }
      try {
      updateScores();
      } catch (e) {
        console.error("Update Scores error: ", e);
      }

      let reward = 1000;
      rewardP1Display.textContent = reward;
      generationDisplay.textContent = "No AI Running";
      stepLoop++;
      stepDisplay.textContent = stepLoop;
      try {
      if(stepLoop >= 50) {
        stepLoop = 0;
        runner.win = true;
        resetGame();
      }
    } catch(e) {
      console.error("Runner win error: ", e);
    }

      // Wait 30 ms before continuing
      await new Promise(r => setTimeout(r, 80));

      requestAnimationFrame(gameLoop);
    }
  }

// === UI Button Functions ===
function startAI() {
    pauseGame();
    resetGame();
    aiRunning = true;
    console.log("AI started training...");
    runAI();
}

function stopAI() {
    aiRunning = false;
    resumeGame();
    console.log("AI stopped.");
}
//Makes the Ai stop mutating and simply run its best verision
let testing = false;

function testAI() {
    if (testing) {
        testing = false;
    } else {
        testing = true;
    }
    console.log("Testing the AI");
}

function toggleSpeed() {
    spectateMode = !spectateMode;
    console.log("Spectate Mode:", spectateMode ? "ON" : "OFF");
}
// === AI Entry Point (Placeholder) ===
// === Neural Network Setup ===
// === Neural Network Setup ===
let population = [];
let bestBrain = {
    weights: [],
    fitness: 0
};
let generation = 0;
let highestReward = 0;
const POP_SIZE = 60;
const MUTATION_RATE = 0.2;
const ELITE_COUNT = 6;
const INPUT_COUNT = 37;
const OUTPUT_COUNT = 12;
const HIDDEN1_COUNT = 90; // first hidden layer
const HIDDEN2_COUNT = 100; // second hidden layer
const HIDDEN3_COUNT = 40; // third hidden layer
const HIDDEN4_COUNT = 30; // fourth hidden layer
const HIDDEN5_COUNT = 20; // fifth hidden layer
const HIDDEN6_COUNT = 20; // sixth hidden layer 
const RENDER_INTERVAL = 423432;
const RENDER_STEPS = 1;

function createRandomBrain() {
    const weights = [];
    const layerSizes = [
        INPUT_COUNT,
        HIDDEN1_COUNT,
        HIDDEN2_COUNT,
        HIDDEN3_COUNT,
        HIDDEN4_COUNT,
        HIDDEN5_COUNT,
        HIDDEN6_COUNT,
        OUTPUT_COUNT
    ];
    for (let i = 0; i < layerSizes.length - 1; i++) {
        const fromSize = layerSizes[i];
        const toSize = layerSizes[i + 1];
        for (let w = 0; w < fromSize * toSize; w++) {
            weights.push(Math.random() * 2 - 1); // random value between -1 and 1
        }
    }
    return {
        weights,
        fitness: 0
    };
}

function mutateBrain(brain) {
    const newWeights = brain.weights.map(w => Math.random() < MUTATION_RATE ? w + (Math.random() * 2 - 1) * 0.5 : w);
    return {
        weights: newWeights,
        fitness: 0
    };
}

function feedForward(inputs, brain) {
    const sigmoid = x => 1 / (1 + Math.exp(-x));
    const relu = x => Math.max(0, x);
    let index = 0;
    // Define the structure using the constants
    const layerSizes = [
        INPUT_COUNT,
        HIDDEN1_COUNT,
        HIDDEN2_COUNT,
        HIDDEN3_COUNT,
        HIDDEN4_COUNT,
        HIDDEN5_COUNT,
        HIDDEN6_COUNT,
        OUTPUT_COUNT
    ];
    // Define which activation function to use per layer (excluding input)
    const activations = [
        relu, // input -> hidden1
        relu, // hidden1 -> hidden2
        relu, // hidden2 -> hidden3
        relu, // hidden3 -> hidden4
        relu, // hidden4 -> hidden5
        relu, // hidden5 -> hidden6
        sigmoid // hidden6 -> output
    ];
    // Process each layer forward
    let current = inputs;
    for (let layer = 0; layer < layerSizes.length - 1; layer++) {
        const next = [];
        const fromSize = layerSizes[layer];
        const toSize = layerSizes[layer + 1];
        const activate = activations[layer];
        for (let to = 0; to < toSize; to++) {
            let sum = 0;
            for (let from = 0; from < fromSize; from++) {
                sum += current[from] * brain.weights[index++];
            }
            next[to] = activate(sum);
        }
        current = next; // push to next layer
    }
    return current; // final output layer
}

function getInputs(memory = [0, 0, 0, 0, 0, 0, 0, 0], main, second) {
    const inputs = [];
    // 5x5 vision (excluding center tile at dx=0, dy=0)
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
            if (dx === 0 && dy === 0) continue; // Skip the tagger tile
            const x = main.x + dx;
            const y = main.y + dy;
            // Out of bounds = wall
            if (x < 0 || x >= 15 || y < 0 || y >= 15) {
                inputs.push(0.33); // wall
            } else {
                let value = grid[y][x];
                // else stays 0 for empty/unknown
                inputs.push(value);
            }
        }
    }
    // Relative position normalized
    inputs.push((main.x) / 15);
    inputs.push((main.y) / 15);
    // Relative other position normalized
    inputs.push((second.x - main.x) / 15);
    inputs.push((second.y - main.y) / 15);
    // Short-term memory (8 values)
    for (let i = 0; i < 8; i++) {
        inputs.push(memory[i] ?? 0);
    }
    // Bias neuron
    inputs.push(1);
    return inputs;
}
// === AI Main Loop ===
async function runAI() {
    population = [];
    for (let i = 0; i < POP_SIZE; i++) {
        population.push(createRandomBrain());
    }
    generation = 0;
    let currentIndex = 0;
    bestBrain = population[1];

    function nextGeneration() {
        population.sort((a, b) => b.fitness - a.fitness);
        const elites = population.slice(0, ELITE_COUNT);
        population = [];
        while (population.length < (POP_SIZE)) {
            const parent = elites[Math.floor(Math.random() * elites.length)];
            if (population.length === 1 || testing) {
                population.push(bestBrain);
            } else {
                population.push(mutateBrain(parent));
            }
        }
        generation++;
        currentIndex = 0;
        //console.log("Generation", generation);
        generationDisplay.textContent = generation;
        evaluateNext();
    }

    function evaluateNext() {
        if (!aiRunning || currentIndex >= POP_SIZE) {
            nextGeneration();
            return;
        }
        resetGame();
        const brain = population[currentIndex];
        let steps = 0;
        let maxSteps = 50;
        let memory = [0, 0, 0, 0, 0, 0, 0, 0];
        // Determine if this AI should be partially rendered
        const renderThisOne = currentIndex % RENDER_INTERVAL === 0;
        async function step() {
            while (steps < maxSteps && aiRunning) {
                const inputs = getInputs(memory, tagger, runner);
                const outputs = feedForward(inputs, brain);
                memory = outputs.slice(4);
                AI1Controls.forward = outputs[0] > 0.5;
                AI1Controls.left = outputs[1] > 0.5;
                AI1Controls.right = outputs[2] > 0.5;
                AI1Controls.down = outputs[3] > 0.5;

                updateGame();

                if (spectateMode) {
                    if (currentIndex === 1) {
                        runningBest = true;
                    } else {
                        runningBest = false;
                    }
                    rewardP1Display.textContent = memory;
                    renderGame();
                    await new Promise(r => setTimeout(r, 100)); // Let browser breathe
                }
                steps++;
            }
            if (renderThisOne) {
                renderGame();
                await new Promise(r => setTimeout(r, 0)); // Let browser breathe
            }
            brain.fitness = steps * 0.005;
            rewardP1Display.textContent = brain.fitness;
            if (highestReward < brain.fitness) {
                highestReward = brain.fitness;
                bestBrain = brain;
            }
            hsDisplay.textContent = highestReward;
            currentIndex++;
            if (!aiRunning) return;
            evaluateNext(); // Move to next AI
        }
        step();
    }
    if (!aiRunning) return;
    evaluateNext();
}

function saveBrainToTextbox() {
    const brainTextarea = document.getElementById("brainData");
    brainTextarea.value = JSON.stringify(bestBrain.weights);
}

function loadBrainFromTextbox() {
    const brainTextarea = document.getElementById("brainData");
    try {
        const loadedWeights = JSON.parse(brainTextarea.value);
        if (Array.isArray(loadedWeights)) {
            bestBrain = {
                weights: loadedWeights,
                fitness: 0
            };
            console.log("Loaded brain with", loadedWeights.length, "weights.");
        } else {
            throw new Error("Parsed data is not an array.");
        }
    } catch (e) {
        console.error("Failed to load brain:", e);
        alert("Invalid brain data format.");
    }
}
// === Start the Game Loop ===
gameLoop();


 // Extra stuff to make the github webpage to work correctly I guess
 if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() => console.log('Service Worker Registered!'));
}
