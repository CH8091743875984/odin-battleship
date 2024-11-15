import { Ship, Gameboard } from "./classes";

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
  expect(() => {
    board.placeShip(5, 6, 7, "horizontal");
  }).toThrow("Square is out of bounds");
});

test("disallow placement of a Ship of length 3 at coordinates 9,9 vertically (runs out of bounds)", () => {
  const board = new Gameboard();
  expect(() => {
    board.placeShip(3, 9, 9, "vertical");
  }).toThrow("Square is out of bounds");
});

test("disallow placement of Ship to overlap another", () => {
  const board = new Gameboard();
  board.placeShip(3, 4, 4, "horizontal");

  expect(() => {
    board.placeShip(5, 5, 3, "vertical");
  }).toThrow("Square is occupied");
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

// test("place a Ship of length 2 at coordinates 0,0 vertically", () => {});

// test("disallow a Ship of length 2 at coordinates 9,9 (out of bounds)", () => {});

// test("disallow overlapping ship placement attempts");

// test("record a missed shot");

// test("record a hit shot and confirm the proper Ship has an updated hit count");

// test("confirm that all ships have been sunk");

// //Player tests
// test("create human player with empty grid");
// test("create computer player with empty grid");
