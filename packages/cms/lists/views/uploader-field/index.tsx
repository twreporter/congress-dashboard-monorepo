import React, { useState, useRef, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import { useQuery, gql } from '@keystone-6/core/admin-ui/apollo'
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
  WarningText,
  LoadingWrapper,
  Spinner,
  LoadingOverlay,
  LoadingHint,
} from './style'

const CHECK_LEGISLATOR_SLUGS = gql`
  query CheckLegislatorSlugs($slugs: [String!]!) {
    duplicates: legislators(where: { slug: { in: $slugs } }) {
      slug
    }
  }
`

const CHECK_TOPIC_SLUGS = gql`
  query CheckTopicSlugs($slugs: [String!]!) {
    duplicates: topics(where: { slug: { in: $slugs } }) {
      slug
    }
  }
`

const CHECK_SPEECH_SLUGS = gql`
  query CheckSpeechSlugs($slugs: [String!]!) {
    duplicates: speeches(where: { slug: { in: $slugs } }) {
      slug
    }
  }
`

export const Cell: CellComponent = ({ item, field }) => {
  const { listOptions } = field
  const { uploadData } = item
  const { listName } = uploadData
  const listOption = listOptions.find((option) => option.value === listName)
  return <CellContainer>{listOption.label}</CellContainer>
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
  itemValue,
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
  const [slugDuplicates, setSlugDuplicates] = useState<string[]>([])
  const [fileName, setFileName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Determine if this is a new record or updating an existing one
  const isNewRecord = itemValue?.createdAt.value.kind === 'create'

  // Extract slugs from CSV data when listName is one of the target lists
  const extractSlugs = () => {
    if (!csvData || csvData.length < 2 || !listName) return []

    const headers = csvData[0]
    const slugIndex = headers.findIndex(
      (header) => header.toLowerCase() === 'slug'
    )

    if (slugIndex === -1) return []

    return csvData
      .slice(1)
      .map((row) => row[slugIndex])
      .filter((slug) => slug)
  }

  const isTargetList =
    listName === 'Legislator' || listName === 'Topic' || listName === 'Speech'
  const shouldCheckSlugs = isNewRecord && isTargetList
  const slugsToCheck = useMemo(() => {
    return shouldCheckSlugs ? extractSlugs() : []
  }, [shouldCheckSlugs, csvData, listName])

  // Select the appropriate query based on listName
  const queryToUse =
    listName === 'Legislator'
      ? CHECK_LEGISLATOR_SLUGS
      : listName === 'Topic'
      ? CHECK_TOPIC_SLUGS
      : CHECK_SPEECH_SLUGS

  // Query to check for duplicate slugs only if this is a new record
  const {
    data,
    loading,
    error: queryError,
    refetch,
  } = useQuery(queryToUse, {
    variables: {
      slugs: slugsToCheck,
    },
    skip: !shouldCheckSlugs || slugsToCheck.length === 0,
    fetchPolicy: 'network-only',
  })

  // Process the query results to find duplicates
  useEffect(() => {
    if (!data || !shouldCheckSlugs) return

    let duplicates: string[] = []

    if (data.duplicates) {
      duplicates = data.duplicates.map((item: { slug: string }) => item.slug)
    }

    setSlugDuplicates(duplicates)
  }, [data, shouldCheckSlugs])

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

  // Refetch duplicate check when CSV data changes (only for new records)
  useEffect(() => {
    if (shouldCheckSlugs && slugsToCheck.length > 0) {
      refetch({ slugs: slugsToCheck })
    }
  }, [refetch, shouldCheckSlugs, slugsToCheck])

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
    setSlugDuplicates([])
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
    setIsProcessing(true)

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
        setIsProcessing(false)
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
        setIsProcessing(false)
      }
    }
    reader.onerror = () => {
      setError('Failed to read file')
      setCsvData([])
      setFileName('')
      setIsProcessing(false)
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

  // Check if the row contains a duplicate slug
  const isSlugDuplicated = (row: string[]) => {
    if (!shouldCheckSlugs || !csvData || csvData.length < 1) return false

    const headers = csvData[0]
    const slugIndex = headers.findIndex(
      (header) => header.toLowerCase() === 'slug'
    )

    if (slugIndex === -1) return false

    const slug = row[slugIndex]
    return slugDuplicates.includes(slug)
  }

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
                isDisabled={!listName || isProcessing || loading}
              >
                Upload CSV File
              </Button>
              {fileName && <FileName>Selected file: {fileName}</FileName>}

              {isProcessing && (
                <LoadingWrapper>
                  <Spinner />
                  <LoadingHint style={{ marginLeft: '12px' }}>
                    Processing CSV file...
                  </LoadingHint>
                </LoadingWrapper>
              )}

              {!isProcessing && loading && (
                <LoadingWrapper>
                  <Spinner />
                  <LoadingHint style={{ marginLeft: '12px' }}>
                    Checking for duplicate slugs...
                  </LoadingHint>
                </LoadingWrapper>
              )}

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
              {queryError && (
                <ErrorText>
                  Error checking for duplicate slugs: {queryError.message}
                </ErrorText>
              )}
              {isNewRecord && slugDuplicates.length > 0 && (
                <WarningText>
                  注意：以下 slug
                  已存在於資料庫中，將會更新現有資料而非新增記錄：
                  <br />
                  不會覆蓋舊有關聯，EX. 原本是 [1, 2, 3]，上傳 [4, 5, 6]
                  之後會變成 [1, 2, 3, 4, 5, 6]
                  <br />
                  {slugDuplicates.join(', ')}
                </WarningText>
              )}
            </>
          ) : null}
          {csvData.length > 0 && (
            <TableWrapper>
              {loading && (
                <LoadingOverlay>
                  <Spinner />
                </LoadingOverlay>
              )}
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
                    // Check if slug is duplicated (only for new records)
                    const hasSlugDuplicate = isSlugDuplicated(row)

                    const isValidRow =
                      isHeaderValid && isLengthValid && !hasRequiredEmpty

                    // Determine row status
                    let rowStatus: 'success' | 'warning' | 'error' = isValidRow
                      ? 'success'
                      : 'error'

                    // If row is valid but has duplicate slug, mark as warning (only for new records)
                    if (isValidRow && hasSlugDuplicate && isNewRecord) {
                      rowStatus = 'warning'
                    }

                    return (
                      <Tr key={i} $status={rowStatus}>
                        {row.map((cell, j) => {
                          // Highlight duplicate slug cells (only for new records)
                          const isSlugColumn =
                            csvData[0][j].toLowerCase() === 'slug'
                          const isDuplicateSlug =
                            isSlugColumn &&
                            isNewRecord &&
                            slugDuplicates.includes(cell)

                          return (
                            <Td key={j}>
                              {cell}
                              {isDuplicateSlug && ' (將更新)'}
                            </Td>
                          )
                        })}
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
