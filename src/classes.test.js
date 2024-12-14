import { Ship, Gameboard, Player, AI } from "./classes";

//Ship tests
test("create Ship object of length 4", () => {
  const destroyer = new Ship(4);
  expect(destroyer.length).toBe(4);
});
test("confirm hit count is 1 after one hit on ship object", () => {
  const destroyer = new Ship(4);
  destroyer.hit();
  expect(destroyer.hitCount).toBe(1);
});
test("confirm sunk status remains False until 3/3 hits made on ship object of length 3", () => {
  const submarine = new Ship(3);
  submarine.hit();
  expect(submarine.sunk).toBe(false);
  submarine.hit();
  expect(submarine.sunk).toBe(false);
  submarine.hit();
  expect(submarine.sunk).toBe(true);
});

//Gameboard tests
test("create Gameboard object with grid of 10x10, all values equal to null", () => {
  const board = new Gameboard();
  const expectedLayout = Array.from({ length: 10 }, () => Array(10).fill(null));
  expect(board.grid).toEqual(expectedLayout);
});

test("empty board returns an empty array if no placements are made", () => {
  const board = new Gameboard();
  expect(board.getOccupiedSquares()).toEqual([]);
});

test("check for occupied square on the board returns False if no placements are made", () => {
  const board = new Gameboard();
  expect(board.isSquareOccupied(0, 0)).toBe(false);
  expect(board.isSquareOccupied(9, 9)).toBe(false);
});

test("place a Ship of length 2 at coordinates 0,0 horizontally", () => {
  const board = new Gameboard();
  board.placeShip(2, 0, 0, "horizontal");
  expect(board.placements[0].coordinates).toEqual([
    [0, 0],
    [1, 0],
  ]);
});

test("place a Ship of length 4 at coordinates 1,1 vertically", () => {
  const board = new Gameboard();
  board.placeShip(4, 1, 1, "vertical");
  expect(board.placements[0].coordinates).toEqual([
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
  ]);
});

test("disallow placement of a Ship of length 5 at coordinates 6,7 horizontally (runs out of bounds)", () => {
  //testing errors requires functions to be wrapped in a function
  const board = new Gameboard();
  // expect(() => {
  //   board.placeShip(5, 6, 7, "horizontal");
  // }).toThrow("Square is out of bounds");
  board.placeShip(5, 6, 7, "horizontal");

  expect(board.placements).toEqual([]);
});

test("disallow placement of a Ship of length 3 at coordinates 9,9 vertically (runs out of bounds)", () => {
  const board = new Gameboard();
  // expect(() => {
  //   board.placeShip(3, 9, 9, "vertical");
  // }).toThrow("Square is out of bounds");
  board.placeShip(3, 9, 9, "vertical");

  expect(board.placements).toEqual([]);
});

test("disallow placement of Ship to overlap another", () => {
  const board = new Gameboard();
  board.placeShip(3, 4, 4, "horizontal");
  board.placeShip(5, 5, 3, "vertical");

  expect(board.placements.length).toEqual(1);
});

test("record several missed shots to the board", () => {
  const board = new Gameboard();
  board.placeShip(3, 4, 4, "horizontal");
  board.placeShip(5, 2, 3, "vertical");
  board.placeShip(2, 8, 8, "vertical");
  board.placeShip(4, 1, 1, "horizontal");
  board.placeShip(3, 9, 2, "vertical");

  board.receiveAttack(0, 2);
  board.receiveAttack(0, 1);
  board.receiveAttack(7, 7);

  expect(board.missedShots).toEqual([
    [0, 2],
    [0, 1],
    [7, 7],
  ]);
  expect(board.hitShots).toEqual([]);
});

test("record two hit shots to the board (ship object hit count, board hit list)", () => {
  const board = new Gameboard();
  board.placeShip(3, 4, 4, "horizontal");
  board.placeShip(5, 2, 3, "vertical");
  board.placeShip(2, 8, 8, "vertical");
  board.placeShip(4, 1, 1, "horizontal");
  board.placeShip(3, 9, 2, "vertical");

  board.receiveAttack(9, 4);
  board.receiveAttack(9, 2);
  expect(board.hitShots).toEqual([
    [9, 4],
    [9, 2],
  ]);
  expect(board.retrieveShipAtCoordinate(9, 4).hitCount).toBe(2);

  expect(board.missedShots).toEqual([]);
});

test("record two hit shots to the board (ship object hit count, board hit list)", () => {
  const board = new Gameboard();
  board.placeShip(3, 4, 4, "horizontal");
  board.placeShip(5, 2, 3, "vertical");
  board.placeShip(2, 8, 8, "vertical");
  board.placeShip(4, 1, 1, "horizontal");
  board.placeShip(3, 9, 2, "vertical");

  board.receiveAttack(9, 4);
  board.receiveAttack(9, 2);
  expect(board.hitShots).toEqual([
    [9, 4],
    [9, 2],
  ]);
  expect(board.retrieveShipAtCoordinate(9, 4).hitCount).toBe(2);

  expect(board.missedShots).toEqual([]);
});

test("record three hit shots to the board and confirm ship sinks (hitCount, sunk status)", () => {
  const board = new Gameboard();
  board.placeShip(3, 4, 4, "horizontal");
  board.placeShip(5, 2, 3, "vertical");
  board.placeShip(2, 8, 8, "vertical");
  board.placeShip(4, 1, 1, "horizontal");
  board.placeShip(3, 9, 2, "vertical");

  board.receiveAttack(9, 4);
  board.receiveAttack(9, 2);
  board.receiveAttack(9, 3);
  expect(board.hitShots).toEqual([
    [9, 4],
    [9, 2],
    [9, 3],
  ]);

  const testShip = board.retrieveShipAtCoordinate(9, 3);

  expect(testShip.hitCount).toBe(3);
  expect(testShip.sunk).toBe(true);

  expect(board.missedShots).toEqual([]);
});

test("record game over with all ships sunk", () => {
  const board = new Gameboard();
  board.placeShip(3, 4, 4, "horizontal");
  board.placeShip(5, 2, 3, "vertical");
  board.placeShip(2, 8, 8, "vertical");

  board.receiveAttack(4, 4);
  board.receiveAttack(5, 4);
  board.receiveAttack(6, 4);
  expect(board.checkGameOver()).toBe(false);

  board.receiveAttack(2, 3);
  board.receiveAttack(2, 4);
  board.receiveAttack(2, 5);
  board.receiveAttack(2, 6);
  board.receiveAttack(2, 7);
  expect(board.checkGameOver()).toBe(false);

  board.receiveAttack(8, 8);
  board.receiveAttack(8, 9);

  expect(board.checkGameOver()).toBe(true);
});

test("remaining shot cords of a fresh board equal length 100", () => {
  const playerTest = new Player("human");
  const remainingCoords = playerTest.board.getRemainingShotCoords();
  expect(remainingCoords.length).toEqual(100);
});

// test("place a Ship of length 2 at coordinates 0,0 vertically", () => {});

// test("disallow a Ship of length 2 at coordinates 9,9 (out of bounds)", () => {});

// test("disallow overlapping ship placement attempts");

// test("record a missed shot");

// test("record a hit shot and confirm the proper Ship has an updated hit count");

// test("confirm that all ships have been sunk");

//Player tests
test("create human player", () => {
  const playerTest = new Player("human");

  expect(playerTest.playerType).toBe("human");
});
test("create computer player", () => {
  const playerTest = new Player("computer");

  expect(playerTest.playerType).toBe("computer");
});
test("create human player, confirm has zero placements", () => {
  const playerTest = new Player("human");

  expect(playerTest.board.placements).toEqual([]);
});

test("computer randomly creates 5 placements", () => {
  const computerTest = new Player("computer");
  computerTest.placementRandom();

  expect(computerTest.board.placements.length).toEqual(5);
});

//AI Tests
test("get smallest remaining ship", () => {
  const playerTest = new Player("human");

  playerTest.board.placeShip(3, 4, 4, "horizontal");
  playerTest.board.placeShip(5, 2, 3, "vertical");
  playerTest.board.placeShip(2, 8, 8, "vertical");
  playerTest.board.placeShip(4, 1, 1, "horizontal");
  playerTest.board.placeShip(3, 9, 2, "vertical");

  const testAI = new AI(playerTest);

  expect(testAI.getSmallestRemainingShipLength()).toBe(2);
});

test("get adjacent squares to a given square (middle of the board)", () => {
  const playerTest = new Player("human");
  const testAI = new AI(playerTest);

  expect(testAI.getAdjacentSquares(2, 2)).toEqual([
    [2, 1],
    [3, 2],
    [2, 3],
    [1, 2],
  ]);
});

test("get adjacent squares to a given square (edge of the board)", () => {
  const playerTest = new Player("human");
  const testAI = new AI(playerTest);

  expect(testAI.getAdjacentSquares(9, 9)).toEqual([
    [9, 8],
    [8, 9],
  ]);
});

test("get suggested followup shots to 1 hit but unsunk shot in the middle of the board", () => {
  const playerTest = new Player("human");

  playerTest.board.placeShip(2, 6, 4, "horizontal");
  playerTest.board.receiveAttack(6, 4);

  const testAI = new AI(playerTest);
  const huntResults = testAI.suggestFollowupShots();

  // console.log(huntResults);

  expect(huntResults).toEqual([
    [6, 3],
    [7, 4],
    [6, 5],
    [5, 4],
  ]);
});

test("get suggested followup shots (two rounds) to 1 hit but unsunk shot in the middle of the board, after a miss has been made", () => {
  const playerTest = new Player("human");

  playerTest.board.placeShip(2, 6, 4, "horizontal");
  //first hit
  playerTest.board.receiveAttack(6, 4);

  const testAI = new AI(playerTest);
  const huntResults = testAI.suggestFollowupShots();

  // console.log(huntResults);

  expect(huntResults).toEqual([
    [6, 3],
    [7, 4],
    [6, 5],
    [5, 4],
  ]);

  //a miss
  playerTest.board.receiveAttack(6, 3);

  const huntResults2 = testAI.suggestFollowupShots();

  expect(huntResults2).toEqual([
    [7, 4],
    [6, 5],
    [5, 4],
  ]);
});

test("calling followup shots with no hits on the board returns an empty list", () => {
  const playerTest = new Player("human");

  playerTest.board.placeShip(2, 6, 4, "horizontal");

  const testAI = new AI(playerTest);
  const huntResults = testAI.suggestFollowupShots();

  expect(huntResults).toEqual([]);
});

test("unsunk shots register correctly after 1 ship is hit - the hit is returned", () => {
  const playerTest = new Player("human");

  playerTest.board.placeShip(2, 6, 4, "horizontal");
  playerTest.board.placeShip(2, 0, 8, "horizontal");

  const testAI = new AI(playerTest);

  playerTest.board.receiveAttack(6, 4);

  expect(testAI.getUnsunkShots()).toEqual([[6, 4]]);
});

test("sunk shots property logs correctly", () => {
  const playerTest = new Player("human");

  playerTest.board.placeShip(2, 6, 4, "horizontal");
  playerTest.board.placeShip(2, 0, 8, "horizontal");

  const testAI = new AI(playerTest);

  playerTest.board.receiveAttack(6, 4);
  playerTest.board.receiveAttack(7, 4);

  expect(playerTest.board.sunkShots).toEqual([
    [6, 4],
    [7, 4],
  ]);
});

test("unsunk shots register correctly after 1 ship is sunk - empty array is returned", () => {
  const playerTest = new Player("human");

  playerTest.board.placeShip(2, 6, 4, "horizontal");
  playerTest.board.placeShip(2, 0, 8, "horizontal");

  const testAI = new AI(playerTest);

  playerTest.board.receiveAttack(6, 4);
  playerTest.board.receiveAttack(7, 4);

  expect(playerTest.board.hitShots).toEqual([
    [6, 4],
    [7, 4],
  ]);

  expect(testAI.getUnsunkShots()).toEqual([]);
});

test("unsunk shots register correctly after 1 ship is sunk and another is hit - just the second ship hit is returned", () => {
  const playerTest = new Player("human");

  playerTest.board.placeShip(2, 6, 4, "horizontal");
  playerTest.board.placeShip(2, 0, 8, "horizontal");

  const testAI = new AI(playerTest);

  playerTest.board.receiveAttack(6, 4);
  playerTest.board.receiveAttack(7, 4);

  playerTest.board.receiveAttack(0, 8);

  expect(testAI.getUnsunkShots()).toEqual([[0, 8]]);
});
