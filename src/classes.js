export class Ship {
  constructor(shipLength) {
    this.shipLength = shipLength;
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
    return this.shipLength <= this.hitCount;
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
        remainingLengths.push(ship.shipLength);
      }
    });

    return Math.min(...remainingLengths);
  }

  getLargestRemainingShipLength() {
    const ships = this.board.placements;
    const remainingLengths = [];
    ships.forEach((ship) => {
      if (ship.sunk === false) {
        remainingLengths.push(ship.shipLength);
      }
    });

    return Math.max(...remainingLengths);
  }

  // findPossibleLocations() {
  //   //get remaining positions
  //   const gridSquares = this.board.getGridSquareCoords()
  //   const availableSquares = this.board.getRemainingShotCoords();
  //   const smallestShip = this.getSmallestRemainingShipLength();
  //   const possiblePlacements = [];

  //   // console.log(smallestShip);

  //   for (let i = 0; i < gridSquares.length; i++) {
  //     const testCoord = gridSquares[i]
  //     if (!availableSquares.some(coord => JSON.stringify(coord) === JSON.stringify(testCoord))) {

  //     }

  //   }
  //   // console.log(possiblePlacements);
  //   return possiblePlacements;
  // }

  getAdjacentSquares(x, y, reach = 1) {
    //get adjacent squares to coords x and y, taking into account bounds of 10x10 grid
    //order returned: above, right, below, left
    const possibleCoords = [];
    const coords = [];
    for (let i = 1; i < reach + 1; i++) {
      possibleCoords.push([x, y - i]);
      possibleCoords.push([x + i, y]);
      possibleCoords.push([x, y + i]);
      possibleCoords.push([x - i, y]);
    }

    possibleCoords.forEach((coord) => {
      if (coord[0] >= 0 && coord[0] <= 9 && coord[1] >= 0 && coord[1] <= 9) {
        coords.push(coord);
      }
    });

    return coords;
  }

  getUnsunkShots() {
    const hitShots = this.board.hitShots;
    const sunkShots = this.board.sunkShots.flat(1);
    //console.log(sunkShots);
    const unsunkShots = hitShots.filter(
      (itemA) =>
        !sunkShots.some(
          (itemB) => JSON.stringify(itemA) === JSON.stringify(itemB)
        )
    );
    return unsunkShots;
  }

  findUnadjacentSquares() {
    //split this out for testing - given smallest ship, given all available shots remaining, filter to those remaining that aren't adjacent
  }

  huntEfficiently() {
    //hunting must be semi-random to avoid player learning the pattern
    //hunting should know the smallest remaining ship length
    //hunting should never pick any shot between one square and N squares between it, with N being the smallest ship length remaining
    //hunting could be "pick a random square, if it's N squares away from a missed shot, pick another" - may not be perfectly efficient?

    const smallestShip = this.getSmallestRemainingShipLength();
    const missedShots = this.board.missedShots;
    const availableShots = this.board.getRemainingShotCoords();
    try {
      for (let i = 0; i < 100; i++) {
        console.log("available");
        console.log(availableShots);

        const shotOption = availableShots.splice(
          Math.floor(Math.random() * availableShots.length),
          1
        )[0];

        const adjacentOptions = this.getAdjacentSquares(
          shotOption[0],
          shotOption[1],
          smallestShip - 1
        );

        if (missedShots.length === 0) {
          console.log("missed is 0, doing shot option here");
          return shotOption;
        } else {
          //below with the if statement, we need to test if the remaining shots are adjacent to eachother... maybe a fn given an array of shots see which are adjacent with len X
          const missedWithinAdjacent = adjacentOptions.filter(
            (itemA) =>
              !missedShots.some(
                (itemB) => JSON.stringify(itemA) === JSON.stringify(itemB)
              )
          );

          // if (missedWithinAdjacent.length === adjacentOptions.length) {
          //   console.log("trying return #2");
          //   return shotOption;
          // }
          if (missedWithinAdjacent.length > 0) {
            console.log("trying return #2");
            console.log(missedWithinAdjacent);
            return shotOption;
          }
        }
      }
    } catch (error) {
      console.log("doing random because of error");
      return this.suggestRandomAvailableShot();
    }
  }

  AIShotmaking() {
    const unsunkShots = this.getUnsunkShots();

    if (unsunkShots.length === 0) {
      // return this.suggestRandomAvailableShot();
      return this.huntEfficiently();
    } else {
      return this.suggestFollowupShots()[0];
    }
  }

  suggestRandomAvailableShot() {
    const availableShots = this.board.getRemainingShotCoords();

    while (true) {
      const randCoord =
        availableShots[Math.floor(Math.random() * availableShots.length)];

      return randCoord;

      // const randCoord = [
      //   Math.floor(Math.random() * 10),
      //   Math.floor(Math.random() * 10),
      // ];

      // if (
      //   availableShots.some(
      //     (coord) => JSON.stringify(coord) === JSON.stringify(randCoord)
      //   )
      // ) {
      //   //console.log("shooting AI rand: " + randCoord);
      //   return randCoord;
    }
  }

  suggestFollowupShots() {
    //hunting vs attacking mode? you're into attack mode after a hit, goes away after any hit s turn into sunks
    //find all hits that aren't to sunk ships
    //if one shot, find available shots around it, start clockwise, or towards center? pick one
    //if 2+ shots, pick available shots in line with it (based on x or y being equal between the shots)
    let suggestedShots = [];
    const largestShip = this.getLargestRemainingShipLength();
    const availableSquares = this.board.getRemainingShotCoords();
    // const hitShots = this.board.hitShots;
    // const sunkShots = this.board.sunkShots;
    // const unsunkShots = hitShots.filter(
    //   (itemA) =>
    //     !sunkShots.some(
    //       (itemB) => JSON.stringify(itemA) === JSON.stringify(itemB)
    //     )
    // );
    const unsunkShots = this.getUnsunkShots();

    // if (unsunkShots.length === 0) {
    //   const huntShot = this.huntEfficiently();

    //   suggestedShots.push(huntShot);
    // }

    if (unsunkShots.length === 1) {
      const shot = unsunkShots[0];
      const adjacentSquares = this.getAdjacentSquares(shot[0], shot[1]);
      const availableShots = adjacentSquares.filter((itemA) =>
        availableSquares.some(
          (itemB) => JSON.stringify(itemA) === JSON.stringify(itemB)
        )
      );
      suggestedShots = availableShots;
    }
    if (unsunkShots.length > 1) {
      const multipleOptions = [];
      //example - [6,4], [6,5]
      //example - [1,1], [1,3], [1,4]
      //get the largest ship remaining
      //find the first pair of unsunk shots that share a plane x or y within the range of the largest ship available

      //
      // the for loop is goofed here

      for (let i = 0; i < unsunkShots.length; i++) {
        for (let k = i + 1; k < unsunkShots.length; k++) {
          //if two unsunk shots are equal on X axis and 1 square away from eachother on Y...
          if (
            unsunkShots[i][0] === unsunkShots[k][0] &&
            Math.abs(unsunkShots[i][1] - unsunkShots[k][1]) === 1
          ) {
            console.log("got to return");
            //return the vertically modified adjacent squares to the two
            const adjacentI = this.getAdjacentSquares(
              unsunkShots[i][0],
              unsunkShots[i][1]
            );
            const adjacentK = this.getAdjacentSquares(
              unsunkShots[k][0],
              unsunkShots[k][1]
            );
            multipleOptions.push(adjacentI[0]);
            multipleOptions.push(adjacentI[2]);
            multipleOptions.push(adjacentK[0]);
            multipleOptions.push(adjacentK[2]);
          }
          //if two unsunk shots are equal on Y axis and 1 square away from eachother on X...
          if (
            unsunkShots[i][1] === unsunkShots[k][1] &&
            Math.abs(unsunkShots[i][0] - unsunkShots[k][0]) === 1
          ) {
            //return the horizontally modified adjacent squares to the two

            const adjacentI = this.getAdjacentSquares(
              unsunkShots[i][0],
              unsunkShots[i][1]
            );
            const adjacentK = this.getAdjacentSquares(
              unsunkShots[k][0],
              unsunkShots[k][1]
            );
            //do shots need to be ordered before sending into the loop? this will return the adjacent right and left of the first square, which gets tossed later because it's a hit square, leaving the LEFT
            //square to be the first option chosen... maybe that's fine?
            multipleOptions.push(adjacentI[1]);
            multipleOptions.push(adjacentI[3]);
            multipleOptions.push(adjacentK[1]);
            multipleOptions.push(adjacentK[3]);

            // multipleOptions.push(this.getAdjacentSquares[unsunkShots[[i][1]]]);
            // multipleOptions.push(this.getAdjacentSquares[unsunkShots[[i][3]]]);
            // multipleOptions.push(this.getAdjacentSquares[unsunkShots[[k][1]]]);
            // multipleOptions.push(this.getAdjacentSquares[unsunkShots[[k][3]]]);
          }
          if (
            unsunkShots[i][0] === unsunkShots[k][0] &&
            Math.abs(unsunkShots[i][1] - unsunkShots[k][1]) < largestShip
          ) {
            // console.log();
          }
          if (
            unsunkShots[i][1] === unsunkShots[k][1] &&
            Math.abs(unsunkShots[i][0] - unsunkShots[k][0]) < largestShip
          ) {
            // console.log();
          }
        }
      }

      //in the event multiple options returns nothing, but there are still unsunk shots on the board, here's a fallback to just run through all adjacent shots (later filtered to those available)

      unsunkShots.forEach((shot) => {
        multipleOptions.push(...this.getAdjacentSquares(shot[0], shot[1]));
      });

      const availableShots = multipleOptions.filter((itemA) =>
        availableSquares.some(
          (itemB) => JSON.stringify(itemA) === JSON.stringify(itemB)
        )
      );
      suggestedShots = availableShots;
      //if the pair are adjacent, shoot on either end of the open plane if not already a miss
      //if not adjacent, find the cells in the middle (min and second to min?, shoot one of those)
      //
      //if no pair exists, fallback to the default?
      //
      //get adjacent shots matching along x or y
      //determine orientation
      //get available shots in that plane, remcommend first one
      //if none available, there may be 2 ships touching eachother... in that case, get adjacent squares around all shots, get available shots for those, ???, pick any??
    }
    console.log(suggestedShots);
    return suggestedShots;
    //fall back to just shoot the first open adjacent square?
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
