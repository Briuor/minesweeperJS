class Game {
	constructor() {
		this.image = new Image();
		this.image.src = "test.png";

		this.playerStatus = "playing"; // loser , winner, restart, playing
		
		this.seg = 0; 		 // game seconds counter
		this.digUnitSeg = 0; // seconds unit to be showed
		this.digDezSeg = 0;  // seconds dezen to be showed
		this.digCenSeg = 0;  // seconds centen to be showed

		this.canvas = document.getElementById("canvas");
		this.canvas.width = 9 * Block.SIZE + 36;
		this.canvas.height = 9 * Block.SIZE + 54 + 48;
		this.ctx = this.canvas.getContext("2d");
		this.board = new Board(9, 9, 10);

		this.firstClick = false;
		this.initInputHandler();
		// prevent the menu appear by right click
		this.canvas.addEventListener('contextmenu', event => event.preventDefault());
		this.timeCounter = this.timeCounter.bind(this);
		this.mineCounter = this.mineCounter.bind(this);
		this.refTimeCounterInterval = [];
		this.refTimeCounterInterval.push(setInterval(this.timeCounter,  10));
		setInterval(this.mineCounter,  10);

	}


	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.board.draw(this.ctx);
		//draw sides
		this.ctx.drawImage(this.image, 0, 24, 1, 22, 18, 0, 216, 18); // top
		this.ctx.drawImage(this.image, 148, 25, 22, 1, 9 * 24 + 18, 18, 18, 48); // right top
		this.ctx.drawImage(this.image, 148, 25, 22, 1, 9 * 24 + 18, 48 + 36,  18, 9 * 24); // right bot
		this.ctx.drawImage(this.image, 148, 25, 22, 1, 0, 18, 18, 48); // left top
		this.ctx.drawImage(this.image, 148, 25, 22, 1, 0, 48 + 36, 18, 9 * 24); // left bot
		this.ctx.drawImage(this.image, 0, 24, 1, 22, 18, 9 * 24 + 36 + 48, 216, 18); // bottom
		this.ctx.drawImage(this.image, 0, 24, 1, 22, 18, 66, 216, 18); // middle
		//draw borders
		this.ctx.drawImage(this.image, 4, 24, 22, 22, 0, 0, 18, 18); // border lt
		this.ctx.drawImage(this.image, 52, 24, 22, 22, 0, 39 + 27, 18, 18); // border lmiddle
		this.ctx.drawImage(this.image, 100, 24, 22, 22, 0, 9 * 24 + 36 + 48, 18, 18); // border lb
		this.ctx.drawImage(this.image, 28, 24, 22, 22, 9 * 24 + 18, 0, 18, 18); // border rt
		this.ctx.drawImage(this.image, 76, 24, 22, 22, 9 * 24 + 18, 39 + 27, 18, 18); // border rmiddle
		this.ctx.drawImage(this.image, 124, 24, 22, 22, 9 * 24 + 18, 9 * 24 + 36 + 48, 18, 18); // border rb
		//draw panel
		this.ctx.fillStyle = "#b3b3b3";
		this.ctx.fillRect(18, 18, 9 * 24 , 48); // panel background 
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(24, 22, 61 , 39); // bomb counter background 
		this.ctx.fillRect( 226 - 59, 22, 61 , 39); // time counter background 
		// draw panel face
		if(this.playerStatus == "winner") {
			this.ctx.drawImage(this.image, 3 * 39, 46, 39, 39, (252/2) - 19, 22, 39 , 39); // panel face
			this.drawNumbers(this.ctx, this.digUnitSeg, "unit", "time");
			this.drawNumbers(this.ctx, this.digDezSeg, "dez", "time");
			this.drawNumbers(this.ctx, this.digCenSeg, "cen", "time");	
		}
		else if(this.playerStatus == "loser") {
			this.ctx.drawImage(this.image, 4 * 39 , 46, 39, 39, (252/2) - 19, 22, 39 , 39); // panel face
			this.drawNumbers(this.ctx, this.digUnitSeg, "unit", "time");
			this.drawNumbers(this.ctx, this.digDezSeg, "dez", "time");
			this.drawNumbers(this.ctx, this.digCenSeg, "cen", "time");	
		}
		// else if (this.playerStatus == "restart"){
		// 	this.ctx.drawImage(this.image, 39, 46, 39, 39, (252/2) - 19, 22, 39 , 39); // panel face
		// }
		else 
			this.ctx.drawImage(this.image, 0, 46, 39, 39, (252/2) - 19, 22, 39 , 39); // panel face

	}

	drawNumbers(ctx, num, dig, type) {
		let x = null;
		if(type == "time") {
			if(dig == "unit") 	  x = 209;
			else if(dig == "dez") x = 189;
			else if(dig == "cen") x = 169;
		}	
		else {
			if(dig == "unit") 	  x = 66;
			else if(dig == "dez") x = 46;
			else if(dig == "cen") x = 26;
		}

		switch(num) {
			case 0: ctx.drawImage(this.image, 195, 46, 18, 32, x, 25, 18 , 32); break;
			case 1: ctx.drawImage(this.image, 213, 46, 18, 32, x, 25, 18 , 32); break;
			case 2: ctx.drawImage(this.image, 231, 46, 18, 32, x, 25, 18 , 32); break;
			case 3: ctx.drawImage(this.image, 249, 46, 18, 32, x, 25, 18 , 32); break;
			case 4: ctx.drawImage(this.image, 267, 46, 18, 32, x, 25, 18 , 32); break;
			case 5: ctx.drawImage(this.image, 285, 46, 18, 32, x, 25, 18 , 32); break;
			case 6: ctx.drawImage(this.image, 303, 46, 18, 32, x, 25, 18 , 32); break;
			case 7: ctx.drawImage(this.image, 321, 46, 18, 32, x, 25, 18 , 32); break;
			case 8: ctx.drawImage(this.image, 339, 46, 18, 32, x, 25, 18 , 32); break;
			case 9: ctx.drawImage(this.image, 357, 46, 18, 32, x, 25, 18 , 32); break;
			default : ctx.drawImage(this.image, 195, 46, 18, 32, x, 25, 18 , 32); break; // draw zero

		}
	}

	start(that) {
		// load image and draw on screen
		this.image.onload = function() {
			that.draw();
		}
	}

	mineCounter() {

		let minesFlagged = this.board.numMines - this.board.getMinesFlagged();
		let digs = Array(0, 0, 0);

		digs[0] = minesFlagged % 10;
		if(minesFlagged/10 > 0)
			digs[1] = parseInt((minesFlagged/10) % 10, 10);
		if(((minesFlagged/10) / 10) > 0)
			digs[2] = parseInt(((minesFlagged/10) / 10) % 10, 10);

		this.drawNumbers(this.ctx, digs[0], "unit", "mine");
		this.drawNumbers(this.ctx, digs[1], "dez", "mine");
		this.drawNumbers(this.ctx, digs[2], "cen", "mine");
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
		this.drawNumbers(this.ctx, this.digUnitSeg, "unit", "time");
		this.drawNumbers(this.ctx, this.digDezSeg, "dez", "time");
		this.drawNumbers(this.ctx, this.digCenSeg, "cen", "time");
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
				if(x >= 107 && x <= 107 + 39 && y >= 22 && y <= 22 + 39 ){
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
		// handle double click left button
		this.canvas.addEventListener("dblclick", (e) => {
			let x = e.clientX - this.canvas.offsetLeft;
			let y = e.clientY - this.canvas.offsetTop;
			this.board.selectBlock(x, y, "double");
			this.checkWon();
			this.draw();
		});
	}

	gameRestart = () => {
		this.board = new Board(9, 9, 10);
		this.firstClick = false;
		this.digUnitSeg = 0;
		this.digDezSeg = 0;
		this.digCenSeg = 0;
		this.refTimeCounterInterval.push(setInterval(this.timeCounter,  10));
	}
}
