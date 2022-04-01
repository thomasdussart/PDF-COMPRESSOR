"use strict";

const express = require("express");
const fs = require("fs");
const fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
const gs = require("ghostscript4js");

const app = express();
// We need cors middleware to bypass CORS security in browsers.
const cors = require("cors");

app.use(express.static("public"));
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let port = 3000;
/**
 * The default path
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  var infile = req.files.input_pdf;
  if (infile == undefined) {
    infile = req.files.uploadedFile;
  }
  var infile_name = __dirname + "/" + infile.name;

  infile.mv(infile_name, function (err) {
    if (err) return res.status(500).send(err);
    console.log(infile_name);
    compressAndMove();
    res.status(200).send();
  });
});

function compressAndMove() {
  try {
    // Take decision based on Ghostscript version
    const version = gs.version();
    console.log(version);
    gs.executeSync(
      "-sDEVICE=pdfwrite -o output.pdf -sDEVICE=pdfwrite -r100 input.pdf"
    );
    fs.rename(
      __dirname + "/output.pdf",
      __dirname + "/public/compressed/output.pdf",
      function (err) {
        if (err) throw err;
        console.log("File Renamed");
      }
    );
  } catch (err) {
    // Handle error
    throw err;
  }
}

app.listen(port, (err) => {
  console.log(`Listening on port: ${port}`);
});
