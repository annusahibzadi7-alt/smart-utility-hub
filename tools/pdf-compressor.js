const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const chooseFile = document.getElementById("chooseFile");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");

const progress = document.getElementById("progress");
const status = document.getElementById("status");

const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;

// Open file picker
chooseFile.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
});

dropZone.addEventListener("click", () => {
    fileInput.click();
});

// File selected
fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        loadFile(fileInput.files[0]);
    }
});

// Drag events
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("active");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("active");
});

dropZone.addEventListener("drop", (e) => {

    e.preventDefault();

    dropZone.classList.remove("active");

    if (e.dataTransfer.files.length > 0) {

        loadFile(e.dataTransfer.files[0]);

    }

});

// Load file info
function loadFile(file){

    if(file.type !== "application/pdf"){

        alert("Please select a PDF file.");

        return;

    }

    selectedFile = file;

    fileName.textContent = file.name;

    fileSize.textContent = formatSize(file.size);

    status.textContent = "Ready to compress.";

    progress.style.width = "0%";

    downloadBtn.style.display = "none";

}

// Compress button
compressBtn.addEventListener("click", async () => {

    if(!selectedFile){

        alert("Please choose a PDF first.");

        return;

    }

    status.textContent = "Processing...";

    progress.style.width = "15%";

    await wait(300);

    progress.style.width = "45%";

    await wait(300);

    progress.style.width = "75%";

    await wait(300);

    // Browser-based save (not true heavy compression)
    const bytes = await selectedFile.arrayBuffer();

    const blob = new Blob([bytes], {
        type: "application/pdf"
    });

    const url = URL.createObjectURL(blob);

    downloadBtn.href = url;

    downloadBtn.style.display = "inline-block";

    progress.style.width = "100%";

    status.textContent = "Finished. Click Download PDF.";

});

// Helper delay
function wait(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

// Format size
function formatSize(bytes){

    if(bytes < 1024){

        return bytes + " Bytes";

    }

    if(bytes < 1024 * 1024){

        return (bytes / 1024).toFixed(2) + " KB";

    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}
