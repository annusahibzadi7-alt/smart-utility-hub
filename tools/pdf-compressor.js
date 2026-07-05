const { PDFDocument } = PDFLib;

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

chooseFile.onclick = (e) => {
    e.stopPropagation();
    fileInput.click();
};

dropZone.onclick = () => fileInput.click();

fileInput.onchange = () => {
    if (fileInput.files.length) {
        loadFile(fileInput.files[0]);
    }
};

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

    if (e.dataTransfer.files.length) {

        loadFile(e.dataTransfer.files[0]);

    }

});

function loadFile(file){

    if(file.type !== "application/pdf"){

        alert("Please choose a PDF.");

        return;

    }

    selectedFile = file;

    fileName.textContent = file.name;

    fileSize.textContent = formatSize(file.size);

    progress.style.width = "0%";

    status.textContent = "Ready.";

    downloadBtn.style.display = "none";

}

compressBtn.onclick = async ()=>{

    if(!selectedFile){

        alert("Select a PDF first.");

        return;

    }

    try{

        progress.style.width="15%";
        status.textContent="Reading PDF...";

        const bytes=await selectedFile.arrayBuffer();

        progress.style.width="40%";

        const pdf=await PDFDocument.load(bytes);

        progress.style.width="70%";
        status.textContent="Optimizing PDF...";

        const newBytes=await pdf.save({

            useObjectStreams:true,

            addDefaultPage:false,

            updateFieldAppearances:false

        });

        progress.style.width="90%";

        const blob=new Blob([newBytes],{

            type:"application/pdf"

        });

        if(downloadBtn.dataset.url){

            URL.revokeObjectURL(downloadBtn.dataset.url);

        }

        const url=URL.createObjectURL(blob);

        downloadBtn.dataset.url=url;

        downloadBtn.href=url;

        downloadBtn.download=

            selectedFile.name.replace(".pdf","") +

            "-compressed.pdf";

        downloadBtn.style.display="inline-block";

        progress.style.width="100%";

        status.textContent=

            `Finished. Original: ${formatSize(selectedFile.size)} | Output: ${formatSize(blob.size)}`;

    }

    catch(err){

        console.error(err);

        progress.style.width="0%";

        status.textContent="Unable to process PDF.";

    }

};

function formatSize(bytes){

    if(bytes<1024)

        return bytes+" Bytes";

    if(bytes<1024*1024)

        return (bytes/1024).toFixed(2)+" KB";

    return (bytes/1024/1024).toFixed(2)+" MB";

}
