class Board {
	constructor(numBlocksX, numBlocksY, numMines) {
		this.numBlocksX = numBlocksX;
		this.numBlocksY = numBlocksY;

		//init board matrix of blocks
		this.board = [];
		for (let i=0; i < numBlocksX; i++)
		    this.board[i] = [];

		this.numMines = numMines;
		this.initBoard();
		this.initMines();
		this.initMinesAround();

		this.image = new Image();
		this.image.src = "test.png";
		
	}

	initBoard() {
		//init board blocks
		for(var i = 0, y = 18 + 48+18; i < this.numBlocksX; i++, y += Block.SIZE) {
			for(var j = 0, x = 18; j < this.numBlocksY; j++, x += Block.SIZE) {
				this.board[i][j] = new Block(x, y);
			}
		}
	}

	initMines() {
		let mines = 0;
		while(mines < this.numMines) {
			let i = Math.floor(Math.random() * (this.numBlocksX - 1));
			let j = Math.floor(Math.random() * (this.numBlocksY - 1));

			// Se bloco já não é uma mina
			if(!this.board[i][j].getIsMine) {
				this.board[i][j].setIsMine = true;
				mines ++;
			}
		}
	}

	initMinesAround() {
		let minesAround = 0;

		for(let i = 0; i < this.numBlocksX; i++) {
			for(let j = 0; j < this.numBlocksY; j++) {

				for(let p = i - 1; p <= i + 1; p++) {
					for(let q = j - 1; q <= j + 1; q++) {
						if(p >= 0 && p < this.numBlocksX && q >= 0 && q < this.numBlocksY){
							if(this.board[p][q].getIsMine){
								minesAround++;
								this.board[p][q].setMinesAround = -1;
							}
						}
					}
				}
				this.board[i][j].setMinesAround = minesAround;
				minesAround = 0;
			}
		}
	}

	getMinesFlagged() {
		let minesFlagged = 0;
		for(let i = 0; i < this.numBlocksX; i++) {
			for(let j = 0; j < this.numBlocksY; j++) {
				if(this.board[i][j].getFlagged)
					minesFlagged++;
			}
		}
		return minesFlagged;
	}

	selectBlock(mouseX, mouseY, mouse) {
		for(let i = 0; i < this.numBlocksX; i++) {
			for(let j = 0; j <this.numBlocksY ; j++) {
				let blockX = this.board[i][j].getX;
				let blockY = this.board[i][j].getY;
				// clicked inside a specific block
				if(mouseX > blockX && mouseX < blockX + Block.SIZE && mouseY > blockY && mouseY < blockY + Block.SIZE) {

					if(mouse == "right") {
						// only mark as flagged, if block is covered
						if(!this.board[i][j].getFlagged && this.board[i][j].getCovered)
							this.board[i][j].setFlagged = true;
						else 
							this.board[i][j].setFlagged = false;
					}

					else if(mouse == "left") {
						// uncover block
						this.board[i][j].setCovered = false;
						// its a MINE, player lose
						if(this.board[i][j].getIsMine) {
							// show mines
							// return lose
						}
						// if dont have mines around, reveal the field around
						if(this.board[i][j].getMinesAround == 0) {
							this.revealField(i, j);
						}
					}

					else if(mouse == "double") {
						this.revealFlaggedField(i, j);
					}

					return ;
				}
			}
		}
	}

	revealFlaggedField(i, j) {
		let minesFlagged = 0;
		// count the number of flagged blocks to do reveal operation
		for(let p = i - 1; p <= i + 1; p++) {
			for(let q = j - 1; q <= j + 1; q++) {
				if(p >= 0 && p < this.numBlocksX && q >= 0 && q < this.numBlocksY){
					if(this.board[p][q].getFlagged)
						minesFlagged++;
				}
			}
		}

		if(minesFlagged == this.board[i][j].getMinesAround) {
			this.revealField(i, j);
		}
	}


	revealField(i, j) {
		for(let p = i - 1; p <= i + 1; p++) {
			for(let q = j - 1; q <= j + 1; q++) {
				if(p >= 0 && p < this.numBlocksX && q >= 0 && q < this.numBlocksY){

					if(this.board[p][q].getMinesAround == 0 && this.board[p][q].getCovered && !this.board[p][q].getFlagged) {
						this.board[p][q].setCovered = false;
						this.revealField(p, q);
					}
					if(!this.board[p][q].getFlagged) {
						this.board[p][q].setCovered = false;
					}
				}
			}
		}
	}

	checkWon() {
		let blocksUncovered = 0;
		let totalBlocksWithoutMines = (this.numBlocksX * this.numBlocksY) - this.numMines;
		for(let i = 0; i < this.numBlocksX; i++) {
			for(let j = 0; j < this.numBlocksY; j++) {
				if(this.board[i][j].getIsMine && !this.board[i][j].getCovered) {
					return "lose";
				}
				else if(!this.board[i][j].getCovered) {
					blocksUncovered++;
				}
			}
		}

		if(blocksUncovered == totalBlocksWithoutMines)
			return "won";
		else 
			return "continue";
	}

	draw(ctx) {
		for(let i = 0; i < this.numBlocksX; i++) {
			for(let j = 0; j < this.numBlocksY; j++) {
				// mine
				if(this.board[i][j].getIsMine && !this.board[i][j].getCovered)		
					ctx.drawImage(this.image, 124, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
				// flagged 
				else if(this.board[i][j].getFlagged)		
					ctx.drawImage(this.image, 48, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
				// covered
				else if(this.board[i][j].getCovered)
					ctx.drawImage(this.image, 0, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
				// se block não está coberto desenha numero de minas em volta
				if(!this.board[i][j].getCovered && this.board[i][j].getMinesAround >= 0) {
					switch(this.board[i][j].getMinesAround) {
						case 0: 
							ctx.drawImage(this.image, 24, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;
						case 1: 
							ctx.drawImage(this.image, 193, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;
						case 2: 
							ctx.drawImage(this.image, 217, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;
						case 3: 
							ctx.drawImage(this.image, 241, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;
						case 4: 
							ctx.drawImage(this.image, 265, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;
						case 5: 
							ctx.drawImage(this.image, 289, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;
						case 6: 
							ctx.drawImage(this.image, 303, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;
						case 7: 
							ctx.drawImage(this.image, 327, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;
						case 8: 
							ctx.drawImage(this.image, 341, 0, 24, 24, this.board[i][j].getX, this.board[i][j].getY, 24, 24);
							break;

					}
				}

			}
		}
	}

}