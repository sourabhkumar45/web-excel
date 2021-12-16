"use strict";

let collectedGraphComponentMatrix = [];
let graphComponenthMatrix = [];

let collectedSheetDB = [];
let sheetDB = [];

let activeSheetBg = "#ced6e0";
let activeSheetBorder = "2px solid #367c42";

const addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");

  // getting no. of sheets
  let allSheetsFolder = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetsFolder.length);

  sheet.innerHTML = `<div class="sheet-content">Sheet ${
    allSheetsFolder.length + 1
  }</div>`;

  let sheetFolderContainer = document.querySelector(".sheet-folder-container");
  sheetFolderContainer.appendChild(sheet);
  sheet.scrollIntoView(); // make new sheet Visible
  createSheetDB();
  createGraphComponentMatrix();
  handleSheetActiveness(sheet);
  handleSheetRemoval(sheet);

  sheet.click(); // click the sheet folder so that cell prop can be defined and make current new sheet active
});

//function to create sheet container which contains sheetDB
function createSheetDB() {
  // creating the 2d array to store cell props to corresponding co-ordinates
  let sheetDB = [];

  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++) {
      let cellProps = {
        value: "",
        formula: "",
        bold: false,
        italic: false,
        underline: false,
        alignment: "left",
        fontFamily: "monospace",
        fontSize: "14",
        fontColor: "#000000",
        bgColor: "#FFFFFF",
        children: [],
      };

      sheetRow.push(cellProps);
    }
    sheetDB.push(sheetRow);
  }
  collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
  let graphComponenthMatrix = [];

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      // more than one child relation
      row.push([]);
    }
    graphComponenthMatrix.push(row);
  }
  collectedGraphComponentMatrix.push(graphComponenthMatrix);
}

function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleSheetProperties();
    handleSheetUI(sheet);
  });
}

function handleSheetDB(id) {
  sheetDB = collectedSheetDB[id]; // reassigning sheetDB for current sheet
  graphComponenthMatrix = collectedGraphComponentMatrix[id];
}

function handleSheetProperties() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid='${i}'][cid='${j}']`);
      let cellProp = sheetDB[i][j];

      cell.innerText = cellProp.value;
      cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
      cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
      cell.style.textDecoration = cellProp.underline ? "underline" : "none";
      cell.style.fontSize = cellProp.fontSize + "px";
      cell.style.fontFamily = cellProp.fontFamily;
      cell.style.color = cellProp.fontColor;
      cell.style.backgroundColor = cellProp.bgColor;
      cell.style.textAlign = cellProp;

      cell.click();
      // by clicking we are adding cell props to the cell
    }
  }
  // clicking the first cell whenever sheet is changed
  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

function handleSheetUI(sheet) {
  let allSheet = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheet.length; i++) {
    allSheet[i].style.backgroundColor = "transparent";
    allSheet[i].style.borderBottom = "none";
  }
  sheet.style.backgroundColor = activeSheetBg;
  sheet.style.borderBottom = activeSheetBorder;
}

function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    if (e.button == "2") {
      // right click
      let allSheetsFolder = document.querySelectorAll(".sheet-folder");
      if (allSheetsFolder.length === 1) {
        alert("Cannot delete this sheet");
        return;
      }
      let sheetIdx = Number(sheet.getAttribute("id"));
      let resp = confirm(
        `Sheet${sheetIdx + 1} will be deleted permanently. Are you sure?`
      );
      if (resp === true) {
        // remove from DB
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponentMatrix.splice(sheetIdx, 1);
        // remove from UI
        handleSheetRemovalUI(sheet);
        // by default bring sheet 1 to active
        handleSheetDB(0);
        handleSheetProperties();
      }
    }
  });
}

function handleSheetRemovalUI(sheet) {
  sheet.remove();
  //manage  id attribute of sheet-folder
  let allSheetsFolder = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetsFolder.length; i++) {
    allSheetsFolder[i].setAttribute("id", i);
    let sheetContent = allSheetsFolder[i].querySelectorAll(".sheet-content");
    sheetContent.innerHTML = `Sheet ${i + 1}`;
    allSheetsFolder[i].style.backgroundColor = "transparent";
  }
  allSheetsFolder[0].style.backgroundColor = activeSheetBg;
  allSheetsFolder[0].style.backgroundColor = activeSheetBorder;
}
