export default class Sprite {
    constructor() {
        this.image = new Image();
		this.image.src = "../img/spritesheet.png";

		this.SIDE_LR_WIDTH = this.SIDE_TMD_HEIGHT = 18;
    }

	get getImage() { return this.image; }
	static get FACE_SIZE() { return 39; } 
	static get SIDE_LR_WIDTH() { return 18; }   // LR = Left, Right
	static get SIDE_TMD_HEIGHT() { return 18; } //TMC = Top, Mid, Down
	static get PANEL_HEIGHT() { return 48; } // panel height without sides

    drawSides(ctx, level) {
		let x1tmd, y1tmd, x2tmd, y2tmd, y2rl;
		if(level == "easy") { x1tmd = 234; y1tmd = 300; y2rl = 216; x2tmd = 216; y2tmd = 18;} 
		else if(level == "intermediate") { x1tmd = 402; y1tmd = 468; y2rl = 384; x2tmd = 384; y2tmd = 18;} 
		else if(level == "hard") { x1tmd = 738; y1tmd = 468; y2rl = 384; x2tmd = 720; y2tmd = 18;} 
		ctx.drawImage(this.image, 0, 24, 1, 22, 18, 0, x2tmd, y2tmd); // top
		ctx.drawImage(this.image, 148, 25, 22, 1, x1tmd, 18, 18, 48); // right top 234
		ctx.drawImage(this.image, 148, 25, 22, 1, x1tmd, 48 + 36,  18, y2rl); // right bot
		ctx.drawImage(this.image, 148, 25, 22, 1, 0, 18, 18, 48); // left top
		ctx.drawImage(this.image, 148, 25, 22, 1, 0, 48 + 36, 18, y2rl); // left bot
		ctx.drawImage(this.image, 0, 24, 1, 22, 18, y1tmd, x2tmd, y2tmd); // bottom
		ctx.drawImage(this.image, 0, 24, 1, 22, 18, 66, x2tmd, y2tmd); // middle
    }

    drawBorders(ctx, level) {
		let x1tmd, y1tmd;
		if(level == "easy") { x1tmd = 234; y1tmd = 300; } 
		else if(level == "intermediate") { x1tmd = 402; y1tmd = 468;} 
		else if(level == "hard") { x1tmd = 738; y1tmd = 468;} 
        ctx.drawImage(this.image, 4, 24, 22, 22, 0, 0, 18, 18); // border lt
        ctx.drawImage(this.image, 52, 24, 22, 22, 0, 39 + 27, 18, 18); // border lmiddle
        ctx.drawImage(this.image, 100, 24, 22, 22, 0, y1tmd, 18, 18); // border lb
        ctx.drawImage(this.image, 28, 24, 22, 22, x1tmd, 0, 18, 18); // border rt
        ctx.drawImage(this.image, 76, 24, 22, 22, x1tmd, 39 + 27, 18, 18); // border rmiddle
        ctx.drawImage(this.image, 124, 24, 22, 22, x1tmd, y1tmd, 18, 18); // border rb
    }

    drawPanel(ctx, level) {
		let x1tc, y1tc, x1mc, x2tmd, y1mc, y2rl, y2tmd;
		if(level == "easy") { x1mc = 24; y1mc = 22; x2tmd = 216; x1tc = 168; y1tc = 22;} 
		else if(level == "intermediate") { x1mc = 107; y1mc = 22; x2tmd = 384; x1tc = 251; y1tc = 22;} 
		else if(level == "hard") {x1mc = 286; y1mc = 22; x2tmd = 720; x1tc = 430; y1tc = 22;} 
		ctx.fillStyle = "#b3b3b3";
		ctx.fillRect(18, 18, x2tmd , 48); // panel background 
		ctx.fillStyle = "black";
		ctx.fillRect(x1mc, y1mc, 61 , 39); // mine counter background 
		ctx.fillRect(x1tc, y1tc, 61 , 39); // time counter background 
    }

    drawFace(ctx, level, facetype) {
		let x1tmd, x1mc, x2tmd, y1mc, y2rl, y2tmd;
		if(level == "easy") { x1mc = 107; y1mc = 24; x2tmd = 216; y2tmd = 18;} 
		else if(level == "intermediate") { x1mc = 190; y1mc = 24; y2rl = 18; x2tmd = 384; y2tmd = 18;} 
		else if(level == "hard") { x1mc = 368; y1mc = 18; x2tmd = 216; y2tmd = 18;} 

		if(facetype == "normal")
			ctx.drawImage(this.image, 0, 46, 39, 39, x1mc, 22, 39 , 39); // panel face
		else if(facetype == "winner") 
			ctx.drawImage(this.image, 3 * 39, 46, 39, 39, x1mc, 22, 39 , 39); // panel face        
		else if(facetype == "loser")
			ctx.drawImage(this.image, 4 * 39 , 46, 39, 39, x1mc, 22, 39 , 39); // panel face
	}

	drawNumbers(ctx, digits, level) {
		let xinc;
		if(level == "easy") { xinc = 0;} 
		else if(level == "intermediate") { xinc = 83;} 
		else if(level == "hard") { xinc = 262;} 
		let x = null;
		for(let i = 0; i < digits.length; i++) {
			if(digits[i].type == "time") {
				if(digits[i].dig == "unit") 	  x = 209 + xinc;
				else if(digits[i].dig == "dez") x = 189 + xinc;
				else if(digits[i].dig == "cen") x = 169 + xinc;
			}	
			else {
				if(digits[i].dig == "unit") 	  x = 66 + xinc;
				else if(digits[i].dig == "dez") x = 46 + xinc;
				else if(digits[i].dig == "cen") x = 26 + xinc;
			}

			switch(digits[i].num) {
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
	}

	drawMineCounter(board, ctx, level) {
		let minesFlagged = board.numMines - board.getMinesFlagged();
		let digs = Array(0, 0, 0);

		digs[0] = minesFlagged % 10;
		if(minesFlagged/10 > 0)
			digs[1] = parseInt((minesFlagged/10) % 10, 10);
		if(((minesFlagged/10) / 10) > 0)
			digs[2] = parseInt(((minesFlagged/10) / 10) % 10, 10);

		this.drawNumbers(ctx, [
			{num: digs[0], dig:"unit", type:"mine"}, 
			{num: digs[1], dig:"dez", type:"mine"}, 
			{num: digs[2], dig:"cen", type:"mine"}], level);

	}

}