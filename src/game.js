import { Ship, Gameboard, Player, AI } from "./classes";

export class Game {
  constructor(demo = false) {
    this.demo = demo;
    this.player1 = new Player("human");
    this.player2 = new Player("computer");
    this.defendingPlayer = this.player2;
    this.setPiecesByMode();
    this.computerAI = new AI(this.player1);
  }

  setPiecesByMode() {
    //allows for predictable placement for testing purposes
    if (this.demo === true) {
      this.setPiecesDemo();
    } else {
      this.setPieces();
    }
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

  setPieces() {
    if (this.player1.playerType === "computer") {
      this.player1.placementRandom();
    }

    if (this.player2.playerType === "computer") {
      this.player2.placementRandom();
    }

    //set player2 pieces
    // this.player2.board.placeShip(2, 5, 0, "vertical");
    // this.player2.board.placeShip(3, 6, 1, "horizontal");
    // this.player2.board.placeShip(3, 0, 6, "vertical");
    // this.player2.board.placeShip(4, 4, 8, "horizontal");
    // this.player2.board.placeShip(5, 0, 9, "horizontal");
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
    const result = this.defendingPlayer.board.receiveAttack(x, y);

    if (this.checkGameOver()) {
      alert("game is over!");
    }
    this.changeDefendingPlayer();

    return result;
  }

  playRoundAI() {
    const followupShots = this.computerAI.suggestFollowupShots();
    const availableShots = this.player1.board.getRemainingShotCoords();

    if (followupShots.length > 0) {
      //followup shots have already been tested for availability, we're just picking the first one... therefore no need to loop
      return this.playRound(followupShots[0][0], followupShots[0][1]);
    }

    //random shot fallback

    while (true) {
      const randCoord = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];

      if (
        availableShots.some(
          (coord) => JSON.stringify(coord) === JSON.stringify(randCoord)
        )
      ) {
        console.log("shooting AI: " + randCoord);
        return this.playRound(randCoord[0], randCoord[1]);
      }
    }
  }
}
