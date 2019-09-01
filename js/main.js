import Game from "./game.js";

window.onload = () => {
	var game = new Game();
	game.start(game);
};