function getMonthNumber(month) {
  if (month === "январь") {
    return "01";
  } else if (month === "февраль") {
    return "02";
  } else if (month === "март") {
    return "03";
  } else if (month === "апрель") {
    return "04";
  } else if (month === "май") {
    return "05";
  } else if (month === "июнь") {
    return "06";
  } else if (month === "июль") {
    return "07";
  } else if (month === "август") {
    return "08";
  } else if (month === "сентябрь") {
    return "09";
  } else if (month === "октябрь") {
    return "10";
  } else if (month === "ноябрь") {
    return "11";
  } else if (month === "декабрь") {
    return "12";
  } else {
    return "01";
  }
}

module.exports = { getMonthNumber };
