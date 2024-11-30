import "./style.css";
import { UI } from "./ui";
import { Game } from "./game";

console.log("initializing");
//test

const thisGame = new Game();
// thisGame.setPiecesDemo();

const thisUI = new UI(thisGame);
