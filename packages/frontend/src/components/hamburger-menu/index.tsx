'use client'
import React, { useState } from 'react'
import styled from 'styled-components'
// next
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// @twreporter
import { MenuButton, PillButton } from '@twreporter/react-components/lib/button'
import Divider from '@twreporter/react-components/lib/divider'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  AlgoliaInstantSearch,
  layoutVariants,
} from '@/components/search/instant-search'
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import { PILL_BUTTON_LINKS } from '@/constants/navigation-link'
import { HEADER_HEIGHT } from '@/constants/header'
import { ExternalRoutes, InternalRoutes } from '@/constants/routes'
import { VALID_COUNCILS } from '@/constants/council'
// utils
import { getOptions } from '@/components/header/utils'
import { openFeedback } from '@/utils/feedback'
// components
import DropdownMenu from '@/components/hamburger-menu/dropdown-menu'

const Container = styled.div<{ $isOpen: boolean }>`
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${HEADER_HEIGHT}px);
  background-color: white;
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  left: -100%;
  z-index: ${ZIndex.HamburgerMenu};
  padding: 16px 32px 0px 32px;
  transition: transform 300ms ease-in-out;
  transform: translateX(${(props) => (props.$isOpen ? '100%' : '-100%')});
  overflow: scroll;
`

const DividerContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
`

const Title2 = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  color: ${colorGrayscale.gray600};
  a {
    color: ${colorGrayscale.gray600};
    text-decoration: none;
  }
`

const PillButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  padding-bottom: 32px;
  gap: 16px;
  a {
    text-decoration: none;
  }
`

const StyledPillButton = styled(PillButton)`
  width: auto !important;
  justify-content: center;
`

const SearchSection = styled.div`
  padding: 16px 0;
`

const pillButtonLinks = PILL_BUTTON_LINKS

type HamburgerMenuProps = {
  isOpen: boolean
  onClose: () => void
}
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const [isDropdownActive, setIsDropdownActive] = useState(false)
  const handleDropdownClick = () => {
    setIsDropdownActive(!isDropdownActive)
  }

  // just for six main cities currently
  const options = getOptions(VALID_COUNCILS)

  return (
    <Container $isOpen={isOpen}>
      <SearchSection>
        <AlgoliaInstantSearch variant={layoutVariants.Menu} />
      </SearchSection>
      <MenuButton
        paddingLeft={0}
        paddingRight={0}
        fontWeight={MenuButton.FontWeight.BOLD}
        text={'立法院'}
        link={{ to: InternalRoutes.Home, target: '_self' }}
        onClick={onClose}
      />
      <DropdownMenu
        label="六都議會" // just for six main cities currently
        options={options}
        onClick={handleDropdownClick}
        isActive={isDropdownActive}
        currentValue={pathname || ''}
        onOptionClick={onClose}
      />
      <MenuButton
        paddingLeft={0}
        paddingRight={0}
        fontWeight={MenuButton.FontWeight.BOLD}
        text={'關於觀測站'}
        link={{ to: InternalRoutes.About, target: '_self' }}
        onClick={onClose}
      />
      <DividerContainer>
        <Divider />
      </DividerContainer>
      <Title2 onClick={() => openFeedback('hamburger-menu')}>
        <P2 text={'意見回饋'} />
      </Title2>
      <Title2>
        <Link
          href={`${InternalRoutes.About}#「報導者觀測站」涵蓋多少資料？更新頻率為何？會再加入其他資料？`}
          target={'_blank'}
        >
          <P2 text={'資料更新說明'} />
        </Link>
      </Title2>
      <Title2>
        <Link href={ExternalRoutes.AboutTwreporter} target={'_blank'}>
          <P2 text={'關於我們'} />
        </Link>
      </Title2>
      <Title2>
        <Link href={ExternalRoutes.TwReporter} target={'_blank'}>
          <P2 text={'前往《報導者》'} />
        </Link>
      </Title2>
      <Title2>
        <Link href={ExternalRoutes.Medium} target={'_blank'}>
          <P2 text={'報導者開放實驗室'} />
        </Link>
      </Title2>
      <DividerContainer>
        <Divider />
      </DividerContainer>
      <PillButtonsContainer>
        {pillButtonLinks.map(({ text, href, target, type }, idx) => (
          <Link
            key={`pill-btn-${idx}`}
            href={href}
            target={target}
            onClick={onClose}
          >
            <StyledPillButton
              size={PillButton.Size.L}
              type={type}
              text={text}
            />
          </Link>
        ))}
      </PillButtonsContainer>
    </Container>
  )
}

export default HamburgerMenu
