window.addEventListener("beforeunload", function () {
    const overlay = document.getElementById("processingOverlay");
    if (overlay) {
      overlay.style.display = "flex";
    }
  });
  
  window.addEventListener("load", function () {
    const overlay = document.getElementById("processingOverlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  });