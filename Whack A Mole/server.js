const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const waitingPlayers = new Set();
const activeGames = new Map();

io.on('connection', (socket) => {
    socket.on('joinGame', () => {
        waitingPlayers.add(socket);
        
        if (waitingPlayers.size >= 2) {
            const players = Array.from(waitingPlayers).slice(0, 2);
            const gameId = Date.now().toString();
            
            players.forEach(player => {
                waitingPlayers.delete(player);
                player.join(gameId);
            });
            
            activeGames.set(gameId, players);
            io.to(gameId).emit('gameStart');
        }
    });

    socket.on('moleWhacked', (data) => {
        socket.broadcast.emit('moleWhacked', data);
    });

    socket.on('disconnect', () => {
        waitingPlayers.delete(socket);
    });
});

http.listen(3000, () => {
    console.log('Server running on port 3000');
});