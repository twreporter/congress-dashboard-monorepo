import styled from '@emotion/styled'

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const SelectorWrapper = styled.div`
  margin-bottom: 16px;
`

export const FileInputWrapper = styled.div`
  margin-bottom: 16px;
`

export const HiddenInput = styled.input`
  display: none;
`

export const ErrorText = styled.div`
  color: #dc2626;
  margin-top: 8px;
  font-size: 14px;
`

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  background-color: white;
`

export const Th = styled.th`
  padding: 12px;
  border-bottom: 2px solid #e5e7eb;
  text-align: left;
  background-color: #f3f4f6;
  font-weight: 500;
  color: #374151;
  min-width: 100px;
`

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
`

export const RequiredIndicator = styled.span`
  color: #dc2626;
  margin-left: 2px;
`

export const Tr = styled.tr<{
  $isHeader?: boolean
  $status?: 'error' | 'success'
}>`
  ${(props) => {
    if (props.$isHeader) {
      return `
        padding: 12px;
        border-bottom: 2px solid #e5e7eb;
        text-align: left;
        background-color: #f3f4f6;
        font-weight: 500;
        color: #374151;
      `
    }

    let bgColor = 'transparent'
    let hoverColor = '#f9fafb'

    if (props.$status === 'error') {
      bgColor = '#e57373'
      hoverColor = '#f44336'
    } else if (props.$status === 'success') {
      bgColor = '#81c784'
      hoverColor = '#66bb6a'
    }

    return `
      background-color: ${bgColor};
      &:hover {
        background-color: ${hoverColor};
      }
    `
  }}
`

export const FileName = styled.div`
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
`
