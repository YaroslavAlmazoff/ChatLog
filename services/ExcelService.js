const XLSX = require("xlsx");
const fs = require("fs");

class ExcelService {
  convertNumbersToStrings(obj) {
    if (typeof obj === "object") {
      for (let key in obj) {
        if (typeof obj[key] === "number") {
          obj[key] = obj[key].toString();
        } else if (typeof obj[key] === "object") {
          this.convertNumbersToStrings(obj[key]);
        }
      }
    } else {
      obj = JSON.parse(obj);
      for (let key in obj) {
        if (typeof obj[key] === "number") {
          obj[key] = obj[key].toString();
        } else if (typeof obj[key] === "object") {
          this.convertNumbersToStrings(obj[key]);
        }
      }
    }
  }
  toJSON(path) {
    const workbook = XLSX.readFile(path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    this.convertNumbersToStrings(jsonData);
    console.log(jsonData);
    return jsonData;
  }
}

module.exports = new ExcelService();
