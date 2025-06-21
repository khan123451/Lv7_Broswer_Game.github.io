# Lin's Escalator Journey

A 2D single-player browser game where you guide Lin, a tired traveler, through a dangerous escalator journey from the ground floor to her hotel room.

## How to Run

1. Download all files to the same folder:
   - `index.html`
   - `styles.css` 
   - `game.js`

2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)

3. The game runs entirely in the browser - no server or installation required!

## Game Story

Lin is a tired traveler who needs to reach her hotel room on the 6th floor. She must ride the escalator through 6 levels, making crucial decisions that determine whether she survives the journey.

## Controls

- **WASD** - Move Lin up, left, down, right
- **K** - Activate escalator control panel to move to next floor
- **F** - Talk to NPCs
- **Y/N** - Select Yes or No in dialogue boxes

## Gameplay

### Level 1 (Ground Floor)
- No NPCs present
- Find and activate the escalator panel to ascend

### Level 2
- Meet **Kimi** who offers protection
- Choice: Accept pepper spray for city harassment protection?

### Level 3  
- Meet **Grandpa with Dog** 
- Choice: Agree to walk his dog upstairs?

### Level 4
- NPCs reach their destination and leave
- Continue to next floor

### Level 5 (Danger Zone)
- Two attackers appear
- **Win Condition**: Have both pepper spray AND dog companion
- **Lose Condition**: Missing either item leads to bad ending

### Level 6 (Hotel Room)
- Safe arrival cutscene
- Victory achieved!

## Save/Load System

- **Save**: Click the "Save" button during gameplay
- **Load**: Use "Load Game" from the title screen
- **3 Save Slots**: Multiple save files supported
- **Auto-Save**: Progress is saved locally in your browser

## Technical Features

- Responsive design works on desktop and mobile
- HTML5 Canvas rendering with placeholder graphics
- State machine architecture (title, playing, dialog, ending)
- Local storage save system
- Smooth animations and transitions

## Game States

The game tracks:
- `currentLevel` (1-6)
- `inventory.pepperSpray` (boolean)
- `inventory.dog` (boolean) 
- `gameState` (title, playing, dialog, ending)

## Art Assets

Currently uses colored rectangles as placeholders:
- **Lin** (Player): Blue rectangle
- **Kimi**: Red rectangle  
- **Grandpa**: Purple rectangle
- **Attackers**: Dark gray rectangles
- **Escalator Panel**: Orange rectangle

These can be easily replaced with actual sprites by modifying the render functions in `game.js`.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
amazon_q_game/
├── index.html      # Main HTML structure
├── styles.css      # Game styling and layout
├── game.js         # Core game logic and mechanics
└── README.md       # This file
```

## Development Notes

- Game uses HTML5 Canvas for rendering
- Save data stored in localStorage
- Modular code structure for easy expansion
- Event-driven architecture for user input
- CSS animations for UI transitions

Enjoy your journey with Lin! 🎮
