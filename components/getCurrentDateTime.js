export default function getCurrentDateTime() {
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = currentDateTime.getMonth() + 1;
  const date = currentDateTime.getDate();
  let hours = currentDateTime.getHours();
  let minutes = currentDateTime.getMinutes();
  let seconds = currentDateTime.getSeconds();

  // Add AM or PM to hours
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  // Pad single digits with a leading zero
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const formattedDateTime = `${year}-${month < 10 ? "0" : ""}${month}-${
    date < 10 ? "0" : ""
  }${date} ${hours}:${minutes}:${seconds} ${ampm}`;

  return formattedDateTime;
}
