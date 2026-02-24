'use client'

import FilterButton from '@/components/button/filter-button'
import { ScopeFilterModal } from '@/components/search/result-page/scope-filter-modal'
import type { OptionGroup } from '@/components/selector/types'
import type { ScopeValue } from '@/components/search/result-page/scope-config'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  ${mq.mobileOnly`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    justify-content: space-between;
  `}
`

const Label = styled.div`
  color: ${colorGrayscale.gray700};
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
`

type ScopeFilterProps = {
  className?: string
  groups: OptionGroup[]
  selectedValue: ScopeValue
  selectedLabel: string
  onChange: (value: ScopeValue, label: string) => void
}

export const ScopeFilter = ({
  className,
  groups,
  selectedValue,
  selectedLabel,
  onChange,
}: ScopeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Container
        className={className}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <Label>{selectedLabel}</Label>
        <FilterButton filterCount={0} />
      </Container>
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
