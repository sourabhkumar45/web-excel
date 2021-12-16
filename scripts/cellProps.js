// This file define how we represent a cell and its properties as a javascript object
"use strict";

{
  const addSheetBtn = document.querySelector(".sheet-add-icon");
  addSheetBtn.click(); // adding 1 sheet by default

  handleSheetProperties();
}

// this array stores the sheetsDB

// creating the 2d array to store cell props to corresponding co-ordinates
// commented because this was applicable for single sheet only
// for (let i = 0; i < rows; i++) {
//   let sheetRow = [];
//   for (let j = 0; j < cols; j++) {
//     let cellProps = {
//       value: "",
//       formula: "",
//       bold: false,
//       italic: false,
//       underline: false,
//       alignment: "left",
//       fontFamily: "monospace",
//       fontSize: "14",
//       fontColor: "#000000",
//       bgColor: "#ecf0f1",
//       children: [],
//     };

//     sheetRow.push(cellProps);
//   }
//   sheetDB.push(sheetRow);
// }
// Selectors
let allCells = document.querySelectorAll(".cell");
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let bgColor = document.querySelector(".bg-color-prop");
let fontColor = document.querySelector(".font-color-prop");
let alignment = document.querySelectorAll(".alignment");
let formulaBar = document.querySelector(".formula-bar");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0"; // if cell props is active give this background color to the prop UI
let inactiveColorProp = "#ecf0f1"; // if cell prop is inactive give this background color to the prop UI

// attach listenters to cell properties
// how to identify cell when prop is clicked
// ---> take help of address bar where address in present as a single encoded value
// ---> now the decoded address will have the co-ordinates of the cell props in the sheetDB
// ---> now using decoded address select the cell of the grid and change the properties of the cell
// ---> reflect the cell props in the sheetDB also. This will be known as two way binding
// ---> two way binding -> reflecting the change in DB as well as on UI.

// by default click on first cell
let firstCell = document.querySelector(".cell");
firstCell.click();

//bold propertry
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndProps(address);
  // modification in the sheetDB
  cellProp.bold = !cellProp.bold;
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //actual change in props of a cell
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp;
});

//italic propertry
italic.addEventListener("click", () => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndProps(address);
  // modification in the sheetDB
  cellProp.italic = !cellProp.italic;
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //actual change in props of a cell
  italic.style.backgroundColor = cellProp.italic
    ? activeColorProp
    : inactiveColorProp;
});

//underline propertry
underline.addEventListener("click", () => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndProps(address);
  // modification in the sheetDB
  cellProp.underline = !cellProp.underline;
  cell.style.textDecoration = cellProp.underline ? "underline" : "none"; //actual change in props of a cell
  underline.style.backgroundColor = cellProp.underline
    ? activeColorProp
    : inactiveColorProp;
});

//font size propertry
fontSize.addEventListener("change", () => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndProps(address);

  //change in DB
  cellProp.fontSize = fontSize.value;

  //change in UI
  fontSize.value = cellProp.fontSize;
  cell.style.fontSize = cellProp.fontSize + "px";
});

//font-family propertry
fontFamily.addEventListener("change", () => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndProps(address);

  //change in DB
  cellProp.fontFamily = fontFamily.value;

  //change in UI
  cell.style.fontFamily = cellProp.fontFamily;
  fontFamily.value = cellProp.fontFamily;
});

//font-color properties
fontColor.addEventListener("change", () => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndProps(address);

  //change in DB
  cellProp.fontColor = fontColor.value;

  //change in UI
  cell.style.color = cellProp.fontColor;
  fontColor.value = cellProp.fontColor;
});

// background-color propertry
bgColor.addEventListener("change", () => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndProps(address);
  //change in DB
  cellProp.bgColor = bgColor.value;

  //change in UI
  bgColor.value = cellProp.bgColor;
  cell.style.backgroundColor = cellProp.bgColor;
});

// alignment properties
alignment.forEach((alignElement) => {
  alignElement.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndProps(address);

    let alignVal = e.target.classList[2];
    //change in DB
    cellProp.alignment = alignVal;

    // UI change
    cell.style.textAlign = alignVal;
    switch (alignVal) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

// addEventListener to show only active proterties on a cell when click
allCells.forEach((cell) => {
  cell.addEventListener("click", () => {
    let address = addressBar.value;
    let [rid, cid] = getRidCidFromAddress(address);
    let cellProp = sheetDB[rid][cid];
    // apply active/inactive properties to the cell props container
    bold.style.backgroundColor = cellProp.bold
      ? activeColorProp
      : inactiveColorProp;

    italic.style.backgroundColor = cellProp.italic
      ? activeColorProp
      : inactiveColorProp;

    underline.style.backgroundColor = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;

    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    fontColor.value = cellProp.fontColor;
    bgColor.value = cellProp.bgColor;
    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
    // update the formula bar to display active cell formula for each cell
    formulaBar.value = cellProp.formula;
  });
});

// returns the array containing the cell whose address is passed (not necessary the cell on which green border is active)
// HTML element and corresponding cell prop object from sheetDB
function getCellAndProps(address) {
  if (
    address.charCodeAt(0) < 65 ||
    address.charCodeAt(0) > 90 ||
    address[1] > 100 ||
    address[1] < 1
  ) {
    throw new Error("not a valid address");
    return;
  }
  let [rid, cid] = getRidCidFromAddress(address);
  //Access cell and storage Object
  let cell = document.querySelector(`.cell[rid='${rid}'][cid='${cid}']`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

// function will return the decoded address from the string
function getRidCidFromAddress(address) {
  let rid = Number(address.substring(1)) - 1;
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}
