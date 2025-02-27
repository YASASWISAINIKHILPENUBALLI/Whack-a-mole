# Whack-a-Mole Game

## Description

This game includes a multiplayer mode, allowing players to compete in real-time over a network. This is a browser-based Whack-a-Mole game that supports both single-player and multiplayer modes. The game features different difficulty levels and theme customization.

## Features

![Game Screenshot](http://localhost:3000/mole.jpeg)

- Single-player and multiplayer modes
- Adjustable difficulty settings (Easy, Medium, Hard)
- Theme customization (Default, Night, Garden)
- Real-time multiplayer support using Socket.IO

## Technologies Used

- HTML, CSS, JavaScript
- Node.js and Express.js (for the server)
- Socket.IO (for real-time multiplayer functionality)

## Algorithms Used

### 1. Random Mole Appearance

The game uses a random number generator to determine which hole a mole will appear in. This prevents predictable patterns and increases engagement.

```js
randomHole() {
    const idx = Math.floor(Math.random() * this.holes.length);
    const hole = this.holes[idx];
    if (hole === this.lastHole) {
        return this.randomHole();
    }
    this.lastHole = hole;
    return hole;
}
```

### 2. Difficulty Scaling

Different difficulty levels are managed by setting the minimum and maximum time a mole stays visible. The game selects a random time within this range for each mole.

```js
getDifficultySettings() {
    const settings = {
        easy: { min: 1000, max: 2000 },
        medium: { min: 500, max: 1500 },
        hard: { min: 200, max: 1000 }
    };
    return settings[this.difficultySelect.value];
}
```

### 3. Multiplayer Synchronization

Multiplayer mode is handled using Socket.IO. When a player whacks a mole, the server broadcasts this event to all connected clients to update their game states.

```js
socket.on('moleWhacked', data => {
    const hole = this.holes[data.holeIndex];
    hole.classList.remove('up');
    this.scores[data.player]++;
    this.updateScore();
});
```

## Setup Instructions

### Prerequisites

- Install Node.js and npm.

### Installation

1. Clone or download the repository.
2. Navigate to the project folder and install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node server.js
   ```
4. Open `index.html` in a browser or run a local server to access the game.

## How to Play

![Game Screenshot](http://localhost:3000/mole.jpeg)

Multiplayer mode allows two players to compete by joining the game through a server.

1. Open the game in a web browser.
2. Choose a difficulty level and theme.
3. Click "Start Game" for single-player mode.
4. Click "Start Multiplayer" to connect with another player online.
5. Whack the moles by clicking on them before they disappear.
6. The player with the highest score at the end of the timer wins.

## File Structure

```
📁 project-folder
│── index.html          # Main game page
│── styles.css          # Styles for the game
│── game.js            # Frontend game logic
│── server.js          # Server for multiplayer mode
│── package.json       # Project dependencies
```

## Future Improvements

- Add sound effects for better user experience.
- Implement a leaderboard for high scores.
- Introduce power-ups for more engaging gameplay.

## License

This project is licensed under the MIT License.

