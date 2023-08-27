/**
 * Date in ISO format to dd-mm-yyyy format
 * @param date - Date in ISO format
 * @returns Date in dd-mm-yyyy format
 */
export const formatDateDDMMYY = (date: string): string => {
  const d = new Date(date);
  let day = d.getDate();
  // If day is less than 10, add a 0 in front of it
  if (day < 10) day = +`0${day}`;

  let month = d.getMonth() + 1;
  // If month is less than 10, add a 0 in front of it
  if (month < 10) month = +`0${month}`;

  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
