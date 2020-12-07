const winningConditions = [
    [0, 1, 2], [3, 4, 5],
    [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

export const minimax = (newBoard, player) => {
	let moves = []
	let bestMove
	let availableSpots = newBoard.filter(s => typeof s == 'number')

	if (minimaxWin(newBoard, 'x')) {
		return { score: -10 }
	}
	else if (minimaxWin(newBoard, 'o')) {
		return { score: 10 }
	} 
	else if (availableSpots.length === 0) {
		return { score: 0 }
	}

	for (let i = 0; i < availableSpots.length; i++) {
		let move = {}
		move.index = newBoard[availableSpots[i]]
		newBoard[availableSpots[i]] = player

		if (player === 'x') {
			let result = minimax(newBoard, 'o')
			move.score = result.score
		} 
		else {
			let result = minimax(newBoard, 'x')
			move.score = result.score
		}
		newBoard[availableSpots[i]] = move.index
		moves.push(move)
	}

	if(player === 'o') {
		let bestScore = -10000
		for(let i = 0; i < moves.length; i++) 
		{
			if (moves[i].score > bestScore) 
			{
				bestScore = moves[i].score
				bestMove = i
			}
		}
	} 
	else {
		let bestScore = 10000
		for(let i = 0; i < moves.length; i++) 
		{
			if (moves[i].score < bestScore)
			{
				bestScore = moves[i].score
				bestMove = i
			}
		}
	}
	return moves[bestMove]
}	

const minimaxWin = (board, player) => {
	let results = []
	for (let i = 0; i < board.length; i++) {
	  const e = board[i];
	  if (e === player) {
	    results = results.concat(i);
	  }
	}
	let plays = results
	if (plays.length < 3) {
		return null
	}

	let gameWon = null
	for (let [index, win] of winningConditions.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player}
			break
		}
	}
	return gameWon
}