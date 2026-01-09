const archiver = require("archiver");
const fs = require("fs");
const { exec } = require("child_process");

class ZipService {
  async archiving(folderName, folderPath, archivePath) {
    console.log("name", folderName);
    console.log("path", folderPath);
    console.log("archive", archivePath);
    const output = fs.createWriteStream(archivePath);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    output.on("close", function () {
      console.log(archive.pointer() + " total bytes");
      console.log("Архив успешно создан");
    });

    archive.on("error", function (err) {
      throw err;
    });

    archive.directory(folderPath, folderName);
    await archive.finalize();
  }
  async terminalArchiving(folderPath, archivePath) {
    const command = `zip -rj ${archivePath} ${folderPath}`;
    exec(command, (error, _, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`zip stderr: ${stderr}`);
        return;
      }
      console.log("Folder zipped successfully.");
    });
  }
}

module.exports = new ZipService();
