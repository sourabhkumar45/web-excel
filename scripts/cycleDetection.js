// This file contains implementation of cycle dependency identication in the formuala

// stores all the graphComponentMatrix


// storage for graph represenation of cells


// commented because this was applicable for single sheet only
// for (let i = 0; i < rows; i++) {
//   let row = [];
//   for (let j = 0; j < cols; j++) {
//     // more than one child relation
//     row.push([]);
//   }
//   graphComponenthMatrix.push(row);
// }

function isCyclePresent() {
  // dependency --> visited, dfsVisited
  // dfsVisited -> emulates the stack trace
  // visited --> keep track of visited cell
  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false); // default value
      dfsVisitedRow.push(false); // default value
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  // cycle detection
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j]) {
        let cycle = dfs(i, j, visited, dfsVisited);
        if (cycle) return true;
      }
    }
  }
  return false;
}

function dfs(sr, sc, visited, dfsVisited) {
  visited[sr][sc] = true;
  dfsVisited[sr][sc] = true;

  for (let ch = 0; ch < graphComponenthMatrix[sr][sc].length; ch++) {
    let [cRid, cCid] = graphComponenthMatrix[sr][sc][ch];

    if (visited[cRid][cCid] === false) {
      let cycle = dfs(cRid, cCid, visited, dfsVisited);

      if (cycle) return true; // cycle is found return true immediately
    } else if (dfsVisited[cRid][cCid]) {
      return true; // cycle is found return true immediately
    }
  }

  dfsVisited[sr][sc] = false;
  return false;
}
