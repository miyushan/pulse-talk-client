export const formatDateTime = (dateStr: Date) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? "AM" : "PM";

  const dateString = `${year}-${padZero(month)}-${padZero(day)}`;
  const timeString = `${hours % 12 || 12}:${padZero(minutes)} ${ampm}`;

  return [dateString, timeString];
};

export const padZero = (num: number) => {
  return (num < 10 ? "0" : "") + num;
};
