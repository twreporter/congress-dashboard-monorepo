import type { Option, OptionGroup } from './types'

export const isOptionGroup = (
  options: OptionGroup[] | Option[]
): options is OptionGroup[] => {
  return (
    Array.isArray(options) && options.length > 0 && 'groupName' in options[0]
  )
}

export const filterOptions = (
  options: Option[],
  searchTerm: string
): Option[] => {
  if (!searchTerm) return options
  return options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )
}
