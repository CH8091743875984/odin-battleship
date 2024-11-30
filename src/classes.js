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
    this.missedShots = [];
    this.hitShots = [];
    this.sunkShips = [];
  }

  createGrid() {
    return Array.from({ length: 10 }, () => Array(10).fill(null));
  }

  getGridValue(x, y) {
    if (x < 10 && y < 10) {
      return this.grid[x][y];
    }
    return null;
  }

  isSquareInBounds(x, y) {
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

  // getNonShotSquares() {
  //   const usedCoords = [];
  //   usedCoords.push(this.missedShots);
  //   usedCoords.push(this.hitShots);
  //   const allCoords = this.grid;

  //   return [
  //     ...usedCoords.filter(
  //       (item1) =>
  //         !allCoords.some(
  //           (item2) => JSON.stringify(item1) === JSON.stringify(item2)
  //         )
  //     ),
  //     ...allCoords.filter(
  //       (item2) =>
  //         !usedCoords.some(
  //           (item1) => JSON.stringify(item1) === JSON.stringify(item2)
  //         )
  //     ),
  //   ].flat();
  // }

  retrieveShipAtCoordinate(x, y) {
    for (let i = 0; i < this.placements.length; i++) {
      if (
        this.placements[i].coordinates.some(
          (arr) => JSON.stringify(arr) === JSON.stringify([x, y])
        )
      ) {
        return this.placements[i];
      }
    }
    return null;
  }

  isSquareOccupied(x, y) {
    return this.getOccupiedSquares().some(
      (arr) => JSON.stringify(arr) === JSON.stringify([x, y])
    );
  }

  getLegalPlacement(length, x, y, orientation) {
    let shipCoords = [];
    for (let i = 0; i < length; i++) {
      if (this.isSquareOccupied(x, y)) {
        throw new Error("Square is occupied");
      }
      if (!this.isSquareInBounds(x, y)) {
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
    return shipCoords;
  }

  placeShip(length, x, y, orientation) {
    //validate coords?

    const ship = new Ship(length);
    // let shipCoords = [];
    // for (let i = 0; i < length; i++) {
    //   if (this.isSquareOccupied(x, y)) {
    //     throw new Error("Square is occupied");
    //   }
    //   if (!this.isSquareInBounds(x, y)) {
    //     throw new Error("Square is out of bounds");
    //   }

    //   shipCoords.push([x, y]);
    //   if (orientation === "horizontal") {
    //     x++;
    //   }
    //   if (orientation === "vertical") {
    //     y++;
    //   }
    // }
    ship.coordinates = this.getLegalPlacement(length, x, y, orientation);
    this.placements.push(ship);
  }

  addMissedShot(x, y) {
    this.missedShots.push([x, y]);
  }

  addHitShot(x, y) {
    this.hitShots.push([x, y]);
  }

  getGridSquareCoords() {
    const coords = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        coords.push([i, j]);
      }
    }
    return coords;
  }

  getRemainingShotCoords() {
    const gridCoords = this.getGridSquareCoords();
    const shotCoords = this.missedShots.concat(this.hitShots);
    const filteredCoords = gridCoords.filter(
      (gridCoord) =>
        !shotCoords.some(
          (shotCoord) => JSON.stringify(gridCoord) === JSON.stringify(shotCoord)
        )
    );
    return filteredCoords;
  }

  addSunkShip(shipObject) {
    this.sunkShips.push(shipObject);
  }

  checkGameOver() {
    //returns bool if all ships are sunk on the board
    return this.placements.length === this.sunkShips.length;
  }

  receiveAttack(x, y) {
    if (!this.isSquareOccupied(x, y)) {
      this.addMissedShot(x, y);
      return "miss";
    } else {
      let ship = this.retrieveShipAtCoordinate(x, y);
      ship.hit();
      this.addHitShot(x, y);
      if (ship.sunk) {
        this.addSunkShip(ship);
      }
      return "hit";
      //need to finish this alerting for all ships sunk
      // if (this.checkGameOver()) {
      //   throw new Error("All ships sunk!");
    }
  }
}

//player object - tracks all shots taken instead of the board?
//or retrieves them each time to check if used already?

export class Player {
  constructor(playerType) {
    this.playerType = playerType;
    this.board = new Gameboard();
  }

  // get playerType() {
  //   return this._playerType;
  // }

  // set playerType(value) {
  //   const allowedValues = ["human", "computer"];
  //   if (!allowedValues.includes(value)) {
  //     throw new Error("Invalid player type");
  //   }
  //   this.playerType(value);
}
