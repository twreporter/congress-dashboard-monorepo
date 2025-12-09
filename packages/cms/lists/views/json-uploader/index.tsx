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
  MoreErrorsItem,
  CellWrapper,
  CellListName,
  CellFileName,
  CardValueWrapper,
  CardValueRow,
  NoDataText,
} from './styles'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

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

        // Notify Keystone - send the parsed JSON data and base64 file content
        onChange?.({
          listName: selectedList,
          filename: file.name,
          filesize: file.size,
          jsonData: data,
          fileContent: base64,
        })
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
                  {validation.errors.slice(0, 20).map((error, idx) => (
                    <ListItem key={idx}>{error}</ListItem>
                  ))}
                  {validation.errors.length > 20 && (
                    <MoreErrorsItem>
                      還有 {validation.errors.length - 20} 個錯誤...
                    </MoreErrorsItem>
                  )}
                </ErrorList>
              </ErrorSection>
            )}

            {validation.warnings.length > 0 && (
              <ErrorSection>
                <WarningHeader>
                  ⚠️ 警告 ({validation.warnings.length}):
                </WarningHeader>
                <WarningList>
                  {validation.warnings.slice(0, 10).map((warning, idx) => (
                    <ListItem key={idx}>{warning}</ListItem>
                  ))}
                  {validation.warnings.length > 10 && (
                    <MoreErrorsItem>
                      還有 {validation.warnings.length - 10} 個警告...
                    </MoreErrorsItem>
                  )}
                </WarningList>
              </ErrorSection>
            )}
          </ValidationBox>
        )}

        {/* Error Data Table - Only show records with errors */}
        {jsonData &&
          jsonData.length > 0 &&
          listConfig &&
          !validation?.isValid &&
          (() => {
            const errorRecords = jsonData
              .map((record, idx) => ({ record, originalIndex: idx }))
              .filter(({ record }) =>
                listConfig.requiredFields.some(
                  (field: string) =>
                    record[field] === undefined ||
                    record[field] === null ||
                    record[field] === ''
                )
              )

            if (errorRecords.length === 0) return null

            return (
              <details open>
                <DetailsSummary>
                  ❌ 錯誤資料 ({errorRecords.length} 筆)
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
                        <TableRow key={originalIndex} hasError>
                          <TableCell isSticky rowHasError>
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
                            const cellHasError = isEmpty && isRequired

                            return (
                              <TableCell
                                key={header}
                                hasError={cellHasError}
                                isEmpty={isEmpty}
                                title={String(cellValue || '')}
                              >
                                {isEmpty ? (
                                  <EmptyCell>
                                    {cellHasError ? '⚠ 缺少必填' : '(空)'}
                                  </EmptyCell>
                                ) : (
                                  String(cellValue)
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
