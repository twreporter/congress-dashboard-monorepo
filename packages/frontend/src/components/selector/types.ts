export type ValueType = string

export type Option = {
  label: string
  value: ValueType
  prefixIcon?: React.ReactNode
  isDeletable?: boolean
}

export type OptionGroup = {
  groupName: string
  options: Option[]
}

export type SingleSelectProps = {
  placeholder?: string
  options: OptionGroup[] | Option[]
  defaultValue?: ValueType
  value: ValueType
  disabled?: boolean
  loading?: boolean
  showError?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  onChange: (value: ValueType) => void
}

export type MultipleSelectProps = {
  placeholder?: string
  options: Option[] | OptionGroup[]
  defaultValue?: ValueType[]
  value: ValueType[]
  disabled?: boolean
  loading?: boolean
  showError?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  onChange: (value: ValueType[]) => void
  maxDisplay?: number | 'responsive'
  enableAllOptionLogic?: boolean
}
