export type TabProps = {
  id?: number
  slug?: string
  name?: string
  count?: number
  avatar?: string
  showAvatar?: boolean
  showCount?: boolean
  selected?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  className?: string
}

export type SelectTagProps = TabProps & {
  withDelete?: boolean
  isLast?: boolean
}

export type FilterOption = SelectTagProps & {
  isFeatured?: boolean
}

export type sidebarContextType = {
  closeFilterModal?: () => void
  selectedOptions: FilterOption[]
  setSelectedOptions: (option: FilterOption[]) => void
}
