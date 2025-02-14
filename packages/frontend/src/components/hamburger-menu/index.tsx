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
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import {
  COMMON_MENU_LINKS,
  SECONDARY_LINKS,
  PILL_BUTTON_LINKS,
} from '@/constants/navigation-link'

const Container = styled.div<{ $isOpen: boolean }>`
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: white;
  position: absolute;
  top: 64px;
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

const menuLinks = COMMON_MENU_LINKS
const secondaryLinks = SECONDARY_LINKS
const pillButtonLinks = PILL_BUTTON_LINKS

type HamburgerMenuProps = {
  isOpen: boolean
}
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen }) => {
  return (
    <Container $isOpen={isOpen}>
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
      {secondaryLinks.map(({ text, href, target }, idx) => (
        <Title2 key={`title-2-${idx}`}>
          <Link href={href} target={target}>
            <P2 text={text} />
          </Link>
        </Title2>
      ))}
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
