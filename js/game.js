import Board  from "./board.js";
import Block  from "./block.js";
import Sprite from "./sprite.js";
import Level from  "./level.js";

export default class Game {

	constructor() {
		
		this.sprite = new Sprite(); // load sprite

		this.level = new Level('hard', 30, 16, 99); // default level is easy
		this.level.initChangeLevelEvent(this);

		this.playerStatus = "playing"; // loser , winner, restart, playing
		
		this.seg = 0; 		 // game seconds counter
		this.digUnitSeg = 0; // seconds unit to be showed
		this.digDezSeg = 0;  // seconds dezen to be showed
		this.digCenSeg = 0;  // seconds centen to be showed

		this.initCanvas(); // init canvas dimensions based on level
		
		this.board = new Board(this.level.getNumBlocksRow, this.level.getNumBlocksColumn, this.level.getNumMines);

		this.firstClick = false; // first click flag to start and stop game counter
		this.initInputHandler(); // handle left/right clicks and double clicks

		// canvas event to prevent the menu appear by right click
		this.canvas.addEventListener('contextmenu', event => event.preventDefault());

		this.timeCounter = this.timeCounter.bind(this);
		this.refTimeCounterInterval = [];
		this.refTimeCounterInterval.push(setInterval(this.timeCounter,  10));

	}

	initCanvas() { 
		this.canvas = document.getElementById("canvas");
		this.canvas.width = this.level.getNumBlocksRow * Block.SIZE + (2 * Sprite.SIDE_LR_WIDTH);
		this.canvas.height = this.level.getNumBlocksColumn * Block.SIZE + (3 * Sprite.SIDE_TMD_HEIGHT) + Sprite.PANEL_HEIGHT;
		this.ctx = this.canvas.getContext("2d");	
	}


	draw() {
		//  clean screen
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		// draw board
		this.board.draw(this.sprite.getImage, this.ctx);
		// draw sides and top panel
		this.sprite.drawSides(this.ctx, this.level.name);
		this.sprite.drawBorders(this.ctx, this.level.name);
		this.sprite.drawPanel(this.ctx, this.level.name);
		// draw panel's face
		if(this.playerStatus == "winner") { 
			this.sprite.drawFace(this.ctx, this.level.name, "winner");
		}
		else if(this.playerStatus == "loser") {
			this.sprite.drawFace(this.ctx, this.level.name, "loser");
		}
		else {
			this.sprite.drawFace(this.ctx, this.level.name, "normal");
		}
		this.sprite.drawNumbers(this.ctx, 
			[{num: this.digUnitSeg, dig:"unit", type:"time"}, 
			 {num: this.digDezSeg, dig:"dez", type:"time"}, 
			 {num: this.digCenSeg, dig:"cen", type:"time"}], this.level.name);	

		this.sprite.drawMineCounter(this.board, this.ctx, this.level.name);
		// this.ctx.fillRect(0, 67, this.canvas.width, this.canvas.height);
	}


	start(gameContext) {
		// load image and draw on screen
		this.sprite.getImage.onload = function() {
			gameContext.draw();
		}
	}


	timeCounter = () => {

		if(this.firstClick) {
			let lastSeg = Date.now();
			if(this.digUnitSeg == 9 && this.digDezSeg == 9 && this.digCenSeg == 9)
				return ;
			else if(this.seg < (lastSeg - 1000)) {
				this.digUnitSeg++;
				// unit to dez
				if(this.digUnitSeg >= 10 ) {
					this.digUnitSeg = 0;
					this.digDezSeg++;
				}
				//dez to cen
				else if(this.digDezSeg >= 10) {
					this.digDezSeg = 0;
					this.digCenSeg++;
				}
				this.seg = lastSeg;
			}
		}	
		this.sprite.drawNumbers(this.ctx, 
			[{num: this.digUnitSeg, dig:"unit", type:"time"}, 
			 {num: this.digDezSeg, dig:"dez", type:"time"}, 
			 {num: this.digCenSeg, dig:"cen", type:"time"}], this.level.name);
	}

	checkWon() {
		if(this.board.checkWon() == "lose") {
			this.playerStatus = "loser";
			this.refTimeCounterInterval.forEach(clearInterval);
		}
		else if(this.board.checkWon() == "won") {
			this.playerStatus = "winner";
			this.refTimeCounterInterval.forEach(clearInterval);
		}
	}

	initInputHandler() {

		// handle normal click left and right buttons
		this.canvas.addEventListener("mousedown", (e) => {
			// if first click, start the time counter
			if(!this.firstClick)
				this.seg = Date.now();
			this.firstClick = true;
			let x = e.clientX - this.canvas.offsetLeft;
			let y = e.clientY - this.canvas.offsetTop;
			// left click select a block
			if(e.which == 1){
				// click on face
				let faceX, faceY;
				if(this.level.name === "easy") { faceX = 107; faceY = 22; }
				else if(this.level.name === "intermediate") { faceX = 190; faceY = 22; }
				else if(this.level.name === "hard") { faceX = 368; faceY = 22; }

				if(x >= faceX && x <= faceX + Sprite.FACE_SIZE && y >= faceY && y <= faceY + Sprite.FACE_SIZE){
					this.playerStatus = "restart";
					this.gameRestart();
				}
				// click on canvas
				else if(this.playerStatus != "loser" && this.playerStatus != "winner")
					this.board.selectBlock(x, y, "left");
			}
			// right click put a flag on block
			else if(e.which == 3 && this.playerStatus != "loser"){
				this.board.selectBlock(x, y, "right");
			}
			this.checkWon();
			this.draw();
		});
		// handle double click of left button
		this.canvas.addEventListener("dblclick", (e) => {
			let x = e.clientX - this.canvas.offsetLeft;
			let y = e.clientY - this.canvas.offsetTop;
			this.board.selectBlock(x, y, "double");
			this.checkWon();
			this.draw();
		});
	}

	gameRestart = () => {
		this.board = new Board(this.level.getNumBlocksRow, this.level.getNumBlocksColumn, this.level.getNumMines);
		this.firstClick = false;
		this.digUnitSeg = this.digDezSeg = this.digCenSeg = 0;
		this.refTimeCounterInterval.push(setInterval(this.timeCounter,  10));
		this.initCanvas();
		this.playerStatus = "playing"; 
		this.draw();
	}
}
