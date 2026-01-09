const useDate = () => {
  //Кастомный хук для получения текущей даты
  const getCurrentDate = () => {
    const date = new Date();
    let [month, day, year] = [
      date.getMonth() + 1,
      date.getDate(),
      date.getFullYear(),
    ];
    let [hour, minutes] = [date.getHours(), date.getMinutes()];
    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    if (hour < 10) {
      hour = `0${hour}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    const now = `${day}.${month}.${year} ${hour}:${minutes}`;
    return now;
  };
  const normalizeBirthDate = (date = "some-thing") => {
    const dateArr = date.split("-");
    const year = dateArr[0];
    const month = dateArr[1];
    const day = dateArr[2];
    const final = day + "." + month + "." + year;
    return final;
  };
  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  const formatAge = (age) => {
    if (age === "") return "";
    if (age % 10 === 1 && age % 100 !== 11) {
      return age + " год";
    } else if (
      (age % 10 === 2 || age % 10 === 3 || age % 10 === 4) &&
      (age % 100 < 10 || age % 100 >= 20)
    ) {
      return age + " года";
    } else {
      return age + " лет";
    }
  };
  const catchNaN = (age) => {
    if (isNaN(age)) return "";
    else return age;
  };
  return {
    getCurrentDate,
    normalizeBirthDate,
    calculateAge,
    formatAge,
    catchNaN,
  };
};

export default useDate;
