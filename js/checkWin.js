const winningConditions = [
    [0, 1, 2], [3, 4, 5],
    [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

export const checkWin = (playerMoves) => {
	let i, matchingMoves

	if (playerMoves.length < 3) {
		return false
	} else {
		for (let win of winningConditions) {
			for (i = 0, matchingMoves = 0; i < playerMoves.length; i++) {
				win.includes(playerMoves[i]) ? matchingMoves++ : ''
			}
			if (matchingMoves === 3) {
				return win
				break
			}
		}
	}
	return false
}
