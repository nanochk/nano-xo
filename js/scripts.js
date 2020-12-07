'use strict'
import { checkWin } from './checkWin.js'
import { minimax } from './miniMax.js'

let state = {
	xIndex: [],
	oIndex: [],
	currentPlayer: 'x'
}

const game = () => {
	const boardElement = document.getElementsByClassName('board')[0]
	const squares = document.getElementsByClassName('square')
	const controllerElement = document.getElementsByClassName('controller')[0]

	let xIndex = []
	let oIndex = []
	let currentPlayer
	let robotPlayer
	let availableMoves

	const handleClick = (mode) => {
		robotPlayer = (mode === 1) ? true : false
		startGame(robotPlayer)
	}

	const updateStatus = (statusElement, message, button) => {
		const controllerMarkup = button 
		? `<p>${message}</p><button onClick='game.handleClick(2)'>New Game</button> <button onClick='game.handleClick(1)'>New Game - Man vs Machine</button>` 
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
		availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8]		
		robotPlayer = (mode === true) ? true : false
		updateStatus(
					 controllerElement, 
					 robotPlayer 
					 			? `New game against the computer. <br />${currentPlayer.toUpperCase()} has the first move. `
					 			: `New two player game. <br />${currentPlayer.toUpperCase()} has the first move. `
					 			, 1
		 			)
	}

	const updatePlayer = () => currentPlayer === 'x' ? 'o' : 'x'

	const computerMove = () => {
		let roboMove
		fillIndexMarkers('x', xIndex)
		fillIndexMarkers('o', oIndex)
		roboMove = minimax(availableMoves, currentPlayer)
		squares[roboMove.index].click()	
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

	const endGame = (winner, moves) => {
		const playerIndex = winner === 'x' ? xIndex : oIndex
		boardElement.classList.add('disabled')
		if (winner) {
			highlightWin(moves)
			updateStatus(controllerElement, `${winner.toUpperCase()} wins the game! `, 1)
		} else {
			updateStatus(controllerElement, `It is a tie! `, 1)
		}
	}

	const highlightWin = (moves) => {
		moves.map(i => boardElement.children[i].classList.add('highlight'))
	}

	const squareClick = (e) => {
		const el = e.target
		const marker = markerElement(currentPlayer)
		const clickedIndex = [...el.parentElement.children].indexOf(el)
		let winningMoves = false

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
			winningMoves = checkWin(playerIndex)
			!winningMoves ? currentPlayer = nextTurn() : endGame(currentPlayer, winningMoves)
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

	const fillIndexMarkers = (marker, index) => {
		if (index.length > 0) {
			index.map(i => { 
					availableMoves[i] = marker
				}
			)					
		}
	}

	const refreshBoard = () => {
		let winningMoves = false
	  	xIndex = state.xIndex
	  	oIndex = state.oIndex
		currentPlayer = state.currentPlayer
		const playerIndex = currentPlayer === 'x' ? xIndex : oIndex
	  	clearBoard()
	  	fillMarkers('x', xIndex)
	  	fillMarkers('o', oIndex)
		winningMoves = checkWin(playerIndex)
		!winningMoves ? currentPlayer = nextTurn() : endGame(currentPlayer, winningMoves)
	}
	
	return { startGame, handleClick, refreshBoard }
}

window.onpopstate = (event) => {
	if (event.state) {
	  	state = event.state
	  	game().refreshBoard()
	}
}

window.game = game()
window.game.startGame(true)
