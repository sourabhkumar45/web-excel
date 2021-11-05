"use strict";

let rows = 100;
let cols = 26;
// selection of HTML element
/******************************************************/
let addressColCont = document.querySelector(".address-col-container");
// container name is colCont but it represent a row

let addressRowCont = document.querySelector(".address-row-container");
// container name is rowCont but it represent a col

let cellCont = document.querySelector(".cells-container");
let addressBar = document.querySelector(".address-bar");
// necessary to access cell in the matrix DB and UI and will help in accessing the active cell for two
// way binding

/******************************************************/
//adding column container on the left side
for (let i = 0; i < rows; i++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerText = i + 1;
  addressColCont.appendChild(addressCol);
}

//adding rows in the grid
for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerText = String.fromCharCode(i + 65);
  addressRowCont.appendChild(addressRow);
}

// creating the grid
for (let i = 0; i < rows; i++) {
  let rowCont = document.createElement("div");
  rowCont.setAttribute("class", "row-container");
  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("contentEditable", true);
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);
    // adding event listenter for displaying cell address on address bar on click

    addListenerForAddressBarDisplay(cell, i, j);
    rowCont.appendChild(cell);
  }
  cellCont.appendChild(rowCont);
}

function addListenerForAddressBarDisplay(cell, i, j) {
  cell.addEventListener("click", () => {
    let rowId = i + 1;
    let colId = String.fromCharCode(j + 65);
    addressBar.value = `${colId}${rowId}`;
  });
}
