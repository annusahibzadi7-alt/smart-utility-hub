async function uploadPDF() {

    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if(fileInput.files.length === 0){
        status.innerText = "Please select a PDF file";
        return;
    }

    let file = fileInput.files[0];

    status.innerText = "Uploading & compressing...";

    const API_KEY = "YOUR_API_KEY_HERE";

    try {

        let formData = new FormData();
        formData.append("file", file);

        let response = await fetch("https://api.cloudconvert.com/v2/import/upload", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            },
            body: formData
        });

        let data = await response.json();

        status.innerText = "Done (check console)";
        console.log(data);

    } catch (error) {
        status.innerText = "Error occurred";
        console.log(error);
    }
}
