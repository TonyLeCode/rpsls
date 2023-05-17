function Play({ gameState, localPlayer }) {
	return (
		<div className='grid grid-cols-3 mb-12 justify-center items-center md:'>
			<div>
				<h3 className={`text-xs md:text-base mb-6 ${localPlayer === 1 ? 'text-amber-400' : ''}`}>
					{localPlayer === 1 ? 'You: ' : 'Opponent: '}
					{/* {gameState.player1} */}
				</h3>
				<h2 className='text-7xl'>{gameState.score1}</h2>
			</div>
			<span className='text-4xl mt-12'>-</span>
			<div>
				<h3 className={`text-xs md:text-base mb-6 ${localPlayer === 2 ? 'text-amber-400' : ''}`}>
					{localPlayer === 2 ? 'You: ' : 'Opponent: '}
					{/* {gameState.player2} */}
				</h3>
				<h2 className='text-7xl'>{gameState.score2}</h2>
			</div>
		</div>
	);
}

export default Play;
