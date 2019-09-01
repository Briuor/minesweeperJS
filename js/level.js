export default class Level {
    constructor(name, numBlocksRow, numBlocksColumn, numMines) {
        this.name = name;
        this.numBlocksRow = numBlocksRow;
        this.numBlocksColumn = numBlocksColumn;
        this.numMines = numMines;
    }

	initChangeLevelEvent(game) {
		window.addEventListener("click", (e) => {
            if(e.target.tagName === 'A') {
                e.target
                e.preventDefault();
                switch(e.target.id) {
                    case "intermediate":
                        game.level = new Level('intermediate', 16, 16, 40); break;
                    case "hard":
                        game.level = new Level('hard', 30, 16, 99); break;
                    case "easy": // default is easy mode
                        game.level = new Level('easy', 9, 9, 10); break;
                }
                game.gameRestart();
            }
		});
	}


    get getNumBlocksRow() { return this.numBlocksRow; }
    get getName() { return this.name; }
    get getNumBlocksColumn() { return this.numBlocksColumn; }
    get getNumMines() { return this.numMines; }
}