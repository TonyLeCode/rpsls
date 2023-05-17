import { useEffect, useState } from 'react';
import './App.css';
import Buttons from './components/Buttons';
import { io } from 'socket.io-client';
import Play from './components/Play';

// const endpoint = 'ws://localhost:3000';
const endpoint = 'wss://rock-paper-scissors-lizard-spock.onrender.com';
const socket = io(endpoint);

function App() {
	const [gameState, setGameState] = useState({
		score1: 0,
		score2: 0,
		win: false,
		full: false,
		player1: null,
		player2: null,
		id: null,
	});
	const [waitOpponent, setWaitOpponent] = useState(false);
	const [localPlayer, setLocalPlayer] = useState(null);
	const [roomError, setRoomError] = useState(false);
	const [input, setInput] = useState('');

	// console.log(gameState);

	useEffect(() => {
		socket.on('state', (gameState) => {
			setGameState(gameState);
		});
		socket.on('makeMove', (move) => {
			console.log(move);
			setWaitOpponent(true);
		});
		socket.on('result', (state, move1, move2) => {
			console.log(`Player 1 chose: ${move1}. Player 2 chose: ${move2}.`);
			setWaitOpponent(false);
			setGameState(state);
		});
		socket.on('message', (message) => {
			console.log(message);
		});
		socket.on('connected', (gameState) => {
			setGameState(gameState);
		});
		socket.on('room-error', () => {
			setRoomError(true);
		});
		socket.on('end', () => {
			;
		});
    socket.on('leave', () => {
      console.log('left room')
      setGameState({
        score1: 0,
        score2: 0,
        win: false,
        full: false,
        player1: null,
        player2: null,
        id: null,
      })
    })
	}, []);

	function handlePlay(choice) {
		setWaitOpponent(false);
		socket.emit('play', choice, gameState.id);
	}

	function joinRoom(roomId) {
		setLocalPlayer(2);
		socket.emit('join-room', roomId);
	}
	function createRoom() {
		setLocalPlayer(1);
		setRoomError(false);
		socket.emit('create-room');
	}

  function back(){
    socket.emit('leave', gameState.id)
  }

	return (
		<div className=''>
			{gameState.id === null ? (
				<div className='fadeIn flex flex-col gap-12 justify-center items-center -mt-48'>
					{roomError ? <h2 className='fadeIn absolute top-24 text-amber-300'>Room does not exist</h2> : null}
					<div className='fadeIn flex flex-col items-center w-full'>
						<label className='fadeIn mb-2' htmlFor='room-id'>
							Room Id
						</label>
						<input
							id='room-id'
							className='fadeIn w-full sm:w-3/4 md:w-1/2 h-10 px-3 mb-4'
							type='text'
							placeholder='Room Id'
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<button
							className='fadeIn bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded w-40 text-black text-lg font-semibold'
							onClick={() => joinRoom(input)}
						>
							Join Room
						</button>
					</div>
					<span>or</span>
					<button
						className='fadeIn bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded w-40 text-black text-lg font-semibold'
						onClick={() => createRoom()}
					>
						Create Room
					</button>
				</div>
			) : (
				<div className='max-w-3xl mx-auto'>
					<div className='-mt-12 mb-4 text-sm md:text-base'>Room Id: {gameState.id}</div>
					<Play gameState={gameState} localPlayer={localPlayer} />
					<Buttons win={gameState.win} waitOpponent={waitOpponent} handlePlay={handlePlay} back={back} />
				</div>
			)}
		</div>
	);
}

export default App;
