let shiftPressed = false;

let rangeStorage = [];
let grid = document.querySelector(".grid-container");
document.addEventListener("keydown", (e) => {
  shiftPressed = e.shiftKey ? true : false;
});

document.addEventListener("keyup", (e) => {
  shiftPressed = false;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid='${i}'][cid='${j}']`);
    handleSelectedCell(cell);
  }
}

function handleSelectedCell(cell) {
  cell.addEventListener("click", (e) => {
    // Select cells range word
    if (!shiftPressed) return;
    if (rangeStorage.length == 2) {
      handleBorders(
        rangeStorage[0][0],
        rangeStorage[0][1],
        rangeStorage[1][0],
        rangeStorage[1][1],
        "none"
      );
      rangeStorage = [];
    }
    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]);
    // managing UI of selection
    if (rangeStorage.length == 2) {
      handleBorders(
        rangeStorage[0][0],
        rangeStorage[0][1],
        rangeStorage[1][0],
        rangeStorage[1][1],
        "#218c74"
      );
    }
  });
}

// below commented code is to add border to selected cell while user move mouse
// let isSelecting = false;
// let startRid, startCid, endRid, endCid;
// grid.addEventListener("mousedown", (e) => {
//   startRid = Number(e.target.getAttribute("rid"));
//   startCid = Number(e.target.getAttribute("cid"));
//   console.log(startRid, startCid);
//   isSelecting = true;
// });

// grid.addEventListener("mousemove", (e) => {
//   if (isSelecting == true) {
//     e.target.style.backgroundColor = "red";
//   }
// });

// grid.addEventListener("mouseup", (e) => {
//   endRid = Number(e.target.getAttribute("rid"));
//   endCid = Number(e.target.getAttribute("cid"));
//   console.log(endRid, endCid);
//   makeBorders(startRid, startCid, endRid, endCid, "#218c74");
//   isSelecting = false;
// });

// function to add or remove borders from selected cell
function handleBorders(startRid, startCid, endRid, endCid, color) {
  let startRow = Math.min(startRid, endRid);
  let endRow = Math.max(startRid, endRid);
  let startCol = Math.min(startCid, endCid);
  let endCol = Math.max(startCid, endCid);
  //   console.log("Row range is ", startRow, " to ", endRow);
  //   console.log("Col range is ", startCol, " to ", endCol);
  for (let i = startCol; i <= endCol; i++) {
    let cell = document.querySelector(`.cell[rid='${startRow}'][cid='${i}']`);
    cell.style.borderTop = color == "none" ? color : `2px solid ${color}`;
  }
  for (let i = startRow; i <= endRow; i++) {
    let cell = document.querySelector(`.cell[rid='${i}'][cid='${startCol}']`);
    cell.style.borderLeft = color == "none" ? color : `2px solid ${color}`;
  }
  for (let i = startRow; i <= endRow; i++) {
    let cell = document.querySelector(`.cell[rid='${i}'][cid='${endCol}']`);
    cell.style.borderRight = color == "none" ? color : `2px solid ${color}`;
  }
  for (let i = startCol; i <= endCol; i++) {
    let cell = document.querySelector(`.cell[rid='${endRow}'][cid='${i}']`);
    cell.style.borderBottom = color == "none" ? color : `2px solid ${color}`;
  }
}
