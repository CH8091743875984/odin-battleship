//key R to rotate pieces
//
export class UI {
  constructor(game) {
    this.game = game;
    this.boardElement = document.getElementById("p2Board");
    //this.infoElement = for messaging
    this.drawGrid("p1Board");
    this.setupComputerBoard(this.game);
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

  setupComputerBoard(gameObject) {
    this.drawGrid("p2Board");

    const container = document.getElementById("p2Board");
    console.log(container);
    const squares = container.querySelectorAll(".gridSquare");
    console.log(squares);

    squares.forEach((div) => {
      div.classList.add("onhover");
    });

    for (let i = 0; i < squares.length; i++) {
      const coord = this.convertArrayToCoord(i);
      squares[i].addEventListener("click", () => {
        let result = gameObject.playRound(coord[0], coord[1]);
        squares[i].classList.remove("onhover");
        console.log(result);
        if (result === "hit") {
          squares[i].style.backgroundColor = "red";
        } else {
          squares[i].style.backgroundColor = "grey";
        }
      });
    }
  }

  //given a game object, for every cell in player2.board, assign a playRound function to the div on click
}
