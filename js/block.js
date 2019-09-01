
export default class Block {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.covered = true;
		this.flagged = false;
		this.isMine = false;
		this.minesAround = 0;
	}

	static get SIZE() { return 24; } // block size is 24 pixels
	get getX() { return this.x; }
	get getY() { return this.y; }
	get getCovered() { return this.covered; }
	get getFlagged() { return this.flagged; }
	get getIsMine() { return this.isMine; }
	get getMinesAround() { return this.minesAround; }

	set setX(x) { this.x = x; }
	set setY(y) { this.y = y; }
	set setCovered(covered) { this.covered = covered; }
	set setFlagged(flagged) { this.flagged = flagged; }
	set setIsMine(isMine) { this.isMine = isMine; }
	set setMinesAround(minesAround) { this.minesAround = minesAround; }
}