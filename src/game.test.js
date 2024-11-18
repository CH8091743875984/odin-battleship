import { Game } from "./game";

test("Initialize game, confirm players 1 and 2 created", () => {
  const game = new Game();

  expect(game.player1.playerType).toBe("human");
  expect(game.player2.playerType).toBe("computer");
});

test("Initialize game, confirm demo placements exist in each player", () => {
  const testGame = new Game();
  testGame.setPiecesDemo();

  const player1Placements = testGame.player1.board.getOccupiedSquares();

  // this.player1.board.placeShip(2, 0, 0, "horizontal");
  // this.player1.board.placeShip(3, 2, 2, "horizontal");
  // this.player1.board.placeShip(3, 9, 0, "vertical");
  // this.player1.board.placeShip(4, 3, 7, "horizontal");
  // this.player1.board.placeShip(5, 2, 9, "horizontal");

  const expectedOccupiedSquares1 = [
    [0, 0],
    [1, 0],
    //next
    [2, 2],
    [3, 2],
    [4, 2],
    //next
    [9, 0],
    [9, 1],
    [9, 2],
    //next
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7],
    //next
    [2, 9],
    [3, 9],
    [4, 9],
    [5, 9],
    [6, 9],
  ];
  expect(player1Placements).toEqual(expectedOccupiedSquares1);

  // this.player2.board.placeShip(2, 5, 0, "vertical");
  // this.player2.board.placeShip(3, 6, 1, "horizontal");
  // this.player2.board.placeShip(3, 0, 6, "vertical");
  // this.player2.board.placeShip(4, 4, 8, "horizontal");
  // this.player2.board.placeShip(5, 0, 9, "horizontal");

  const player2Placements = testGame.player2.board.getOccupiedSquares();

  const expectedOccupiedSquares2 = [
    [5, 0],
    [5, 1],
    //next
    [6, 1],
    [7, 1],
    [8, 1],
    //next
    [0, 6],
    [0, 7],
    [0, 8],
    //next
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8],
    //next
    [0, 9],
    [1, 9],
    [2, 9],
    [3, 9],
    [4, 9],
  ];

  expect(player2Placements).toEqual(expectedOccupiedSquares2);
});

test("confirm starting defending player is player 2", () => {
  const testGame = new Game();

  expect(testGame.defendingPlayer).toEqual(testGame.player2);
});

test("play 1 round, confirm missed shot from player 1 recorded to the board of player 2", () => {
  const testGame = new Game();
  testGame.setPiecesDemo();

  testGame.playRound(1, 1);

  expect(testGame.player1.board.missedShots).toEqual([]);
  expect(testGame.player1.board.hitShots).toEqual([]);

  expect(testGame.player2.board.missedShots).toEqual([[1, 1]]);
  expect(testGame.player2.board.hitShots).toEqual([]);
});

test("play 2 rounds, confirm player switch happens and missed and hit shots recorded", () => {
  const testGame = new Game();
  testGame.setPiecesDemo();

  testGame.playRound(1, 1);

  expect(testGame.player1.board.missedShots).toEqual([]);
  expect(testGame.player1.board.hitShots).toEqual([]);

  expect(testGame.player2.board.missedShots).toEqual([[1, 1]]);
  expect(testGame.player2.board.hitShots).toEqual([]);

  testGame.playRound(2, 2);

  expect(testGame.player1.board.missedShots).toEqual([]);
  expect(testGame.player1.board.hitShots).toEqual([[2, 2]]);

  expect(testGame.player2.board.missedShots).toEqual([[1, 1]]);
  expect(testGame.player2.board.hitShots).toEqual([]);
});
