function getCorrectNumber(dayString) {
  if (dayString.split("")[0] === "0") {
    const day = Number(dayString);
    if (day < 10) {
      return `0${day}`;
    } else {
      return day;
    }
  } else return day;
}

module.exports = { getCorrectNumber };
