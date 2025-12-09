import styled from '@emotion/styled'

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 6px;
  border: 2px dashed #ddd;
`

export const SelectorWrapper = styled.div`
  margin-bottom: 16px;
`

export const RequiredLabel = styled.div`
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  ::before {
    content: '*';
    color: #dc2626;
    margin-right: 4px;
  }
`

export const HiddenInput = styled.input`
  display: none;
`

export const FileInputWrapper = styled.div`
  margin-bottom: 16px;
`

export const InfoBox = styled.div`
  padding: 12px;
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 13px;
`

export const InfoRow = styled.div<{ hasMargin?: boolean }>`
  margin-bottom: ${(props) => (props.hasMargin ? '6px' : '0')};
`

export const InfoCode = styled.code<{ variant?: 'required' | 'normal' }>`
  background-color: ${(props) =>
    props.variant === 'required' ? '#fff3e0' : 'white'};
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
`

export const ValidationBox = styled.div<{ isValid: boolean }>`
  padding: 14px;
  background-color: ${(props) => (props.isValid ? '#e8f5e9' : '#ffebee')};
  border: 2px solid ${(props) => (props.isValid ? '#66bb6a' : '#ef5350')};
  border-radius: 6px;
  margin-bottom: 16px;
`

export const ValidationHeader = styled.div<{ isValid: boolean }>`
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 16px;
  color: ${(props) => (props.isValid ? '#2e7d32' : '#c62828')};
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ValidationStats = styled.div<{ hasErrors: boolean }>`
  font-size: 14px;
  margin-bottom: ${(props) => (props.hasErrors ? '10px' : '0')};
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
`

export const ValidCount = styled.strong<{ allValid: boolean }>`
  color: ${(props) => (props.allValid ? '#2e7d32' : '#f57c00')};
`

export const ErrorSection = styled.div`
  margin-top: 10px;
`

export const ErrorHeader = styled.div`
  font-weight: 600;
  color: #c62828;
  margin-bottom: 6px;
  font-size: 14px;
`

export const WarningHeader = styled.div`
  font-weight: 600;
  color: #f57c00;
  margin-bottom: 6px;
  font-size: 14px;
`

export const ErrorList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #c62828;
  max-height: 200px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 8px 8px 8px 24px;
  border-radius: 4px;
`

export const WarningList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #f57c00;
  max-height: 150px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 8px 8px 8px 24px;
  border-radius: 4px;
`

export const ListItem = styled.li`
  font-size: 13px;
  margin-bottom: 4px;
`

export const DetailsSummary = styled.summary`
  cursor: pointer;
  font-weight: 600;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 14px;
  &:hover {
    background-color: #e0e0e0;
  }
`

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 8px;
`

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const TableHeaderRow = styled.tr`
  background-color: #f5f5f5;
`

export const TableHeader = styled.th<{
  isSticky?: boolean
  isRequired?: boolean
}>`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: ${(props) => (props.isSticky ? 'center' : 'left')};
  font-weight: 700;
  min-width: ${(props) => (props.isSticky ? 'auto' : '120px')};
  background-color: ${(props) =>
    props.isSticky ? '#e0e0e0' : props.isRequired ? '#fff3e0' : '#f5f5f5'};
  ${(props) =>
    props.isSticky &&
    `
    position: sticky;
    left: 0;
    z-index: 1;
  `}
`

export const RequiredStar = styled.span`
  color: #d32f2f;
  margin-left: 4px;
`

export const TableRow = styled.tr<{ hasError?: boolean }>`
  background-color: ${(props) => (props.hasError ? '#ffebee' : 'white')};
  &:hover {
    background-color: ${(props) => (props.hasError ? '#ffcdd2' : '#f5f5f5')};
  }
`

export const TableCell = styled.td<{
  isSticky?: boolean
  hasError?: boolean
  isEmpty?: boolean
  rowHasError?: boolean
}>`
  padding: 10px;
  border: 1px solid #ddd;
  font-weight: ${(props) => (props.isSticky ? 600 : 'normal')};
  text-align: ${(props) => (props.isSticky ? 'center' : 'left')};
  max-width: ${(props) => (props.isSticky ? 'auto' : '250px')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: ${(props) =>
    props.hasError
      ? '#ffcdd2'
      : props.isSticky && props.rowHasError
      ? '#ffcdd2'
      : props.isSticky
      ? 'white'
      : 'inherit'};
  color: ${(props) => (props.isEmpty ? '#999' : 'inherit')};
  ${(props) =>
    props.isSticky &&
    `
    position: sticky;
    left: 0;
  `}
`

export const EmptyCell = styled.em`
  font-size: 11px;
`

export const TableFooter = styled.div`
  padding: 10px;
  text-align: center;
  color: #666;
  font-size: 13px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-top: none;
  font-weight: 600;
`

// Additional styled components to replace inline CSS
export const ExistingFileWrapper = styled.div`
  margin-left: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ExistingFileLabel = styled.span`
  color: #666;
  font-size: 13px;
`

export const FileLink = styled.a`
  color: #1976d2;
  text-decoration: underline;
  font-size: 13px;
`

export const FileSize = styled.span`
  color: #999;
  font-size: 12px;
`

export const ValidationIcon = styled.span`
  font-size: 20px;
`

export const MoreErrorsItem = styled(ListItem)`
  font-weight: 600;
`

export const CellWrapper = styled.div`
  font-size: 13px;
`

export const CellListName = styled.div`
  font-weight: 600;
  color: #1976d2;
`

export const CellFileName = styled.div`
  font-size: 12px;
  color: #666;
`

export const CardValueWrapper = styled.div`
  font-size: 14px;
`

export const CardValueRow = styled.div<{ hasMargin?: boolean }>`
  margin-bottom: ${(props) => (props.hasMargin ? '4px' : '0')};
`

export const NoDataText = styled.div`
  color: #999;
  font-size: 13px;
`
