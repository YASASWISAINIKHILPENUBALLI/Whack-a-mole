class WhackAMole {
    constructor() {
        this.holes = document.querySelectorAll('.hole');
        this.moles = document.querySelectorAll('.mole');
        this.scoreBoards = {
            player1: document.querySelector('#score1'),
            player2: document.querySelector('#score2')
        };
        this.timeDisplay = document.querySelector('#time');
        this.startBtn = document.querySelector('#startGame');
        this.multiplayerBtn = document.querySelector('#startMultiplayer');
        this.difficultySelect = document.querySelector('#difficulty');
        this.themeSelect = document.querySelector('#theme');
        
        this.scores = { player1: 0, player2: 0 };
        this.gameTime = 60000; // 60 seconds
        this.isPlaying = false;
        this.currentPlayer = 'player1';
        this.socket = null;

        this.bindEvents();
        this.initializeThemes();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.multiplayerBtn.addEventListener('click', () => this.startMultiplayerGame());
        this.themeSelect.addEventListener('change', () => this.changeTheme());
        
        this.moles.forEach(mole => {
            mole.addEventListener('click', (e) => {
                if (this.isPlaying) {
                    const hole = e.target.parentNode;
                    if (hole.classList.contains('up')) {
                        this.scores[this.currentPlayer]++;
                        this.updateScore();
                        hole.classList.remove('up');
                        
                        if (this.socket) {
                            this.socket.emit('moleWhacked', {
                                holeIndex: Array.from(this.holes).indexOf(hole),
                                player: this.currentPlayer
                            });
                        }
                    }
                }
            });
        });
    }

    initializeThemes() {
        this.themes = {
            default: { background: '#fff', color: '#000' },
            night: { background: '#222', color: '#fff' },
            garden: { background: '#90EE90', color: '#333' }
        };
    }

    changeTheme() {
        const theme = this.themeSelect.value;
        document.body.className = `theme-${theme}`;
    }

    getDifficultySettings() {
        const settings = {
            easy: { min: 1000, max: 2000 },
            medium: { min: 500, max: 1500 },
            hard: { min: 200, max: 1000 }
        };
        return settings[this.difficultySelect.value];
    }

    randomHole() {
        const idx = Math.floor(Math.random() * this.holes.length);
        const hole = this.holes[idx];
        
        if (hole === this.lastHole) {
            return this.randomHole();
        }
        
        this.lastHole = hole;
        return hole;
    }

    showMole() {
        const { min, max } = this.getDifficultySettings();
        const time = Math.random() * (max - min) + min;
        const hole = this.randomHole();
        
        hole.classList.add('up');
        
        setTimeout(() => {
            hole.classList.remove('up');
            if (this.isPlaying) this.showMole();
        }, time);
    }

    updateScore() {
        this.scoreBoards.player1.textContent = this.scores.player1;
        this.scoreBoards.player2.textContent = this.scores.player2;
    }

    startGame() {
        this.scores.player1 = 0;
        this.scores.player2 = 0;
        this.updateScore();
        this.isPlaying = true;
        this.showMole();
        
        let timeLeft = this.gameTime / 1000;
        
        const timer = setInterval(() => {
            timeLeft--;
            this.timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.endGame();
            }
        }, 1000);
    }

    startMultiplayerGame() {
        if (!this.socket) {
            this.socket = io('http://localhost:3000');
            
            this.socket.on('gameStart', () => this.startGame());
            this.socket.on('moleWhacked', data => {
                const hole = this.holes[data.holeIndex];
                hole.classList.remove('up');
                this.scores[data.player]++;
                this.updateScore();
            });
        }
        
        this.socket.emit('joinGame');
    }

    endGame() {
        this.isPlaying = false;
        alert(`Game Over!\nPlayer 1: ${this.scores.player1}\nPlayer 2: ${this.scores.player2}`);
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    const game = new WhackAMole();
});