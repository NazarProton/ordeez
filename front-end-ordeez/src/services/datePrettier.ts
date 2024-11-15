export function convertDateTime(inputDateTime: string) {
  const date = new Date(inputDateTime);

  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} — ${day}/${month}/${year}`;
}
export const convertTimestampToDate = (timestamp: number = 0) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export function formatDate(inputDate: string) {
  const date = new Date(inputDate);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours() + 2).padStart(2, '0'); // Adding 2 hours to UTC time
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
}
