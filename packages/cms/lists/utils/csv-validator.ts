/**
 * Validate CSV structure against expected headers and required fields
 */
export function validateCsvStructure(
  csvData: string[][],
  listName: string,
  expectedHeaders: Record<string, string[]>,
  requiredFields: Record<string, string[]>
) {
  const errors = []
  const csvHeader = csvData[0]

  // Validate headers
  const expectedHeadersArray = expectedHeaders[listName]
  if (
    csvHeader.length !== expectedHeadersArray.length ||
    !csvHeader.every((header, index) => header === expectedHeadersArray[index])
  ) {
    errors.push(
      `CSV 檔案標題格式不符\n上傳內容標題: ${csvHeader.join(
        ','
      )}\n規格標題應為: ${expectedHeadersArray.join(
        ','
      )}\n請確認標題順序是否正確`
    )
    return errors // Early return for header problems
  }

  // Validate required fields and row structure
  const headerLength = csvHeader.length
  for (let i = 1; i < csvData.length; i++) {
    const row = csvData[i]

    // Skip empty rows (could be trailing newlines)
    if (row.length === 0 || (row.length === 1 && row[0] === '')) {
      continue
    }

    // Check if row length matches header length
    if (row.length !== headerLength) {
      errors.push(`第 ${i + 1} 行: 欄位數量不符`)
      continue
    }

    // Check for empty cells in required fields
    if (requiredFields[listName]) {
      for (let j = 0; j < row.length; j++) {
        const fieldName = csvHeader[j]
        if (requiredFields[listName].includes(fieldName) && row[j] === '') {
          errors.push(`第 ${i + 1} 行: 必填欄位 "${fieldName}" 為空`)
          break
        }
      }
    }
  }

  return errors
}

/**
 * Format validation errors into a readable message
 */
export function formatValidationErrors(errors: string[]) {
  if (errors.length === 0) return ''

  return `CSV 檔案含有錯誤:\n${errors.join('\n')}`
}
