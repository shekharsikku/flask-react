const formatTimestampToIST = (timestamp) => {
  // Parse the given timestamp into a Date object
  const date = new Date(timestamp);

  // Options for formatting the date in IST
  const dateOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour12: false,
  };

  // Options for formatting the time in IST
  const timeOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  // Create formatters for date and time
  const dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);
  const timeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);

  // Format the date and time
  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter.format(date);

  return {
    date: formattedDate,
    time: formattedTime,
  };
};

export { formatTimestampToIST };

// Given timestamp
// const timestamp = "Thu, 20 Jun 2024 08:10:13 GMT";
// const formattedDateTime = formatTimestampToIST(timestamp);
// console.log(formattedDateTime); // Output: { date: 'Thu, Jun 20, 2024', time: '13:40:13' }
