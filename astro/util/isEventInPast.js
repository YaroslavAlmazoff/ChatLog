function isEventInPast(eventDate, eventTime) {
  const [day, month, year] = eventDate.split(".");
  const [hour, minute] = eventTime.split(":");

  const eventDateTime = moment({
    year: parseInt(year),
    month: parseInt(month) - 1,
    day: parseInt(day),
    hour: parseInt(hour),
    minute: parseInt(minute),
  });

  return eventDateTime.isBefore(moment());
}

module.exports = { isEventInPast };
