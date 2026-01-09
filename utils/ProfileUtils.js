const sortByDate = (posts) =>
  posts.sort((a, b) => {
    const [dayA, monthA, yearA, hoursA, minutesA] = a.date
      .match(/\d+/g)
      .map(Number);
    const [dayB, monthB, yearB, hoursB, minutesB] = b.date
      .match(/\d+/g)
      .map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA, hoursA, minutesA);
    const dateB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB);

    return dateB - dateA;
  });

module.exports = { sortByDate };
