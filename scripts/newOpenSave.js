let fileBtn = document.querySelector(".page-action");
let container = document.querySelector(".container");

fileBtn.addEventListener("click", (e) => {
  let fileModal = document.createElement("div");
  fileModal.setAttribute("class", "file-modal");
  fileModal.innerHTML = `<div class="file-options-modal">
  <div class="close">
      <div class="material-icons close-icon">arrow_circle_down</div>
      <div>Close</div>
  </div>
  <div class="new">
      <div class="material-icons new-icon">insert_drive_file</div>
      <div>New</div>
  </div>
  <div class="open">
      <div class="material-icons open-icon">folder_open</div>
      <div>Open</div>
  </div>
  <div class="save">
      <div class="material-icons save-icon">save</div>
      <div>Save</div>
  </div>
</div>
<div class="file-recent-modal">
<img src="../favicon.png"></img></div>
<div class="file-transparent"></div>`;
  container.appendChild(fileModal);
  fileModal.animate([{ width: "100vw" }], {
    duration: 450,
  });
  setTimeout(() => {
    fileModal.style.width = "100vw";
  }, 400);
});

function closeModal() {
  let fileModal = document.querySelector(".file-modal");
  fileModal.animate([{ width: "0vw" }], {
    duration: 450,
  });
  setTimeout(() => {
    fileModal.style.width = "0vw";
  }, 400);
}

let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".upload");

downloadBtn.addEventListener("click", () => {
  let data = JSON.stringify([sheetDB, graphComponenthMatrix]);
  let file = new Blob([data], { type: "application/json" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "sheet1.json";
  a.click();
});

//open file

openBtn.addEventListener("click", (e) => {
  let inputELe = document.querySelector("input");
  inputELe.setAttribute("type", "file");
  inputELe.click();

  inputELe.addEventListener("change", (eve) => {
    let fr = new FileReader();
    let fileObj = inputELe.files[0];
    fr.readAsText(fileObj);
    fr.addEventListener("load", () => {
      let res = JSON.parse(fr.result);
      // basic sheet will be created
      addSheetBtn.click();
      // database setting
      // collectedSheetDB and collectedGraphComponentMatrix is created after addSheetbtn is clicked

      sheetDB = res[0];
      graphComponenthMatrix = res[1];
      collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
      collectedGraphComponentMatrix[collectedGraphComponentMatrix.length - 1] =
        graphComponenthMatrix;

      //change the UI with new data
      handleSheetProperties();
    });
  });
});
