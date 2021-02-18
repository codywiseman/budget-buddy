function parseMonth(date) {
  const months = ["January", "February", "March", "April", "May",
  "June", "July", "August", "September", "October", "November", "December"];
  const dateSplit = date.split('-');
  const monthIndex  = parseInt(dateSplit[1]);
  const month = months[monthIndex - 1];
  return month;
}

function parseYear(date) {
  const dateSplit = date.split('-');
  const year = parseInt(dateSplit[0]);
  return year;
}

function currentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString();
  if(month.length === 1) {
    const current = `${year}-0${month}`;
    return current;
  } else {
    const current = `${year}-${month}`;
    return current;
  }
}

export {parseMonth, parseYear, currentDate}
