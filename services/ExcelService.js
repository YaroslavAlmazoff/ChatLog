const XLSX = require("xlsx");
const fs = require("fs");

class ExcelService {
  toJSON(path) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData);
    return jsonData;
  }
}

module.exports = new ExcelService();
