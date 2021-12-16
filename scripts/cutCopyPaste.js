// This file contains the implementation of cut copy and paste operations

let grid = document.querySelector(".grid-container");
let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let shiftPressed = false;
let isSelecting = false;
let rangeStorage = [];

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

let startRid, startCid, endRid, endCid;
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

// below code is to add border to selected cell while user move mouse

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
    if (!shiftPressed)
      handleBorders(startRid, startCid, endRid, endCid, "#218c74");
  }
});

// function to add or remove borders from selected cell
function handleBorders(startRid, startCid, endRid, endCid, color) {
  let startRow = Math.min(startRid, endRid);
  let endRow = Math.max(startRid, endRid);
  let startCol = Math.min(startCid, endCid);
  let endCol = Math.max(startCid, endCid);
  if (color != "none") {
    rangeStorage[0] = [startRow, startCol];
    rangeStorage[1] = [endRow, endCol];
  } else {
    // clearing range so that cut copy and paste should not usable
    rangeStorage = [];
  }
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

// implementation of cut, copy, paste
let copyData = [];
let prevCopyData = [];
copyBtn.addEventListener("click", () => {
  prepareData();
});

cutBtn.addEventListener("click", () => {
  prepareData();

  for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
    for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
      let cell = document.querySelector(`.cell[rid='${i}'][cid='${j}']`);

      let cellProp = sheetDB[i][j];
      cellProp.value = "";
      cellProp.formula = "";
      cellProp.bold = false;
      cellProp.italic = false;
      cellProp.underline = false;
      cellProp.fontSize = "14";
      cellProp.fontFamily = "monospace";
      cellProp.fontColor = "#000000";
      cellProp.bgColor = "#FFFFFF";
      cellProp.aligment = "left";
      cellProp.children = [];
      // do not create parent child relation

      //change in UI
      cell.innerText = cellProp.value;
      cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
      cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
      cell.style.textDecoration = cellProp.underline ? "underline" : "none";
      cell.style.fontSize = cellProp.fontSize + "px";
      cell.style.fontFamily = cellProp.fontFamily;
      cell.style.color = cellProp.fontColor;
      cell.style.backgroundColor = cellProp.bgColor;
      cell.style.textAlign = cellProp.alignment;
    }
  }
});

pasteBtn.addEventListener("click", () => {
  if (!copyData.length && !prevCopyData.length) return;
  else if (!copyData.length && prevCopyData.length) copyData = prevCopyData;
  prevCopyData = copyData;
  let address = addressBar.value;
  let [sRid, sCid] = getRidCidFromAddress(address);

  // start paste action

  // is paste action possible
  if (sRid + copyData.length > 100 || sCid + copyData[0].length > 26) {
    alert("Cannot perform paste action!! cells out of range");
    return;
  }
  for (let i = sRid, r = 0; i < sRid + copyData.length; i++, r++) {
    for (let j = sCid, c = 0; j < sCid + copyData[0].length; j++, c++) {
      let cell = document.querySelector(`.cell[rid='${i}'][cid='${j}']`);
      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];
      cellProp.value = data.value;
      cellProp.formula = data.formula;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.bgColor = data.bgColor;
      cellProp.aligment = data.aligment;
      cellProp.children = [];
      // do not create parent child relation

      //change in UI
      cell.innerText = data.value;
      cell.style.fontWeight = data.bold ? "bold" : "normal";
      cell.style.fontStyle = data.italic ? "italic" : "normal";
      cell.style.textDecoration = data.underline ? "underline" : "none";
      cell.style.fontSize = data.fontSize + "px";
      cell.style.fontFamily = data.fontFamily;
      cell.style.color = data.fontColor;
      cell.style.backgroundColor = data.bgColor;
      cell.style.textAlign = data.alignment;
    }
  }
  copyData = [];
});

function prepareData() {
  if (rangeStorage.length < 2) return;
  copyData = [];
  for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
    let copyRow = [];
    for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
      let cellProps = sheetDB[i][j];
      let obj = {
        value: cellProps.value,
        formula: "",
        bold: cellProps.bold,
        italic: cellProps.italic,
        underline: cellProps.underline,
        fontSize: cellProps.fontSize,
        fontFamily: cellProps.fontFamily,
        fontColor: cellProps.fontColor,
        bgColor: cellProps.bgColor,
        aligment: cellProps.aligment,
        chidren: [],
      };
      copyRow.push(obj);
    }
    copyData.push(copyRow);
  }
}
