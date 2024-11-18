//key R to rotate pieces
//

export function drawGrid(containerID) {
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
      gridSquare.style.backgroundColor = "rgb(255,255,255)";
    }
    container.appendChild(gridRow);
  }
  // resizeGrid(sideSetting)
  // addPen()
}
