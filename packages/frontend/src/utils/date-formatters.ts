/**
 * Formats a date string to YYYY/MM format
 */
export const formatDateToYearMonth = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}/${month}`
}
