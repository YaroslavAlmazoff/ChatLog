function compareStringToEventType(str) {
  if (str.includes("комет")) return "COMETS";
  else if (str.includes("затмение")) return "ECLIPSES";
  else if (str.includes("юпитер")) return "JUPITER";
  else if (str.includes("метеор")) return "METEOR_SHOWERS";
  else if (str.includes("противостояни") || str.includes("элонгац"))
    return "OPPOSITIONS";
  else if (
    str.includes("покрытие") ||
    str.includes("соединение") ||
    str.includes("сближение")
  )
    return "CONJUNCTIONS";
  else return "OTHER";
}

module.exports = { compareStringToEventType };
