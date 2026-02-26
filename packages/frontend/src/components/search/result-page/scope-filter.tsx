'use client'

import FilterButton from '@/components/button/filter-button'
import { ScopeFilterModal } from '@/components/search/result-page/scope-filter-modal'
import type { OptionGroup } from '@/components/selector/types'
import type { ScopeValue } from '@/components/search/result-page/scope-config'
import { useState } from 'react'

type ScopeFilterProps = {
  groups: OptionGroup[]
  selectedValue: ScopeValue
  onChange: (value: ScopeValue, label: string) => void
}

export const ScopeFilter = ({
  groups,
  selectedValue,
  onChange,
}: ScopeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <FilterButton filterCount={0} onClick={() => setIsOpen(true)} />
      <ScopeFilterModal
        isOpen={isOpen}
        groups={groups}
        selectedValue={selectedValue}
        onSubmit={(value, label) => {
          onChange(value as ScopeValue, label)
        }}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
