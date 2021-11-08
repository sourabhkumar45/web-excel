// this file contains implementation of formula feature
// blur is triggered before click event
// how formula evalute
// -> type of expression
// ---> Normal Expression e.g.(10+20)
// ---> dependency expression e.g.(A1 + 20), (A1 + A2 + 10), (A1 + A2)
//
//
let formulaBar = document.querySelector(".formula-bar");

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid='${i}'][cid='${j}']`);
    cell.addEventListener("blur", () => {
      let address = addressBar.value;
      let [cell, cellProp] = getCellAndProps(address);
      let enteredData = cell.innerText;
      cellProp.value = enteredData;
    });
  }
}

formulaBar.addEventListener("keydown", (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    let formula = inputFormula;
    let evaluatedValue = evaluateFormula(formula);
    // set the UI and database only when evaluatedValue is true value (valid answer)
    if (evaluatedValue) setCellUIandCellProps(evaluatedValue, inputFormula);
  }
});

// evaluate the value of the formula
function evaluateFormula(formula) {
  // the formula is encoded like (A1 + A2)
  // step 1 : trim the formula to no space containing formula (A1+A2)
  // step 2 : iterate the formula and extract all cell value if cell address is given
  //          extract the ascii value of encodedFormula[i] if it is in character range,
  //          take the character and next character and from a address to get cell and cellProps
  //          add the value of cellProp.value to decodedFormula handling all the edge cases like
  //          it is should be true value and not a character
  // step 3: leave all the character which are not character as it is and add them to decodedFormula
  // step 4: use eval(decodedFormula) to get the value of expression handling the error cases

  let decodedFormula = "";
  let encodedFormala = formula.replaceAll(" ", "");
  console.log(encodedFormala[0]);
  for (let i = 0; i < encodedFormala.length; i++) {
    let asciiValue = encodedFormala.charCodeAt(i);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndProps(
        encodedFormala[i] + encodedFormala[i + 1]
      );
      if (!cellProp.value) {
        alert(
          `Value missing at ${String.fromCharCode(
            cell.getAttribute("cid") + 65
          )}${parseInt(cell.getAttribute("rid")) + 1}`
        );
        return;
      }
      decodedFormula += cellProp.value;
      i++;
    } else {
      decodedFormula += encodedFormala[i];
    }
  }
  console.log(decodedFormula);
  try {
    return eval(decodedFormula);
  } catch (err) {
    alert(`There was some error with the formula "${formula}"`);
  }
}

// to update UI and cell props in DB
function setCellUIandCellProps(evaluatedValue, formula) {
  let address = addressBar.value;
  let [cell, cellProps] = getCellAndProps(address);
  // UI update
  cell.innerText = evaluatedValue;
  // DB update
  cellProps.value = evaluatedValue;
  cellProps.formula = formula;
}
