//key R to rotate pieces
//
export class UI {
  constructor(game) {
    this.game = game;
    this.boardElement = document.getElementById("p2Board");
    //this.infoElement = for messaging
    this.drawGrid("p1Board");

    this.placementOrientation = "horizontal";
    this.remainingPlacements = [5, 4, 3, 3, 2];
    // this.setupComputerBoard();
    // this.renderPlayerBoard();
    this.setupPlayerBoard();
    this.activatePlacementOrientation();
  }

  activatePlacementOrientation() {
    document.addEventListener("keydown", (event) => {
      // console.log(this.placementOrientation);

      if (event.key === "r" || event.key === "R") {
        this.clearPlacementHighlights();
        if (this.placementOrientation === "horizontal") {
          this.placementOrientation = "vertical";
        } else {
          this.placementOrientation = "horizontal";
        }
        // this.clearPlacementHighlights();
      }
    });
  }

  clearPlacementHighlights() {
    const elements = document.querySelectorAll(".placementHover");
    // console.log(elements.length);
    elements.forEach((element) => {
      element.classList.remove("placementHover");
      // console.log(element.classList);
    });
  }

  setupPlayerBoard() {
    /*
    gather proposed placements
    disallow player shots / don't fully render the opponent yet
    for a piece in the requestit lengths - 2, 3, 3, 4, 5
    start with 5; cursor starts with the first cell of the piece, then highlights the 
    - adjacent ones whether vertical or horizontal in the len of the pice
    clicking saves the proposed placement and displays it on the grid - or we just outright have it save to the grid
    after through all pieces, either we have them confirm they're ok - retry either clears all placements? 
    --or if they want to continue
    
    */
    this.setMessage(
      "Welcome! Please set up your pieces. Press the R key to rotate the piece."
    );
    const container = document.getElementById("p1Board");
    const squares = container.querySelectorAll(".gridSquare");

    if (this.remainingPlacements.length > 0) {
      for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener("mouseover", () => {
          const proposedCoord = this.convertArrayToCoord(i);
          try {
            document.body.style.cursor = "default";
            const coords = this.game.player1.board.getLegalPlacement(
              this.remainingPlacements[0],
              proposedCoord[0],
              proposedCoord[1],
              this.placementOrientation
            ); //needs to be inside listener given changing lengths

            coords.forEach((coord) => {
              const index = this.convertCoordToArray(coord[0], coord[1]);
              squares[index].classList.add("placementHover");
            });
          } catch (err) {
            document.body.style.cursor = "not-allowed";
            setTimeout(() => {
              document.body.style.cursor = "default";
            }, 2000);
          }
        });
        squares[i].addEventListener("mouseout", () => {
          const proposedCoord = this.convertArrayToCoord(i);

          const coords = this.game.player1.board.getLegalPlacement(
            this.remainingPlacements[0],
            proposedCoord[0],
            proposedCoord[1],
            this.placementOrientation
          ); //needs to be inside listener given changing lengths

          coords.forEach((coord) => {
            const index = this.convertCoordToArray(coord[0], coord[1]);
            squares[index].classList.remove("placementHover");
          });
        });
        squares[i].addEventListener("click", () => {
          const proposedCoord = this.convertArrayToCoord(i);
          const length = this.remainingPlacements.shift();
          this.game.player1.board.placeShip(
            length,
            proposedCoord[0],
            proposedCoord[1],
            this.placementOrientation
          );

          const occupiedSquares = this.game.player1.board.getOccupiedSquares();
          console.log(occupiedSquares);
          occupiedSquares.forEach((square) => {
            const index = this.convertCoordToArray(square[0], square[1]);
            squares[index].style.backgroundColor = "darkGrey";
          });

          if (this.remainingPlacements.length === 0) {
            this.setMessage("Begin the game! Your turn.");
            this.setupComputerBoard();
            this.renderPlayerBoard();
          }
        });
      }
    }
  }

  drawGrid(containerID) {
    const container = document.getElementById(containerID);

    container.replaceChildren();
    let sideSetting = 10;
    for (let i = 0; i < sideSetting; i++) {
      let gridRow = document.createElement("div");
      gridRow.className = "gridRow";

      for (let i = 0; i < sideSetting; i++) {
        let gridSquare = document.createElement("div");
        gridSquare.className = "gridSquare";
        gridRow.append(gridSquare);
      }
      container.appendChild(gridRow);
    }
  }

  convertArrayToCoord(i) {
    const x = i % 10;
    const y = Math.floor(i / 10);

    return [x, y];
  }

  convertCoordToArray(x, y) {
    return x + y * 10;
  }

  renderPlayerBoard() {
    this.drawGrid("p1Board");

    const container = document.getElementById("p1Board");
    const squares = container.querySelectorAll(".gridSquare");

    const hitShots = this.game.player1.board.hitShots;
    const missedShots = this.game.player1.board.missedShots;
    const occupiedSquares = this.game.player1.board.getOccupiedSquares();
    //console.log(occupiedSquares);

    for (let i = 0; i < squares.length; i++) {
      const gridCoord = this.convertArrayToCoord(i);
      if (
        hitShots.some(
          (shotCoord) => JSON.stringify(gridCoord) === JSON.stringify(shotCoord)
        )
      ) {
        squares[i].classList.add("playerHit");
      } else if (
        missedShots.some(
          (shotCoord) => JSON.stringify(gridCoord) === JSON.stringify(shotCoord)
        )
      ) {
        squares[i].classList.add("playerMissed");
      } else if (
        occupiedSquares.some(
          (shipCoord) => JSON.stringify(gridCoord) === JSON.stringify(shipCoord)
        )
      ) {
        squares[i].style.backgroundColor = "darkGrey";
      }
    }

    // squares.forEach((div) => {
    //   div.classList.add("onhover");
    // });
  }

  renderComputerSunkShips() {
    const container = document.getElementById("p2Board");
    const squares = container.querySelectorAll(".gridSquare");

    const sunkCoords = this.game.player2.board.getSunkSquares();
    //console.log(sunkCoords);

    for (let i = 0; i < squares.length; i++) {
      const gridCoord = this.convertArrayToCoord(i);
      if (
        sunkCoords.some(
          (shotCoord) => JSON.stringify(gridCoord) === JSON.stringify(shotCoord)
        )
      ) {
        //do not need to remove the hit style just yet?
        squares[i].classList.add("computerSunk");
      }
    }
  }

  changeStatusIndicator(square) {
    square.classList.add("statusSunk");
  }

  renderAllPlayerStatus() {
    //webpack doesnt like dynamic values in query selector it seems?
    const containerPlayer = document.querySelector("#trackerPlayer");
    const containerComputer = document.querySelector("#trackerComputer");
    const sunkShipsPlayer = this.game.player1.board.sunkShips;
    const sunkShipsComputer = this.game.player2.board.sunkShips;

    const trackers = [
      [containerPlayer, sunkShipsPlayer],
      [containerComputer, sunkShipsComputer],
    ];

    trackers.forEach((tracker) => {
      const container = tracker[0];
      const sunkShips = tracker[1];
      let threeCount = 0;
      for (let i = 0; i < sunkShips.length; i++) {
        if (sunkShips[i].shipLength === 3) {
          threeCount++;
        }
      }
      for (let i = 0; i < sunkShips.length; i++) {
        if (sunkShips[i].shipLength === 5) {
          const squares = container.querySelectorAll(
            "#statusCarrier > .statusSquares > .statusSquare"
          );
          squares.forEach((square) => {
            this.changeStatusIndicator(square);
          });
        }
        if (sunkShips[i].shipLength === 4) {
          const squares = container.querySelectorAll(
            "#statusBattleship > .statusSquares > .statusSquare"
          );
          squares.forEach((square) => {
            this.changeStatusIndicator(square);
          });
        }
        if (sunkShips[i].shipLength === 2) {
          const squares = container.querySelectorAll(
            "#statusGunboat > .statusSquares > .statusSquare"
          );
          squares.forEach((square) => {
            this.changeStatusIndicator(square);
          });
        }
        if (sunkShips[i].shipLength === 3) {
          if (threeCount > 0) {
            const squares = container.querySelectorAll(
              "#statusDestroyer > .statusSquares > .statusSquare"
            );
            squares.forEach((square) => {
              this.changeStatusIndicator(square);
            });
          }
          if (threeCount === 2) {
            const squares = container.querySelectorAll(
              "#statusSubmarine > .statusSquares > .statusSquare"
            );
            squares.forEach((square) => {
              this.changeStatusIndicator(square);
            });
          }
        }
      }
    });
  }

  setupComputerBoard() {
    this.drawGrid("p2Board");

    const container = document.getElementById("p2Board");
    const squares = container.querySelectorAll(".gridSquare");

    squares.forEach((div) => {
      div.classList.add("onhover");
    });

    for (let i = 0; i < squares.length; i++) {
      const coord = this.convertArrayToCoord(i);
      squares[i].addEventListener(
        "click",
        () => {
          let result = this.game.playRound(coord[0], coord[1]);
          squares[i].classList.remove("onhover");
          //console.log(result);
          if (result === "hit") {
            // squares[i].style.backgroundColor = "red";
            this.setMessage("You made a hit!");
            squares[i].classList.add("computerHit");
          } else {
            this.setMessage("You missed!");
            squares[i].style.backgroundColor = "grey";
          }
          const computerResult = this.game.playRoundAI();
          this.setMessage(
            this.getMessage() + " The computer made a " + computerResult + "."
          );

          this.renderPlayerBoard();
          this.renderComputerSunkShips();
          this.renderAllPlayerStatus();
        },
        { once: true }
      );
    }
  }

  setMessage(text) {
    const msg = document.querySelector("#message");
    msg.textContent = text;
  }

  getMessage() {
    return document.querySelector("#message").textContent;
  }

  //given a game object, for every cell in player2.board, assign a playRound function to the div on click
}
