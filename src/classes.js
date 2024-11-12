export class Ship {
  constructor(length, hitCount = 0, sunk = false) {
    this.length = length;
    this.hitCount = hitCount;
    this.sunk = sunk;
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
