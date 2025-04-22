// === Canvas Setup ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// UI Elements
const levelsDisplay = document.getElementById("levels");
const moveDisplay = document.getElementById("moves");
const generationDisplay = document.getElementById("generation");
const rewardDisplay = document.getElementById("reward");
const hsDisplay = document.getElementById("hs");
let levelCount = 0;
let aiRunning = false;
let paused = false;
let spectateMode = false;
const TILE_SIZE = 20;
const GRID_SIZE = 15;
const TILE = {
    EMPTY: 0,
    WALL: 0.3,
    BOX: 0.7,
    GOAL: 1,
    PLAYER: 2
};
// Keyboard input
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);
// Controls
const controls = {
    forward: false,
    left: false,
    right: false,
    down: false
};
const AIControls = {
    forward: false,
    left: false,
    right: false,
    down: false
};
// Level definitions
let player = {
    x: 0,
    y: 0
};
let box = {
    x: 0,
    y: 0
};
let goal = {
    x: 0,
    y: 0
};
let moves = 0;
let grid = [];

function resetGame(fullGame = false) {
    moves = 0;
    if (fullGame) {
        levelCount = 0;
        levelsDisplay.textContent = levelCount;
    }
    //Empty the Grid
    grid = Array.from({
        length: GRID_SIZE
    }, () => Array(GRID_SIZE).fill(TILE.EMPTY));
    // Place walls around the border
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[0][i] = TILE.WALL;
        grid[GRID_SIZE - 1][i] = TILE.WALL;
        grid[i][0] = TILE.WALL;
        grid[i][GRID_SIZE - 1] = TILE.WALL;
    }
    // Custom level design 
    switch (levelCount) {
        case 0:
            player = {
                x: 2,
                y: 2
            };
            box = {
                x: 6,
                y: 2
            };
            goal = {
                x: 10,
                y: 2
            };
            break;
        case 1:
            player = {
                x: 10,
                y: 13
            };
            box = {
                x: 10,
                y: 4
            };
            goal = {
                x: 10,
                y: 2
            };
            break;
        case 2:
            player = {
                x: 2,
                y: 3
            };
            box = {
                x: 4,
                y: 2
            };
            goal = {
                x: 10,
                y: 2
            };
            break;
        case 3:
            player = {
                x: 8,
                y: 4
            };
            box = {
                x: 6,
                y: 2
            };
            goal = {
                x: 2,
                y: 2
            };
            break;
        case 4:
            player = {
                x: 2,
                y: 6
            };
            box = {
                x: 8,
                y: 6
            };
            goal = {
                x: 12,
                y: 6
            };
            grid[6][5] = TILE.WALL;
            break;
        case 5:
            player = {
                x: 12,
                y: 6
            };
            box = {
                x: 5,
                y: 6
            };
            goal = {
                x: 2,
                y: 6
            };
            grid[6][8] = TILE.WALL;
            break;
        case 6:
            player = {
                x: 13,
                y: 13
            };
            box = {
                x: 3,
                y: 12
            };
            goal = {
                x: 3,
                y: 5
            };
            grid[7][5] = TILE.WALL;
            grid[8][6] = TILE.WALL;
            grid[12][7] = TILE.WALL;
            grid[3][8] = TILE.WALL;
            break;
        case 7:
            player = {
                x: 13,
                y: 13
            };
            box = {
                x: 8,
                y: 8
            };
            goal = {
                x: 1,
                y: 1
            };
            break;
        case 8:
            player = {
                x: 13,
                y: 13
            };
            box = {
                x: 2,
                y: 11
            };
            goal = {
                x: 1,
                y: 1
            };
            grid[13][5] = TILE.WALL;
            grid[12][5] = TILE.WALL;
            grid[11][5] = TILE.WALL;
            grid[10][5] = TILE.WALL;
            break;
        case 9:
            player = {
                x: 13,
                y: 13
            };
            box = {
                x: 8,
                y: 11
            };
            goal = {
                x: 1,
                y: 1
            };
            grid[13][5] = TILE.WALL;
            grid[12][5] = TILE.WALL;
            grid[11][5] = TILE.WALL;
            grid[10][5] = TILE.WALL;
            grid[9][5] = TILE.WALL;
            grid[8][5] = TILE.WALL;
            grid[7][5] = TILE.WALL;
            grid[6][5] = TILE.WALL;
            grid[2][5] = TILE.WALL;
            grid[1][5] = TILE.WALL;
            break;
        case 50:
            player = {
                x: 13,
                y: 13
            };
            box = {
                x: 8,
                y: 11
            };
            goal = {
                x: 1,
                y: 1
            };
            grid[13][5] = TILE.WALL;
            grid[12][5] = TILE.WALL;
            grid[11][5] = TILE.WALL;
            grid[10][5] = TILE.WALL;
            grid[9][5] = TILE.WALL;
            grid[8][5] = TILE.WALL;
            grid[7][5] = TILE.WALL;
            grid[6][5] = TILE.WALL;
            grid[2][5] = TILE.WALL;
            grid[1][5] = TILE.WALL;
            grid[13][7] = TILE.WALL;
            grid[12][7] = TILE.WALL;
            grid[8][7] = TILE.WALL;
            grid[7][7] = TILE.WALL;
            grid[6][7] = TILE.WALL;
            grid[5][7] = TILE.WALL;
            grid[4][8] = TILE.WALL;
            grid[3][7] = TILE.WALL;
            grid[2][7] = TILE.WALL;
            grid[1][7] = TILE.WALL;
            break;
        case 150:
            player = {
                x: 2,
                y: 2
            };
            box = {
                x: 6,
                y: 2
            };
            goal = {
                x: 14,
                y: 14
            };
            grid[13][13] = TILE.WALL;
            grid[12][13] = TILE.WALL;
            break;
        default:
            player = {
                x: Math.round((Math.random() * 12 + 1)),
                y: Math.round((Math.random() * 12 + 1))
            };
            box = {
                x: Math.round((Math.random() * 10 + 2)),
                y: Math.round((Math.random() * 10 + 2))
            };
            while (box.x === player.x && box.y === player.y) {
                box = {
                    x: Math.round((Math.random() * 10 + 2)),
                    y: Math.round((Math.random() * 10 + 2))
                };
            }
            goal = {
                x: Math.round((Math.random() * 12 + 1)),
                y: Math.round((Math.random() * 12 + 1))
            };
            while (goal.x === player.x && goal.y === player.y) {
                goal = {
                    x: Math.round((Math.random() * 12 + 1)),
                    y: Math.round((Math.random() * 12 + 1))
                };
            }
            while (goal.x === box.x && goal.y === box.y) {
                goal = {
                    x: Math.round((Math.random() * 12 + 1)),
                    y: Math.round((Math.random() * 12 + 1))
                };
            }
    }
    //Make sure grid is correct
    grid[box.y][box.x] = TILE.BOX;
    grid[player.y][player.x] = TILE.PLAYER;
    grid[goal.y][goal.x] = TILE.GOAL;
}
resetGame(true);
// === Control Logic ===
function updateControls() {
    if (aiRunning) {
        controls.forward = AIControls.forward;
        controls.left = AIControls.left;
        controls.right = AIControls.right;
        controls.down = AIControls.down;
    } else {
        controls.forward = keys["ArrowUp"];
        controls.left = keys["ArrowLeft"];
        controls.right = keys["ArrowRight"];
        controls.down = keys["ArrowDown"];
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
                case TILE.GOAL:
                    ctx.fillStyle = "gold";
                    break;
                case TILE.BOX:
                    ctx.fillStyle = "#701f27";
                    break;
                case TILE.PLAYER:
                    ctx.fillStyle = "#3b48bf";
                    if (runningBest) {
                        ctx.fillStyle = "#1b2157";
                    }
                    break;
                default:
                    ctx.fillStyle = "#222";
            }
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}
// === Update Functions ===
function isWalkable(x, y) {
    return grid[y][x] !== TILE.WALL && (player.x !== x || player.y !== y);
}

function movePlayer(dy, dx) {
    //Make sure the grid doesn't have multiple boxes or players
    grid[box.y][box.x] = TILE.EMPTY;
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (box.x === nx && box.y === ny) {
        const nx2 = box.x + dx;
        const ny2 = box.y + dy;
        if (isWalkable(nx2, ny2) && (dx != 0 || dy != 0)) {
            grid[player.y][player.x] = TILE.EMPTY;
            box.x = nx2;
            box.y = ny2;
            player.x = nx;
            player.y = ny;
            moves++;
        }
    } else if (isWalkable(nx, ny) && (dx != 0 || dy != 0)) {
        grid[player.y][player.x] = TILE.EMPTY;
        player.x = nx;
        player.y = ny;
        moves++;
    }
    //Make sure grid is correct
    grid[box.y][box.x] = TILE.BOX;
    grid[player.y][player.x] = TILE.PLAYER;
    moveDisplay.textContent = moves;
}

function updatePlayer() {
    updateControls();
    const dy = (controls.forward ? -1 : 0) + (controls.down ? 1 : 0);
    const dx = (controls.left ? -1 : 0) + (controls.right ? 1 : 0);
    movePlayer(dy, dx);
}

function updateGame() {
    updatePlayer();
    grid[goal.y][goal.x] = TILE.GOAL;
    if (box.x === goal.x && box.y === goal.y) {
        levelCount++;
        resetGame();
    }
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
    levelsDisplay.textContent = levelCount;
}
// === Game Loop ===
async function gameLoop() {
    if (!paused) {
        updateGame();
        levelsDisplay.textContent = levelCount;
        let distanceBox = Math.abs(goal.x - box.x) + Math.abs(goal.y - box.y);
        let distancePlayer = Math.abs(goal.x - box.x) + Math.abs(goal.y - box.y);
        let reward = levelCount * 1000 - distanceBox * 30 - distancePlayer * 15;
        rewardDisplay.textContent = reward;
        generationDisplay.textContent = "No AI Running";
        renderGame();
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
//Renders the AI 
function drawNeuralNetworkVisualization() {
    const vizCanvas = document.getElementById('aiVisualizer');
    const vizCtx = vizCanvas.getContext('2d');
    vizCanvas.width = vizCanvas.clientWidth;
    vizCanvas.height = vizCanvas.clientHeight;
    vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
    const layerCounts = [
        INPUT_COUNT,
        HIDDEN1_COUNT,
        HIDDEN2_COUNT,
        HIDDEN3_COUNT,
        HIDDEN4_COUNT,
        HIDDEN5_COUNT,
        HIDDEN6_COUNT,
        OUTPUT_COUNT
    ];
    const layerSpacing = vizCanvas.width / (layerCounts.length - 0.5);
    const radius = 4;
    const nodePositions = [];
    for (let i = 0; i < layerCounts.length; i++) {
        const count = layerCounts[i];
        const ySpacing = vizCanvas.height / (count + 1);
        const positions = [];
        for (let j = 0; j < count; j++) {
            const x = i * layerSpacing + 5;
            const y = (j + 1) * ySpacing;
            positions.push({
                x,
                y
            });
        }
        nodePositions.push(positions);
    }
    // Draw connections
    vizCtx.strokeStyle = "#888";
    for (let i = 0; i < nodePositions.length - 1; i++) {
        for (const from of nodePositions[i]) {
            for (const to of nodePositions[i + 1]) {
                vizCtx.beginPath();
                vizCtx.moveTo(from.x, from.y);
                vizCtx.lineTo(to.x, to.y);
                vizCtx.stroke();
            }
        }
    }
    // Draw nodes
    vizCtx.fillStyle = "#000";
    for (const layer of nodePositions) {
        for (const node of layer) {
            vizCtx.beginPath();
            vizCtx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            vizCtx.fill();
        }
    }
}

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

function getInputs(memory = [0, 0, 0, 0, 0, 0, 0, 0]) {
    const inputs = [];
    // 5x5 vision (excluding center tile at dx=0, dy=0)
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
            if (dx === 0 && dy === 0) continue; // Skip the player tile
            const x = player.x + dx;
            const y = player.y + dy;
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
    // Relative box position normalized
    inputs.push((box.x - player.x) / 15);
    inputs.push((box.y - player.y) / 15);
    // Relative box position normalized
    inputs.push((goal.x - player.x) / 15);
    inputs.push((goal.y - player.y) / 15);
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
        resetGame(true);
        const brain = population[currentIndex];
        let steps = 0;
        let nomove = 0;
        let maxSteps = 30;
        let outofBounds = false;
        let memory = [0, 0, 0, 0, 0, 0, 0, 0];
        let lastX = player.x;
        let lastY = player.y;
        // Determine if this AI should be partially rendered
        const renderThisOne = currentIndex % RENDER_INTERVAL === 0;
        async function step() {
            while (steps < maxSteps && aiRunning && !outofBounds) {
                const inputs = getInputs(memory);
                const outputs = feedForward(inputs, brain);
                memory = outputs.slice(4);
                AIControls.forward = outputs[0] > 0.5;
                AIControls.left = outputs[1] > 0.5;
                AIControls.right = outputs[2] > 0.5;
                AIControls.down = outputs[3] > 0.5;
                lastX = player.x;
                lastY = player.y;
                updateGame();
                if (player.x === lastX && player.y === lastY) {
                    nomove++;
                } else {
                    nomove = 0;
                    lastX = player.x;
                    lastY = player.y;
                }
                maxSteps = 30 + levelCount * 50;
                if (nomove > 3) {
                    outofBounds = true; //Resets the AI so it doesn't run for unnecessary time
                }
                if (spectateMode) {
                    if (currentIndex === 1) {
                        runningBest = true;
                    } else {
                        runningBest = false;
                    }
                    rewardDisplay.textContent = memory;
                    renderGame();
                    await new Promise(r => setTimeout(r, 100)); // Let browser breathe
                }
                steps++;
            }
            if (renderThisOne) {
                renderGame();
                await new Promise(r => setTimeout(r, 0)); // Let browser breathe
            }
            let distanceBox = Math.abs(goal.x - box.x) + Math.abs(goal.y - box.y);
            let distancePlayer = Math.abs(box.x - player.x) + Math.abs(box.y - player.y);
            brain.fitness = levelCount * 1000 - distanceBox * 30 - distancePlayer * 20 - steps * 0.005;
            rewardDisplay.textContent = brain.fitness;
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
