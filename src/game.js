import { Ship, Gameboard, Player } from "./classes";

export class Game {
  constructor() {
    this.player1 = new Player("human");
    this.player2 = new Player("computer");
    this.defendingPlayer = this.player2;
  }

  setPiecesDemo() {
    //maybe arg is the player object, if type is human await input
    //if computer, follow AI strategy based on difficulty
    //set player1 pieces
    this.player1.board.placeShip(2, 0, 0, "horizontal");
    this.player1.board.placeShip(3, 2, 2, "horizontal");
    this.player1.board.placeShip(3, 9, 0, "vertical");
    this.player1.board.placeShip(4, 3, 7, "horizontal");
    this.player1.board.placeShip(5, 2, 9, "horizontal");

    //set player2 pieces
    this.player2.board.placeShip(2, 5, 0, "vertical");
    this.player2.board.placeShip(3, 6, 1, "horizontal");
    this.player2.board.placeShip(3, 0, 6, "vertical");
    this.player2.board.placeShip(4, 4, 8, "horizontal");
    this.player2.board.placeShip(5, 0, 9, "horizontal");
  }

  changeDefendingPlayer() {
    //change who is receiving attacks
    this.defendingPlayer =
      this.defendingPlayer === this.player1 ? this.player2 : this.player1;
  }

  checkGameOver() {
    return (
      this.player1.board.checkGameOver() || this.player2.board.checkGameOver()
    );
  }

  playRound(x, y) {
    //are we going to rely on event listeners to prevent clicks?
    //, else how to do retries?
    this.defendingPlayer.board.receiveAttack(x, y);

    if (this.checkGameOver()) {
      alert("game is over!");
    }
    this.changeDefendingPlayer();
  }
}
