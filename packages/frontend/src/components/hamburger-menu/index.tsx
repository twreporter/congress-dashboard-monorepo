'use client'
import React from 'react'
import styled from 'styled-components'
// next
import Link from 'next/link'
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
import {
  COMMON_MENU_LINKS,
  PILL_BUTTON_LINKS,
} from '@/constants/navigation-link'
import { HEADER_HEIGHT } from '@/constants/header'
import { ExternalRoutes } from '@/constants/routes'
// utils
import { openFeedback } from '@/utils/feedback'

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

const menuLinks = COMMON_MENU_LINKS
const pillButtonLinks = PILL_BUTTON_LINKS

type HamburgerMenuProps = {
  isOpen: boolean
}
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen }) => {
  return (
    <Container $isOpen={isOpen}>
      <SearchSection>
        <AlgoliaInstantSearch variant={layoutVariants.Menu} />
      </SearchSection>
      {menuLinks.map(({ text, href, target }, idx) => (
        <MenuButton
          key={`menu-btn-${idx}`}
          paddingLeft={0}
          paddingRight={0}
          fontWeight={MenuButton.FontWeight.BOLD}
          text={text}
          link={{ to: href, target: target }}
        />
      ))}
      <DividerContainer>
        <Divider />
      </DividerContainer>
      <Title2 onClick={() => openFeedback('hamburger-menu')}>
        <P2 text={'意見回饋'} />
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
          <Link key={`pill-btn-${idx}`} href={href} target={target}>
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
