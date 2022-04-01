async function submitForm() {
  var formData = new FormData();
  var infile = document.getElementById("input_pdf").files[0];
  var fileNameFull = document.getElementById("input_pdf").value;
  var fileName = fileNameFull.replace(/^.*[\\\/]/, "");
  var dpi = 100;

  if (infile == undefined) {
    return alert("Veuillez sélectionner un PDF à compresser.");
  }

  document.getElementById("submit_pdf").disabled = true;
  document.getElementById("input_pdf").disabled = true;

  document.getElementById("loader").innerHTML =
    "<span class='text-primary h1 mt-5'>Compressing.....</span>";
  formData.append("dpi", dpi);
  formData.append("uploadedFile", infile, "input.pdf");
  axios
    .post("/", formData)
    .then((res) => {
      console.log(res);
      console.log(res.data);
      document.getElementById("loader").innerHTML =
        "<button class='btn btn-success mt-2'><a class='text-white' download='" +
        fileName +
        "' href='/compressed/output.pdf'>Télécharger le fichier</a ></button>";
    })
    .catch((error) => {
      console.log(error.response);
      document.getElementById("loader").innerHTML =
        "<span style='color: red;'>No file is uploaded.</span>";
    });
}
