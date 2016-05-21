var theGame;

function ConnectFourGame() {
	this.currentPlayer;
	this.currentRows;
	this.gameBoard;
	this.players = ["Player1", "Player2"];
	this.winner = 0;
	this.previousTile = [];
	this.isDraw = false;
	
	// general configurations
	this.boardRows = 6;
	this.boardColumns = 7;
	
	// configurable winning positions
	// number pairs work as coordinate adjustments to the current tile position
	this.winningPositions = {
		// the current position is always the reference
		horizontal : [
				[[0,1], [0,2], [0,3]], // 1st tile from the left
				[[0,-1], [0,1], [0,2]], // 2nd tile
				[[0,-2], [0,-1], [0,1]], // 3rd tile
				[[0,-3], [0,-2], [0,-1]] // last tile
			],
		vertical : [
				[[1,0], [2,0], [3,0]], // 1st tile from the top
				[[-1,0], [1,0], [2,0]], // 2nd tile
				[[-2,0], [-1,0], [1,0]], // 3rd tile
				[[-3,0], [-2,0], [-1,0]] // last tile
			],
		diagonal : [
				[[1,1], [2,2], [3,3]], // 1st tile, downward diagonal
				[[-1,-1], [1,1], [2,2]], // 2nd tile
				[[-2,-2], [-1,-1], [1,1]], // 3rd tile
				[[-3,-3], [-2,-2], [-1,-1]], // last tile
				[[-1,1], [-2,2], [-3,3]], // 1st tile, upward diagonal
				[[1,-1], [-1,1], [-2,2]], // 2nd tile
				[[2,-2], [1,-1], [-1,1]], // 3rd tile
				[[3,-3], [2,-2], [1,-1]], // last tile
			]
	}
	
	this.tossCoin = function() {
		this.currentPlayer = Math.floor(Math.random()*2)+1;
	}
		
	this.initGameBoard = function() {
		// set initial current occupied row per column
		// by default is 7, will be accordingly decremented as tiles in the column are turned 
		this.currentRows = [];
		for(var i=0; i<this.boardColumns; i++)
			this.currentRows.push(this.boardColumns);
		
		// sets the initial values of which player is occupying a tile
		// each member in the 2d array gameBoard corresponds to a tile in the real game board
		// default value is 0, could also be 1 for Player 1 or 2 for Player 2
		this.gameBoard = [];
		for(var i=0, arr; i<this.boardRows; i++) {
			arr = [];
			for(var j=0; j<this.boardColumns; j++)
				arr.push(0);
			
			this.gameBoard.push(arr);
		}
	}
	
	this.checkForWin = function(winningCombi, cRow, cCol) {
		for(var w=0; w<winningCombi.length; w++) {
			var combiToCheck = winningCombi[w], c;
			for(c=0; c<combiToCheck.length; c++) {
				var coor = combiToCheck[c];
				
				// if the coordinates are out bound, break and move to the next combination
				if(this.gameBoard[cRow+coor[0]] == undefined || this.gameBoard[cRow+coor[0]][cCol+coor[1]] == undefined) break;
				// else check the value of the neighboring tile
				else {
					var tileVal = this.gameBoard[cRow][cCol];
					var tileToCheckVal = this.gameBoard[cRow+coor[0]][cCol+coor[1]];
					
					// if they're not equal, break and move to the next combination
					if(tileVal != tileToCheckVal) break;
				}
			}
			
			// if all neighboring tiles have been checked and passed the criteria, there is a victory
			if(c == combiToCheck.length) return true;
		}
		
		return false;
	}
	
	this.checkIfGameOver = function(currRow, currCol) {
		var hasWinner = false;
		
		if(!hasWinner) hasWinner = this.checkForWin(this.winningPositions.horizontal, currRow, currCol);
		if(!hasWinner) hasWinner = this.checkForWin(this.winningPositions.vertical, currRow, currCol);
		if(!hasWinner) hasWinner = this.checkForWin(this.winningPositions.diagonal, currRow, currCol);
		
		return hasWinner;
	}
	
	this.checkForDraw = function() {
		for(var d=0; d<this.currentRows.length; d++) {
			if(this.currentRows[d]-1 > 0) return false;
		}
		
		return true;
	}
	
	this.turnTile = function(currColm) {
		var currCol = currColm - 1;
		
		// update the marker for the
		this.currentRows[currCol] -= 1
		
		var currRow = this.currentRows[currCol] - 1;
		
		// currentPlayer occupies the tile that was turned/selected
		this.gameBoard[currRow][currCol] = this.currentPlayer;
		this.previousTile = [this.currentPlayer, currRow+1, currCol+1];
		
		// check for a winner
		if(this.checkIfGameOver(currRow, currCol)) {
			this.winner = this.currentPlayer;			
			return;
		}
		
		// check for draw
		this.isDraw = this.checkForDraw();
		
		// continue the game
		// change the current player
		this.currentPlayer = (this.currentPlayer == 1) ?  2 : 1;
	}
	
	this.initPlayers = function(name1, name2) {
		if(name1 != null) this.players[0] = name1;
		if(name2 != null) this.players[1] = name2;
	}
	
	this.initGameBoard();
}

function initializePlayers() {
	alert("Welcome to ConnectFour!\n\nLet's start by entering the names of the players accordingly.");
		
	var name1 = prompt("Please enter your name Player 1", "Player 1");
	var name2 = prompt("How about you, Player 2?", "Player 2");
	
	alert("Thank you so much! Let's play!");
	
	theGame.initPlayers(name1, name2);
}

function initializeGame() {
	theGame = new ConnectFourGame();
	
	initializePlayers();		
	theGame.tossCoin();
	
	alert("Player " + theGame.currentPlayer + ": " + theGame.players[theGame.currentPlayer-1] + ", you go first!");
}

function paintTile() {
	var tileId = "#tile_" + theGame.previousTile[1] + "_" + theGame.previousTile[2];
	
	$(tileId).toggleClass("unturned turned-player" + theGame.previousTile[0]);
}

function disableColumn(elem, mode) {
	var selector;
	
	if(elem == 'all') selector = ".columnButton";
	else selector = '#' + elem;
	
	$(selector).prop("disabled", mode);
}

function resetBoard() {
	$('td[class*="tile"]').attr("class", "tiles unturned");
	disableColumn("all", false);
}

function declareResult(what) {
	
	if(what == "winner") alert("Player " + theGame.winner + ": " + theGame.players[theGame.winner-1] + " wins!!!");
	if(what == "draw") alert("It's a draw!!!");
	
	disableColumn("all", true);
}

$(document).ready(function(){
	disableColumn("all", true);
	
	$("#newGameButton").click(function() {
		
		// create new game
		initializeGame();
		resetBoard();
	});
	
	$(".columnButton").click(function() {
		
		// turn the lowermost unturned tile for selected column
		var col = this.id.split("_")[1];
		
		theGame.turnTile(col);
		paintTile();
		if(theGame.currentRows[col-1]-1 <= 0) disableColumn(this.id, true);
		
		// declare draw
		if(theGame.isDraw) declareResult("draw");
		
		// declare if there's a winner
		if(theGame.winner != 0) declareResult("winner");	
	});
});