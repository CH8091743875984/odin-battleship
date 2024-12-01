import "./style.css";
import { UI } from "./ui";
import { Game } from "./game";

console.log("initializing");

const thisGame = new Game();

const thisUI = new UI(thisGame);

//next up - randomized AI ship placement, AI shot behavior strategies, messaging during placement, messaging after misses/shots, styling
