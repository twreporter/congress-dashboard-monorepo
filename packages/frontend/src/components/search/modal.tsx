import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { Cross } from '@twreporter/react-components/lib/icon'
import { IconButton } from '@twreporter/react-components/lib/button'
import { InstantHits } from '@/components/search/instant-hits'
import { SearchBox } from '@/components/search/search-box'
import { ZIndex } from '@/styles/z-index'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { layoutVariants } from '@/components/search/constants'
import { useBodyScrollLock } from '@/hooks/use-scroll-lock'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Overlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  background: ${colorGrayscale.white};
  z-index: ${ZIndex.FilterModal};
  overflow: auto;
`

const SearchBoxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  border-bottom: 1px solid ${colorGrayscale.gray300};

  padding: 12px 36px 12px 24px;
`

export const SearchModal = ({
  className,
  onClose,
}: {
  className?: string
  onClose: () => void
}) => {
  // Lock body scroll
  useBodyScrollLock({
    toLock: true,
    lockID: 'search-modal',
  })

  return ReactDOM.createPortal(
    <Overlay className={className}>
      <SearchBoxContainer>
        <SearchBox variant={layoutVariants.Modal} autoFocus={true} />
        <IconButton
          iconComponent={<Cross releaseBranch={releaseBranch} />}
          onClick={onClose}
        />
      </SearchBoxContainer>
      <InstantHits variant={layoutVariants.Modal} />
    </Overlay>,
    // Append the modal to <body> to avoid z-index issues caused by parent stacking contexts
    document.body
  )
}
