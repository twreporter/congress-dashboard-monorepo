/**
 * Universal date formatter with enhanced features.
 * Supports various format tokens and handles both string dates and Date objects.
 *
 * Supported tokens:
 * - YYYY: Full year (e.g., 2020)
 * - YY: Short year (e.g., 20)
 * - MM: Padded month (01-12)
 * - M: Unpadded month (1-12)
 * - DD: Padded day (01-31)
 * - D: Unpadded day (1-31)
 * - HH: Padded hour (00-23)
 * - H: Unpadded hour (0-23)
 * - mm: Padded minute (00-59)
 * - m: Unpadded minute (0-59)
 * - ss: Padded second (00-59)
 * - s: Unpadded second (0-59)
 *
 * @param date - The date to format, can be a string, Date object, null, or undefined.
 * @param format - The format string using the tokens described above.
 * @returns The formatted date string or an empty string if the input is invalid.
 */
export const formatDate = (
  date: string | Date | null | undefined,
  format: string = 'YYYY/MM/DD'
): string => {
  if (date == null) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return ''
  }
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const seconds = dateObj.getSeconds()

  const tokenMap = {
    YYYY: `${year}`,
    YY: `${year}`.slice(-2),
    MM: pad(month),
    M: `${month}`,
    DD: pad(day),
    D: `${day}`,
    HH: pad(hours),
    H: `${hours}`,
    mm: pad(minutes),
    m: `${minutes}`,
    ss: pad(seconds),
    s: `${seconds}`,
  }

  return format.replace(
    /YYYY|YY|MM|M|DD|D|HH|H|mm|m|ss|s/g,
    (match) => tokenMap[match]
  )
}

/**
 * Formats a date string to YYYY/MM/DD format
 */
export const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`
  const day = `${date.getDate()}`
  return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`
}
