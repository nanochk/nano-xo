let state = {
	xIndex: [],
	oIndex: [],
	currentPlayer: 'x'
}

const game = (() => {
	const boardElement = document.getElementsByClassName('board')[0]
	const squares = document.getElementsByClassName('square')
	const controllerElement = document.getElementsByClassName('controller')[0]
	const winningConditions = [
	    [0,1,2],[3,4,5],
	    [6,7,8],[0,3,6],
	    [1,4,7],[2,5,8],
	    [0,4,8],[2,4,6]
	]

	let xIndex = []
	let oIndex = []
	let currentPlayer
	let robotPlayer

	const handleClick = (mode) => {
		robotPlayer = (mode === 1) ? true : false
		startGame(robotPlayer)
	}

	const updateStatus = (statusElement, message, button) => {
		const controllerMarkup = button ? 
		`<p>${message}</p><button onClick='game.handleClick(2)'>New Game</button> <button onClick='game.handleClick(1)'>New Game - Man vs Machine</button>` 
		: `<p>${message}</p>`
		statusElement.innerHTML = controllerMarkup
	}

	const setClearState = () => {
		xIndex = []
		oIndex = []
		currentPlayer = 'x'
		state = {
			xIndex,
			oIndex,
			currentPlayer
		}
		window.history.pushState(state, null, '')
	}

	const startGame = (mode) => {
		setClearState()
		clearBoard()
		robotPlayer = (mode === true) ? true : false
		robotPlayer ? 
					  updateStatus(controllerElement, `New game against the computer. <br />${currentPlayer.toUpperCase()} has the first move. `, 1) 
					: updateStatus(controllerElement, `New two player game. <br />${currentPlayer.toUpperCase()} has the first move. `, 1)
	}

	const updatePlayer = () => currentPlayer === 'x' ? 'o' : 'x'

	const calculateNextMove = () => {
		let availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8]
		availableMoves = availableMoves.filter(n => ![...xIndex, ...oIndex].includes(n))

		let playerMoves = oIndex
		if (availableMoves.length === 8) {
			let randomMove
			randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
			return(randomMove)
		}

		let offensiveMove = calculateConditions(availableMoves, playerMoves)
		if (offensiveMove) {
			return offensiveMove
		}

		playerMoves = xIndex
		let defensiveMove = calculateConditions(availableMoves, playerMoves)
		if (defensiveMove) {
			return defensiveMove
		}

		return availableMoves[Math.floor(Math.random() * availableMoves.length)]
	}

	const calculateConditions = (availableMoves, playerMoves) => {
		const availableMovesFilter = (move) => !availableMoves.includes(move)
		const possibleMovesFilter = (move) => !possibleMove.includes(move)

		for (let moves of winningConditions) {
			let tempMove
			for (i = 0, matchingMoves = 0; i < playerMoves.length; i++) {
				moves.includes(playerMoves[i]) ? matchingMoves++ : ''
			}
			if (matchingMoves === 2) {
				possibleMove = moves.filter(availableMovesFilter)
				tempMove = moves.filter(possibleMovesFilter)
				if (tempMove.length > 0) {
					return tempMove
				}
			}
		}
		return false
	}
	
	const computerMove = () => {
		let roboMove
		roboMove = calculateNextMove()
		squares[roboMove].click()	
	}
	
	const markerElement = (player) => {
		const marker = document.createElement('span')
		marker.innerHTML = player
		return marker
	}

	const nextTurn = (update) => {
		if ([...xIndex, ...oIndex].length === 9) {
			endGame()
			return false
		}
		([...xIndex, ...oIndex].length > 0) ? currentPlayer = updatePlayer() : ''
		updateStatus(controllerElement, `${currentPlayer.toUpperCase()}'s turn. `)
		if (currentPlayer !== 'x' && robotPlayer) {
			computerMove()
		}
		return currentPlayer
	}

	const checkWin = (playerMoves) => {
		if (playerMoves.length < 3) {
			return false
		} else {
			for (let win of winningConditions) {
				for (i = 0, matchingMoves = 0; i < playerMoves.length; i++) {
					win.includes(playerMoves[i]) ? matchingMoves++ : ''
				}
				if (matchingMoves === 3) {
					win.map(i => boardElement.children[i].classList.add('highlight'))
					return true
					break
				}
			}
		}
		return false
	}

	const endGame = (winner) => {
		boardElement.classList.add('disabled')
		if (winner) {
			updateStatus(controllerElement, `${winner.toUpperCase()} wins the game! `, 1)
		} else {
			updateStatus(controllerElement, `It is a tie! `, 1)
		}
	}

	const squareClick = (e) => {
		const el = e.target
		const marker = markerElement(currentPlayer)
		const clickedIndex = [...el.parentElement.children].indexOf(el)

		if (![...xIndex, ...oIndex].includes(clickedIndex)) {
			const playerIndex = currentPlayer === 'x' ? xIndex : oIndex
			el.classList.add('clicked')
			el.appendChild(marker)
			playerIndex.push(clickedIndex)
			state = {
				xIndex,
				oIndex,
				currentPlayer
			}
			window.history.pushState(state, null, '')
			checkWin(playerIndex) ? endGame(currentPlayer) : currentPlayer = nextTurn()
		}
	}

	const clearBoard = () => {
		Array.from(squares).forEach((element) => {
				element.innerHTML ? element.innerHTML = '' : ''
				element.classList.remove('clicked')
				element.classList.remove('highlight')
				element.addEventListener('click', squareClick)
			}
		)
		boardElement.classList.remove('disabled')		
	}

	const fillMarkers = (marker, index) => {
		index.map(i => { 
				boardElement.children[i].classList.add('clicked')
				boardElement.children[i].appendChild(markerElement(marker))
			}
		)		
	}

	const refreshBoard = () => {
	  	xIndex = state.xIndex
	  	oIndex = state.oIndex
		currentPlayer = state.currentPlayer
		const playerIndex = currentPlayer === 'x' ? xIndex : oIndex
	  	clearBoard()
	  	fillMarkers('x', xIndex)
	  	fillMarkers('o', oIndex)
		checkWin(playerIndex) ? endGame(currentPlayer) : currentPlayer = nextTurn()
	}

	return { startGame, handleClick, refreshBoard }
})()

window.onpopstate = (event) => {
	if (event.state) {
	  	state = event.state
	  	game.refreshBoard()
	}
}

game.startGame()
