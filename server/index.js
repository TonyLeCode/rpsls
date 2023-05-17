const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});
const { v4: uuidv4 } = require('uuid');

const toWin = 2;
const connectionStates = new Map();

function withoutMoves(obj) {
	let newObj = {};

	for (let key in obj) {
		if (key !== 'player1Move' && key !== 'player2Move') {
			newObj[key] = obj[key];
		}
	}

	return newObj;
}

function determineWinner(choice1, choice2) {
	const choices = {
		rock: { winsAgainst: ['scissors', 'lizard'], losesAgainst: ['paper', 'spock'] },
		paper: { winsAgainst: ['rock', 'spock'], losesAgainst: ['scissors', 'lizard'] },
		scissors: { winsAgainst: ['paper', 'lizard'], losesAgainst: ['rock', 'spock'] },
		lizard: { winsAgainst: ['spock', 'paper'], losesAgainst: ['rock', 'scissors'] },
		spock: { winsAgainst: ['scissors', 'rock'], losesAgainst: ['paper', 'lizard'] },
	};

	if (choice1 === choice2) {
		return 0;
	} else if (choices[choice1].winsAgainst.includes(choice2)) {
		return 1;
	} else {
		return 2;
	}
}

io.on('connection', (socket) => {
	console.log('a user connected');
	// console.log(connectionStates)

	socket.on('create-room', () => {
		const connectionId = uuidv4();
		connectionStates.set(connectionId, {
			score1: 0,
			score2: 0,
			win: false,
			full: false,
			player1: socket.id,
			player2: null,
			id: connectionId,
			player1Move: null,
			player2Move: null,
		});
		socket.join(connectionId);
		socket.to(connectionId).emit('message', `${socket.id} has joined ${connectionId}`);
		socket.emit('connected', withoutMoves(connectionStates.get(connectionId)));
		// console.log(connectionStates.get(connectionId))
		// socket.to(connectionId).emit('message', `${socket} has joined ${connectionId}`)
	});

	socket.on('join-room', (id) => {
		const room = connectionStates.get(id);

		if (!room) {
			console.log('Room does not exist');
			socket.emit('message', 'Room does not exist');
			return;
		}
		if (room.full === false) {
			// console.log('Not full!');
			room.full = true;
			room.player2 = socket.id;
			socket.join(id);
			socket.emit('connected', withoutMoves(room));
			// socket.emit('connected', withoutMoves(connectionStates.get(connectionId)));
			socket.to(id).emit('message', `${socket.id} has joined ${id}`);
			socket.to(id).emit('state', withoutMoves(room));
			// socket.to(id).emit('state', withoutMoves(connectionStates.get(connectionId)))
		} else {
			console.log('Room full');
			socket.emit('message', 'Room is full');
		}
	});

	socket.on('message', (message) => {
		console.log(message);
		io.emit('message', `${socket.id} said ${message}`);
	});

	socket.on('leave', (id) => {
		if (connectionStates.get(id)) {
			connectionStates.delete(id);
		}
		console.log('Left Room');
		socket.emit('leave');
	});

	socket.on('play', (choice, id) => {
		// console.log(choice);
		const room = connectionStates.get(id);
		let madeMove = false;

		if (!room) {
			return;
		}

		if (socket.id === room.player1) {
			if (!room.player1Move) {
				room.player1Move = choice;
				madeMove = true;
			}
		}

		if (socket.id === room.player2) {
			if (!room.player2Move) {
				room.player2Move = choice;
				madeMove = true;
			}
		}

		if (room.player1Move && room.player2Move) {
			// console.log(room.player1Move, room.player2Move);
			const result = determineWinner(room.player1Move, room.player2Move);

			if (room.win) {
				return;
			}

			if (result === 0) {
				console.log('draw');
			} else if (result === 1) {
				room.score1++;
				console.log('player 1 wins');
			} else if (result === 2) {
				room.score2++;
				console.log('player 2 wins');
			}
			if (room.score1 === toWin || room.score2 === toWin) {
				console.log('game end');
				room.win = result;
				io.to(id).emit('end'); // TODO end game
			}

			io.to(id).emit('result', withoutMoves(room), room.player1Move, room.player2Move);
			room.player1Move = null;
			room.player2Move = null;
		} else if (madeMove) {
			socket.emit('makeMove', `${socket.id} played ${choice}`);
		}
	});
});

const port = process.env.PORT || 3000

server.listen(port, () => {
	console.log('listening on port 3000');
});
