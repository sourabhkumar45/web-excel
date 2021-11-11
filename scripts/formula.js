// this file contains implementation of formula feature
// blur is triggered before click event

// how formula is evaluted
// -> type of expression
// ---> Normal Expression e.g.(10+20)
// ---> dependency expression e.g.(A1 + 20), (A1 + A2 + 10), (A1 + A2)

// ********************FORMULA HANDLING CASE***********************

// --> CASE 1: EVALUATION OF FORMULA WITHOUT CHILD DEPENDENCY
// ---> Normal expression can be easily evaluated by decoding the formula and using eval function
// ---> suppose formula on B1 = (A1+A2)
// ---> so we will extract the value of A1 suppose 10 and A2 suppose 10
// ---> and will passs the expression "10+10" to eval function and set the value of B1 to value returned by eval

// -> CASE 2: EVALUATION OF FORMULA WITH CHILD DEPENDENCY
// -> evaluation of child dependency when parent value is affected by a formula
// ---> we will add a propetry to cell which is children array which contains all the dependent child cell address
// ---> and will add children dependency in that array
// ---> e.g. suppose formula on B1  = (A1 + A2)
// ---> so the children array of A1 and A2 will contain B1 as a child dependency and alteration
//      in value of A1 or A2 will affect the value of B1

// --> CASE 3: FORMULAS CAN BE EDITED TO
// ---> suppose this formula is applied to B1  = (A1+A2)
// ---> the children of A1 and A2 will contain B1 as a child dependency
// ---> but now user changed the formula on B1 = (A1 + 10)
// ---> then we need to remove B1 from dependency array of A2
// ---> now, suppose C1 is also depended on B1 and formula applied is = (B1*10)
// ---> now , since B1 value is changed we need to change the value of C1 also this is done recursively
// ---> in updateChildCell function which will ensure the child of C1 are also updated

// --> CASE 4: USER CHANGES THE VALUE AT THE CELL
// ---> changing value at the cell means remove the current formula applied, which also removes parent-child relation,
//      to the cell and update the DB
// ---> suppose formula on B1 = (A1+A2)
// ---> and user updates the value at A1
// ---> so we need to update B1 and its child dependency as B1 is child dependency of A1

// **************************CYCLE DETECTION**************************
// --> there can be cycle among cells for e.g. suppose the following formulae
// ---> B1=(A1+10); C1=(B1+10); A1=(C1+10);
// ---> now, suppose we we change the formula at B1=(A1*10), this will cause C1 to change and change in C1 will cause A1 to change
// ---> and change in A1 will change B1, which will again change C1 and then A1, this will continue infinitely and will cause stack overflow
// ---> as the relationship among cell is of Directed graph, we must ensure there is no cycle in it to avoid this kind of senarios.
// ---> the Data-structure used to implement formulas is DAG(Directed Acyclic graphs)
//There are one or more circular references where a formula refers to its own cell either directly or indirectly. This might cause them to calculate incorrectly

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid='${i}'][cid='${j}']`);
    cell.addEventListener("blur", () => {
      let address = addressBar.value;
      let [cell, cellProp] = getCellAndProps(address);
      let enteredData = cell.innerText;

      if (enteredData === cellProp.value) return;

      // if value of cell is changed by user
      cellProp.value = enteredData;

      // remove the parent child relationship as formula is removed now
      removeChildFromParent(cellProp.formula);

      // remove formula from the cell
      cellProp.formula = "";

      // evaluate child formulas with new value of parent cell
      updateChildCells(address);
    });
  }
}

formulaBar.addEventListener("keydown", (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    let formula = inputFormula;
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndProps(address);

    // there is change in formula we need to remove previous parent child relationship and add new parent child relationship
    if (inputFormula !== cellProp.formula) {
      // remove previous formula dependency
      removeChildFromParent(cellProp.formula);

      //add child dependency to graph representation
      addChildToGraphComponent(inputFormula, address);

      // evaluate the value
      let isCyclic = isCyclePresent(graphComponenthMatrix);
      if (isCyclic) {
        // remove the dependecy pushed in line no. 88
        removeChildFromGraphComponent(inputFormula);

        //clear the formula bar
        formulaBar.value = "";

        //alert
        alert(
          "There are one or more circular references where a formula refers to its own cell either directly or indirectly. This might cause them to calculate incorrectly."
        );
        return;
      }
      let evaluatedValue = evaluateFormula(formula);

      // set the UI,database and parent child relation ship only when evaluatedValue is true value (valid answer)
      if (evaluatedValue) {
        // update UI and DB
        setCellUIandCellProps(evaluatedValue, inputFormula, address);

        // development of dependency array
        addChildToParent(inputFormula);

        // update child when parents update
        updateChildCells(address);
      }
    }
  }
});

// function to add child dependency to the parent cell
function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormala = formula.replaceAll(" ", "");
  for (let i = 0; i < encodedFormala.length; i++) {
    let asciiValue = encodedFormala.charCodeAt(i);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let parentAddress = encodedFormala[i] + encodedFormala[i + 1];
      let [_, parentCellProp] = getCellAndProps(parentAddress);
      parentCellProp.children.push(childAddress);
      // increament i because we considered A (character) and next element
      i++;
    }
  }
}

// function to remove parent child relationship when formula is changed
function removeChildFromParent(newFormula) {
  let childAddress = addressBar.value;
  let encodedFormala = newFormula.replaceAll(" ", "");
  for (let i = 0; i < encodedFormala.length; i++) {
    let asciiValue = encodedFormala.charCodeAt(i);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let parentAddress = encodedFormala[i] + encodedFormala[i + 1];
      let [_, parentCellProp] = getCellAndProps(parentAddress);
      let childIdx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(childIdx, 1);
      // increament i because we considered A (character) and next element
      i++;
    }
  }
}

function updateChildCells(parentAddress) {
  //parentAddress -> address of parent whose child dependency need to managed
  let [_, parentCellProp] = getCellAndProps(parentAddress);
  let { children } = parentCellProp;
  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [_, childCellProp] = getCellAndProps(childAddress);
    let childFormula = childCellProp.formula; // child's formula
    let newEvalutedValue = evaluateFormula(childFormula);

    setCellUIandCellProps(newEvalutedValue, childFormula, childAddress);
    // above code updates one level of children
    // recursive call will ensure all level of children are updated
    updateChildCells(childAddress);
  }
}

// evaluate the value of the formula
function evaluateFormula(formula) {
  // the formula is encoded like (A1 + A2)
  // step 1 : trim the formula to no space containing formula (A1+A2)
  // step 2 : iterate the formula and extract all cell value if cell address is given
  //          extract the ascii value of encodedFormula[i] if it is in character range,
  //          take the character and next character and from address to get cell and cellProps
  //          add the value of cellProp.value to decodedFormula handling all the edge cases like
  //          it is should be true value and not a character
  // step 3: leave all the character which are not character as it is and add them to decodedFormula
  // step 4: use eval(decodedFormula) to get the value of expression handling the error cases

  let decodedFormula = "";
  let encodedFormala = formula.replaceAll(" ", "");

  for (let i = 0; i < encodedFormala.length; i++) {
    let asciiValue = encodedFormala.charCodeAt(i);

    if (asciiValue >= 65 && asciiValue <= 90) {
      let address = encodedFormala[i] + encodedFormala[i + 1];
      let cell, cellProp;

      // error handling for invalid address like A!
      try {
        [cell, cellProp] = getCellAndProps(address);
      } catch (err) {
        alert(`${address} is not a valid address`);
        return false;
      }
      [cell, cellProp] = getCellAndProps(address);
      // does cell contain any value or cell is empty
      if (!cellProp.value) {
        alert(
          `Value missing at ${String.fromCharCode(
            cell.getAttribute("cid") + 65
          )}${parseInt(cell.getAttribute("rid")) + 1}`
        );
        return false;
      }
      decodedFormula += cellProp.value;
      // increament i because we considered A (character) and next element
      i++;
    } else {
      decodedFormula += encodedFormala[i];
    }
  }
  // error handling for invalid evaluated value
  // e.g user is not adding interger values
  try {
    return eval(decodedFormula);
  } catch (err) {
    alert(`There was some error with the formula "${formula}"`);
  }
}

// to update UI and cell props in DB of given address
function setCellUIandCellProps(evaluatedValue, formula, address) {
  let [cell, cellProps] = getCellAndProps(address);
  // UI update
  cell.innerText = evaluatedValue;
  // DB update
  cellProps.value = String(evaluatedValue);
  cellProps.formula = formula;
}

// function to add cell co-ordinates to graph 2d matrix
function removeChildFromGraphComponent(formula) {
  let encodedFormala = formula.replaceAll(" ", "");

  for (let i = 0; i < encodedFormala.length; i++) {
    let asciiValue = encodedFormala.charCodeAt(i);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let parentAddress = encodedFormala[i] + encodedFormala[i + 1];
      let [pRid, pCid] = getRidCidFromAddress(parentAddress); // parent col and row id
      // rid -> i cid -> j

      // cycle has been detected remove the wrongly pushed children which was pushed previously
      graphComponenthMatrix[pRid][pCid].pop();
    }
  }
}

// function to add cell co-ordinates to graph 2d matrix

function addChildToGraphComponent(formula, childAddress) {
  let [cRid, cCid] = getRidCidFromAddress(childAddress); // child's row and col id
  let encodedFormala = formula.replaceAll(" ", "");

  for (let i = 0; i < encodedFormala.length; i++) {
    let asciiValue = encodedFormala.charCodeAt(i);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let parentAddress = encodedFormala[i] + encodedFormala[i + 1];
      let [pRid, pCid] = getRidCidFromAddress(parentAddress); // parent col and row id
      // rid -> i cid -> j
      graphComponenthMatrix[pRid][pCid].push([cRid, cCid]); // making directed edge frome parent to child
    }
  }
}
