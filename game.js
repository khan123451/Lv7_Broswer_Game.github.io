/*
 * Lin's Escalator Journey - A 2D Browser Game
 * 
 * HOW TO RUN LOCALLY:
 * 1. Download all files (index.html, styles.css, game.js) to the same folder
 * 2. Open index.html in any modern web browser (Chrome, Firefox, Safari, Edge)
 * 3. The game will run entirely in the browser - no server required
 * 
 * CONTROLS:
 * - WASD: Move Lin around
 * - K: Activate escalator control panel
 * - F: Talk to NPCs
 * - Y/N: Make dialogue choices
 * 
 * SAVE/LOAD:
 * - Click "Save" button during gameplay to save progress
 * - Use "Load Game" from title screen to continue
 * - 3 save slots available
 */

// Game State Management
const GameState = {
    TITLE: 'title',
    PLAYING: 'playing',
    DIALOG: 'dialog',
    BAD_ENDING: 'badEnding',
    GOOD_ENDING: 'goodEnding'
};

// Game Variables
let gameState = GameState.TITLE;
let currentLevel = 1;
let inventory = {
    pepperSpray: false,
    dog: false
};

// Player and Game Objects
let player = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    speed: 3
};

let escalatorPanel = {
    x: 700,
    y: 280,
    width: 60,
    height: 40
};

let npcs = [];
let attackers = [];
let movementPaused = false;
let defenseAnimationPlaying = false;

// Canvas and Context
let canvas, ctx;

// Input Handling
let keys = {};
let nearestNPC = null;

// Save/Load System
const SAVE_KEY_PREFIX = 'lins_escalator_save_';

// Visual Assets (SVG-based for crisp rendering)
const sprites = {
    player: null,
    kimi: null,
    grandpa: null,
    attacker: null,
    escalator: null,
    panel: null
};

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Create visual assets
    createSprites();
    
    setupEventListeners();
    showScreen(GameState.TITLE);
    
    // Start game loop
    gameLoop();
});

function createSprites() {
    // Create Lin (Player) sprite
    sprites.player = createPlayerSprite();
    
    // Create NPC sprites
    sprites.kimi = createKimiSprite();
    sprites.grandpa = createGrandpaSprite();
    sprites.attacker = createAttackerSprite();
    
    // Create environment sprites
    sprites.escalator = createEscalatorSprite();
    sprites.panel = createPanelSprite();
}

function createPlayerSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    // Draw Lin - a tired female traveler
    // Head
    ctx.fillStyle = '#FDBCB4'; // Skin tone
    ctx.beginPath();
    ctx.arc(20, 12, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(20, 10, 9, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // Eyes (tired)
    ctx.fillStyle = '#000';
    ctx.fillRect(17, 10, 2, 1);
    ctx.fillRect(21, 10, 2, 1);
    
    // Body
    ctx.fillStyle = '#4A90E2'; // Blue shirt
    ctx.fillRect(15, 20, 10, 15);
    
    // Arms
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(12, 22, 3, 8);
    ctx.fillRect(25, 22, 3, 8);
    
    // Legs
    ctx.fillStyle = '#2C3E50'; // Dark pants
    ctx.fillRect(16, 35, 3, 5);
    ctx.fillRect(21, 35, 3, 5);
    
    // Luggage (small bag)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(10, 25, 4, 3);
    
    return canvas;
}

function createKimiSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    // Draw Kimi - helpful woman
    // Head
    ctx.fillStyle = '#FDBCB4';
    ctx.beginPath();
    ctx.arc(20, 12, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair (longer)
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(20, 10, 10, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(12, 15, 16, 5);
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(17, 10, 2, 2);
    ctx.fillRect(21, 10, 2, 2);
    
    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(20, 14, 3, 0, Math.PI);
    ctx.stroke();
    
    // Body
    ctx.fillStyle = '#E74C3C'; // Red top
    ctx.fillRect(15, 20, 10, 15);
    
    // Arms
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(12, 22, 3, 8);
    ctx.fillRect(25, 22, 3, 8);
    
    // Legs
    ctx.fillStyle = '#34495E';
    ctx.fillRect(16, 35, 3, 5);
    ctx.fillRect(21, 35, 3, 5);
    
    return canvas;
}

function createGrandpaSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    // Draw Grandpa
    // Head
    ctx.fillStyle = '#FDBCB4';
    ctx.beginPath();
    ctx.arc(20, 12, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Gray hair
    ctx.fillStyle = '#BDC3C7';
    ctx.beginPath();
    ctx.arc(20, 10, 9, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // Beard
    ctx.fillStyle = '#BDC3C7';
    ctx.fillRect(16, 16, 8, 4);
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(17, 10, 2, 2);
    ctx.fillRect(21, 10, 2, 2);
    
    // Body
    ctx.fillStyle = '#8E44AD'; // Purple sweater
    ctx.fillRect(15, 20, 10, 15);
    
    // Arms
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(12, 22, 3, 8);
    ctx.fillRect(25, 22, 3, 8);
    
    // Legs
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(16, 35, 3, 5);
    ctx.fillRect(21, 35, 3, 5);
    
    // Dog (small)
    ctx.fillStyle = '#D2691E';
    ctx.fillRect(30, 32, 8, 6);
    ctx.fillRect(32, 30, 4, 2); // head
    ctx.fillRect(30, 38, 2, 2); // legs
    ctx.fillRect(34, 38, 2, 2);
    ctx.fillRect(36, 38, 2, 2);
    ctx.fillRect(38, 32, 3, 1); // tail
    
    return canvas;
}

function createAttackerSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 35;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    // Draw menacing figure
    // Head
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(17, 12, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Hood
    ctx.fillStyle = '#1A252F';
    ctx.beginPath();
    ctx.arc(17, 10, 10, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // Eyes (red)
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(14, 10, 2, 2);
    ctx.fillRect(19, 10, 2, 2);
    
    // Body
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(12, 20, 10, 15);
    
    // Arms
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(9, 22, 3, 8);
    ctx.fillRect(23, 22, 3, 8);
    
    // Legs
    ctx.fillStyle = '#1A252F';
    ctx.fillRect(13, 35, 3, 5);
    ctx.fillRect(18, 35, 3, 5);
    
    return canvas;
}

function createEscalatorSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Escalator structure
    ctx.fillStyle = '#95A5A6';
    ctx.fillRect(0, 0, 100, 400);
    
    // Side rails
    ctx.fillStyle = '#7F8C8D';
    ctx.fillRect(0, 0, 10, 400);
    ctx.fillRect(90, 0, 10, 400);
    
    // Steps
    ctx.fillStyle = '#BDC3C7';
    for (let i = 0; i < 12; i++) {
        const y = i * 32;
        ctx.fillRect(15, y, 70, 28);
        
        // Step edge
        ctx.fillStyle = '#34495E';
        ctx.fillRect(15, y + 26, 70, 2);
        ctx.fillStyle = '#BDC3C7';
        
        // Step grooves
        ctx.fillStyle = '#95A5A6';
        for (let j = 0; j < 5; j++) {
            ctx.fillRect(20 + j * 12, y + 5, 8, 2);
            ctx.fillRect(20 + j * 12, y + 10, 8, 2);
            ctx.fillRect(20 + j * 12, y + 15, 8, 2);
            ctx.fillRect(20 + j * 12, y + 20, 8, 2);
        }
        ctx.fillStyle = '#BDC3C7';
    }
    
    // Handrails
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(5, 0, 5, 400);
    ctx.fillRect(90, 0, 5, 400);
    
    return canvas;
}

function createPanelSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 60;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    // Panel background
    ctx.fillStyle = '#F39C12';
    ctx.fillRect(0, 0, 60, 40);
    
    // Panel border
    ctx.strokeStyle = '#E67E22';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 56, 36);
    
    // Button
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.arc(30, 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Button highlight
    ctx.fillStyle = '#C0392B';
    ctx.beginPath();
    ctx.arc(30, 20, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#000';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CALL', 30, 32);
    
    return canvas;
}

function setupEventListeners() {
    // Title Screen
    document.getElementById('playButton').addEventListener('click', startNewGame);
    document.getElementById('loadButton').addEventListener('click', showLoadMenu);
    document.getElementById('cancelLoad').addEventListener('click', hideLoadMenu);
    
    // Save/Load Slots
    document.querySelectorAll('.save-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            const slotNumber = this.dataset.slot;
            if (document.getElementById('saveSlots').classList.contains('active') || 
                !document.getElementById('saveSlots').classList.contains('hidden')) {
                loadGame(slotNumber);
            } else if (document.getElementById('saveMenu').classList.contains('active') ||
                      !document.getElementById('saveMenu').classList.contains('hidden')) {
                saveGame(slotNumber);
            }
        });
    });
    
    // Save Menu
    document.getElementById('saveButton').addEventListener('click', showSaveMenu);
    document.getElementById('cancelSave').addEventListener('click', hideSaveMenu);
    
    // Dialog Choices
    document.getElementById('yesButton').addEventListener('click', () => handleDialogChoice(true));
    document.getElementById('noButton').addEventListener('click', () => handleDialogChoice(false));
    
    // Ending Screens
    document.getElementById('retryButton').addEventListener('click', startNewGame);
    document.getElementById('continueButton').addEventListener('click', () => showScreen(GameState.TITLE));
    
    // Keyboard Input
    document.addEventListener('keydown', function(e) {
        keys[e.key.toLowerCase()] = true;
        handleKeyPress(e.key.toLowerCase());
    });
    
    document.addEventListener('keyup', function(e) {
        keys[e.key.toLowerCase()] = false;
    });
}

function handleKeyPress(key) {
    if (gameState === GameState.PLAYING && !movementPaused) {
        switch(key) {
            case 'k':
                tryUseEscalator();
                break;
            case 'f':
                tryTalkToNPC();
                break;
        }
    } else if (gameState === GameState.DIALOG) {
        switch(key) {
            case 'y':
                handleDialogChoice(true);
                break;
            case 'n':
                handleDialogChoice(false);
                break;
        }
    }
}

function startNewGame() {
    currentLevel = 1;
    inventory = { pepperSpray: false, dog: false };
    player = { x: 100, y: 300, width: 40, height: 40, speed: 3 };
    npcs = [];
    attackers = [];
    movementPaused = false;
    defenseAnimationPlaying = false;
    
    setupLevel(currentLevel);
    updateHUD();
    showScreen(GameState.PLAYING);
}

function setupLevel(level) {
    npcs = [];
    attackers = [];
    
    switch(level) {
        case 1:
            // No NPCs on level 1
            break;
        case 2:
            npcs.push({
                name: 'Kimi',
                x: 400,
                y: 200,
                width: 40,
                height: 40,
                color: '#e74c3c',
                talked: false,
                question: "There's news of harassment in the city—do you need protection?",
                yesAction: () => { inventory.pepperSpray = true; },
                noAction: () => {}
            });
            break;
        case 3:
            npcs.push({
                name: 'Grandpa with Dog',
                x: 300,
                y: 400,
                width: 50,
                height: 40,
                color: '#8e44ad',
                talked: false,
                question: "Will you walk my dog upstairs?",
                yesAction: () => { inventory.dog = true; },
                noAction: () => {}
            });
            break;
        case 4:
            // NPCs disappear on level 4
            break;
        case 5:
            // Spawn attackers
            attackers.push(
                { x: 200, y: 150, width: 35, height: 40, color: '#2c3e50' },
                { x: 500, y: 450, width: 35, height: 40, color: '#2c3e50' }
            );
            
            // Check if player has both items for defense
            if (inventory.pepperSpray && inventory.dog) {
                setTimeout(() => {
                    playDefenseAnimation();
                }, 1000);
            } else {
                setTimeout(() => {
                    showScreen(GameState.BAD_ENDING);
                }, 2000);
            }
            break;
        case 6:
            // Safe arrival
            setTimeout(() => {
                showScreen(GameState.GOOD_ENDING);
            }, 1000);
            break;
    }
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (gameState === GameState.PLAYING && !movementPaused && !defenseAnimationPlaying) {
        // Player movement
        if (keys['w'] && player.y > 0) player.y -= player.speed;
        if (keys['s'] && player.y < canvas.height - player.height) player.y += player.speed;
        if (keys['a'] && player.x > 0) player.x -= player.speed;
        if (keys['d'] && player.x < canvas.width - player.width) player.x += player.speed;
        
        // Check for nearest NPC
        nearestNPC = findNearestNPC();
    }
}

function render() {
    if (gameState !== GameState.PLAYING) return;
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw floor pattern
    drawFloorPattern();
    
    // Draw level background
    drawLevelBackground();
    
    // Draw escalator
    ctx.drawImage(sprites.escalator, 650, 100);
    
    // Draw escalator panel
    ctx.drawImage(sprites.panel, escalatorPanel.x, escalatorPanel.y);
    
    // Draw NPCs with their sprites
    npcs.forEach(npc => {
        let sprite;
        switch(npc.name) {
            case 'Kimi':
                sprite = sprites.kimi;
                break;
            case 'Grandpa with Dog':
                sprite = sprites.grandpa;
                break;
            default:
                sprite = sprites.kimi;
        }
        ctx.drawImage(sprite, npc.x, npc.y);
        
        // Name label with background
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(npc.x - 5, npc.y - 20, npc.name.length * 6 + 10, 15);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.fillText(npc.name, npc.x, npc.y - 8);
    });
    
    // Draw attackers
    attackers.forEach(attacker => {
        ctx.drawImage(sprites.attacker, attacker.x, attacker.y);
        
        // Menacing label
        ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.fillRect(attacker.x - 5, attacker.y - 20, 60, 15);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('DANGER!', attacker.x, attacker.y - 8);
    });
    
    // Draw player (Lin)
    ctx.drawImage(sprites.player, player.x, player.y);
    
    // Player name label
    ctx.fillStyle = 'rgba(52, 152, 219, 0.8)';
    ctx.fillRect(player.x + 5, player.y - 20, 25, 15);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('Lin', player.x + 8, player.y - 8);
    
    // Draw interaction prompts with better styling
    if (nearestNPC && getDistance(player, nearestNPC) < 80) {
        drawInteractionPrompt('Press F to talk', nearestNPC.x, nearestNPC.y + nearestNPC.height + 30, '#27AE60');
    }
    
    if (getDistance(player, escalatorPanel) < 80) {
        drawInteractionPrompt('Press K to use escalator', escalatorPanel.x - 30, escalatorPanel.y + escalatorPanel.height + 30, '#F39C12');
    }
    
    // Draw defense animation
    if (defenseAnimationPlaying) {
        drawDefenseAnimation();
    }
}

function drawFloorPattern() {
    // Draw tile pattern
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let x = 0; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
            if ((x + y) % 100 === 0) {
                ctx.fillRect(x, y, 48, 48);
            }
        }
    }
}

function drawInteractionPrompt(text, x, y, color) {
    // Background bubble
    const textWidth = ctx.measureText(text).width;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 15, textWidth + 20, 20, 10);
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(text, x, y);
    
    // Pointer
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + textWidth/2, y + 5);
    ctx.lineTo(x + textWidth/2 - 5, y + 12);
    ctx.lineTo(x + textWidth/2 + 5, y + 12);
    ctx.closePath();
    ctx.fill();
}

// Add roundRect method if not available
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

function drawLevelBackground() {
    // Draw floor indicator with better styling
    const gradient = ctx.createLinearGradient(10, 10, 210, 50);
    gradient.addColorStop(0, '#2C3E50');
    gradient.addColorStop(1, '#34495E');
    ctx.fillStyle = gradient;
    ctx.fillRect(10, 10, 200, 40);
    
    // Border
    ctx.strokeStyle = '#ECF0F1';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 40);
    
    // Level text
    ctx.fillStyle = '#ECF0F1';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Level ${currentLevel}`, 20, 35);
    
    // Add level description
    ctx.fillStyle = '#BDC3C7';
    ctx.font = '12px Arial';
    const levelDesc = getLevelDescription(currentLevel);
    ctx.fillText(levelDesc, 20, 65);
    
    // Draw building structure
    drawBuildingStructure();
}

function getLevelDescription(level) {
    switch(level) {
        case 1: return 'Ground Floor - Find the escalator';
        case 2: return 'Floor 2 - Meet Kimi';
        case 3: return 'Floor 3 - Meet Grandpa';
        case 4: return 'Floor 4 - Transition';
        case 5: return 'Floor 5 - DANGER ZONE!';
        case 6: return 'Floor 6 - Hotel Room (Safe!)';
        default: return '';
    }
}

function drawBuildingStructure() {
    // Draw building outline
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Building walls
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(50, 500);
    ctx.lineTo(600, 500);
    ctx.lineTo(600, 100);
    ctx.stroke();
    
    // Floor divisions
    for (let i = 1; i <= 6; i++) {
        const y = 500 - (i * 60);
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(600, y);
        ctx.stroke();
        
        // Floor numbers on the side
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '12px Arial';
        ctx.fillText(`${i}`, 30, y + 30);
    }
    
    ctx.setLineDash([]);
}

function findNearestNPC() {
    let nearest = null;
    let minDistance = Infinity;
    
    npcs.forEach(npc => {
        const distance = getDistance(player, npc);
        if (distance < minDistance && distance < 80) {
            minDistance = distance;
            nearest = npc;
        }
    });
    
    return nearest;
}

function getDistance(obj1, obj2) {
    const dx = (obj1.x + obj1.width/2) - (obj2.x + obj2.width/2);
    const dy = (obj1.y + obj1.height/2) - (obj2.y + obj2.height/2);
    return Math.sqrt(dx*dx + dy*dy);
}

function tryUseEscalator() {
    if (getDistance(player, escalatorPanel) < 80) {
        // Check if all NPCs have been talked to (if any exist)
        const untalkednpcs = npcs.filter(npc => !npc.talked);
        if (untalkednpcs.length === 0) {
            currentLevel++;
            if (currentLevel <= 6) {
                setupLevel(currentLevel);
                updateHUD();
                // Reset player position
                player.x = 100;
                player.y = 300;
            }
        }
    }
}

function tryTalkToNPC() {
    if (nearestNPC && !nearestNPC.talked) {
        startDialog(nearestNPC);
    }
}

function startDialog(npc) {
    movementPaused = true;
    showScreen(GameState.DIALOG);
    
    document.getElementById('npcName').textContent = npc.name;
    document.getElementById('dialogText').textContent = npc.question;
}

function handleDialogChoice(isYes) {
    const npc = nearestNPC;
    if (npc) {
        npc.talked = true;
        
        if (isYes) {
            npc.yesAction();
        } else {
            npc.noAction();
        }
        
        updateHUD();
    }
    
    movementPaused = false;
    showScreen(GameState.PLAYING);
}

function playDefenseAnimation() {
    defenseAnimationPlaying = true;
    
    // Simple defense animation - could be enhanced
    let animationFrame = 0;
    const animationDuration = 60; // frames
    
    const animate = () => {
        animationFrame++;
        if (animationFrame >= animationDuration) {
            defenseAnimationPlaying = false;
            // Automatically proceed to next level
            currentLevel++;
            setupLevel(currentLevel);
            updateHUD();
            player.x = 100;
            player.y = 300;
        } else {
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

function drawDefenseAnimation() {
    // Draw defense effects with better visuals
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, 300);
    gradient.addColorStop(0, 'rgba(46, 204, 113, 0.6)');
    gradient.addColorStop(1, 'rgba(46, 204, 113, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Defense action illustrations
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Lin defends herself successfully!', canvas.width/2, canvas.height/2 - 40);
    
    // Show items being used
    ctx.font = '18px Arial';
    ctx.fillText('🌶️ Pepper Spray Used!', canvas.width/2, canvas.height/2);
    ctx.fillText('🐕 Dog Companion Helps!', canvas.width/2, canvas.height/2 + 30);
    
    // Action effects
    ctx.strokeStyle = '#F1C40F';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(canvas.width/2 + Math.cos(i * 1.2) * 100, canvas.height/2 + Math.sin(i * 1.2) * 100, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.textAlign = 'left';
}

function updateHUD() {
    document.getElementById('levelDisplay').textContent = currentLevel;
    
    const pepperIcon = document.getElementById('pepperSprayIcon');
    const dogIcon = document.getElementById('dogIcon');
    
    if (inventory.pepperSpray) {
        pepperIcon.classList.remove('greyed');
        pepperIcon.classList.add('active');
    } else {
        pepperIcon.classList.add('greyed');
        pepperIcon.classList.remove('active');
    }
    
    if (inventory.dog) {
        dogIcon.classList.remove('greyed');
        dogIcon.classList.add('active');
    } else {
        dogIcon.classList.add('greyed');
        dogIcon.classList.remove('active');
    }
}

function showScreen(screen) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // Show target screen
    switch(screen) {
        case GameState.TITLE:
            document.getElementById('titleScreen').classList.add('active');
            break;
        case GameState.PLAYING:
            document.getElementById('gameScreen').classList.add('active');
            break;
        case GameState.DIALOG:
            document.getElementById('dialogScreen').classList.add('active');
            break;
        case GameState.BAD_ENDING:
            document.getElementById('badEndingScreen').classList.add('active');
            break;
        case GameState.GOOD_ENDING:
            document.getElementById('goodEndingScreen').classList.add('active');
            break;
    }
    
    gameState = screen;
}

// Save/Load System
function showSaveMenu() {
    document.getElementById('saveMenu').classList.remove('hidden');
    document.getElementById('saveMenu').classList.add('active');
}

function hideSaveMenu() {
    document.getElementById('saveMenu').classList.add('hidden');
    document.getElementById('saveMenu').classList.remove('active');
}

function showLoadMenu() {
    document.getElementById('saveSlots').classList.remove('hidden');
    document.getElementById('saveSlots').classList.add('active');
    updateLoadSlots();
}

function hideLoadMenu() {
    document.getElementById('saveSlots').classList.add('hidden');
    document.getElementById('saveSlots').classList.remove('active');
}

function updateLoadSlots() {
    document.querySelectorAll('#saveSlots .save-slot').forEach(slot => {
        const slotNumber = slot.dataset.slot;
        const saveData = localStorage.getItem(SAVE_KEY_PREFIX + slotNumber);
        
        if (saveData) {
            const data = JSON.parse(saveData);
            slot.textContent = `Slot ${slotNumber} - Level ${data.currentLevel}`;
            slot.disabled = false;
        } else {
            slot.textContent = `Slot ${slotNumber} - Empty`;
            slot.disabled = true;
        }
    });
}

function saveGame(slotNumber) {
    const saveData = {
        currentLevel: currentLevel,
        inventory: { ...inventory },
        player: { ...player },
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(SAVE_KEY_PREFIX + slotNumber, JSON.stringify(saveData));
    hideSaveMenu();
    
    // Show save confirmation
    alert(`Game saved to Slot ${slotNumber}!`);
}

function loadGame(slotNumber) {
    const saveData = localStorage.getItem(SAVE_KEY_PREFIX + slotNumber);
    
    if (saveData) {
        const data = JSON.parse(saveData);
        
        currentLevel = data.currentLevel;
        inventory = { ...data.inventory };
        player = { ...data.player };
        
        setupLevel(currentLevel);
        updateHUD();
        hideLoadMenu();
        showScreen(GameState.PLAYING);
    }
}

// Initialize save slot display on load
document.addEventListener('DOMContentLoaded', function() {
    // Update save menu slots
    document.querySelectorAll('#saveMenu .save-slot').forEach(slot => {
        const slotNumber = slot.dataset.slot;
        const saveData = localStorage.getItem(SAVE_KEY_PREFIX + slotNumber);
        
        if (saveData) {
            const data = JSON.parse(saveData);
            slot.textContent = `Slot ${slotNumber} - Level ${data.currentLevel}`;
        } else {
            slot.textContent = `Slot ${slotNumber} - Empty`;
        }
    });
});
