let shiftPressed = false;
let startcellSelected = false;
//let isSelecting = false;
let startCell = {};
let endCell = {};

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
function selectCellBetween(startCell, endCell) {
  handleBorders(
    startCell.rowId,
    startCell.colId,
    endCell.rowId,
    endCell.colId,
    "#218c74"
  );
}
let isSelecting = false;
let startRid, startCid, endRid, endCid, prevRid, prevCid;
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

grid.addEventListener("mousedown", (e) => {
  if (isSelecting == true) {
    isSelecting = false;
    handleBorders(startRid, startCid, endRid, endCid, "none");
    return;
  }
  startRid = Number(e.target.getAttribute("rid"));
  startCid = Number(e.target.getAttribute("cid"));
  isSelecting = true;
});

grid.addEventListener("mouseup", (e) => {
  if (isSelecting) {
    endRid = Number(e.target.getAttribute("rid"));
    endCid = Number(e.target.getAttribute("cid"));
    handleBorders(startRid, startCid, endRid, endCid, "#218c74");
  }
});

// function to add or remove borders from selected cell
function handleBorders(startRid, startCid, endRid, endCid, color) {
  let startRow = Math.min(startRid, endRid);
  let endRow = Math.max(startRid, endRid);
  let startCol = Math.min(startCid, endCid);
  let endCol = Math.max(startCid, endCid);
  for (let i = startCol; i <= endCol; i++) {
    let cell = document.querySelector(`.cell[rid='${startRow}'][cid='${i}']`);
    cell.style.borderTop =
      color == "none"
        ? "0.001px solid rgb(230, 230, 230)"
        : `0.001px solid ${color}`;
  }
  for (let i = startRow; i <= endRow; i++) {
    let cell = document.querySelector(`.cell[rid='${i}'][cid='${startCol}']`);
    cell.style.borderLeft =
      color == "none"
        ? "0.001px solid rgb(230, 230, 230)"
        : `0.001px solid ${color}`;
  }
  for (let i = startRow; i <= endRow; i++) {
    let cell = document.querySelector(`.cell[rid='${i}'][cid='${endCol}']`);
    cell.style.borderRight =
      color == "none"
        ? "0.001px solid rgb(230, 230, 230)"
        : `0.001px solid ${color}`;
  }
  for (let i = startCol; i <= endCol; i++) {
    let cell = document.querySelector(`.cell[rid='${endRow}'][cid='${i}']`);
    cell.style.borderBottom =
      color == "none"
        ? "0.001px solid rgb(230, 230, 230)"
        : `0.001px solid ${color}`;
  }
}
