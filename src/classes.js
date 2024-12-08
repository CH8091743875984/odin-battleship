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
    this.sunkShots = [];
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

  getSunkSquares() {
    const coords = [];
    for (let i = 0; i < this.sunkShips.length; i++) {
      coords.push(this.sunkShips[i].coordinates);
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
        //throw new Error("Square is occupied");
        return null;
      }
      if (!this.isSquareInBounds(x, y)) {
        //throw new Error("Square is out of bounds");
        return null;
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

    if (ship.coordinates !== null) {
      this.placements.push(ship);
    }
  }

  addMissedShot(x, y) {
    this.missedShots.push([x, y]);
  }

  addHitShot(x, y) {
    this.hitShots.push([x, y]);
  }

  addSunkShots(ship) {
    this.sunkShots.push(ship.coordinates);
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
        this.addSunkShots(ship);
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

      // try {

      if (
        this.board.getLegalPlacement(
          randPieceLength,
          randX,
          randY,
          randOrient
        ) !== null
      ) {
        this.board.placeShip(randPieceLength, randX, randY, randOrient);
        remainingPlacements.splice(randPieceIndex, 1);
      }
      // } catch (err) {}
    }
  }
}

export class AI {
  constructor(opponent) {
    this.opponent = opponent;
    this.board = opponent.board;
  }

  getSmallestRemainingShipLength() {
    const ships = this.board.placements;
    const remainingLengths = [];
    ships.forEach((ship) => {
      if (ship.sunk === false) {
        remainingLengths.push(ship.length);
      }
    });

    return Math.min(...remainingLengths);
  }

  hunt() {
    //get remaining positions
    const availableSquares = this.board.getRemainingShotCoords();
    const smallestShip = this.getSmallestRemainingShipLength();
    const possiblePlacements = [];

    for (let i = 0; i < availableSquares.length; i++) {
      const tryHorizontal = this.board.getLegalPlacement(
        smallestShip,
        availableSquares[i][0],
        availableSquares[i][1],
        "horizontal"
      );
      possiblePlacements.push(
        this.board.getLegalPlacement(
          smallestShip,
          availableSquares[i][0],
          availableSquares[i][1],
          "horizontal"
        )
      )[0];
      possiblePlacements.push(
        this.board.getLegalPlacement(
          smallestShip,
          availableSquares[i][0],
          availableSquares[i][1],
          "horizontal"
        )
      )[1];
    }

    return possiblePlacements;
  }

  followupShot() {
    //hunting vs attacking mode? you're into attack mode after a hit, goes away after any hit s turn into sunks
    //find all hits that aren't to sunk ships
    //if one shot, find available shots around it, start clockwise, or towards center? pick one
    //if 2+ shots, pick available shots in line with it (based on x or y being equal between the shots)
    const unsunkShots =
      this.board.hitShots.length !== this.board.sunkShots.length; //fix this

    if (unsunkShots.length === 1) {
    }
    if (unsunkShots.length > 1) {
      //get adjacent shots matching along x or y
      //determine orientation
      //get available shots in that plane, remcommend first one
      //if none available, there may be 2 ships touching eachother... in that case, get adjacent squares around all shots, get available shots for those, ???, pick any??
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
