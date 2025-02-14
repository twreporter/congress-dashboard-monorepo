'use client'

import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
// next
import Link from 'next/link'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { LogoHeader } from '@twreporter/react-components/lib/logo'
import {
  PillButton,
  TextButton,
  IconButton,
} from '@twreporter/react-components/lib/button'
import {
  TabletAndAbove,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'
import { Hamburger, Cross } from '@twreporter/react-components/lib/icon'
import { DEFAULT_SCREEN } from '@twreporter/core/lib/utils/media-query'
// components
import HamburgerMenu from '@/components/hamburger-menu'
// hooks
import useWindowWidth from '@/hooks/use-window-width'
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import {
  COMMON_MENU_LINKS,
  COMPACT_PILL_BUTTON_LINKS,
} from '@/constants/navigation-link'
// context
import { useScrollContext } from '@/contexts/scroll-context'

const Container = styled.header<{ $isHidden: boolean }>`
  display: flex;
  width: -webkit-fill-available;
  height: 64px;
  background-color: ${colorGrayscale.gray100};
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: ${ZIndex.Header};
  transition: transform 300ms ease-in-out;
  transform: translateY(${(props) => (props.$isHidden ? '-100%' : '0')});

  ${mq.desktopOnly`
    padding: 0 48px;
  `}
  ${mq.tabletOnly`
    padding: 0 32px;
  `}
  ${mq.mobileOnly`
    padding: 0 24px;
  `}
`

const HeaderSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 16px;

  ${mq.hdOnly`
    width: 1280px;
    margin: auto;
  `}
  ${mq.mobileOnly`
    padding: 0px;
  `}
`

const LogoContainer = styled.div`
  width: 172px;
  height: 24px;

  a,
  img {
    display: flex;
    width: 172px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`

const Button = styled.div`
  a {
    text-decoration: none;
  }
`

const HamburgerBtn = styled.div`
  width: 24px;
  height: 24px;
`

const Spacing = styled.div<{ $width?: number; $height?: number }>`
  width: ${(props) => (props.$width ? props.$width : 0)}px;
  height: ${(props) => (props.$height ? props.$height : 0)}px;
`

// Constants
const menuLinks = COMMON_MENU_LINKS
const pillButtonLinks = COMPACT_PILL_BUTTON_LINKS

const Header: React.FC = () => {
  const { isHeaderHidden } = useScrollContext()
  const windowWidth = useWindowWidth()
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const hamburgerIcon = <Hamburger releaseBranch={'master'} /> //TODO: releaseBranch
  const crossIcon = <Cross releaseBranch={'master'} /> //TODO: releaseBranch
  const handleHamburgerOnClick = useCallback(() => {
    setIsHamburgerOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (windowWidth >= DEFAULT_SCREEN.tablet.minWidth) {
      setIsHamburgerOpen(false)
    }
  }, [windowWidth])

  // Handle body scroll lock
  useEffect(() => {
    if (isHamburgerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isHamburgerOpen])

  return (
    <Container $isHidden={isHeaderHidden}>
      <HeaderSection>
        <LogoContainer>
          {/* TODO: releaseBranch */}
          <Link href={'https://www.twreporter.org/'} target={'_blank'}>
            <LogoHeader />
          </Link>
        </LogoContainer>
        <TabletAndAbove>
          <ButtonContainer>
            {menuLinks.map(({ href, text, target }, idx) => (
              <React.Fragment key={`link-btn-${idx}`}>
                <Button>
                  <Link href={href} target={target}>
                    <TextButton
                      text={text}
                      size={TextButton.Size.L}
                      style={TextButton.Style.DARK}
                    />
                  </Link>
                </Button>
                <Spacing $width={24} />
              </React.Fragment>
            ))}

            {pillButtonLinks.map(({ href, text, target, type }, idx) => (
              <React.Fragment key={`pill-btn-${idx}`}>
                <Button>
                  <Link href={href} target={target}>
                    <PillButton
                      text={text}
                      size={PillButton.Size.S}
                      type={type}
                    />
                  </Link>
                </Button>
                {idx < pillButtonLinks.length - 1 ? (
                  <Spacing $width={16} />
                ) : null}
              </React.Fragment>
            ))}
          </ButtonContainer>
        </TabletAndAbove>
        <MobileOnly>
          <ButtonContainer>
            {!isHamburgerOpen ? (
              <>
                <Button>
                  <Link
                    href={pillButtonLinks[1].href}
                    target={pillButtonLinks[1].target}
                  >
                    <PillButton
                      text={pillButtonLinks[1].text}
                      size={PillButton.Size.S}
                      type={pillButtonLinks[1].type}
                    />
                  </Link>
                </Button>
                <Spacing $width={16} />
              </>
            ) : null}
            <HamburgerBtn>
              <IconButton
                iconComponent={isHamburgerOpen ? crossIcon : hamburgerIcon}
                onClick={handleHamburgerOnClick}
              />
            </HamburgerBtn>
          </ButtonContainer>
        </MobileOnly>
      </HeaderSection>
      <HamburgerMenu isOpen={isHamburgerOpen} />
    </Container>
  )
}

export default Header
