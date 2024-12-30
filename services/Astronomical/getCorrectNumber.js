function getCorrectNumber(dayString) {
  const day = Number(dayString);
  if (day < 10) {
    return `0${day}`;
  } else {
    return day;
  }
}

module.exports = { getCorrectNumber };
