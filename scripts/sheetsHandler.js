"use strict";

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
        bgColor: "#ecf0f1",
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

function handleSheetActiveness() {
  sheet.addEventListener("click", (e) => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleSheetProperties(sheetIdx);
  });
}

function handleSheetDB(id) {
  sheetDB = collectedSheetDB[id];
  graphComponenthMatrix = collectedGraphComponentMatrix[id];
}

function handleSheetProperties(id) {
  let cell = document.querySelector(`.cell[rid='${i}'][cid='${j}']`);
  for(let i =0; i<rows; i++) {
      for(let j = 0; j<cols; i++) {
          
      }
  }
}
