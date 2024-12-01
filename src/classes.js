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

  placementRandom() {
    const remainingPlacements = [5, 4, 3, 3, 2];

    while (remainingPlacements.length > 0) {
      // const proposedLength = remainingPlacements[0];
      const randPieceIndex = Math.floor(
        Math.random() * remainingPlacements.length
      );
      const randPieceLength = remainingPlacements[randPieceIndex];
      const randX = Math.floor(Math.random() * 10);
      const randY = Math.floor(Math.random() * 10);
      const randOrient =
        Math.floor(Math.random() * 2) === 0 ? "horizontal" : "vertical";

      try {
        this.board.placeShip(randPieceLength, randX, randY, randOrient);
        remainingPlacements.splice(randPieceIndex, 1);
      } catch (err) {}
    }
  }
}
/*
computer skills - 

placements - 
1. random until it fits - random position, random orientation
2. find available locations for a given piece, maximizing space from nearby ships
3. 

shots - 
1. random
2. 
2. remember last hit shot? 
2. may need to look for remaining slots that are both x and y - look for possible crosses of the smallest ship remaining to eliminate vertical and horizontal options at the same time; after then, search for planes of that min len that remain
2. if hit, make an available shot to the adjacent last hit made until there are no hits without a sunk boat, then resume strat
2. if there are two or more adjacent hits on an x or y plane, continue shooting along that plane until there's a miss
3. if the remaining spaces on the plane of the last hit are less than the possible length of the remaining boat(s), don't try hitting in that plane
2. grid spacing of every other, starting in the top corner
gather lines where the last ship could be, pick shots that eliminate the most
3. change grid spacing based on smallest ship remaining - if small 2 size is sunk, space out every three shots where those gaps still remain
4. if battleship sunk in one quadrant, switch to a quadrant with the least shots made - spacing out shots
*/
