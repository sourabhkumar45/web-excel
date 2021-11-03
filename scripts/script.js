"use strict";

let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-container");
// container name is colCont but it represent a row

let addressRowCont = document.querySelector(".address-row-container");
// container name is rowCont but it represent a col

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

