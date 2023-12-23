export function getPreviewByFileName(
  fileName,
  asUrl = false,
  isOnlyBase64 = false,
  hasData = false
) {
  var preview;

  if (isOnlyBase64 && hasData) {
    preview = require("../assets/img/raw.svg");
  } else {
    if (fileName && fileName != "") {
      fileName = fileName.toLowerCase();
      var exInd = fileName.lastIndexOf(".");
      var fileExtension = fileName.substring(exInd + 1);

      if (fileExtension == "xls" || fileExtension == "xlsx")
        preview = require("../assets/img/xls.svg");
      else if (fileExtension == "pdf" || fileExtension == "pdfx")
        preview = require("../assets/img/pdf.svg");
      else if (fileExtension == "docx" || fileExtension == "docxx")
        preview = require("../assets/img/doc.svg");
      else if (fileExtension == "ppt" || fileExtension == "pptx")
        preview = require("../assets/img/ppt.svg");
      else if (fileExtension == "tiff" || fileExtension == "tif")
        preview = require("../assets/img/tif.svg");
      else if (fileExtension == "zip" || fileExtension == "rar")
        preview = require("../assets/img/zip.svg");

      if (preview == null)
        try {
          preview = require(`../assets/img/${fileExtension}.svg`);
        } catch {}
    }
  }

  if (preview == null) preview = require("../assets/img/no-image.png");

  if (asUrl) return `url(${preview})`;
  else return preview;
}
