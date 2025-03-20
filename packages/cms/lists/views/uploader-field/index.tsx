import React, { useState, useRef, useEffect } from 'react'
import Papa from 'papaparse'
import type {
  FieldController,
  FieldControllerConfig,
  FieldProps,
  CardValueComponent,
  CellComponent,
} from '@keystone-6/core/types'
import {
  FieldLabel,
  FieldContainer,
  FieldDescription,
  Select,
} from '@keystone-ui/fields'
import { Button } from '@keystone-ui/button'
import { CellContainer } from '@keystone-6/core/admin-ui/components'
import {
  FieldWrapper,
  SelectorWrapper,
  FileInputWrapper,
  HiddenInput,
  ErrorText,
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  RequiredIndicator,
  FileName,
} from './style'

export const Cell: CellComponent = ({ item, field }) => {
  const { listOptions } = field
  const { uploadData } = item
  const { listName, csvData } = uploadData
  const listOption = listOptions.find((option) => option.value === listName)
  return (
    <CellContainer>{`${listOption.label}, 共 ${
      csvData.length - 1 // Exclude header row
    } 筆`}</CellContainer>
  )
}
Cell.supportsLinkTo = true

export const CardValue: CardValueComponent = ({ item, field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {item[field.path]}
    </FieldContainer>
  )
}

type Option = {
  label: string
  value: string
}

type UploaderFieldValue = {
  listName: string | null
  csvData: string[][] | null
}

type UploaderControllerMeta = {
  listOptions: Option[]
  expectedHeaders: Record<string, string[]>
  requiredFields: Record<string, string[]>
  isRequired: boolean
}

type UploaderFieldController = {
  listOptions: Option[]
  expectedHeaders: Record<string, string[]>
  requiredFields: Record<string, string[]>
  isRequired: boolean
} & FieldController<UploaderFieldValue | null, string>

export function Field({
  field,
  value,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) {
  const [listName, setListName] = useState<string | null>(
    value?.listName || null
  )
  const [csvData, setCsvData] = useState<string[][]>([])
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value?.csvData) {
      try {
        setCsvData(value.csvData)
      } catch (err) {
        console.error('Failed to process stored CSV data', err)
      }
    }
    if (value?.listName) {
      setListName(value.listName)
    }
  }, [value])

  const requiredFields =
    !listName || !field.requiredFields[listName]
      ? []
      : field.requiredFields[listName]

  const isFieldRequired = (fieldName: string) => {
    return requiredFields.includes(fieldName)
  }

  const getDescription = () => {
    if (listName && field.expectedHeaders[listName]) {
      const headerText = field.expectedHeaders[listName].join(', ')
      const requiredText =
        requiredFields.length > 0
          ? `必填欄位: ${requiredFields.join(', ')}`
          : ''
      return `標題順序為 ${headerText}\n${requiredText}`
    }
    return field.description
  }

  const handleListChange = (newValue: Option | null) => {
    const newListName = newValue?.value || null
    setListName(newListName)
    setCsvData([])
    setFileName('')
    if (onChange) {
      onChange({
        listName: newListName,
        csvData: null, // Reset CSV data when list changes
      })
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file')
      setFileName('')
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const result = Papa.parse(text, {
          skipEmptyLines: true,
          transform: (value) => value.replace(/^["']|["']$/g, '').trim(),
        })
        setCsvData(result.data)
        setError('')
        if (onChange) {
          onChange({
            listName,
            csvData: result.data,
          })
        }
      } catch (err) {
        console.error('CSV parsing error:', err)
        setError('Failed to parse CSV file')
        setCsvData([])
      }
    }
    reader.onerror = () => {
      setError('Failed to read file')
      setCsvData([])
      setFileName('')
    }
    reader.readAsText(file)
  }

  const validateCsvHeader = () => {
    if (!listName || !csvData.length || !field.expectedHeaders[listName])
      return true
    const csvHeader = csvData[0]
    return (
      csvHeader.length === field.expectedHeaders[listName].length &&
      csvHeader.every(
        (header, index) => header === field.expectedHeaders[listName][index]
      )
    )
  }

  const isHeaderValid = validateCsvHeader()

  const selectedOption =
    field.listOptions.find((option) => option.value === listName) || null

  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      <FieldWrapper>
        <SelectorWrapper>
          <FieldLabel htmlFor={`${field.path}-listName`}>匯入項目</FieldLabel>
          <Select
            id={`${field.path}-listName`}
            options={field.listOptions}
            isDisabled={onChange === undefined}
            onChange={handleListChange}
            value={selectedOption}
            autoFocus={autoFocus}
            portalMenu
            isClearable={!field.isRequired}
          />
        </SelectorWrapper>
        <FileInputWrapper>
          <FieldLabel htmlFor={`${field.path}-csvData`}>CSV</FieldLabel>
          <FieldDescription id={`${field.path}-description`}>
            {getDescription()}
          </FieldDescription>
          {onChange ? (
            <>
              <HiddenInput
                ref={fileInputRef}
                id={`${field.path}-csvData`}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              <Button
                size="small"
                onClick={handleButtonClick}
                tone="active"
                weight="light"
                isDisabled={!listName}
              >
                Upload CSV File
              </Button>
              {fileName && <FileName>Selected file: {fileName}</FileName>}
              {error && <ErrorText>{error}</ErrorText>}
              {!isHeaderValid && csvData.length > 0 && (
                <ErrorText>
                  CSV 檔案標題格式不符
                  <br />
                  上傳內容標題: {csvData[0].join(',')}
                  <br />
                  規格標題應為:{' '}
                  {listName && field.expectedHeaders[listName].join(',')}
                  <br />
                  請確認標題順序是否正確
                </ErrorText>
              )}
            </>
          ) : null}
          {csvData.length > 0 && (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    {csvData[0].map((header, i) => (
                      <Th key={i}>
                        {isFieldRequired(header) ? (
                          <>
                            {header}
                            <RequiredIndicator>*</RequiredIndicator>
                          </>
                        ) : (
                          <div>{header}</div>
                        )}
                      </Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((row, i) => {
                    // Only check required fields for empty values
                    const hasRequiredEmpty = csvData[0].some(
                      (header, idx) =>
                        isFieldRequired(header) && row[idx] === ''
                    )
                    // Check if row length matches header
                    const isLengthValid = row.length === csvData[0].length
                    const isValidRow =
                      isHeaderValid && isLengthValid && !hasRequiredEmpty
                    return (
                      <Tr key={i} $status={isValidRow ? 'success' : 'error'}>
                        {row.map((cell, j) => (
                          <Td key={j}>{cell}</Td>
                        ))}
                      </Tr>
                    )
                  })}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </FileInputWrapper>
      </FieldWrapper>
    </FieldContainer>
  )
}

export const controller = (
  config: FieldControllerConfig<UploaderControllerMeta>
): UploaderFieldController => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: `${config.path} { listName, csvData }`,
    listOptions: config.fieldMeta.listOptions,
    expectedHeaders: config.fieldMeta.expectedHeaders,
    requiredFields: config.fieldMeta.requiredFields,
    isRequired: config.fieldMeta.isRequired,
    defaultValue: null,
    deserialize: (data) => {
      const value = data[config.path]
      return value
    },
    serialize: (value) => ({ [config.path]: value }),
  }
}
