function Buttons({win, waitOpponent, handlePlay, back}) {
	function upperCase(str) {
		return str[0].toUpperCase() + str.slice(1);
	}
	function tooltipString(winsAgainst, losesAgainst) {
		return `winsAgainst ${upperCase(winsAgainst[0])} and ${upperCase(winsAgainst[1])}. Loses to ${upperCase(losesAgainst[0])} and ${upperCase(
			losesAgainst[1],
		)}.`;
	}

	const buttons = [
		{ type: 'rock', winsAgainst: ['scissors', 'lizard'], losesAgainst: ['paper', 'spock'] },
		{ type: 'paper', winsAgainst: ['rock', 'spock'], losesAgainst: ['scissors', 'lizard'] },
		{ type: 'scissors', winsAgainst: ['paper', 'lizard'], losesAgainst: ['rock', 'spock'] },
		{ type: 'lizard', winsAgainst: ['spock', 'paper'], losesAgainst: ['rock', 'scissors'] },
		{ type: 'spock', winsAgainst: ['scissors', 'rock'], losesAgainst: ['paper', 'lizard'] },
	];
	return (
		<div className='grid grid-rows-5 sm:grid-rows-none sm:grid-cols-5 gap-6 sm:gap-7 relative'>
			{buttons.map((button) => {
				return (
					<button
          key={button.type}
						className={`fadeIn bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded text-black text-lg font-semibold ${waitOpponent === true || win !== false ? 'invisible' : null}`}
						title={tooltipString(button.winsAgainst, button.losesAgainst)}
            disabled={false}
            onClick={() => handlePlay(button.type)}
					>
						{upperCase(button.type)}
					</button>
				);
			})}
      {waitOpponent === true ? <div className='fadeIn absolute left-0 right-0 top-1/2'>Waiting for opponent...</div> : null}
      {waitOpponent === false && win === false ? <div className='fadeIn absolute text-sm mt-2 top-full text-gray-400'>- hover buttons to see details -</div> : null}
      {win !== false ? <div className='fadeIn absolute left-0 right-0 top-1/2'>{`Player ${win} wins!`}</div> : null}
      {win !== false ? <button className='fadeIn absolute left-0 right-0 top-1/2 mt-24 bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded text-black text-lg font-semibold' onClick={() => back()}>Back</button> : null}
      
			{/* <button className='bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded text-black text-lg font-semibold' title='winsAgainst Scissors andLizard'>Rock</button>
			<button className='bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded text-black text-lg font-semibold'>Paper</button>
			<button className='bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded text-black text-lg font-semibold'>Scissors</button>
			<button className='bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded text-black text-lg font-semibold'>Lizard</button>
			<button className='bg-amber-400 hover:bg-amber-200 active:bg-amber-300 px-3 py-1 rounded text-black text-lg font-semibold'>Spock</button> */}
		</div>
	);
}

export default Buttons;
