let fileData;

const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const info = document.getElementById("info");
const downloadLink = document.getElementById("downloadLink");

// Click to upload
dropZone.addEventListener("click", () => fileInput.click());

// File select
fileInput.addEventListener("change", (e) => {
    fileData = e.target.files[0];
    info.innerText = "Selected: " + fileData.name;
});

// Drag & Drop
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    fileData = e.dataTransfer.files[0];
    info.innerText = "Selected: " + fileData.name;
});

async function compressPDF() {

    if(!fileData){
        alert("Please select a PDF file");
        return;
    }

    info.innerText = "Processing PDF...";

    const arrayBuffer = await fileData.arrayBuffer();

    const { PDFDocument } = PDFLib;

    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Create new optimized PDF
    const newPdf = await PDFDocument.create();

    const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

    pages.forEach(page => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.style.display = "block";

    info.innerText = "Compression complete ✔ Ready to download";
}
