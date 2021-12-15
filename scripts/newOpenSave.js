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
