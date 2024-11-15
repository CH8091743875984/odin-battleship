export class Ship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
    this.sunk = false;
    this.coordinates = [];
  }

  //only counts number of hits... relying on gameboard tracking to plot legal hits?
  hit() {
    this.hitCount++;
    this.sunk = this.isSunk();
  }

  isSunk() {
    return this.length <= this.hitCount;
  }
}

export class Gameboard {
  constructor() {
    this.grid = this.createGrid();
    this.placements = [];
  }

  //create grid

  createGrid() {
    return Array.from({ length: 10 }, () => Array(10).fill(null));
  }

  getGridValue(x, y) {
    if (x < 10 && y < 10) {
      return this.grid[x][y];
    }
    return null;
  }

  isInBoundsSquare(x, y) {
    return x < 10 && y < 10;
  }

  getOccupiedSquares() {
    const coords = [];
    for (let i = 0; i < this.placements.length; i++) {
      coords.push(this.placements[i].coordinates);
    }
    //remember coords ends up being a nested array for each Ship; flatten to get all coords across all ships in one array
    return coords.flat();
  }

  isSquareOccupied(x, y) {
    return this.getOccupiedSquares().some(
      (arr) => JSON.stringify(arr) === JSON.stringify([x, y])
    );
  }

  placeShip(length, x, y, orientation) {
    //validate coords?

    const ship = new Ship(length);
    let shipCoords = [];
    for (let i = 0; i < length; i++) {
      if (this.isSquareOccupied(x, y)) {
        throw new Error("Square is occupied");
      }
      if (!this.isInBoundsSquare(x, y)) {
        throw new Error("Square is out of bounds");
      }

      shipCoords.push([x, y]);
      if (orientation === "horizontal") {
        x++;
      }
      if (orientation === "vertical") {
        y++;
      }
    }
    ship.coordinates = shipCoords;
    this.placements.push(ship);
  }
}
