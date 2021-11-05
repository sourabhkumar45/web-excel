// This file define how we represent a cell and its properties as a javascript object

// creating the 2d array to store cell props to corresponding co-ordinates
let sheetDB = [];

for (let i = 0; i < rows; i++) {
  let sheetRow = [];
  for (let j = 0; j < cols; j++) {
    let cellProps = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: "14",
      fontColor: "#000000",
      bgColor: "#000000",
    };

    sheetRow.push(cellProps);
  }
  sheetDB.push(sheetRow);
}

// Selectors for cell props
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-props");
let fontFamily = document.querySelector(".font-family-props");
let bgColor = document.querySelector(".bg-color-prop");
let fontColor = document.querySelector(".font-color-prop");
let alignment = document.querySelectorAll(".alignment");
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

bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);
  console.log(cell);
  // modification in the sheetDB
  cellProp.bold = !cellProp.bold;
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //actual change in props of a cell
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp;
});

// returns the array containing the cell HTML element and corresponding cell prop object from sheetDB
function activeCell(address) {
  let [rid, cid] = getRidCidFromAddress(address);
  //Access cell and storage Object
  let cell = document.querySelector(`.cell[rid='${rid}'][cid='${cid}']`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

// function will return the decoded address from the string
function getRidCidFromAddress(address) {
  let rid = Number(address[1]) - 1;
  let cid = Number(address.charCodeAt(0)) - 65;
  console.log(cid, rid);
  return [rid, cid];
}
