import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'
import type {
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '@keystone-6/core/types'
import {
  FieldLabel,
  FieldContainer,
  FieldDescription,
} from '@keystone-ui/fields'
import { Button } from '@keystone-ui/button'

const FileInputWrapper = styled.div`
  margin-bottom: 16px;
`

const HiddenInput = styled.input`
  display: none;
`

const ErrorText = styled.div`
  color: #dc2626;
  margin-top: 8px;
  font-size: 14px;
`

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  background-color: white;
`

const Th = styled.th`
  padding: 12px;
  border-bottom: 2px solid #e5e7eb;
  text-align: left;
  background-color: #f3f4f6;
  font-weight: 500;
  color: #374151;
`

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
`

const Tr = styled.tr<{ $isHeader?: boolean }>`
  ${(props) =>
    props.$isHeader
      ? `
    padding: 12px;
    border-bottom: 2px solid #e5e7eb;
    text-align: left;
    background-color: #f3f4f6;
    font-weight: 500;
    color: #374151;
  `
      : `
    &:hover {
    background-color: #f9fafb;
  }
  `}
`

const FileName = styled.div`
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
`

export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) => {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        const rows = text
          .split('\n')
          .map((row) =>
            row
              .split(',')
              .map((cell) => cell.trim().replace(/^["']|["']$/g, ''))
          )
        setCsvData(rows)
        setError('')
        if (onChange) {
          onChange(JSON.stringify(rows))
        }
      } catch (err) {
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

  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      <FieldDescription id={`${field.path}-description`}>
        {field.description}
      </FieldDescription>

      {onChange ? (
        <FileInputWrapper>
          <HiddenInput
            ref={fileInputRef}
            id={field.path}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            autoFocus={autoFocus}
          />

          <Button
            size="small"
            onClick={handleButtonClick}
            tone="active"
            weight="light"
          >
            Upload CSV File
          </Button>

          {fileName && <FileName>Selected file: {fileName}</FileName>}

          {error && <ErrorText>{error}</ErrorText>}

          {csvData.length > 0 && (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    {csvData[0].map((header, i) => (
                      <Th key={i}>{header}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((row, i) => (
                    <Tr key={i}>
                      {row.map((cell, j) => (
                        <Td key={j}>{cell}</Td>
                      ))}
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </FileInputWrapper>
      ) : (
        <TableWrapper>
          {value && (
            <Table>
              <tbody>
                {JSON.parse(value).map((row: string[], i: number) => (
                  <Tr key={i} $isHeader={i === 0}>
                    {row.map((cell, j) => (
                      <Td key={j}>{cell}</Td>
                    ))}
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </TableWrapper>
      )}
    </FieldContainer>
  )
}

export const controller = (
  config: FieldControllerConfig<any>
): FieldController<string | null, string> => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: null,
    deserialize: (data) => {
      const value = data[config.path]
      return value
    },
    serialize: (value) => ({ [config.path]: value }),
  }
}
