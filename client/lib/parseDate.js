function parseMonth(date) {
  const months = ["January", "February", "March", "April", "May",
  "June", "July", "August", "September", "October", "November", "December"]
  const dateSplit = date.split('-');
  const monthIndex  = parseInt(dateSplit[1])
  const month = months[monthIndex - 1]
  return month;
}

function parseYear(date) {
  const dateSplit = date.split('-');
  const year = parseInt(dateSplit[0]);
  return year;
}

export {parseMonth, parseYear}
