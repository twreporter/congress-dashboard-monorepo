'use client'

import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import {
  colorOpacity,
  colorGrayscale,
} from '@twreporter/core/lib/constants/color'
import { H5 } from '@twreporter/react-components/lib/text/headline'
import { Cross } from '@twreporter/react-components/lib/icon'
import { PillButton } from '@twreporter/react-components/lib/button'
import mq from '@twreporter/core/lib/utils/media-query'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { ZIndex } from '@/styles/z-index'
import { useBodyScrollLock } from '@/hooks/use-scroll-lock'
import { SingleSelect } from '@/components/selector'
import type { OptionGroup } from '@/components/selector/types'

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0px;
  right: 0px;
  width: 100vw;
  height: 100dvh;
  background-color: ${colorOpacity['black_0.2']};
  justify-content: center;
  align-items: center;
  z-index: ${ZIndex.FilterModal};
`

const Filter = styled.div`
  background-color: ${colorGrayscale.white};
  width: 100%;
  ${mq.tabletAndAbove`
    max-width: 480px;
    border-radius: 8px;
    box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};
  `}
  ${mq.mobileOnly`
    height: 100%;
    overflow: auto;
  `}
`

const Header = styled.div`
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${colorGrayscale.gray800};
  position: relative;
  background-color: ${colorGrayscale.white};
  border-radius: 8px;
  ${mq.mobileOnly`
    border-bottom: 1px solid ${colorGrayscale.gray300};
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 1;
  `}
`

const CrossIcon = styled.div`
  position: absolute;
  right: 16px;
  height: 24px;
  width: 24px;
  svg {
    background-color: ${colorGrayscale.gray600};
  }
  &:hover {
    cursor: pointer;
  }
`

const Footer = styled.div`
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background-color: ${colorGrayscale.white};
  border-radius: 8px;
  ${mq.mobileOnly`
    padding: 24px;
    gap: 10px;
    border-top: 1px solid ${colorGrayscale.gray300};
    position: fixed;
    width: 100%;
    bottom: 0;
  `}
`

const StyledPillButton = styled(PillButton)`
  width: 144px !important;
  justify-content: center;
  ${mq.mobileOnly`
    width: 100% !important;
  `}
`

const SelectorsContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px 24px;
  gap: 24px;
  flex-direction: column;
  ${mq.mobileOnly`
    gap: 20px;
    margin-bottom: 91px;
    margin-top: 58.5px;
  `}
`

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  ${mq.mobileOnly`
    flex-direction: column;
    gap: 8px;
    align-items: start;
  `}
`

const Label = styled(P2)`
  color: ${colorGrayscale.gray800};
  flex: 0 0 25%;
  max-width: 42px;
  ${mq.tabletAndAbove`
    display: block !important;
    text-align: justify;
    text-align-last: justify;
  `}
  ${mq.mobileOnly`
    width: 100%;
  `}
`

const SelectorContainer = styled.div`
  flex: 1;
  width: 100%;
`

type ScopeFilterModalProps = {
  isOpen: boolean
  groups: OptionGroup[]
  selectedValue: string
  onSubmit: (value: string, label: string) => void
  onClose: () => void
}

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

export const ScopeFilterModal = ({
  isOpen,
  groups,
  selectedValue,
  onSubmit,
  onClose,
}: ScopeFilterModalProps) => {
  const [tempSelectedValue, setTempSelectedValue] = useState(selectedValue)

  // Lock body scroll
  useBodyScrollLock({
    toLock: isOpen,
    lockID: 'scope-filter-modal',
  })

  const handleCancel = () => {
    setTempSelectedValue(selectedValue)
    onClose()
  }

  const handleReset = () => {
    setTempSelectedValue(selectedValue)
  }

  const handleConfirm = () => {
    // Find the label for the selected value
    let label = ''
    for (const group of groups) {
      const option = group.options.find(
        (opt) => opt.value === tempSelectedValue
      )
      if (option) {
        label = option.label
        break
      }
    }
    onSubmit(tempSelectedValue, label)
    onClose()
  }

  if (typeof window === 'undefined') {
    return null
  }

  return ReactDOM.createPortal(
    <ModalContainer $isOpen={isOpen}>
      <Filter>
        <Header>
          <H5 text={'篩選'} />
          <CrossIcon onClick={handleCancel}>
            <Cross releaseBranch={releaseBranch} />
          </CrossIcon>
        </Header>
        <SelectorsContainer>
          <SelectContainer>
            <Label text={'單位'} />
            <SelectorContainer>
              <SingleSelect
                placeholder="請選擇搜尋範圍"
                options={groups}
                value={tempSelectedValue}
                searchable={false}
                onChange={(value) => {
                  setTempSelectedValue(value as string)
                }}
              />
            </SelectorContainer>
          </SelectContainer>
        </SelectorsContainer>
        <Footer>
          <StyledPillButton
            theme={PillButton.THEME.normal}
            type={PillButton.Type.SECONDARY}
            size={PillButton.Size.L}
            text={'重設'}
            onClick={handleReset}
          />
          <StyledPillButton
            theme={PillButton.THEME.normal}
            type={PillButton.Type.GHOST}
            size={PillButton.Size.L}
            text={'確定'}
            onClick={handleConfirm}
          />
        </Footer>
      </Filter>
    </ModalContainer>,
    document.body
  )
}
