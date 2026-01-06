/** @jsxRuntime classic */
/** @jsx jsx */
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Fragment,
} from 'react'
import { jsx } from '@keystone-ui/core'
import { FieldContainer, FieldLabel, Select } from '@keystone-ui/fields'
import { Button } from '@keystone-ui/button'
import { useQuery, gql } from '@keystone-6/core/admin-ui/apollo'
// types
import type {
  FieldController,
  FieldControllerConfig,
  FieldProps,
  CardValueComponent,
  CellComponent,
} from '@keystone-6/core/types'
import type { ListConfig } from '../../fields/json-uploader'
// styles
import {
  FieldWrapper,
  FileInputWrapper,
  RequiredLabel,
  SelectorWrapper,
  HiddenInput,
  InfoBox,
  InfoRow,
  InfoCode,
  ValidationBox,
  ValidationHeader,
  ValidationStats,
  ValidCount,
  ErrorSection,
  ErrorHeader,
  WarningHeader,
  ErrorList,
  WarningList,
  ListItem,
  DetailsSummary,
  TableWrapper,
  DataTable,
  TableHeaderRow,
  TableHeader,
  RequiredStar,
  TableRow,
  TableCell,
  EmptyCell,
  ExistingFileWrapper,
  ExistingFileLabel,
  FileLink,
  FileSize,
  ValidationIcon,
  CellWrapper,
  CellListName,
  CellFileName,
  CardValueWrapper,
  CardValueRow,
  NoDataText,
  WarningCell,
} from './styles'

const CHECK_COUNCILOR_SLUGS = gql`
  query CheckCouncilorSlugs($slugs: [String!]!) {
    councilors(where: { slug: { in: $slugs } }) {
      slug
    }
  }
`

const CHECK_COUNCIL_TOPIC_SLUGS = gql`
  query CheckCouncilTopicSlugs($slugs: [String!]!) {
    councilTopics(where: { slug: { in: $slugs } }) {
      slug
    }
  }
`

const CHECK_COUNCIL_BILL_SLUGS = gql`
  query CheckCouncilBillSlugs($slugs: [String!]!) {
    councilBills(where: { slug: { in: $slugs } }) {
      slug
    }
  }
`

// Helper to get slugs from JSON data based on list type
const getSlugFieldForList = (listName: string): string | null => {
  if (
    listName === 'Councilor' ||
    listName === 'CouncilTopic' ||
    listName === 'CouncilBill'
  ) {
    return 'slug'
  }
  return null
}

const extractSlugsFromData = (jsonData: any[], slugField: string): string[] => {
  if (!Array.isArray(jsonData)) return []
  return jsonData
    .map((item) => item?.[slugField])
    .filter(
      (slug): slug is string => typeof slug === 'string' && slug.length > 0
    )
}

type JSONUploaderFieldValue = {
  listName: string | null
  filename: string | null
  filesize: number | null
  url?: string | null
  jsonData?: any[] // Optional for input only, not stored in DB
  fileContent?: string // base64 encoded file content for upload
}
type JSONUploaderControllerMeta = {
  listConfigs: Record<string, ListConfig>
}
type JSONUploaderFieldController = {
  listConfigs: Record<string, ListConfig>
} & FieldController<JSONUploaderFieldValue>

export const controller = (
  config: FieldControllerConfig<JSONUploaderControllerMeta>
): JSONUploaderFieldController => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    listConfigs: config.fieldMeta?.listConfigs,
    graphqlSelection: config.path,
    defaultValue: {
      listName: null,
      filename: null,
      filesize: null,
      url: null,
    },
    deserialize: (data) => {
      const value = data[config.path]
      return value
    },
    serialize: (value) => ({ [config.path]: value }),
    validate: (value: any) => {
      // Validation requires jsonData to be present in the input
      return value?.listName && value?.jsonData ? true : false
    },
  }
}

type ValidationResult = {
  isValid: boolean
  errors: string[]
  warnings: string[]
  recordCount: number
  validRecordCount: number
}

const validateJsonData = (
  jsonData: any[],
  listConfig: ListConfig
): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  let validRecordCount = 0

  if (!Array.isArray(jsonData)) {
    errors.push('JSON 檔案必須是陣列格式')
    return {
      isValid: false,
      errors,
      warnings,
      recordCount: 0,
      validRecordCount: 0,
    }
  }

  if (jsonData.length === 0) {
    errors.push('JSON 檔案不包含任何資料')
    return {
      isValid: false,
      errors,
      warnings,
      recordCount: 0,
      validRecordCount: 0,
    }
  }

  // Find slug fields and check for duplicates
  const slugFields = listConfig.expectedHeaders.filter((header) =>
    header.includes('slug')
  )

  // Track duplicate slugs: { fieldName: { slugValue: [rowNumbers] } }
  const slugValueMap: Record<string, Record<string, number[]>> = {}
  slugFields.forEach((slugField) => {
    slugValueMap[slugField] = {}
  })

  // First pass: collect all slug values
  jsonData.forEach((item, index) => {
    if (typeof item !== 'object' || item === null) return

    slugFields.forEach((slugField) => {
      const slugValue = item[slugField]
      if (slugValue && typeof slugValue === 'string') {
        if (!slugValueMap[slugField][slugValue]) {
          slugValueMap[slugField][slugValue] = []
        }
        slugValueMap[slugField][slugValue].push(index + 1)
      }
    })
  })

  // Find duplicates and add errors
  const duplicateSlugs: Record<string, Set<string>> = {}
  slugFields.forEach((slugField) => {
    duplicateSlugs[slugField] = new Set()
    Object.entries(slugValueMap[slugField]).forEach(([slugValue, rows]) => {
      if (rows.length > 1) {
        duplicateSlugs[slugField].add(slugValue)
        errors.push(
          `欄位 ${slugField} 的值 "${slugValue}" 重複出現於第 ${rows.join(
            ', '
          )} 筆`
        )
      }
    })
  })

  jsonData.forEach((item, index) => {
    const rowNum = index + 1
    let recordValid = true

    if (typeof item !== 'object' || item === null) {
      errors.push(`第 ${rowNum} 筆: 資料格式錯誤`)
      return
    }

    const missingHeaders = listConfig.expectedHeaders.filter(
      (header) => !(header in item)
    )
    if (missingHeaders.length > 0) {
      errors.push(`第 ${rowNum} 筆: 缺少欄位 ${missingHeaders.join(', ')}`)
      recordValid = false
    }

    const missingRequired = listConfig.requiredFields.filter(
      (field) =>
        item[field] === undefined || item[field] === null || item[field] === ''
    )
    if (missingRequired.length > 0) {
      errors.push(`第 ${rowNum} 筆: 必填欄位為空 ${missingRequired.join(', ')}`)
      recordValid = false
    }

    const extraFields = Object.keys(item).filter(
      (key) => !listConfig.expectedHeaders.includes(key)
    )
    if (extraFields.length > 0) {
      warnings.push(`第 ${rowNum} 筆: 包含非預期欄位 ${extraFields.join(', ')}`)
    }

    slugFields.forEach((slugField) => {
      const slugValue = item[slugField]
      if (slugValue && typeof slugValue === 'string') {
        // Check for uppercase
        if (/[A-Z]/.test(slugValue)) {
          errors.push(`第 ${rowNum} 筆: 欄位 ${slugField} 不可包含大寫字母`)
          recordValid = false
        }
        // Check for duplicate
        if (duplicateSlugs[slugField]?.has(slugValue)) {
          recordValid = false
        }
      }
    })

    if (recordValid) {
      validRecordCount++
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recordCount: jsonData.length,
    validRecordCount,
  }
}

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  const listConfigs = field.listConfigs

  const [selectedList, setSelectedList] = useState<string>(
    value?.listName || ''
  )
  const [jsonData, setJsonData] = useState<any[] | null>(null)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [fileName, setFileName] = useState<string>(value?.filename || '')
  const [fileContent, setFileContent] = useState<File | null>(null)
  const [existingSlugs, setExistingSlugs] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Determine which query to use based on selected list
  const queryToUse =
    selectedList === 'Councilor'
      ? CHECK_COUNCILOR_SLUGS
      : selectedList === 'CouncilTopic'
      ? CHECK_COUNCIL_TOPIC_SLUGS
      : selectedList === 'CouncilBill'
      ? CHECK_COUNCIL_BILL_SLUGS
      : null

  // Extract slugs from jsonData for query
  const slugField = getSlugFieldForList(selectedList)
  const slugsToCheck =
    jsonData && slugField ? extractSlugsFromData(jsonData, slugField) : []

  // Query for existing slugs in database
  const { data: existingSlugsData } = useQuery(
    queryToUse || CHECK_COUNCILOR_SLUGS, // Fallback to avoid null query
    {
      variables: { slugs: slugsToCheck },
      skip: !queryToUse || slugsToCheck.length === 0,
    }
  )

  // Update existingSlugs when query data changes
  useEffect(() => {
    if (existingSlugsData) {
      const dataKey =
        selectedList === 'Councilor'
          ? 'councilors'
          : selectedList === 'CouncilTopic'
          ? 'councilTopics'
          : selectedList === 'CouncilBill'
          ? 'councilBills'
          : null

      if (dataKey && existingSlugsData[dataKey]) {
        const slugs = new Set<string>(
          existingSlugsData[dataKey].map((item: { slug: string }) => item.slug)
        )
        setExistingSlugs(slugs)

        // Add warnings for existing slugs
        if (slugs.size > 0 && validation) {
          const existingWarnings = Array.from(slugs).map(
            (slug) => `slug "${slug}" 已存在於資料庫中，將會更新該筆資料`
          )
          setValidation((prev) =>
            prev
              ? {
                  ...prev,
                  warnings: [
                    ...prev.warnings.filter(
                      (w) => !w.includes('已存在於資料庫中')
                    ),
                    ...existingWarnings,
                  ],
                }
              : null
          )
        }
      }
    } else {
      setExistingSlugs(new Set())
    }
  }, [existingSlugsData, selectedList])

  // Update when value changes (for edit mode)
  useEffect(() => {
    if (value?.listName) {
      setSelectedList(value.listName)
    }
    if (value?.filename) {
      setFileName(value.filename)
    }
  }, [value])

  const handleListChange = useCallback(
    (option: { label: string; value: string } | null) => {
      const newListName = option?.value || ''
      setSelectedList(newListName)
      // Reset file data when changing list type
      setJsonData(null)
      setValidation(null)

      // Notify Keystone of the change
      onChange?.({
        listName: newListName,
        filename: fileName,
        filesize: fileContent?.size || 0,
      })
    },
    [onChange, fileName, fileContent]
  )

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) {
        setJsonData(null)
        setValidation(null)
        setFileName('')
        setFileContent(null)
        onChange?.({
          listName: selectedList,
          filename: null,
          filesize: 0,
        })
        return
      }

      setFileName(file.name)
      setFileContent(file)

      if (!selectedList) {
        setJsonData(null)
        setValidation({
          isValid: false,
          errors: ['請先選擇匯入類型'],
          warnings: [],
          recordCount: 0,
          validRecordCount: 0,
        })
        return
      }

      try {
        const text = await file.text()
        const data = JSON.parse(text)
        setJsonData(data)

        const listConfig = listConfigs[selectedList]
        if (!listConfig) {
          setValidation({
            isValid: false,
            errors: ['找不到列表配置'],
            warnings: [],
            recordCount: 0,
            validRecordCount: 0,
          })
          return
        }

        const validationResult = validateJsonData(data, listConfig)
        setValidation(validationResult)

        // Read file as base64 for upload
        const arrayBuffer = await file.arrayBuffer()
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )

        // Only send jsonData if validation passes, otherwise the record cannot be created
        if (validationResult.isValid) {
          onChange?.({
            listName: selectedList,
            filename: file.name,
            filesize: file.size,
            jsonData: data,
            fileContent: base64,
          })
        } else {
          // Don't send jsonData - this will prevent the record from being created
          onChange?.({
            listName: selectedList,
            filename: file.name,
            filesize: file.size,
          })
        }
      } catch (error) {
        setJsonData(null)
        if (error instanceof SyntaxError) {
          setValidation({
            isValid: false,
            errors: ['JSON 格式錯誤'],
            warnings: [],
            recordCount: 0,
            validRecordCount: 0,
          })
        } else {
          setValidation({
            isValid: false,
            errors: ['檔案讀取失敗'],
            warnings: [],
            recordCount: 0,
            validRecordCount: 0,
          })
        }
      }
    },
    [selectedList, listConfigs, onChange]
  )

  const listConfig = selectedList ? listConfigs[selectedList] : null

  const listNameOptions = Object.values(listConfigs).map((config) => ({
    value: config.value,
    label: config.label,
  }))

  const selectedOption =
    listNameOptions.find((opt) => opt.value === selectedList) || null

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <FieldWrapper>
        <SelectorWrapper>
          <RequiredLabel>
            <FieldLabel htmlFor={`${field.path}-listName`}>匯入項目</FieldLabel>
          </RequiredLabel>
          <Select
            id={`${field.path}-listName`}
            options={listNameOptions}
            value={selectedOption}
            isDisabled={onChange === undefined}
            onChange={handleListChange}
          />
        </SelectorWrapper>

        {/* List Config Info */}
        {listConfig && onChange ? (
          <InfoBox>
            <InfoRow hasMargin>
              <strong>📋 必填欄位:</strong>{' '}
              <InfoCode variant="required">
                {listConfig.requiredFields.join(', ')}
              </InfoCode>
            </InfoRow>
            <InfoRow hasMargin>
              <strong>📝 所有欄位:</strong>{' '}
              <InfoCode variant="normal">
                {listConfig.expectedHeaders.join(', ')}
              </InfoCode>
            </InfoRow>
            <InfoRow>
              <strong>ℹ️ 注意:</strong>{' '}
              驗證僅檢查必填欄位是否缺漏，不檢查資料格式與內容正確性
            </InfoRow>
          </InfoBox>
        ) : null}

        <FileInputWrapper>
          <RequiredLabel>
            <FieldLabel htmlFor={`${field.path}-json`}>JSON 檔案</FieldLabel>
          </RequiredLabel>
          {onChange ? (
            <Fragment>
              <HiddenInput
                ref={fileInputRef}
                id={`${field.path}-json-file`}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
              />
              <Button
                size="small"
                onClick={handleButtonClick}
                tone="active"
                weight="light"
              >
                Upload JSON File
              </Button>
            </Fragment>
          ) : null}
          {/* Show existing file info with download link */}
          {value?.url && value?.filename && !fileContent && (
            <ExistingFileWrapper>
              <ExistingFileLabel>現有檔案:</ExistingFileLabel>
              <FileLink
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {value.filename}
              </FileLink>
              {value.filesize && (
                <FileSize>({(value.filesize / 1024).toFixed(2)} KB)</FileSize>
              )}
            </ExistingFileWrapper>
          )}
        </FileInputWrapper>

        {/* Validation Result */}
        {validation && (
          <ValidationBox isValid={validation.isValid}>
            <ValidationHeader isValid={validation.isValid}>
              {validation.isValid ? (
                <React.Fragment>
                  <ValidationIcon>✓</ValidationIcon> 驗證通過
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ValidationIcon>✗</ValidationIcon> 驗證失敗
                </React.Fragment>
              )}
            </ValidationHeader>
            <ValidationStats hasErrors={validation.errors.length > 0}>
              總筆數: <strong>{validation.recordCount}</strong> | 有效筆數:{' '}
              <ValidCount
                allValid={
                  validation.validRecordCount === validation.recordCount
                }
              >
                {validation.validRecordCount}
              </ValidCount>
            </ValidationStats>

            {validation.errors.length > 0 && (
              <ErrorSection>
                <ErrorHeader>❌ 錯誤 ({validation.errors.length}):</ErrorHeader>
                <ErrorList>
                  {validation.errors.map((error, idx) => (
                    <ListItem key={idx}>{error}</ListItem>
                  ))}
                </ErrorList>
              </ErrorSection>
            )}

            {validation.warnings.length > 0 && (
              <ErrorSection>
                <WarningHeader>
                  ⚠️ 警告 ({validation.warnings.length}):
                </WarningHeader>
                <WarningList>
                  {validation.warnings.map((warning, idx) => (
                    <ListItem key={idx}>{warning}</ListItem>
                  ))}
                </WarningList>
              </ErrorSection>
            )}
          </ValidationBox>
        )}

        {/* Error/Warning Data Table - Show records with errors or existing slugs */}
        {jsonData &&
          jsonData.length > 0 &&
          listConfig &&
          (!validation?.isValid || existingSlugs.size > 0) &&
          (() => {
            const slugFields = listConfig.expectedHeaders.filter(
              (header: string) => header.includes('slug')
            )

            // Build slug value map to detect duplicates
            const slugValueMap: Record<string, Record<string, number[]>> = {}
            slugFields.forEach((slugField: string) => {
              slugValueMap[slugField] = {}
            })
            jsonData.forEach((item, index) => {
              if (typeof item !== 'object' || item === null) return
              slugFields.forEach((slugField: string) => {
                const slugValue = item[slugField]
                if (slugValue && typeof slugValue === 'string') {
                  if (!slugValueMap[slugField][slugValue]) {
                    slugValueMap[slugField][slugValue] = []
                  }
                  slugValueMap[slugField][slugValue].push(index)
                }
              })
            })

            // Find duplicate slug values
            const duplicateSlugs: Record<string, Set<string>> = {}
            slugFields.forEach((slugField: string) => {
              duplicateSlugs[slugField] = new Set()
              Object.entries(slugValueMap[slugField]).forEach(
                ([slugValue, rows]) => {
                  if (rows.length > 1) {
                    duplicateSlugs[slugField].add(slugValue)
                  }
                }
              )
            })

            const errorRecords = jsonData
              .map((record, idx) => ({ record, originalIndex: idx }))
              .filter(({ record }) => {
                // Check for missing required fields
                const hasMissingRequired = listConfig.requiredFields.some(
                  (field: string) =>
                    record[field] === undefined ||
                    record[field] === null ||
                    record[field] === ''
                )
                // Check for uppercase in slug fields
                const hasUppercaseSlug = slugFields.some(
                  (slugField: string) => {
                    const slugValue = record[slugField]
                    return (
                      slugValue &&
                      typeof slugValue === 'string' &&
                      /[A-Z]/.test(slugValue)
                    )
                  }
                )
                // Check for duplicate slug values
                const hasDuplicateSlug = slugFields.some(
                  (slugField: string) => {
                    const slugValue = record[slugField]
                    return (
                      slugValue &&
                      typeof slugValue === 'string' &&
                      duplicateSlugs[slugField]?.has(slugValue)
                    )
                  }
                )
                // Check for existing slug in database
                const hasExistingSlug =
                  record['slug'] &&
                  typeof record['slug'] === 'string' &&
                  existingSlugs.has(record['slug'])

                return (
                  hasMissingRequired ||
                  hasUppercaseSlug ||
                  hasDuplicateSlug ||
                  hasExistingSlug
                )
              })

            if (errorRecords.length === 0) return null

            // Count how many are errors vs just existing in DB
            const errorCount = errorRecords.filter(({ record }) => {
              const hasMissingRequired = listConfig.requiredFields.some(
                (field: string) =>
                  record[field] === undefined ||
                  record[field] === null ||
                  record[field] === ''
              )
              const hasUppercaseSlug = slugFields.some((slugField: string) => {
                const slugValue = record[slugField]
                return (
                  slugValue &&
                  typeof slugValue === 'string' &&
                  /[A-Z]/.test(slugValue)
                )
              })
              const hasDuplicateSlug = slugFields.some((slugField: string) => {
                const slugValue = record[slugField]
                return (
                  slugValue &&
                  typeof slugValue === 'string' &&
                  duplicateSlugs[slugField]?.has(slugValue)
                )
              })
              return hasMissingRequired || hasUppercaseSlug || hasDuplicateSlug
            }).length

            const updateCount = errorRecords.length - errorCount

            return (
              <details open>
                <DetailsSummary>
                  {errorCount > 0 && `❌ 錯誤資料 (${errorCount} 筆)`}
                  {errorCount > 0 && updateCount > 0 && ' / '}
                  {updateCount > 0 && `🔄 將更新資料 (${updateCount} 筆)`}
                </DetailsSummary>
                <TableWrapper>
                  <DataTable>
                    <thead>
                      <TableHeaderRow>
                        <TableHeader isSticky>#</TableHeader>
                        {listConfig.expectedHeaders.map((header: string) => (
                          <TableHeader
                            key={header}
                            isRequired={listConfig.requiredFields.includes(
                              header
                            )}
                          >
                            {header}
                            {listConfig.requiredFields.includes(header) && (
                              <RequiredStar>*</RequiredStar>
                            )}
                          </TableHeader>
                        ))}
                      </TableHeaderRow>
                    </thead>
                    <tbody>
                      {errorRecords.map(({ record, originalIndex }) => (
                        <TableRow key={originalIndex} hasError={errorCount > 0}>
                          <TableCell isSticky rowHasError={errorCount > 0}>
                            {originalIndex + 1}
                          </TableCell>
                          {listConfig.expectedHeaders.map((header: string) => {
                            const cellValue = record[header]
                            const isEmpty =
                              cellValue === undefined ||
                              cellValue === null ||
                              cellValue === ''
                            const isRequired =
                              listConfig.requiredFields.includes(header)
                            const isSlugField = header.includes('slug')
                            const hasUppercase =
                              isSlugField &&
                              cellValue &&
                              typeof cellValue === 'string' &&
                              /[A-Z]/.test(cellValue)
                            const isDuplicate =
                              isSlugField &&
                              cellValue &&
                              typeof cellValue === 'string' &&
                              duplicateSlugs[header]?.has(cellValue)
                            const isExistingInDb =
                              isSlugField &&
                              header === 'slug' &&
                              cellValue &&
                              typeof cellValue === 'string' &&
                              existingSlugs.has(cellValue)
                            const cellHasError =
                              (isEmpty && isRequired) || hasUppercase

                            const formatCellValue = (val: any): string => {
                              if (
                                val === undefined ||
                                val === null ||
                                val === ''
                              )
                                return ''
                              if (Array.isArray(val)) {
                                return JSON.stringify(val, null, 0)
                              }
                              if (typeof val === 'object') {
                                return JSON.stringify(val, null, 0)
                              }
                              return String(val)
                            }

                            const displayValue = formatCellValue(cellValue)

                            return (
                              <TableCell
                                key={header}
                                hasError={cellHasError}
                                isEmpty={isEmpty}
                                title={displayValue}
                              >
                                {isEmpty ? (
                                  <EmptyCell>
                                    {isRequired ? '⚠ 缺少必填' : '(空)'}
                                  </EmptyCell>
                                ) : hasUppercase ? (
                                  <EmptyCell>
                                    ⚠ {displayValue} (含大寫)
                                  </EmptyCell>
                                ) : isDuplicate ? (
                                  <EmptyCell>⚠ {displayValue} (重複)</EmptyCell>
                                ) : isExistingInDb ? (
                                  <WarningCell>
                                    {displayValue} (將更新)
                                  </WarningCell>
                                ) : (
                                  displayValue
                                )}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </tbody>
                  </DataTable>
                </TableWrapper>
              </details>
            )
          })()}
      </FieldWrapper>
    </FieldContainer>
  )
}

export const Cell: CellComponent = ({ item, field }) => {
  const value = item[field.path]
  if (!value) return null

  return (
    <CellWrapper>
      <CellListName>{value.listName || 'N/A'}</CellListName>
      <CellFileName>
        {value.url ? (
          <FileLink href={value.url} target="_blank" rel="noopener noreferrer">
            {value.filename || 'Download file'}
          </FileLink>
        ) : (
          value.filename || 'No file'
        )}
      </CellFileName>
    </CellWrapper>
  )
}
Cell.supportsLinkTo = false

export const CardValue: CardValueComponent = ({ item, field }) => {
  const value = item[field.path]

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {value ? (
        <CardValueWrapper>
          <CardValueRow hasMargin>
            <strong>類型:</strong> {value.listName || 'N/A'}
          </CardValueRow>
          <CardValueRow hasMargin>
            <strong>檔案:</strong>{' '}
            {value.url ? (
              <FileLink
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {value.filename || 'Download'}
              </FileLink>
            ) : (
              value.filename || 'N/A'
            )}
          </CardValueRow>
          <CardValueRow>
            <strong>大小:</strong>{' '}
            {value.filesize
              ? `${(value.filesize / 1024).toFixed(2)} KB`
              : 'N/A'}
          </CardValueRow>
        </CardValueWrapper>
      ) : (
        <NoDataText>No data</NoDataText>
      )}
    </FieldContainer>
  )
}
