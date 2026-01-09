const { Router } = require("express");
const CloudService = require("../services/CloudService");
const router = require("./auth");
const auth = require("../middleware/auth.middleware");

router.post("/upload", auth, (req, res) => {
  try {
    CloudService.upload(req, res);
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});
router.post("/upload-mobile", auth, (req, res) => {
  try {
    CloudService.uploadMobile(req, res);
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});
router.post("/files", auth, (req, res) => {
  try {
    CloudService.getFiles(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/delete/:id", auth, (req, res) => {
  try {
    CloudService.deleteFile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/delete-mobile/:id", auth, (req, res) => {
  try {
    CloudService.deleteFileMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/rmdir/:id", auth, (req, res) => {
  try {
    CloudService.removeFolder(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/filetext/:id", auth, (req, res) => {
  try {
    CloudService.fileText(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/hardfiletext/:id", auth, (req, res) => {
  try {
    CloudService.hardFileText(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/excel/:id", auth, (req, res) => {
  try {
    CloudService.getExcel(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/file/:id", (req, res) => {
  try {
    CloudService.fileById(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/publicfile/:id", auth, (req, res) => {
  try {
    CloudService.publicFile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/sendfile/:user/:id/:filename", auth, (req, res) => {
  try {
    CloudService.sendFile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/sendfile-mobile/:user/:id", auth, (req, res) => {
  try {
    CloudService.sendFileMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getsentfile/:id", auth, (req, res) => {
  try {
    CloudService.getSentFile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/filetodownload/:id", auth, (req, res) => {
  try {
    CloudService.getFileToDownload(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/mkdir", auth, (req, res) => {
  try {
    CloudService.makeFolder(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/mkdir-mobile", auth, (req, res) => {
  try {
    CloudService.makeFolderMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/checkfolder", auth, (req, res) => {
  try {
    CloudService.checkFolder(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/filesbyfolder", auth, (req, res) => {
  try {
    CloudService.getFilesByFolderId(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/filesbysearch", auth, (req, res) => {
  try {
    CloudService.getFilesBySearch(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/getpath/:id", auth, (req, res) => {
  try {
    CloudService.getPath(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/getpath-mobile", auth, (req, res) => {
  try {
    CloudService.getPathMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/rootfiles", auth, (req, res) => {
  try {
    CloudService.getRootFile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/download-folder/:id", auth, (req, res) => {
  try {
    CloudService.downloadFolder(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/delete-temp-file/:name", (req, res) => {
  try {
    CloudService.removeTempFile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/sortedfiles", auth, (req, res) => {
  try {
    CloudService.getSortedFiles(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
